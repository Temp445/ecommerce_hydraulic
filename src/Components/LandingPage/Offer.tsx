"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

export default function Offer({ initialContent }: { initialContent: any }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const defaultContent = {
    title: "",
    description: "",
    note: "",
    active: true,
  };

  const [content, setContent] = useState(initialContent ?? defaultContent);

  const isEmpty = !initialContent || !initialContent.title;

  const [editMode, setEditMode] = useState(isEmpty && isAdmin);
  const isPostMode = isEmpty;

  const handleSave = async () => {
    const method = isPostMode ? "POST" : "PATCH";
     await fetch("/api/landingpage/offersection", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    setEditMode(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  if (!content.active && !editMode && !isAdmin) {
    return null;
  }

  return (
    <div className="bg-white">
      <section className="relative bg-gray-950 text-white py-20 text-center px-6 rounded-3xl mx-4 overflow-hidden">
        {isAdmin && (
            <div className="">
              {editMode ? (
                <div className="absolute top-3 right-3 z-50 flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 px-4 py-2 rounded text-black"
                >
                  Save
                </button>
                <button
            onClick={cancelEdit}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded"
          >
            Cancel
          </button>
          </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-yellow-400 px-4 py-2 border z-50 rounded text-black absolute top-3 right-3"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        <div className="absolute inset-0 opacity-20 animated-grid" />
        {!content.active && isAdmin && (
          <div className="absolute top-2 left-2 bg-white border rounded max-w-sm text-red-700 px-3 py-2 rounded-bl shadow-md text-sm">
            This section is currently hidden from users.If you want Click "Edit"
            to enable it.
          </div>
        )}
        <div className="relative z=10 max-w-3xl mx-auto">
          {editMode ? (
            <input
              value={content.title}
              onChange={(e) =>
                setContent({ ...content, title: e.target.value })
              }
              className="text-center text-xl md:text-3xl bg-transparent border p-2 rounded"
              placeholder="Enter title..."
            />
          ) : (
            <h2 className="text-lg md:text-3xl xl:text-4xl mb-4 leading-tight">
              {content.title}
            </h2>
          )}

          {editMode ? (
            <textarea
              value={content.description}
              onChange={(e) =>
                setContent({ ...content, description: e.target.value })
              }
              className="w-full text-center bg-transparent border p-2 rounded mt-4"
              placeholder="Enter description..."
            />
          ) : (
            <p className="text-sm md:text-lg text-blue-100 mb-8">
              {content.description}
            </p>
          )}

          <Link
            href="/contact"
            className="px-4 py-2 md:px-8 md:py-3 bg-white text-black font-medium rounded-full shadow-md"
          >
            Contact Us
          </Link>

          {editMode ? (
            <input
              value={content.note}
              onChange={(e) => setContent({ ...content, note: e.target.value })}
              className="w-full text-center bg-transparent border p-2 rounded mt-4"
              placeholder="Enter footnote..."
            />
          ) : (
            <p className="mt-4 text-sm text-blue-200">{content.note}</p>
          )}

          {editMode && isAdmin && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <input
                type="checkbox"
                checked={content.active}
                onChange={(e) =>
                  setContent({ ...content, active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label className="text-sm text-blue-100">Offer Active</label>
            </div>
          )}

          
        </div>
      </section>
    </div>
  );
}
