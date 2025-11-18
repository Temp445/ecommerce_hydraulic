"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Save, Image as ImageIcon, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const CategoryEditPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    Name: "",
    CatImage: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`/api/category/admin/${id}`);
        setFormData({
          Name: data.data.Name,
          CatImage: null,
        });
        setPreview(data.data.CatImage);
      } catch (err) {
        toast.error("Failed to load category data.");
      } finally {
        setFetching(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "CatImage" && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, CatImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, CatImage: null });
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Name.trim()) {
      toast.error("Please provide a category name.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("Name", formData.Name);
      if (formData.CatImage) {
        data.append("CatImage", formData.CatImage);
      }

      await axios.put(`/api/category/admin/${id}`, data);
      toast.success("Category updated successfully!");
      router.push("/admin/category");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-gray-800 mb-1">
              Edit Category
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-1 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-gray-500 hover:bg-blue-50 transition-all duration-200 group">
                <input
                  type="file"
                  name="CatImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600 mb-1">
                  Click to upload new image
                </span>
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain"
                />
                <div className="absolute inset-0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-red-600 rounded-full p-2 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl flex items-center justify-center transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-5 h-5" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 w-5 h-5" />
                Update
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditPage;
