"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
const UploadTestimonialPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userRole: "",
    description: "",
  });
  const Route=useRouter();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/testimonial", formData);
      toast.success("Testimonial submitted successfully!");
      Route.push("/admin/testimonial");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Testimonial</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2  outline-none"
            placeholder="Enter user's name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Role</label>
          <input
            type="text"
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 outline-none"
            placeholder="e.g., Industrial Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 h-24 outline-none resize-none"
            placeholder="Write testimonial..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Testimonial"}
        </button>
      </form>
    </div>
  );
}

export default UploadTestimonialPage;