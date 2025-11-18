"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import AddToCartButton from "../Button/AddToCartButton";
import { useAuth } from "@/context/AuthProvider";

const PopularProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product");
      const data = res.data?.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && products.length === 0) {
    return (
      <p className="text-center text-gray-500">No popular products found.</p>
    );
  }

  return (
    <div className="bg-white px-4 md:px-8 lg:px-6 py-10 container mx-auto">
      <div className="pb-8 flex justify-between">
        <h2 className="text-2xl md:text-3xl xl:text-4xl max-w-52 md:max-w-max font-medium text-gray-900">
          Most Popular Products
        </h2>

        <Link
          href="/products"
          className="bg-gray-900 text-white h-11 pl-3 pr-1 flex  items-center rounded text-sm"
        >
          View All <ChevronRight className="w-5 h-5" />{" "}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md border border-gray-200 bg-white animate-pulse"
            >
              <div className="relative w-full h-52 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .slice()
            .reverse()
            .map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl border transition-all duration-300 bg-white"
              >
                <Link href={`/products/${product.pathUrl}`} className="relative w-full overflow-hidden">
                  <img
                    src={
                      product.thumbnail ||
                      product.images?.[0] ||
                      "/placeholder.jpg"
                    }
                    alt={product.name}
                    className=" h-52 w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>

                      {product.stock === 0 && (
          <span className="absolute top-3 right-2 pr-2 text-red-500 z-10">
            Out of stock
          </span>
        )}

                <div className="p-4">
                  <h3 className="font-medium md:text-lg text-gray-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-sans text-base font-semibold">
                        ₹
                        {product.discountPrice > 0
                          ? product.discountPrice?.toLocaleString()
                          : product.price.toLocaleString()}
                      </div>
                      {product.discountPrice > 0 && (
                        <div className="text-xs line-through font-sans text-gray-500">
                          ₹{product.price?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <AddToCartButton
                        product={product}
                        userId={user?._id}
                        disabled={product.stock <= 0}
                        className="text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PopularProducts;
