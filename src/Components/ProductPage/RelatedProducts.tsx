"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import AddToCartButton from "../Button/AddToCartButton";
import { useAuth } from "@/context/AuthProvider";


interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    if (categoryId) fetchRelatedProducts();
  }, [categoryId]);

  const fetchRelatedProducts = async () => {
    try {
      const res = await axios.get(`/api/category/${categoryId}`);
      const filtered = res.data.data.filter(
        (p: any) => p._id !== currentProductId
      );
      setRelated(filtered);
    } catch (err) {
      console.error("Error fetching related products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );

  if (!related.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl md:text-2xl mb-6 text-gray-800">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <div
            key={item._id}
            className="group border border-gray-300 rounded-xl p-4 bg-white hover:shadow-md transition space-y-2"
          >
            <Link
             href={`/products/${item.pathUrl}`}
             className="relative w-full aspect-auto h-fit mb-3">
              <img
                src={item.images?.[0] || item.thumbnail || "/placeholder.jpg"}
                alt={item.name}
                className="rounded-lg h-52 w-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
            <h3 className="font-semibold text-gray-800 text-sm">
              {item.name}
            </h3>
             <p className="line-clamp-2 text-sm">{item.description}</p>
            <p className="text-gray-900 font-semibold font-sans mt-1 text-lg py-1">
              ₹{(item.discountPrice || item.price)?.toLocaleString()}
            </p>
            <AddToCartButton 
               product={item._id}
               userId={user?._id}
               className="border"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
