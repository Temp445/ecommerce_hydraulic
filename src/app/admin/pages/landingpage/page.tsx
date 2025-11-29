"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, X, Image as ImageIcon, Edit } from "lucide-react";
import toast from "react-hot-toast";


const LandingPageUpload = () => {
  const [mode, setMode] = useState<"view" | "edit" | "upload">("upload");
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState<any>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>( null );
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/pages/landingpage");
        if (res.data?.data) {
          setLandingData(res.data.data);
          setMode("view");
          setHeroImagePreview(res.data.data.hero.heroImage || null);
          setAboutImagePreview(res.data.data.about.aboutImage || null);
        } else {
          setMode("upload");
        }
      } catch (err) {
        console.log("No landing page found, upload mode");
        setMode("upload");
        setLoading(false);

      }
    };
    fetchLanding();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "about"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      if (type === "hero") {
        setHeroImagePreview(preview);
        setHeroImageFile(file);
      } else {
        setAboutImagePreview(preview);
        setAboutImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: "hero" | "about") => {
    if (type === "hero") {
      setHeroImagePreview(null);
      setHeroImageFile(null);
    } else {
      setAboutImagePreview(null);
      setAboutImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (heroImageFile) formData.set("heroImage", heroImageFile);
      if (aboutImageFile) formData.set("aboutImage", aboutImageFile);

      if (mode === "upload") {
        const res = await axios.post("/api/pages/landingpage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          toast.success("Landing Page uploaded successfully!");
          setLandingData(res.data.data);
          setMode("view");
        }
      } else if (mode === "edit") {
        const res = await axios.patch("/api/pages/landingpage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          toast.success("Landing Page updated successfully!");
          setLandingData(res.data.data);
          setMode("view");
        }
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to upload";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

   if (loading && !landingData) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between">
          <h1 className="text-2xl font-medium  text-slate-900 mb-2">
           {mode === "upload" ? "Upload Landing Page" : mode === "edit" ? "Edit Landing Page" : "Landing Page"}
          </h1>

          {mode === "view" && (
            <button
              onClick={() => setMode("edit")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-xl shadow-lg p-8"
        >
          <section className="pl-6">
            <h2 className="text-2xl  text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm ">
                1
              </span>
              Hero Section
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hero Title *
                  </label>
                  <input
                    type="text"
                    defaultValue={landingData?.hero?.title || ""}
                    name="heroTitle"
                    placeholder="Enter main hero title"
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    required
                    disabled={mode === "view"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hero Sub Title *
                  </label>
                  <input
                    type="text"
                    name="heroSubTitle"
                    defaultValue={landingData?.hero?.subTitle || ""}
                    placeholder="Enter hero subtitle"
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    required
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hero Description *
                </label>
                <textarea
                  name="heroDescription"
                  defaultValue={landingData?.hero?.description || ""}
                  placeholder="Enter detailed hero description"
                  rows={4}
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none  resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hero Note
                </label>
                <input
                  type="text"
                  name="heroNote"
                  defaultValue={landingData?.hero?.note || ""}
                  placeholder="Optional hero note"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hero Image *
                </label>

                {heroImagePreview ? (
                  <div className="relative w-fit bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={heroImagePreview}
                      alt="Hero preview"
                      className="w-fit h-64 object-cover"
                    />

                    {mode === "edit" && (
                      <label className="absolute bottom-0 left-0 right-0 w-full h-full bg-opacity-50 text-white py-2 cursor-pointer text-center hover:bg-opacity-70 transition">
                        <input
                          type="file"
                          name="heroImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "hero")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="block relative w-fit border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-gray-900 hover:bg-slate-50 transition cursor-pointer">
                    <input
                      type="file"
                      name="heroImage"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "hero")}
                      className="hidden"
                    />
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold mb-1">
                      Click to upload image
                    </p>
                  </label>
                )}
              </div>
            </div>
          </section>

          <section className="border-t-4 border-gray-900 pt-4 pl-6">
            <h2 className="text-2xl  text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm ">
                2
              </span>
              Offer Section
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Offer Title
                </label>
                <input
                  type="text"
                  name="offerTitle"
                  defaultValue={landingData?.offer?.title || ""}
                  placeholder="Enter offer title"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Offer Description
                </label>
                <textarea
                  name="offerDescription"
                  defaultValue={landingData?.offer?.description || ""}
                  placeholder="Enter offer description"
                  rows={3}
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none  resize-none"
                  disabled={mode === "view"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Offer Note
                  </label>
                  <input
                    type="text"
                    name="offerNote"
                    defaultValue={landingData?.offer?.note || ""}
                    placeholder="Enter offer note"
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    disabled={mode === "view"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="offerActive"
                    defaultValue={landingData?.offer?.offerActive || ""}
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    required
                    disabled={mode === "view"}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t-4 border-gray-900 pt-4 pl-6">
            <h2 className="text-2xl  text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm ">
                3
              </span>
              About Section
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    About Title
                  </label>
                  <input
                    type="text"
                    name="aboutTitle"
                    defaultValue={landingData?.about?.title || ""}
                    placeholder="Enter about title"
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    disabled={mode === "view"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    About Sub Title
                  </label>
                  <input
                    type="text"
                    name="aboutSubTitle"
                    defaultValue={landingData?.about?.subTitle || ""}
                    placeholder="Enter about subtitle"
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  About Description
                </label>
                <textarea
                  name="aboutDescription"
                  defaultValue={landingData?.about?.description || ""}
                  placeholder="Enter detailed about section description"
                  rows={4}
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none  resize-none"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  About Image
                </label>

                {aboutImagePreview || landingData?.about?.bgImage ? (
                  <div className="relative w-fit bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={aboutImagePreview || landingData?.about?.bgImage}
                      alt="About preview"
                      className="w-fit h-64 object-cover"
                    />

                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={() => removeImage("about")}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {mode === "edit" && (
                      <label className="absolute bottom-0 left-0 right-0 w-full h-full bg-opacity-50 text-white py-2 cursor-pointer text-center hover:bg-opacity-70 transition">
                        <input
                          type="file"
                          name="aboutImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "about")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="block relative w-fit border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-gray-900 hover:bg-slate-50 transition cursor-pointer">
                    <input
                      type="file"
                      name="aboutImage"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "about")}
                      className="hidden"
                    />
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold mb-1">
                      Click to upload image
                    </p>
                  </label>
                )}
              </div>
            </div>
          </section>

          <section className="border-t-4 border-gray-900 pt-4 pl-6">
            <h2 className="text-2xl  text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm ">
                4
              </span>
              Section Headings & Labels
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categories Title
                </label>
                <input
                  type="text"
                  name="categories"
                  defaultValue={landingData?.sectionHeadings?.categories || ""}
                  placeholder="e.g., Shop by Category"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Arrivals
                </label>
                <input
                  type="text"
                  name="newArrivals"
                  defaultValue={landingData?.sectionHeadings?.newArrivals || ""}
                  placeholder="e.g., New Arrivals"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Arrivals Tag
                </label>
                <input
                  type="text"
                  name="newArrivalsTag"
                  defaultValue={
                    landingData?.sectionHeadings?.newArrivalsTag || ""
                  }
                  placeholder="e.g., Latest"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Popular Products
                </label>
                <input
                  type="text"
                  name="popularProducts"
                  defaultValue={
                    landingData?.sectionHeadings?.popularProducts || ""
                  }
                  placeholder="e.g., Popular Products"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Testimonials
                </label>
                <input
                  type="text"
                  name="testimonials"
                  defaultValue={
                    landingData?.sectionHeadings?.testimonials || ""
                  }
                  placeholder="e.g., What Customers Say"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Testimonials Subtitle
                </label>
                <input
                  type="text"
                  name="testimonialsSubtitle"
                  defaultValue={
                    landingData?.sectionHeadings?.testimonialsSubtitle || ""
                  }
                  placeholder="e.g., subtitle"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Testimonials Description
                </label>
                <input
                  type="text"
                  name="testimonialsDesc"
                  defaultValue={
                    landingData?.sectionHeadings?.testimonialsDesc || ""
                  }
                  placeholder="e.g., Hear from our satisfied customers"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Applications Title
                </label>
                <input
                  type="text"
                  name="Applications"
                  defaultValue={
                    landingData?.sectionHeadings?.Applications || ""
                  }
                  placeholder="e.g., Use Cases"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="blog"
                  defaultValue={landingData?.sectionHeadings?.blog || ""}
                  placeholder="e.g., Latest Blog Posts"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Blog Subtitle
                </label>
                <input
                  type="text"
                  name="blogSubtitle"
                  defaultValue={
                    landingData?.sectionHeadings?.blogSubtitle || ""
                  }
                  placeholder="e.g., News and Updates"
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none "
                  disabled={mode === "view"}
                />
              </div>
            </div>
          </section>

          {mode !== "view" && (
            <div className="flex justify-end pt-6 border-t border-slate-200 gap-3">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("view");
                    setHeroImagePreview(landingData?.hero?.heroImage || null);
                    setAboutImagePreview(landingData?.about?.bgImage || null);
                  }}
                  className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {mode === "upload" ? "Upload" : "Update"}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LandingPageUpload;
