"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Calendar, Clock } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-gray-600 mb-8 text-lg">Article not found</p>
          <button
            onClick={() => router.push("/blog")}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const readingTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <span className="font-bold text-gray-900 mb-4">About This Article</span>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Published</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Reading Time</p>
                      <p className="font-semibold text-gray-900">{readingTime} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl  leading-tight text-gray-900 mb-6">
                {blog.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {blog.shortDescription}
              </p>
            </div>

            {blog.imageUrl && (
              <div className="mb-12 rounded-xl overflow-hidden border border-gray-200 h-96">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <article className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed space-y-6 [&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-gray-900 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-gray-900 [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:ml-6 [&>ul>li]:mb-3 [&>ul>li]:list-disc [&>ol]:mb-6 [&>ol]:ml-6 [&>ol>li]:mb-3 [&>ol>li]:list-decimal [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </article>

          </div>
        </div>
      </div>

    
    </div>
  );
};

export default BlogDetailPage;