"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SeoUploadForm = () => {
  const [path, setPath] = useState("home");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/pages/seo", {
        path,
        title,
        description,
        keywords: keywords.split(",").map(k => k.trim()),
        ogTitle,
        ogDescription,
        twitterTitle,
        twitterDescription,
      });

      if (res.data.success) {
         toast.success("SEO created successfully!");
       router.push('/admin/pages/seo')
      } else{
      toast.error(res.data.message || "Seo Already Exists!");
      }
    } catch (err: any) {
      toast.error( err?.response?.data?.message || "Seo Already Exists");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="px-4 pb-32">
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl text-center">Upload SEO Metadata</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="max-w-xl mx-auto border border-gray-400 rounded p-4 space-y-4"
      >
        <label className="block font-medium">Page</label>
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="blog">Blog</option>
          <option value="contact">Contact</option>
          <option value="product">Product</option>
          <option value="cart">Cart</option>
          <option value="checkout">CheckOut</option>
          <option value="policy">Policy</option>
        </select>

        <label className="block font-medium">Title (chars 50 ~ 60)</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />

        <label className="block font-medium">Description (chars 150 ~ 160)</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />

        <label className="block font-medium">Keywords</label>
        <textarea
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">OG Title (chars 10 ~ 60)</label>
        <input
          type="text"
          placeholder="OG Title"
          value={ogTitle}
          onChange={(e) => setOgTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">OG Description (chars 50 ~ 160)</label>
        <textarea
          placeholder="OG Description"
          value={ogDescription}
          onChange={(e) => setOgDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">Twitter Title (chars 10 ~ 70)</label>
        <input
          type="text"
          placeholder="Twitter Title"
          value={twitterTitle}
          onChange={(e) => setTwitterTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">Twitter Description (chars 70 ~ 200)</label>
        <textarea
          placeholder="Twitter Description"
          value={twitterDescription}
          onChange={(e) => setTwitterDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

      <div className="flex gap-4">

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

         <button
           type="button"
          className="bg-gray-500 text-white px-6 py-2 rounded "
          onClick={() => router.push('/admin/pages/seo')}
        >
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
}

export default SeoUploadForm