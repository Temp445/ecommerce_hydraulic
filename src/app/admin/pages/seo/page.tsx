"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const SeoListPage = () => {
  const [seoList, setSeoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSeoList = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/pages/seo");
      setSeoList(res.data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch SEO list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoList();
  }, []);

  return (
    <div className="px-4 max-w-5xl mx-auto pb-32">
      <div className="p-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl">All SEO Pages</h1>
        <Link
          href="/admin/pages/seo/upload"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          New SEO
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {seoList.length === 0 && <p className="text-center">No SEO entries found.</p>}
          {seoList.map((seo) => (
            <div key={seo._id} className="border p-4 rounded">
              <p><strong>Path:</strong> {seo.path}</p>
              <p><strong>Title:</strong> {seo.title}</p>
              <p><strong>Description:</strong> {seo.description}</p>
              <div className="mt-2">
                <Link
                  href={`/admin/pages/seo/update/${seo.path}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeoListPage