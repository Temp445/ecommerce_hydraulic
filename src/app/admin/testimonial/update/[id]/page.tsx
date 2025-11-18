"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const UpdateTestimonialPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    userName: "",
    userRole: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(`/api/testimonial/${id}`);
        const data = res.data.data;
        setFormData({
          userName: data.userName || "",
          userRole: data.userRole || "",
          description: data.description || "",
        });
      } catch (error) {
        toast.error("Failed to load testimonial");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchTestimonial();
  }, [id]);

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
      await axios.put(`/api/testimonial/${id}`, formData);
      toast.success("Testimonial updated successfully!");
      router.push("/admin/testimonial");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading testimonial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Testimonial</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 outline-none"
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
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold transition duration-300"
        >
          {loading ? "Updating..." : "Update Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTestimonialPage;
