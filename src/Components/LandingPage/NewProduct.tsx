"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CircleChevronRight } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import AddToCartButton from "../Button/AddToCartButton";

export default function NewProduct() {
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product");
      const allProducts = res.data?.data || [];
      const filtered = allProducts.filter((p: any) => p.isNewArrival);
      setNewArrivals(filtered);
    } catch (err) {
      console.error("Error fetching new arrivals:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 md:py-14 bg-gradient-to-b from-slate-100 to-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-7">
          <h2 className="text-2xl 2xl:text-4xl font-medium text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
        </div>
        {!loading && newArrivals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {newArrivals.slice(0, 8).map((product, idx) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-sm border border-gray-200 hover:border-slate-700 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-full h-16">
                  <div className="absolute top-0 right-0 w-fit px-4 rounded-bl bg-slate-900 text-white text-center text-[10px] font-bold uppercase tracking-wider py-1 shadow-md">
                    NEW
                  </div>
                </div>

                <div className="grid grid-cols-5">
                  <div className="col-span-2 p-2 flex items-center justify-center">
                    <Link
                      href={`/products/${product.pathUrl}`}
                      className="relative w-52 h-52 transform group-hover:scale-110 transition-all duration-500"
                    >
                      <img
                        src={
                          product.thumbnail ||
                          product.images?.[0] ||
                          "/placeholder.jpg"
                        }
                        alt={product.name}
                        className="object-contain w-full h-full"
                      />
                    </Link>
                  </div>

                  <div className="col-span-3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-full text-xs font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="h-px flex-1 bg-gray-300"></div>
                      </div>

                      <h3 className=" text-sm md:text-xl font-medium text-gray-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-medium">
                            Max Capacity:
                          </span>
                          <span className="font-mono font-bold text-gray-900">
                            {product.technicalDetails.workingPressure}
                          </span>
                        </div>

                        {product.technicalDetails.material && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Material:
                            </span>
                            <span className="font-mono font-bold text-gray-900 line-clamp-1 ">
                              {product.technicalDetails.material
                                .split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
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

                      <Link
                        href={`/products/${product.pathUrl}`}
                        className="flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:gap-3 transition-all duration-300"
                      >
                        <CircleChevronRight />
                      </Link>
                    </div>
                    <div className="bg-white text-red-500 text-xs mt-5">
                      <AddToCartButton
                        product={product}
                        userId={user?._id}
                        disabled={product.stock <= 0}
                        className="bg-white border borde-gray-800 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed "
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && newArrivals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No New Arrivals found</p>
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex bg-white rounded-sm border border-gray-200  transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gray-300 h-64 w-52 animate-pulse"></div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2 animate-pulse"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
