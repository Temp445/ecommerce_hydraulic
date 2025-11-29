//  Cart page

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Minus, ShoppingBag, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartProvider";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import CartLoading from "./CartLoading";
import CartEmpty from "./CartEmpty";
import CartSummary from "./CartSummary";

interface Product {
  _id: string;
  name: string;
  pathUrl: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  thumbnail?: string;
  images?: string[];
  deliveryCharge?: number;
}

interface CartProductType {
  _id: string;
  productId?: Product | null;
  product?: Product | null;
  quantity: number;
}

interface Cart {
  items: CartProductType[];
}

const CartItem = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { refreshCart } = useCart();
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      setLoading(true);

      if (user?._id) {
        const res = await axios.get(`/api/cart?userId=${user?._id}`);
        setCart(res.data.cart);
      } else {
        const localCartString = localStorage.getItem("guestCart");
        const localCart = localCartString ? JSON.parse(localCartString) : [];

        const fakeCart: Cart = {
          items: localCart.map((item: any) => ({
            _id: item.product._id,
            productId: item.product,
            quantity: item.quantity,
          })),
        };
        setCart(fakeCart);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  useEffect(() => {
    const mergeLocalCart = async () => {
      if (!user?._id) return;
      const localCartString = localStorage.getItem("guestCart");
      if (!localCartString) return;

      const localCart = JSON.parse(localCartString);
      if (localCart.length === 0) return;

      try {
        const { data } = await axios.get(`/api/cart?userId=${user._id}`);
        const dbCartProducts = data.cart?.items || [];

        const dbProductIds = dbCartProducts.map((item: CartProductType) =>
          item.productId?._id?.toString?.()
        );

        const uniqueLocalItems = localCart.filter(
          (item: any) => !dbProductIds.includes(item.product._id)
        );

        if (uniqueLocalItems.length > 0) {
          const token = localStorage.getItem("token");
          await axios.post(
            "/api/cart",
            {
              items: uniqueLocalItems.map((item: any) => ({
                productId: item.product._id,
                quantity: item.quantity,
              })),
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        localStorage.removeItem("guestCart");
        await fetchCart();
      } catch (err) {
        toast.error("Failed to merge cart items");
      }
    };

    mergeLocalCart();
  }, [user?._id]);

  const handleQuantityUpdate = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    try {
      setUpdatingId(itemId);

      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                (user?._id ? item._id : item.productId?._id) === itemId
                  ? { ...item, quantity: newQty }
                  : item
              ),
            }
          : prev
      );

      if (user?._id) {
        const res = await axios.put(`/api/cart/${itemId}`, {
          quantity: newQty,
        });
        if (res.data.success) await refreshCart();
      } else {
        const guestCartString = localStorage.getItem("guestCart");
        let guestCart = guestCartString ? JSON.parse(guestCartString) : [];
        const index = guestCart.findIndex(
          (item: any) => item.product._id === itemId
        );
        if (index > -1) {
          guestCart[index].quantity = newQty;
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      await fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      setUpdatingId(itemId);

      if (user?._id) {
        const res = await axios.delete(`/api/cart/${itemId}`);
        if (res.data.success) {
          setCart((prev) =>
            prev
              ? {
                  ...prev,
                  items: prev.items.filter((item) => item._id !== itemId),
                }
              : prev
          );
          await refreshCart();
          toast.success("Item removed");
        }
      } else {
        const guestCartString = localStorage.getItem("guestCart");
        let guestCart = guestCartString ? JSON.parse(guestCartString) : [];
        guestCart = guestCart.filter(
          (item: any) => item.product._id !== itemId
        );
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCart((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.filter(
                  (item) => item.productId?._id !== itemId
                ),
              }
            : prev
        );
        await refreshCart();
        toast.success("Item removed");
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const inStockItems =
    cart?.items.filter((item) => {
      const product = item.productId || item.product;
      return product && item.quantity <= (product.stock ?? 0);
    }) || [];

  if (loading) {
    return (
      <>
        <CartLoading />
      </>
    );
  }

  const isLoggedIn = !!user;
  if (!cart?.items?.length) {
    return (
      <>
        <CartEmpty isLoggedIn={isLoggedIn} />
      </>
    );
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    const product = item.productId || item.product;
    if (!product) return sum;
    const price = product.discountPrice || product.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalPriceSave = cart.items.reduce((sum, item) => {
    const product = item.productId || item.product;
    if (!product) return sum;
    const original = product.price || 0;
    const discounted = product.discountPrice || original;
    return sum + (original - discounted) * item.quantity;
  }, 0);

  const totalDeliveryCharge = cart.items.reduce((sum, item) => {
    const product = item.productId || item.product;
    if (!product) return sum;
    return sum + (product.deliveryCharge || 0);
  }, 0);

  const itemCount = cart.items.filter((i) => i.productId || i.product).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black text-white py-6 px-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl md:font-bold">My Cart</h1>
              <p className="text-sm text-gray-300">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className=" px-2 md:px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.productId || item.product;
            if (!product)
              return (
                <div
                  key={item._id}
                  className="p-5 bg-white border border-slate-200 rounded-xl text-center text-slate-500 italic"
                >
                  This product is no longer available.
                  <button
                    onClick={() =>
                      handleDelete(user?._id ? item._id : "unknown")
                    }
                    className="ml-2 text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              );

            const stock = product.stock ?? 999;
            const inStock = stock >= item.quantity;
            const isUpdating =
              updatingId === (user?._id ? item._id : product._id);
            const price = product.discountPrice || product.price;
            const hasDiscount =
              (product.discountPrice ?? 0) > 0 &&
              (product.discountPrice ?? 0) < product.price;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.price - product.discountPrice!) / product.price) *
                    100
                )
              : 0;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md p-5 border border-slate-200"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="relative flex-shrink-0">
                    <Link href={`/products/${product.pathUrl}`}>
                      <img
                        src={
                          product.thumbnail ||
                          product.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full md:w-32 h-32 object-contain rounded-lg bg-white"
                      />
                    </Link>
                    {hasDiscount && (
                      <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800 mb-1">
                          {product.name}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {inStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDelete(user?._id ? item._id : product._id)
                        }
                        disabled={isUpdating}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-slate-800 font-sans">
                            ₹{price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-slate-400 line-through font-sans">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          Subtotal:{" "}
                          <span className="font-semibold text-slate-800 font-sans">
                            ₹{(price * item.quantity).toLocaleString()}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden w-fit">
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              user?._id ? item._id : product._id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="px-4 py-4 disabled:opacity-30 cursor-pointer  transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-6 py-2 font-semibold bg-slate-50 border-x border-slate-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              user?._id ? item._id : product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= stock}
                          className="px-4 py-4  disabled:opacity-30  cursor-pointer transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4">
          <CartSummary
            itemCount={itemCount}
            totalAmount={totalAmount}
            totalDeliveryCharge={totalDeliveryCharge}
            totalPriceSave={totalPriceSave}
            inStockItems={inStockItems}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
