"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryProductsPage() {
  const { name } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) fetchProducts();
  }, [name]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/category/${name}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  if (!products.length)
    return (
      <p className="text-center mt-10">
        No products found in the <b>{name}</b> category.
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 capitalize">{name} Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-3 hover:shadow-md transition">
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
