"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const UploadBlogPage = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Router = useRouter()

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    // "bullet",
    "link",
    "image",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription || !content || !image) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("shortDescription", shortDescription);
      formData.append("content", content);
      if (image) formData.append("file", image);

      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Blog created successfully!");
        Router.push("/admin/blog")
        setTitle("");
        setSlug("");
        setShortDescription("");
        setContent("");
        setImage(null);
        setPreviewUrl("");
      } else {
        toast.error(data.message || "Failed to create blog.");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-medium text-gray-800 mb-4">
        Create New Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Title *
          </label>
          <input
            type="text"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => {
              const val = e.target.value;
              setTitle(val);
              setSlug(val.toLowerCase().trim().replace(/\s+/g, "-"));
            }}
            required
          />
        </div>

        <div className="hidden">
          <label className="text-gray-700 font-medium mb-2">
            Slug 
          </label>
          <input
            type="text"
            className="border border-gray-300 p-3 w-full rounded-lg bg-gray-50"
            value={slug}
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Short Description *
          </label>
          <textarea
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none min-h-[100px]"
            placeholder="Enter a short summary..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cover Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-600"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-32 object-cover mt-3 rounded-lg shadow border"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Content *
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            style={{ height: "400px" }}
            className=" bg-white rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg font-medium text-white bg-emerald-600 mt-10"
        >
          {isSubmitting ? "Uploading..." : "Upload Blog"}
        </button>
      </form>
    </div>
  );
}

export default UploadBlogPage