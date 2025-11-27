"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Policy = {
  _id: string;
  category: string;
  title: string;
  content: string;
};

export default function AllPoliciesPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/api/pages/policy");
      if (res.data.success) {
        setPolicies(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Delete Policy
  const deletePolicy = async (category: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    try {
      const res = await axios.delete(`/api/pages/policy/${category}`);
      if (res.data.success) {
        toast.success("Policy deleted");
        fetchPolicies(); // refresh list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="text-center py-10">Loading ...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Policies</h1>
        <button
          className="px-5 py-2 bg-emerald-600 text-white rounded"
          onClick={() => router.push("/admin/pages/policy/upload")}
        >
          Add New Policy
        </button>
      </div>

      {policies.length === 0 ? (
        <p className="text-gray-500">No policies found.</p>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold">{policy.title}</h2>
                <p className="text-sm text-gray-500">Category: {policy.category}</p>
              </div>

              <div className="flex gap-3">

                <button
                  className="px-4 py-1 bg-yellow-500 text-white rounded"
                  onClick={() =>
                    router.push(`/admin/pages/policy/update/${policy.category}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="px-4 py-1 bg-red-600 text-white rounded"
                  onClick={() => deletePolicy(policy.category)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
