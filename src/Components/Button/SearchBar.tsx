"use client";

import React, { useState } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setShowResults(true);
    try {
      const res = await axios.get(`/api/product/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (pathUrl: string) => {
    router.push(`/products/${pathUrl}`);
    setShowResults(false);
    setQuery("");
    setMobileOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <>
      <div className="hidden md:block w-full max-w-2xl mx-auto relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white border border-gray-200 rounded-full hover:shadow-md focus-within:shadow-lg transition-all duration-200">
            <div className="pl-3 text-gray-400">
              <Search className="w-5" />
            </div>
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-gray-800"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setShowResults(false);
              }}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-500 w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {showResults && (
          <div className="absolute  mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[28rem] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-600">Searching...</div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleRedirect(item.pathUrl)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.price && (
                      <p className="text-xs text-gray-600 font-sans">₹{item.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-600 text-sm">No products found</div>
            )}
          </div>
        )}
      </div>

      <button
        className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600"
        onClick={() => setMobileOpen(true)}
      >
        <Search size={22} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col animate-fadeIn">
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 sticky top-0 bg-white">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-2 py-2 text-sm outline-none bg-transparent text-gray-800"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setShowResults(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
            {query && (
              <button onClick={clearSearch} className="p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <button onClick={() => setMobileOpen(false)} className="ml-2 text-gray-700 font-medium">
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-3"></div>
                <p className="text-sm">Searching...</p>
              </div>
            ) : showResults && results.length > 0 ? (
              <div className="pt-2">
                {results.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleRedirect(item.pathUrl)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.price && (
                        <p className="text-xs text-gray-500 mt-0.5 font-sans">
                          ₹{item.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : showResults ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <Search size={40} className="mb-2 text-gray-300" />
                <p className="text-sm">No products found</p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <Search size={40} className="mb-2 text-gray-300" />
                <p className="text-sm">Start typing to search products</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}

export default SearchBar;