"use client";

import Link from "next/link";
import { CircleChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import AddToCartButton from "../Button/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  description: string;
  thumbnail?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock?: number;
}

const NewProduct = ({ products }: { products: Product[] }) => {
  const { user } = useAuth();

  const newArrivals = products.filter((p: any) => p.isNewArrival);

  return (
    <section className="py-5 md:py-14 bg-gradient-to-b from-slate-100 to-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-7">
          <h2 className="text-2xl 2xl:text-4xl font-medium text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
        </div>
        {newArrivals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {newArrivals.slice(0, 8).map((product: any, idx: any) => (
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
                        <span className="font-mono line-clamp-2 font-bold text-gray-900">
                          {product.description}
                        </span>
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
        {newArrivals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No New Arrivals found</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewProduct