"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className=" py-10 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="inline-block px-4 py-2 bg-gray-300 text-gray-900 text-xs font-bold uppercase tracking-wider mb-4">
                Blogs
              </div>
              <h2 className="text-2xl text-gray-900 mb-4 leading-tight">
                Hydraulic
                <br /> Cyclinders
              </h2>

              <div className="w-16 h-1 bg-gray-800"></div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {blogs.slice(0, 5).map((blog, idx) => (
              <button
                onClick={() => router.push(`/blog/${blog.slug}`)}
                key={idx}
                className="group flex flex-col md:flex-row bg-white hover:bg-gray-50 transition-all duration-300 border-l-4 border-gray-300 hover:border-gray-900 shadow-sm hover:shadow-lg"
              >
                <div className="w-[300px] flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="relative w-full h-40 md:h-full transform group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-52 object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl flex items-end font-bold text-gray-400">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-2 text-left transition-colors duration-300">
                          {blog.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 text-left">
                        {blog.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-end pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:gap-3 transition-all duration-300">
                      <span>Explore</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection