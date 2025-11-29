"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useParams, useRouter } from "next/navigation";


const SeoUpdateForm = () => {
  const { path } = useParams()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await axios.get(`/api/pages/seo/${path}`);
        const data = res.data.data;
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setKeywords((data.keywords || []).join(", "));
          setOgTitle(data.ogTitle || "");
          setOgDescription(data.ogDescription || "");
          setTwitterTitle(data.twitterTitle || "");
          setTwitterDescription(data.twitterDescription || "");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch SEO data");
      }
    };

    fetchSeo();
  }, [path]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/pages/seo/${path}`, {
        path,
        title,
        description,
        keywords: keywords.split(",").map((k) => k.trim()),
        ogTitle,
        ogDescription,
        twitterTitle,
        twitterDescription,
      });
      if (res.data.success) toast.success("SEO updated successfully!");
      router.push("/admin/pages/seo");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pb-32">
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl text-center">Edit SEO Metadata</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="max-w-xl mx-auto border border-gray-400 rounded p-4 space-y-4"
      >
       <div className="flex gap-2">
         <label className="block font-medium">Page :</label>
       <span className="font-semibold">{path}</span>
       </div>

        <label className="block font-medium">Title (chars 50 ~ 60)</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />

        <label className="block font-medium">
          Description (chars 150 ~ 160)
        </label>
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

        <label className="block font-medium">
          OG Description (chars 50 ~ 160)
        </label>
        <textarea
          placeholder="OG Description"
          value={ogDescription}
          onChange={(e) => setOgDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">
          Twitter Title (chars 10 ~ 70)
        </label>
        <input
          type="text"
          placeholder="Twitter Title"
          value={twitterTitle}
          onChange={(e) => setTwitterTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

        <label className="block font-medium">
          Twitter Description (chars 70 ~ 200)
        </label>
        <textarea
          placeholder="Twitter Description"
          value={twitterDescription}
          onChange={(e) => setTwitterDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />

      <div className="flex gap-4">

        <button
          type="submit"
          disabled={loading }
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
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
};

export default SeoUpdateForm;
