"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Edit, Loader2, Trash2 } from "lucide-react";

type Policy = {
  _id: string;
  category: string;
  title: string;
  content: string;
  shortDescription?: string;
};

export default function AllPoliciesPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/pages/policy");
      if (res.data.success) {
        setPolicies(res.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to load policies");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load policies";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const deletePolicy = async (id: string, category: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/pages/policy/${category}`);
      if (res.data.success) {
        toast.success("Policy deleted successfully");
        setPolicies((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete policy");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete policy";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900"> Manage Policies</h1>
            
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            onClick={() => router.push("/admin/pages/policy/upload")}
          >
            + Add New
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-600">Loading ...</p>
            </div>
          </div>
        )}

        {!loading && policies.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No policies found</p>
            <button
              onClick={() => router.push("/admin/pages/policy/upload")}
              className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Create your first policy
            </button>
          </div>
        )}

        {!loading && policies.length > 0 && (
          <div className="space-y-3 grid md:grid-cols-2 gap-2">
            {policies.map((policy) => (
              <div
                key={policy._id}
                className="bg-white rounded-lg border  border-gray-200 p-5 hover:shadow-md transition-shadow grid grid-cols-1 justify-between items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-sm text-blue-600 font-mono py-1 rounded mb-2">
                    {policy.category}
                  </span>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">
                    {policy.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {policy.shortDescription}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Link
                    href={`/admin/pages/policy/update/${policy.category}`}
                    className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                    title="Edit"
                  >
                    <Edit size={16} className="text-green-700" />
                  </Link>
                  <button
                    disabled={deletingId === policy._id}
                    onClick={() => deletePolicy(policy._id, policy.category)}
                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  >
                    {deletingId === policy._id ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-red-700"
                      />
                    ) : (
                      <Trash2 size={16} className="text-red-700" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
