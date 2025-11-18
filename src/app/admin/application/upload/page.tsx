"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const UploadApplicationPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post("/api/application", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      if (data.success) {
        toast.success("Application uploaded successfully!");
        router.push("/admin/application");
      } else {
        toast.error(data.message || "Failed to upload");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Add New Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1 text-gray-800">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800">
            Description
          </label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-800">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            required
          />
        </div>

        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-40 rounded border" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Application"}
        </button>
      </form>
    </div>
  );
};

export default UploadApplicationPage;
