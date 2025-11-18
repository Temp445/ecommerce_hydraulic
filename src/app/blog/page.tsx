"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { File } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
  createdAt: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-white"></div>
            <div>
              <p className="text-white text-sm tracking-wider uppercase">
                Knowledge Base
              </p>
              <h1 className="text-2xl md:text-4xl  text-white">
                Hydraulic Insights
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-lg ml-4 max-w-3xl">
            Expert insights, technical guides, and industry updates from our engineering team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-3 bg-gray-200 w-24"></div>
                  <div className="h-6 bg-gray-200 w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 w-full"></div>
                    <div className="h-4 bg-gray-200 w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 mb-4">
              <File  className="w-8 h-8 text-gray-700"/>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Articles Available
            </h3>
            <p className="text-gray-600">
              New technical content coming soon
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => router.push(`/blog/${blog.slug}`)}
                className="group bg-white border border-gray-200 hover:border-gray-900 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-lg"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {blog.imageUrl ? (
                    <>
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="text-slate-600 font-medium uppercase tracking-wide">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {blog.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
                      Read Article
                    </span>
                    <div className="w-8 h-8 bg-slate-900  flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogPage;