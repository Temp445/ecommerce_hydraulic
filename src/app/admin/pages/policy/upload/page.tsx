"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const categories = [
  { label: "Terms & Conditions", value: "terms" },
  { label: "Privacy Policy", value: "privacy" },
  { label: "Cancellation Policy", value: "cancellation" },
  { label: "Shipping Policy", value: "shipping" },
];

export default function UploadPolicyPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
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
    "link",
  ];

  const handleUpload = async () => {
    if (!category || !title || !shortDescription || !content) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/pages/policy", {
        category,
        title,
        shortDescription,
        effectiveDate,
        content,
      });

      if (res.data.success) {
        toast.success("Policy created successfully");
        router.push("/admin/pages/policy");

        setCategory("");
        setTitle("");
        setShortDescription("");
        setEffectiveDate("");
        setContent("");
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Upload Policy</h1>

      <label className="block mb-2 font-medium">Select Category</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Title</label>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="Enter page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2 font-medium">Short Description</label>
      <textarea
        className="border p-2 rounded w-full mb-4"
        placeholder="Enter short description"
        rows={3}
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      ></textarea>

      <label className="block mb-2 font-medium">Effective Date (Optional)</label>
      <input
        type="date"
        className="border p-2 rounded w-full mb-4"
        value={effectiveDate}
        onChange={(e) => setEffectiveDate(e.target.value)}
      />

      <div className="ql-custom-styles">
        <label className="block mb-2 font-medium">Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          style={{ height: "400px" }}
          className="bg-white rounded-lg"
        />
      </div>

      <div className="flex gap-4 mt-16">

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

        <button
          type="button"
          className="bg-gray-400 text-white px-6 py-2 rounded "
          onClick={() => router.back()}
        >
          Cancel
        </button>
        </div>

    </div>
  );
}
