"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pathUrl: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeleting(pathUrl);
      const res = await axios.delete(`/api/product/${pathUrl}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p.pathUrl !== pathUrl));
        toast.success("Product deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error deleting product");
    } finally {
      setDeleting(null);
    }
  };

  if (!loading && products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="p-6 pb-32 lg:pb-52">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-slate-800">All Products</h1>
        <Link
          href="/admin/product/upload"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md flex flex-col justify-center h-28">
          <p className="text-gray-700 font-medium text-sm mb-2">
            Total Products
          </p>
          <span className="font-bold text-2xl text-blue-900">
            {products.length}
          </span>
        </div>

        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-md  flex flex-col justify-center h-28">
          <p className="text-red-700 font-medium text-sm mb-2">Out of Stock</p>
          <span className="font-bold text-2xl text-red-900">
            {products.filter((p) => p.stock <= 0).length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-400 rounded-xl shadow-sm p-4 animate-pulse"
            >
              <div className="aspect-square rounded-lg bg-gray-300 mb-3"></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-white mb-3">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold text-slate-800 line-clamp-1 mb-1">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {product.description || "No description available."}
              </p>
              <div>{product.stock > 0 ? <span className="text-emerald-600 text-sm">Stock</span> : <span className="text-red-500 text-sm">Out of Stock</span>}</div>

              <div className="mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <p className="text-slate-800 font-semibold font-sans">
                      ₹
                      {product.discountPrice
                        ? product.discountPrice.toLocaleString()
                        : product.price?.toLocaleString()}
                    </p>
                    {product.discountPrice > 0 && (
                      <p className="text-gray-600 text-xs line-through font-sans">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Link
                    href={`/admin/product/update/${product.pathUrl}`}
                    className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                    title="Edit"
                  >
                    <Edit size={16} className="text-green-700" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.pathUrl)}
                    disabled={deleting === product.pathUrl}
                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    {deleting === product.pathUrl ? (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
