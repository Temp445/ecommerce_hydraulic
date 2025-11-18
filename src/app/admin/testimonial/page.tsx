"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/api/testimonial");
      setTestimonials(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`/api/testimonial/${id}`);
      toast.success("Testimonial deleted!");
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete testimonial");
    }
  };

  if (!loading && testimonials.length === 0) {
    return (
   <p className="text-center text-gray-500">No testimonials found.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800">Testimonials</h1>
        <Link href="/admin/testimonial/upload" className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg">
          <Plus className="w-5 h-5 mr-2" />
          Add
        </Link>
      </div>

      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-5 animate-pulse"
              >
                <div className="flex items-center mb-3">
                    <div className="w-14 h-14 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                </div>

                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                 <div className="flex justify-end gap-2 mt-auto">
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
                </div>
            ))}

         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-center mb-3">
                  {item.userImage ? (
                    <img
                      src={item.userImage}
                      alt={item.userName}
                      className="w-14 h-14 rounded-full object-cover border mr-3"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-gray-600 font-semibold">
                      {item.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.userName}
                    </h3>
                    <p className="text-sm text-gray-500">{item.userRole}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  “{item.description.length > 120
                    ? item.description.slice(0, 120) + "..."
                    : item.description}”
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Link
                  href={`/admin/testimonial/update/${item._id}`}
                  className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                  title="Edit"
                >
                  <Edit size={16} className="text-green-700" />
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
