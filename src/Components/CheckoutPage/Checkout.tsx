"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import {
  CreditCard,
  MapPin,
  ShoppingCart,
  User,
  LockKeyhole,
  MoveRight,
  Loader2,
} from "lucide-react";
import CheckoutLogin from "./CheckoutAuth";
import CheckoutAddress from "./CheckoutAddress";
import OrderSummary from "./OrderSummary";
import Payment from "./Payment";

export type AddressType = {
  _id: string;
  Name: string;
  MobileNumber: string;
  PinCode?: string | number;
  Address?: string;
  City?: string;
  State?: string;
  Country?: string;
  AddressLine?: string;
};

export type CartItem = {
  _id?: string;
  productId?:
    | {
        _id: string;
        name?: string;
        price?: number;
        thumbnail?: string;
        stock?: number;
        discountPrice?: number;
        deliveryCharge?: number;
      }
    | string;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
  discountPrice?: number;
  deliveryCharge?: number;
};

const Checkout = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [addrRes, cartRes] = await Promise.all([
          axios.get(`/api/address?userId=${user._id}`),
          axios.get(`/api/cart?userId=${user._id}`),
        ]);

        const addr =
          addrRes.data?.addresses || addrRes.data?.data || addrRes.data || [];
        const items =
          cartRes.data?.cart?.items ||
          cartRes.data?.items ||
          cartRes.data ||
          [];

        setCartItems(items);
        if (addr.length && !selectedAddressId)
          setSelectedAddressId(addr[0]._id);
      } catch (e) {
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const availableCartItems = cartItems.filter(
    (item) =>
      typeof item.productId === "object" && (item.productId.stock ?? 0) > 0
  );

  const totalProductAmount = availableCartItems.reduce((sum, it) => {
    const product = it.productId;
    if (!product) return sum;
    const price =
      typeof product === "object"
        ? product.discountPrice || product.price || 0
        : 0;
    return sum + price * it.quantity;
  }, 0);

  const totalDeliveryCharge = availableCartItems.reduce((sum, item) => {
    const product = item.productId;
    if (!product) return sum;
    return (
      sum + (typeof product === "object" ? product.deliveryCharge || 0 : 0)
    );
  }, 0);

  const totalAmount = totalProductAmount + totalDeliveryCharge;

  const goNext = () => {
    if (step === 1 && !user?._id)
      return toast.error("Please login to continue");
    if (step === 2 && !selectedAddressId)
      return toast.error("Please select a delivery address");
    if (step === 3 && !cartItems.length)
      return toast.error("Your cart is empty");
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
        </div>
      </div>
    );

  const handleIncrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const steps = [
    { num: 1, label: "Login", icon: User },
    { num: 2, label: "Address", icon: MapPin },
    { num: 3, label: "Review", icon: ShoppingCart },
    { num: 4, label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl  text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-slate-200" />
            <div
              className="absolute top-4 left-0 h-px bg-slate-900 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;

              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center relative md:bg-white px-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : isCompleted
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-300 text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <p
                    className={`mt-2 text-xs ${
                      isActive ? "text-slate-900 font-medium" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between items-center pb-8 ">
          <button
            onClick={goBack}
            disabled={step === 1}
            className={`text-sm  flex gap-2 font-medium transition-colors ${
              step === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-900 hover:text-slate-600"
            }`}
          >
            <MoveRight className=" h-5 w-5 rotate-180" /> Back
          </button>

          {step < 4 && (
            <button
              onClick={goNext}
              className="px-6 py-2.5 bg-emerald-600  rounded flex gap-2 text-white text-sm font-medium transition-colors"
            >
              Continue <MoveRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-">
              <div>
                {step === 1 && <CheckoutLogin user={user} />}
                {step === 2 && (
                  <CheckoutAddress
                    selectedAddressId={selectedAddressId}
                    onSelect={setSelectedAddressId}
                  />
                )}
                {step === 3 && (
                  <OrderSummary
                    cartItems={cartItems}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                )}
                {step === 4 && (
                  <Payment
                    user={user}
                    cartItems={cartItems}
                    selectedAddressId={selectedAddressId}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    totalAmount={totalAmount}
                    router={router}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-200">
                Price Details
              </h3>

              <div className="space-y-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    Price ({availableCartItems.length}{" "}
                    {availableCartItems.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold font-sans text-gray-900">
                    ₹{totalProductAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center font-sans">
                  <span className="text-gray-600 text-sm">Delivery fee</span>
                  {totalDeliveryCharge > 0 ? (
                    <span> ₹{totalDeliveryCharge.toLocaleString()} </span>
                  ) : (
                    "Free"
                  )}
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-300 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-base">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold font-sans text-gray-900">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-500  rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <LockKeyhole className="text-emerald-700" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Safe & Secure
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      100% secure payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
