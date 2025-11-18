"use client";

import axios from "axios";
import { Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ApplicationType {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function ApplicationList() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await axios.get("/api/application");
    const data = await res.data;

    if (data.success) {
      setApplications(data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await axios.delete(`/api/application/${id}`, { method: "DELETE" });
    const data = res.data;

    if (data.success) {
      setApplications((prev) => prev.filter((item) => item._id !== id));
    }
  };

  if (!loading && applications.length === 0) {
    return <p className="text-center text-gray-500">No testimonials found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-900">Applications</h2>

        <Link
          href="/admin/application/upload"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md transition shadow"
        >
          <Plus size={18} /> Upload
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-300 flex flex-col rounded-lg shadow p-2 bg-white animate-pulse h-64"
            >
              <div className="bg-gray-300 h-40 w-full mb-3 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
              <div className="flex justify-end gap-2 mt-auto">
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded-lg shadow p-2 bg-white"
            >
              <img
                src={app.image}
                alt={app.title}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {app.title}
              </h3>

              <p className="mt-2 text-gray-700 line-clamp-2 text-sm">
                {app.description}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <Link
                  href={`/admin/application/update/${app._id}`}
                  className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                  title="Edit"
                >
                  <Edit size={16} className="text-green-700" />
                </Link>

                <button
                  onClick={() => handleDelete(app._id)}
                  className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
