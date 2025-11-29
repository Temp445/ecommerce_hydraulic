"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface SeoPage {
  _id: string;
  path: string;
  title: string;
  description: string;
}

const SeoListPage = () => {
  const [seoList, setSeoList] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSeoList = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/pages/seo");
      setSeoList(res.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to fetch SEO list";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoList();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900"> Manage SEO metadata</h1>
          </div>
          <Link
            href="/admin/pages/seo/upload"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            + New SEO
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {!loading && seoList.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No SEO entries found</p>
            <Link
              href="/admin/pages/seo/upload"
              className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              Create your first SEO page
            </Link>
          </div>
        )}

        {!loading  && seoList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {seoList.map((seo) => (
              <div
                key={seo._id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="flex-1">
                  <p className="text-sm font-mono text-blue-600 mb-2">
                    {seo.path}
                  </p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {seo.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {seo.description || "No description provided"}
                  </p>
                </div>

                <Link
                  href={`/admin/pages/seo/update/${seo.path}`}
                  className="inline-flex justify-center bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoListPage;