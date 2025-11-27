"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Policy = {
  _id: string;
  category: string;
  title: string;
  shortDescription: string;
  effectiveDate: string;
  content: string;
};

const UpdatePolicyPage = () => {
  const { category } = useParams();
  const router = useRouter();

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/pages/policy/${category}`);
      if (res.data.success) {
        const p = res.data.data;
        setPolicy(p);
        setTitle(p.title);
        setShortDescription(p.shortDescription);
        setEffectiveDate(p.effectiveDate || "");
        setContent(p.content);
      } else {
        toast.error("Policy not found");
      }
    } catch (error) {
      toast.error("Error fetching policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [category]);

  const handleUpdate = async () => {
    if (!title || !shortDescription || !content) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`/api/pages/policy/${category}`, {
        title,
        shortDescription,
        effectiveDate,
        content,
      });

      if (res.data.success) {
        toast.success("Policy updated successfully!");
        router.push("/admin/pages/policy");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch {
      toast.error("Error updating policy");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
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
    "list",
    "link",
  ];

  if (!policy) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Edit Policy: {policy.category}
      </h1>

      <label className="block mb-2 font-medium">Title </label>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2 font-medium">Short Description </label>
      <textarea
        className="border p-2 rounded w-full mb-4"
        rows={3}
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      />

      <label className="block mb-2 font-medium">Effective Date (Optional)</label>
      <input
        type="date"
        className="border p-2 rounded w-full mb-4"
        value={effectiveDate}
        onChange={(e) => setEffectiveDate(e.target.value)}
      />

      <label className="block mb-2 font-medium">Content </label>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        style={{ height: "400px" }}
      />

      <div className="flex gap-4 mt-16">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Policy"}
        </button>

        <button
          className="bg-gray-400 text-white px-6 py-2 rounded"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePolicyPage;
