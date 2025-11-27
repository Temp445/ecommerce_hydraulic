"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Plus, Trash, Upload } from "lucide-react";


export default function AboutPageAdmin() {
  const [mode, setMode] = useState<"view" | "edit" | "upload">("upload");
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState<any | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/pages/aboutpage');
        if (res.data?.data) {
          setAboutData(res.data.data);
          setMode("view");
        } else {
          setAboutData(null);
          setMode("upload");
        }
      } catch (err) {
        setAboutData(null);
        setMode("upload");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);

      if (mode === "upload") {
        const res = await axios.post('/api/pages/aboutpage', aboutData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data?.success) {
          toast.success("About page created");
          setAboutData(res.data.data);
          setMode("view");
        } else {
          toast.error(res.data?.message || "Failed to create");
        }
      } else if (mode === "edit") {
        const res = await axios.patch('/api/pages/aboutpage', aboutData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data?.success) {
          toast.success("About page updated");
          setAboutData(res.data.data);
          setMode("view");
        } else {
          toast.error(res.data?.message || "Failed to update");
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Request failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const setHero = (patch: Partial<any["hero"]>) =>
    setAboutData((data:any) => ({ ...data, hero: { ...(data.hero || {}), ...patch } }));

  const setWhy = (patch: Partial<any["WhyChooseUs"]>) =>
    setAboutData((data:any) => ({ ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), ...patch } }));

  const updateWhyFeature = (index: number, patch: Partial<any>) =>
    setAboutData((data:any) => {
      const features = (data.WhyChooseUs?.features || []).slice();
      features[index] = { ...(features[index] || {}), ...patch };
      return { ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), features } };
    });

  const addWhyFeature = () =>
    setAboutData((data:any) => ({ ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), features: [...(data.WhyChooseUs?.features || []), { title: "", subTitle: "", description: "" }] } }));

  const removeWhyFeature = (index: number) =>
    setAboutData((data:any) => {
      const features = (data.WhyChooseUs?.features || []).slice();
      features.splice(index, 1);
      return { ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), features } };
    });

  const updateWhyValue = (index: number, patch: Partial<any>) =>
    setAboutData((data:any) => {
      const values = (data.WhyChooseUs?.values || []).slice();
      values[index] = { ...(values[index] || {}), ...patch };
      return { ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), values } };
    });

  const addWhyValue = () =>
    setAboutData((data:any) => ({ ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), values: [...(data.WhyChooseUs?.values || []), { title: "", value: "", description: "" }] } }));

  const removeWhyValue = (index: number) =>
    setAboutData((data:any) => {
      const values = (data.WhyChooseUs?.values || []).slice();
      values.splice(index, 1);
      return { ...data, WhyChooseUs: { ...(data.WhyChooseUs || {}), values } };
    });

  const setVision = (patch: Partial<any["vision"]>) =>
    setAboutData((data:any) => ({ ...data, vision: { ...(data.vision || {}), ...patch } }));

  const setProcessHeading = (patch: Partial<any["process"]>) =>
    setAboutData((data:any) => ({ ...data, process: { ...(data.process || {}), ...patch } }));

  const updateProcessFeature = (index: number, patch: Partial<any>) =>
    setAboutData((data:any) => {
      const features = (data.process?.features || []).slice();
      features[index] = { ...(features[index] || {}), ...patch };
      return { ...data, process: { ...(data.process || {}), features } };
    });

  const addProcessFeature = () =>
    setAboutData((data:any) => ({ ...data, process: { ...(data.process || {}), features: [...(data.process?.features || []), { title: "", subTitle: "" }] } }));

  const removeProcessFeature = (index: number) =>
    setAboutData((data:any) => {
      const features = (data.process?.features || []).slice();
      features.splice(index, 1);
      return { ...data, process: { ...(data.process || {}), features } };
    });

  const setShop = (patch: Partial<any["shopUs"]>) =>
    setAboutData((data:any) => ({ ...data, shopUs: { ...(data.shopUs || {}), ...patch } }));

  const updateShopFeature = (index: number, patch: Partial<any>) =>
    setAboutData((data:any) => {
      const features = (data.shopUs?.features || []).slice();
      features[index] = { ...(features[index] || {}), ...patch };
      return { ...data, shopUs: { ...(data.shopUs || {}), features } };
    });

  const addShopFeature = () =>
    setAboutData((data:any) => ({ ...data, shopUs: { ...(data.shopUs || {}), features: [...(data.shopUs?.features || []), { title: "", subTitle: "" }] } }));

  const removeShopFeature = (index: number) =>
    setAboutData((data:any) => {
      const features = (data.shopUs?.features || []).slice();
      features.splice(index, 1);
      return { ...data, shopUs: { ...(data.shopUs || {}), features } };
    });

  if (loading && !aboutData) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl  text-slate-900">
              {mode === "upload" ? "Upload About Page" : mode === "edit" ? "Edit About Page" : "About Page"}
            </h1>
           
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && (
              <button
                onClick={() => {
                  setMode("edit");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8 bg-white rounded-xl shadow p-8">
          {/* HERO */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">1</div>
              <h2 className="text-2xl font-semibold">Hero</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  name="heroTitle"
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  required
                  disabled={mode === "view"}
                  value={aboutData?.hero?.title || ""}
                  onChange={(e) => setHero({ title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Sub Title *</label>
                <input
                  name="heroSubTitle"
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  required
                  disabled={mode === "view"}
                  value={aboutData?.hero?.subTitle || ""}
                  onChange={(e) => setHero({ subTitle: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  name="heroDescription"
                  className="w-full border border-gray-400 px-4 py-2 rounded resize-none"
                  rows={4}
                  required
                  disabled={mode === "view"}
                  value={aboutData?.hero?.description || ""}
                  onChange={(e) => setHero({ description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Note</label>
                <input
                  name="heroNote"
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.hero?.note || ""}
                  onChange={(e) => setHero({ note: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">2</div>
              <h2 className="text-2xl font-semibold">Why Choose Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.title || ""}
                  onChange={(e) => setWhy({ title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Sub Title</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.subTitle || ""}
                  onChange={(e) => setWhy({ subTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Clients - Label</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.stats?.clients?.label || ""}
                  onChange={(e) => setWhy({ stats: { ...(aboutData?.WhyChooseUs?.stats || {}), clients: { ...(aboutData?.WhyChooseUs?.stats?.clients || {}), label: e.target.value } } })}
                />
              </div>
           
              <div>
                <label className="block text-sm font-semibold mb-2">Clients - Value</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.stats?.clients?.value || ""}
                  onChange={(e) => setWhy({ stats: { ...(aboutData?.WhyChooseUs?.stats || {}), clients: { ...(aboutData?.WhyChooseUs?.stats?.clients || {}), value: e.target.value } } })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Satisfaction - Label</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.stats?.satisfaction?.label || ""}
                  onChange={(e) => setWhy({ stats: { ...(aboutData?.WhyChooseUs?.stats || {}), satisfaction: { ...(aboutData?.WhyChooseUs?.stats?.satisfaction || {}), label: e.target.value } } })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Satisfaction - Value</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.WhyChooseUs?.stats?.satisfaction?.value || ""}
                  onChange={(e) => setWhy({ stats: { ...(aboutData?.WhyChooseUs?.stats || {}), satisfaction: { ...(aboutData?.WhyChooseUs?.stats?.satisfaction || {}), value: e.target.value } } })}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Features</h3>
              </div>

              <div className="space-y-4">
                {(aboutData?.WhyChooseUs?.features || []).map((feature:any, idx:number) => (
                  <div key={idx} className="p-4 border border-gray-400 rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
             <div>
                   <label className="block text-sm mb-2 font-semibold">Title</label>
                        <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Title"
                          disabled={mode === "view"}
                          value={feature?.title || ""}
                          onChange={(e) => updateWhyFeature(idx, { title: e.target.value })}
                        />
             </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Subtitle</label>

                        <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Subtitle"
                          disabled={mode === "view"}
                          value={feature?.subTitle || ""}
                          onChange={(e) => updateWhyFeature(idx, { subTitle: e.target.value })}
                        />
                </div>
                        <div className="md:col-span-2"> 
                    <label className="block text-sm font-semibold mb-2">Short description</label>

                            <textarea
                          className="border border-gray-400 px-3 py-2 rounded w-full resize-none"
                          placeholder="Short description"
                          disabled={mode === "view"}
                          value={feature?.description || ""}
                          onChange={(e) => updateWhyFeature(idx, { description: e.target.value })}
                        />
                            </div>

                      </div>

                      {mode !== "view" && (
                        <button type="button" onClick={() => removeWhyFeature(idx)} title="Remove" className="ml-3 p-2 rounded bg-red-50 text-red-600 hover:bg-red-100">
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {mode !== "view" && (
                  <button type="button" onClick={addWhyFeature} className="flex items-center mt-4  gap-1 p-2 border rounded text-sm text-white bg-blue-600">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                )}
            </div>

            {/* Values list */}
            <div className="mt-6  border-t border-dashed border-gray-400 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Our Values</h3>
               
              </div>

              <div className="space-y-4">
                {(aboutData?.WhyChooseUs?.values || []).map((value: any, idx: number) => (
                  <div key={idx} className="p-4 border border-gray-400 rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">

                          <div>
                    <label className="block text-sm font-semibold mb-2">Value</label>

                          <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Value"
                          disabled={mode === "view"}
                          value={value?.value || ""}
                          onChange={(e) => updateWhyValue(idx, { value: e.target.value })}
                        />
                      </div>
                        <div>
                    <label className="block text-sm font-semibold mb-2">Title</label>

                         <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Title"
                          disabled={mode === "view"}
                          value={value?.title || ""}
                          onChange={(e) => updateWhyValue(idx, { title: e.target.value })}
                        />
                            </div>
                    
                        <div>
                    <label className="block text-sm font-semibold mb-2">Short description</label>

                            <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Description"
                          disabled={mode === "view"}
                          value={value?.description || ""}
                          onChange={(e) => updateWhyValue(idx, { description: e.target.value })}
                        />
                        </div>
                      </div>

                      {mode !== "view" && (
                        <button type="button" onClick={() => removeWhyValue(idx)} title="Remove" className="ml-3 p-2 rounded bg-red-50 text-red-600 hover:bg-red-100">
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
               {mode !== "view" && (
                  <button type="button" onClick={addWhyValue} className="flex items-center gap-1 mt-4 text-sm text-white bg-blue-600 border p-2 rounded">
                    <Plus className="w-4 h-4" />Add 
                  </button>
                )}
            </div>
          </section>

          {/* VISION */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">3</div>
              <h2 className="text-2xl font-semibold">Vision & Mission</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Section Heading</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.vision?.Heading || ""}
                  onChange={(e) => setVision({ Heading: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  className="w-full border border-gray-400 px-4 py-2 rounded resize-none"
                  rows={3}
                  disabled={mode === "view"}
                  value={aboutData?.vision?.description || ""}
                  onChange={(e) => setVision({ description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Vision Title</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.vision?.visionTitle || ""}
                  onChange={(e) => setVision({ visionTitle: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Vision Desc</label>
                <textarea
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.vision?.visionDesc || ""}
                  onChange={(e) => setVision({ visionDesc: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Mission Title</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.vision?.missionTitle || ""}
                  onChange={(e) => setVision({ missionTitle: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Mission Desc</label>
                <textarea
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.vision?.missionDesc || ""}
                  onChange={(e) => setVision({ missionDesc: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* PROCESS */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">4</div>
              <h2 className="text-2xl font-semibold">Process</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Section Heading</label>
              <input
                className="w-full border border-gray-400 px-4 py-2 rounded"
                disabled={mode === "view"}
                value={aboutData?.process?.Heading || ""}
                onChange={(e) => setProcessHeading({ Heading: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Process </h3>
               
              </div>

              <div className="space-y-4">
                {(aboutData?.process?.features || []).map((feature:any, idx:number) => (
                  <div key={idx} className="p-4 border border-gray-400 rounded flex items-start justify-between gap-4">
                    <div className="w-full grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>

                      <input
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                        placeholder="Title"
                        disabled={mode === "view"}
                        value={feature?.title || ""}
                        onChange={(e) => updateProcessFeature(idx, { title: e.target.value })}
                      />
              </div>
                     <div>
                <label className="block text-sm font-semibold mb-2">Description</label>

                         <textarea
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                        placeholder="Description"
                        disabled={mode === "view"}
                        value={feature?.subTitle || ""}
                        onChange={(e) => updateProcessFeature(idx, { subTitle: e.target.value })}
                      />
                     </div>
                    </div>

                    {mode !== "view" && (
                      <button type="button" onClick={() => removeProcessFeature(idx)} className="ml-3 p-2 rounded bg-red-50 text-red-600 hover:bg-red-100">
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
               {mode !== "view" && (
                  <button type="button" onClick={addProcessFeature} className="flex items-center gap-1 mt-5 text-sm text-white border  bg-blue-600 rounded p-2">
                    <Plus className="w-4 h-4"/>Add
                  </button>
                )}
            </div>
          </section>

          {/* SHOP US */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">5</div>
              <h2 className="text-2xl font-semibold">Shop With Us</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Section Heading</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.shopUs?.Heading || ""}
                  onChange={(e) => setShop({ Heading: e.target.value })}
                />
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Shop Features</h3>
                </div>

                <div className="space-y-4">
                  {(aboutData?.shopUs?.features || []).map((feature:any, idx:number) => (
                    <div key={idx} className="p-4 border border-gray-400 rounded flex items-start justify-between gap-4">
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                <label className="block text-sm font-semibold mb-2">Title</label>

                            <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Title"
                          disabled={mode === "view"}
                          value={feature?.title || ""}
                          onChange={(e) => updateShopFeature(idx, { title: e.target.value })}
                        />
                        </div>
                        <div>
                <label className="block text-sm font-semibold mb-2">Subtitle</label>

                            <input
                          className="border border-gray-400 px-3 py-2 rounded w-full"
                          placeholder="Subtitle"
                          disabled={mode === "view"}
                          value={feature?.subTitle || ""}
                          onChange={(e) => updateShopFeature(idx, { subTitle: e.target.value })}
                        />
                        </div>
                      </div>

                      {mode !== "view" && (
                        <button type="button" onClick={() => removeShopFeature(idx)} className="ml-3 p-2 rounded bg-red-50 text-red-600 hover:bg-red-100">
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {mode !== "view" && (
                    <button type="button" onClick={addShopFeature} className="flex items-center gap-1 mt-4 p-2 border rounded text-sm text-white bg-blue-600">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Banner Title</label>
                <input
                  className="w-full border border-gray-400 px-4 py-2 rounded"
                  disabled={mode === "view"}
                  value={aboutData?.shopUs?.bannerTitle || ""}
                  onChange={(e) => setShop({ bannerTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Banner Description</label>
                <textarea
                  className="w-full border border-gray-400 px-4 py-2 rounded resize-none"
                  rows={3}
                  disabled={mode === "view"}
                  value={aboutData?.shopUs?.bannerDesc || ""}
                  onChange={(e) => setShop({ bannerDesc: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          {mode !== "view" && (
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  if (aboutData) {
                    setAboutData(aboutData);
                    setMode("view");
                  } else {
                    setAboutData(null);
                    setMode("upload");
                  }
                }}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-lg disabled:bg-slate-400"
              >
                <Upload className="w-4 h-4" />
                {loading ? "Processing..." : mode === "upload" ? "Upload" : "Update"}
              </button>
            </div>
          )}
        </form>

   
      </div>
    </div>
  );
}
