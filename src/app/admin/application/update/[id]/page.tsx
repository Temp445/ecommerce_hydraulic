"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const UpdateApplicationPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/api/application/${id}`);
      const data = res.data || {};

      if (data.success) {
        setForm({
          title: data.data.title || "",
          description: data.data.description || "",
          image: data.data.image || "",
        });
      }
    }
    fetchData();
  }, [id]);

  const handleImageSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const previewURL = URL.createObjectURL(file);
      setNewImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);

      if (newImage) formData.append("image", newImage);

      await axios.put(`/api/application/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Updated Successfully");
      router.push("/admin/application");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center pb-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          Update Application
        </h2>

        <label className="block mb-2 font-semibold text-gray-700">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none mb-4"
          required
        />

        <label className="block mb-2 font-semibold text-gray-700">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none mb-4"
          rows={4}
          required
        />

        <label className="block mb-2 font-semibold text-gray-700">Image</label>

        <div
          className="relative w-40 h-40 border rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={newImagePreview || form.image || "/placeholder.png"}
            alt="Preview"
            className="w-full h-full object-cover group-hover:opacity-80 transition"
          />

          <div className="absolute inset-0 bg-black/50 bg-opacity-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span className="text-white text-sm font-semibold">
              Click to Update
            </span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          type="submit"
          className="mt-10 w-full bg-emerald-600 text-white py-2 rounded-lg  shadow"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateApplicationPage;
