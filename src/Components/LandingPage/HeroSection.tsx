"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

const HeroSection = ({ initialContent }: { initialContent: any }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const defaultContent = {
    title: "",
    subTitle: "",
    description: "",
    note: "",
    heroImage: "",
  };

  const [content, setContent] = useState(initialContent ?? defaultContent);
  const [editContent, setEditContent] = useState(content);

  const isEmpty = !initialContent || !initialContent.title;
  const [editMode, setEditMode] = useState(isEmpty && isAdmin);
  const isPostMode = isEmpty;


  const handleSave = async () => {
    const method = isPostMode ? "POST" : "PATCH";

    const formData = new FormData();
    formData.append("title", editContent.title);
    formData.append("subTitle", editContent.subTitle);
    formData.append("description", editContent.description);
    formData.append("note", editContent.note);

    if (editContent.heroImageFile) {
      formData.append("heroImage", editContent.heroImageFile);
    }

    const res = await fetch("/api/landingpage/herosection", {
      method,
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setContent(editContent);
    }

    setEditMode(false);
  };

  const handleChange = (e: any) => {
    setEditContent({ ...editContent, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setEditContent({
      ...editContent,
      heroImage: preview,
      heroImageFile: file, 
    });
  };

  const cancelEdit = () => {
    setEditContent(content);
    setEditMode(false);
  };


  return (
    <div className="overflow-hidden relative">
      
      {isAdmin && !editMode && (
        <button
          onClick={() => setEditMode(true)}
          className="absolute top-3 right-3 z-50 px-4 py-2 bg-yellow-500 text-black text-sm rounded"
        >
          Edit
        </button>
      )}

      {isAdmin && editMode && (
        <div className="absolute top-3 right-3 z-50 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded"
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
      )}

      <div className="container mx-auto h-fit">
        <div className="relative flex flex-col md:flex-row items-center justify-between lg:gap-12 px-4 md:px-8 lg:px-2 xl:px-12">

          <div className="w-full md:w-1/2 flex flex-col justify-center py-1 md:pt-10 xl:py-14 order-2 md:order-1 z-10">

            <div className="mb-6 xl:mb-10">

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-gradient-to-r from-gray-900 to-gray-600"></div>

                {editMode ? (
                  <input
                    name="note"
                    value={editContent.note}
                    onChange={handleChange}
                    placeholder="note"
                    className="text-xs font-semibold text-gray-600 tracking-widest uppercase border p-1"
                  />
                ) : (
                  <p className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
                    {content.note}
                  </p>
                )}
              </div>

              {editMode ? (
                <input
                  name="title"
                  value={editContent.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-gray-900 w-full border p-2"
                />
              ) : (
                <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight tracking-tight">
                  {content.title}
                </h1>
              )}

              {editMode ? (
                <input
                  name="subTitle"
                  value={editContent.subTitle}
                  onChange={handleChange}
                  placeholder="Subtitle"
                  className="text-2xl md:text-3xl lg:text-4xl text-gray-500 font-medium w-full border p-2 my-4"
                />
              ) : (
                <h2 className="text-3xl lg:text-4xl xl:text-5xl text-gray-500 leading-tight mb-8">
                  {content.subTitle}
                </h2>
              )}

              {editMode ? (
                <textarea
                  name="description"
                  value={editContent.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full border p-3 text-base"
                  rows={4}
                />
              ) : (
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-light max-w-lg">
                  {content.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <Link href="/products">
                <button className="group relative px-8 py-4 bg-gray-900 text-white text-sm font-semibold tracking-wide uppercase overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Products
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          <div className="order-1 md:w-1/2 relative">
            <div className="flex h-full w-full my-5">
              <div className="w-full h-full flex-shrink-0 flex items-center justify-center">

                {editMode ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={editContent.heroImage || '/preview.png'}
                      className="w-full object-contain"
                    />

                    <input type="file" onChange={handleImage} />
                  </div>
                ) : (
                  <img
                    src={content.heroImage || ""}
                    alt="Hero Image"
                    className="w-full object-contain"
                  />
                )}

              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HeroSection;
