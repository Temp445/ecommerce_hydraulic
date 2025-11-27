"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactAdminPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [data, setData] = useState({
    websiteTitle: "",
    emails: [""],
    numbers: [""],
    address: "",
    timing: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setFetching(true);
      const res = await axios.get("/api/pages/contactpage");

      if (res.data?.data && Object.keys(res.data.data).length > 0) {
        const c = res.data.data;
        setData({
          websiteTitle: c.websiteTitle || "",
          emails: c.emails?.length ? c.emails : [""],
          numbers: c.numbers?.length ? c.numbers : [""],
          address: c.address || "",
          timing: c.timing || "",
          youtube: c.youtube || "",
          twitter: c.twitter || "",
          linkedin: c.linkedin || "",
          instagram: c.instagram || "",
          logo: c.logo || "",
        });

        setEditing(true);
        setIsEditMode(false); 
      } else {
        setIsEditMode(true); 
      }
    } catch (err) {
      console.error("Error fetching contact data:", err);
      setIsEditMode(true);
    } finally {
      setFetching(false);
    }
  };

  

  const handleArrayChange = (index: number, value: string, field: "emails" | "numbers") => {
    const updated = [...data[field]];
    updated[index] = value;
    setData({ ...data, [field]: updated });
  };

  const addField = (field: "emails" | "numbers") => {
    if (!isEditMode) return;
    setData({ ...data, [field]: [...data[field], ""] });
  };

  const removeField = (index: number, field: "emails" | "numbers") => {
    if (!isEditMode) return;
    if (data[field].length > 1) {
      const updated = data[field].filter((_, i) => i !== index);
      setData({ ...data, [field]: updated });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }
      setLogoFile(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("websiteTitle", data.websiteTitle.trim());
      fd.append("emails", JSON.stringify(data.emails.filter(e => e.trim())));
      fd.append("numbers", JSON.stringify(data.numbers.filter(n => n.trim())));
      fd.append("address", data.address.trim());
      fd.append("timing", data.timing.trim());
      fd.append("youtube", data.youtube.trim());
      fd.append("twitter", data.twitter.trim());
      fd.append("linkedin", data.linkedin.trim());
      fd.append("instagram", data.instagram.trim());
      if (logoFile) fd.append("logo", logoFile);

      if (editing) {
        await axios.patch("/api/pages/contactpage", fd);
        toast.success("Contact updated successfully!");
      } else {
        await axios.post("/api/pages/contactpage", fd);
        toast.success("Contact created successfully!");
        setEditing(true);
      }

      await fetchContactData();
      setIsEditMode(false);
    } catch (err: any) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => setIsEditMode(true);

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setLogoFile(null);
    fetchContactData();
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  const disabled = !isEditMode;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {editing ? (isEditMode ? "Edit Contact Information" : "Contact Information") : "Create Contact Information"}
        </h1>

        {editing && !isEditMode && (
          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="border-t pt-6">
          <label className="block font-semibold text-gray-700 mb-2">Website Logo</label>

          <input
            type="file"
            disabled={disabled}
            accept="image/*"
            onChange={handleLogoChange}
            className={`border p-3 w-full rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />

          {(data.logo || logoFile) && (
            <img
              src={logoFile ? URL.createObjectURL(logoFile) : data.logo}
              alt="Logo preview"
              className="w-40 h-40 mt-4 object-contain border rounded-lg p-2 bg-gray-50"
            />
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Website Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data.websiteTitle}
            onChange={(e) => setData({ ...data, websiteTitle: e.target.value })}
            className={`border p-3 w-full rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Email Addresses</label>
          {data.emails.map((email, idx) => (
            <div key={idx} className="flex gap-2 mt-2">
              <input
                type="email"
                disabled={disabled}
                value={email}
                onChange={(e) => handleArrayChange(idx, e.target.value, "emails")}
                className={`border p-3 flex-1 rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {!disabled && data.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(idx, "emails")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {!disabled && (
            <button type="button" onClick={() => addField("emails")} className="text-blue-600 mt-2">
              + Add Email
            </button>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Contact Numbers</label>
          {data.numbers.map((num, idx) => (
            <div key={idx} className="flex gap-2 mt-2">
              <input
                type="tel"
                disabled={disabled}
                value={num}
                onChange={(e) => handleArrayChange(idx, e.target.value, "numbers")}
                className={`border p-3 flex-1 rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {!disabled && data.numbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(idx, "numbers")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {!disabled && (
            <button type="button" onClick={() => addField("numbers")} className="text-blue-600 mt-2">
              + Add Number
            </button>
          )}
        </div>

       
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            disabled={disabled}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className={`border p-3 w-full rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Working Hours</label>
          <input
            type="text"
            disabled={disabled}
            value={data.timing}
            placeholder="Mon-Sat, 10am-6:30pm"
            onChange={(e) => setData({ ...data, timing: e.target.value })}
            className={`border p-3 w-full rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>

          {["youtube", "twitter", "linkedin", "instagram"].map((field) => (
            <div key={field}>
              <label className="block font-medium mb-2 capitalize">{field}</label>
              <input
                type="url"
                disabled={disabled}
                value={(data as any)[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className={`border p-3 w-full rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          {!disabled && (
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          )}

          {editing && isEditMode && (
            <button
              type="button"
              disabled={loading}
              className="border px-8 py-3 rounded-lg"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
