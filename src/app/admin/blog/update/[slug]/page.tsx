"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface BlogData {
  title: string;
  shortDescription: string;
  slug: string;
  content: string;
  imageUrl?: string;
}

const UpdateBlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [form, setForm] = useState<BlogData>({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (data.success) {
          const blog = data.data;
          setForm({
            title: blog.title,
            slug: blog.slug,
            shortDescription: blog.shortDescription,
            content: blog.content,
            imageUrl: blog.imageUrl,
          });
          setPreviewUrl(blog.imageUrl || "");
        } else {
          toast.error("Failed to load blog");
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        toast.error("Error loading blog");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      const newSlug = value.toLowerCase().trim().replace(/\s+/g, "-");
      setForm((prev) => ({ ...prev, title: value, slug: newSlug }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("shortDescription", form.shortDescription);
    formData.append("content", form.content);
    formData.append("newSlug", form.slug);
    if (image) formData.append("file", image);

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blog");
      } else {
        toast.error(data.message || "Update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-md my-14">
      <h1 className="text-2xl font-semibold mb-6">Update Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="border p-2 w-full rounded"
            placeholder="Enter blog title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            className="border border-gray-300 p-3 w-full rounded-lg bg-gray-50"
            value={form.slug}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            className="border p-2 w-full rounded min-h-[100px]"
            placeholder="Brief summary of the blog..."
            value={form.shortDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                const preview = URL.createObjectURL(file);
                setPreviewUrl(preview);
                toast("📸 New image selected", { icon: "🖼️" });
              }
            }}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-32 object-cover mt-3 rounded-lg shadow-md border"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Blog Content
          </label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
            modules={modules}
            style={{ minHeight: "350px" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`${
            saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white px-6 py-2 rounded transition font-medium`}
        >
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBlogPage;
