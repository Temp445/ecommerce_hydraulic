"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import FiltersSidebar from "@/Components/ProductPage/FiltersSidebar";
import ProductCard from "@/Components/ProductPage/ProductCard";
import Pagination from "@/Components/Common/Pagination"; 

const ProductsClient = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); 
  }, [products, selectedCategories, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      const data = res.data?.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category?._id)
      );
    }

    filtered = filtered.filter((p) => {
      const price = p.discountPrice || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSortBy("featured");
    router.push("/products");
  };

  const categories = Array.from(
    new Map(
      products
        .filter((p) => p.category?._id)
        .map((p) => [p.category._id, p.category])
    ).values()
  );

  const totalItems = filteredProducts.length;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(firstIndex, lastIndex);

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex  md:gap-8 relative">
          <div>
            <div className="w-64 lg:w-72 h-full bg-white rounded-lg shadow-md p-6 hidden lg:block">
              <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (  
                  <div key={index} className="h-5 bg-slate-200 rounded w-full"></div>
                ))}
              </div>  
              </div>
          </div>

          <div className="w-full md:flex-1">
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white border border-slate-200 rounded p-4 shadow-sm animate-pulse">
          <div className="w-40 h-6 bg-slate-200 rounded"></div>
          <div className="hidden md:flex gap-2">
            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="w-24 h-8 bg-slate-200 rounded lg:hidden"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden animate-pulse"
            >
              <div className="bg-slate-200 h-64 w-full"></div>

              <div className="p-5 space-y-3">
                <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
                <div className="w-full h-4 bg-slate-200 rounded"></div>
                <div className="w-2/3 h-4 bg-slate-200 rounded"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-20 h-6 bg-slate-200 rounded"></div>
                  <div className="w-24 h-9 bg-slate-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex gap-8 relative">
          <FiltersSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
          />

          <main className="flex-1">
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white border border-slate-200 rounded p-4 shadow-sm">
              <h1 className="text-xl font-medium">Our Products</h1>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition lg:hidden"
              >
                <Filter size={18} />
                Filters
              </button>

              <div className="md:flex items-center gap-2 hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg border ${
                    viewMode === "grid"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg border ${
                    viewMode === "list"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    viewMode={viewMode}
                    userId={user?._id}
                  />
                ))
              )}
            </div>

            {totalItems > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsClient;
