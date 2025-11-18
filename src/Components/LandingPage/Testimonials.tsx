"use client";

import { Quote } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
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

  if (!loading && testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500">No testimonials found.</div>
    );
  }

  return (
    <section className="relative px-4 md:px-6 max-w-7xl mx-auto py-5 lg:py-10 overflow-hidden">
      <div className="text-center mb-10 lg:mb-16">
        <span className="text- font-semibold text-sm uppercase tracking-wider mb-2 block">
          Testimonials
        </span>
        <h2 className=" text-2xl md:text-3xl xl:text-4xl font-medium mb-4 text-gray-900">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trusted by industry leaders for precision hydraulic solutions
        </p>
      </div>

      {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-200 animate-pulse"
            > 
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}

        </div> ):(

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
          >
            <div className="flex gap-1 mb-4 mt-4">
              <Quote className="text-gray-500 w-6 h-6" fill="currentColor" />
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-sm xl:text-base">
              "{t.description}"
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {t.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{t.userName}</h4>
                <p className="text-sm text-gray-500">{t.userRole}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
        )}

    </section>
  );
}
