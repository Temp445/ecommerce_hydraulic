'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CategorySection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/category");
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className=" py-5 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4 2xl:px-8">
        <div className=" mb-5 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2">
            Shop by Category
          </h2>
          <div className="w-12 h-1 bg-white mt-4"></div>
        </div>

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat._id}
                onClick={() => router.push(`/products?category=${cat._id}`)}
                className="group flex flex-col items-center text-center transition-all duration-300"
              >
                <div className="w-full aspect-square bg-white rounded flex items-center justify-center mb-4  transition-colors duration-300 border border-gray-200">
                  <img
                    src={cat.CatImage}
                    alt={cat.Name}
                    className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm  font-medium text-white line-clamp-2">
                  {cat.Name}
                </h3>
              </button>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No categories found</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategorySection;