"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  Award,
  History,
  MoveRight 
} from "lucide-react";
import toast from "react-hot-toast";
import AddToCartButton from "@/Components/Button/AddToCartButton";
import { useAuth } from "@/context/AuthProvider";
import RelatedProducts from "@/Components/ProductPage/RelatedProducts";
import ProductReviews from "@/Components/ProductPage/ProductReviews";

const ProductDetailPage = () => {
  const { pathUrl } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (pathUrl) fetchProduct();
  }, [pathUrl]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/product/${pathUrl}`);
      if (res.data.success) {
        setProduct(res.data.data);
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-gray-200 rounded-md"></div>

            <div className="flex md:gap-4 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="w-40 h-4 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>

            <div className="space-y-2">
              <div className="w-32 h-6 bg-gray-300 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-gray-200 p-4 rounded-md space-y-3">
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="w-40 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="w-16 h-12 bg-gray-200 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="h-12 bg-gray-300 rounded-md w-full"></div>
          </div>
        </div>

        <div className="mt-24 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="w-48 h-6 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="w-44 h-6 bg-gray-300 rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-gray-200 py-3"
              >
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
                <div className="w-32 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Package className="text-slate-300 mb-3" size={60} />
        <p className="text-slate-600 text-lg">Product not found</p>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="relative mb-6 group">
              <div className="aspect-[4/3] bg-neutral-50 border border-gray-200 rounded overflow-hidden">
                {discountPercentage > 0 && (
                  <span className="absolute md:top-6 md:right-5 text-xs font-medium tracking-widest text-white bg-emerald-600 rounded px-4 py-2 z-10">
                    Upto {discountPercentage}% off
                  </span>
                )}
                <img
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain bg-white"
                />
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-sm overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? "border-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-3 mb-4 text-xs tracking-widest uppercase text-neutral-500">
                {product.brand && <span>{product.brand}</span>}
                {product.brand && product.category && <span>•</span>}
                {product.category && (
                  <span>{product.category?.Name || product.category}</span>
                )}
              </div>

              <h1 className="text-xl 2xl:text-4xl font-light text-neutral-900 mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.model && (
                <p className="text-sm text-neutral-600 mb-8">
                  Model: {product.model}
                </p>
              )}

              <div className="mb-8 pb-8 border-b border-neutral-200">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-xl 2xl:text-3xl font-light text-neutral-900 font-sans">
                    ₹
                    {(product.discountPrice || product.price)?.toLocaleString()}
                  </span>
                  {product.discountPrice > 0 && (
                    <span className=" md:text-lg text-neutral-400 line-through font-sans">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discountPrice > 0 && (
                  <p className="text-xs text-neutral-800 uppercase tracking-wide font-sans">
                    You save ₹{" "}
                    <span> {product.price - product.discountPrice} </span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-neutral-200 p-4">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Availability
                  </div>
                  <div
                    className={`text-xs md:text-sm font-medium ${
                      product.stock > 10 ? "text-neutral-900" : "text-red-600"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </div>
                </div>

                <div className="border border-neutral-200 rounded p-4">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Delivery
                  </div>
                  <div className="text-xs md:text-sm font-medium text-neutral-900">
                    {(() => {
                      const date = new Date();
                      date.setDate(date.getDate() + 7);
                      return `Expected by ${date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}`;
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                {product.deliveryCharge !== undefined && (
                  <div className="mb-8 text-sm text-neutral-800 flex items-center gap-2 font-sans">
                    <Truck size={16} />
                    <span>
                      {product.deliveryCharge === 0
                        ? "Free Shipping"
                        : `Shipping: ₹${product.deliveryCharge}`}
                    </span>
                  </div>
                )}

                {product.returnPolicy && (
                  <div className="mb-8 text-sm text-neutral-800 flex items-center gap-2 font-sans">
                    <History size={16} />
                    <span>
                      {product.returnPolicy
                        ? "7 Days Return Policy"
                        : "No Return Policy"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="text-xs uppercase tracking-widest text-neutral-800 mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center rounded border border-neutral-300 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center text-sm font-medium border-x border-neutral-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <AddToCartButton
                product={product}
                userId={user?._id}
                quantity={quantity}
                className="text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className=" mt-10 md:mt-24 grid lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
              Product Details
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-10 md:mt-12">
                <h3 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
                  Key Features
                </h3>
                <div className="space-y-6">
                  {product.benefits.map((benefit: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <MoveRight 
                        className="text-neutral-400 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
              Specifications
            </h2>

            <div className="space-y-4">
              {product.technicalDetails &&
                Object.entries(product.technicalDetails).map(([key, value]) => {
                  if (!value || key === "_id") return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div
                      key={key}
                      className="flex justify-between py-3 border-b border-neutral-200"
                    >
                      <span className="text-xs uppercase tracking-widest text-neutral-700">
                        {label}
                      </span>
                      <span className="text-sm font-medium text-neutral-900 text-right max-w-[200px]">
                        {value as string}
                      </span>
                    </div>
                  );
                })}

              {(!product.technicalDetails ||
                Object.keys(product.technicalDetails).filter(
                  (k) => product.technicalDetails[k] && k !== "_id"
                ).length === 0) &&
                !product.category && (
                  <p className="text-sm text-neutral-500 italic">
                    No specifications available
                  </p>
                )}
              {product.warranty && (
                <div className=" text-sm text-neutral-800 flex flex-col leading-none  gap-2 font-sans">
                  <span className="text-base">Warranty Details</span> <br />
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>

            <div className="mt-12 md:pt-8 md:border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Shield size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      100% Secure Payments
                    </p>
                    <p className="text-gray-500 text-xs">
                      Your transactions are encrypted and protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Fast & Reliable Delivery
                    </p>
                    <p className="text-gray-500 text-xs">
                      Quick shipping right to your doorstep
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Premium Quality
                    </p>
                    <p className="text-gray-500 text-xs">
                      All products are checked before dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews productId={product._id} />

        {product?.category?._id && (
          <RelatedProducts
            categoryId={product.category._id}
            currentProductId={product._id}
          />
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;