import React from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/Components/Button/AddToCartButton";

export default function ProductCard({
  product,
  viewMode,
  userId,
}: {
  product: any;
  viewMode: "grid" | "list";
  userId?: string;
}) {
  const router = useRouter();

  const discountPercentage =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  const handleNavigate = () => {
    router.push(`/products/${product.pathUrl}`);
  };

  return (
    <div
      className={`bg-white border border-slate-200 rounded shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        viewMode === "list" ? "flex" : "flex flex-col"
      }`}
    >
      <div
        onClick={handleNavigate}
        className={`relative bg-slate-50 cursor-pointer overflow-hidden ${
          viewMode === "list" ? "w-64 flex-shrink-0" : "w-full"
        }`}
      >
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 z-10 text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded shadow-md">
            {discountPercentage}% OFF
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute top-3 right-2 pr-2 text-red-500 z-10">
            Out of stock
          </span>
        )}

          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.name}
            className={`w-full object-contain bg-white group-hover:scale-105 transition-transform duration-500 ${
              viewMode === "list" ? "h-80" : "h-72"
            }`}
          />
      
      </div>

      <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
        <h2
          onClick={handleNavigate}
          className="text-lg font-medium text-slate-800 mb-2 cursor-pointer hover:text-gray-900 transition line-clamp-2 leading-snug"
        >
          {product.name}
        </h2>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.description || "No description available."}
        </p>

        <div className="mb-4 font-sans">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-xl md:text-2xl font-medium text-slate-900">
              ₹{(product.discountPrice || product.price)?.toLocaleString()}
            </p>

            {product.discountPrice > 0 && (
              <>
                <p className="text-base text-slate-400 line-through">
                  ₹{product.price?.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  You save ₹
                  {(product.price - product.discountPrice)?.toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>

        <AddToCartButton
          product={product}
          userId={userId}
          disabled={product.stock <= 0}
          className={`text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  );
}
