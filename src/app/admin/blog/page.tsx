"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  slug: string;
  shortDescription: String;
  createdAt: string;
}

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          setBlogs(data.data);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        toast.error("Failed to load blogs");
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (slug: string) => {
    const confirmed = confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.success) {
        setBlogs((prev) => prev.filter((b) => b.slug !== slug));
        toast.success("Blog deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete blog!");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
        <button
          onClick={() => router.push("/admin/blog/upload")}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> New Blog
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="bg-gray-200 h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition relative group overflow-hidden"
            >
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h2 className="text-base font-medium mb-1 line-clamp-2 text-gray-800">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">
                 {blog.shortDescription}
                </p>
              </div>

              <div className="flex justify-end p-4 gap-2 ">
                <Link
                  href={`/admin/blog/update/${blog.slug}`}
                  className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                  title="Edit"
                >
                  <Edit size={16} className="text-green-700" />
                </Link>

                <button
                  onClick={() => handleDelete(blog.slug)}
                  className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>No blogs found. Create your first one!</p>
          <button
            onClick={() => router.push("/admin/blog/upload")}
            className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Create Blog
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogListPage