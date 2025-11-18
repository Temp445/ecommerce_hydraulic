"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import { Star, Upload, X, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{ productId: string; orderId?: string }>; 
}

interface ReviewData {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const [productId, setProductId] = useState<string>("");
  const [orderId, setOrderId] = useState<string | undefined>();
  const { user } = useAuth();
  const router = useRouter();

  const [existingReview, setExistingReview] = useState<ReviewData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const unwrapped = await params;
      setProductId(unwrapped.productId);
      setOrderId(unwrapped.orderId);
    })();
  }, [params]);

  useEffect(() => {
    if (!user?._id || !productId) return;

    const fetchReview = async () => {
      try {
        const res = await axios.get(`/api/review?userId=${user._id}&productId=${productId}`);
        if (res.data.data && res.data.data.length > 0) {
          const review: ReviewData = res.data.data[0];
          setExistingReview(review);
          setRating(review.rating ?? 0);
          setTitle(review.title ?? "");
          setComment(review.comment ?? "");
          setPreview(review.images || []);
        }
      } catch (err) {
        console.error("Failed to fetch review", err);
      }
    };

    fetchReview();
  }, [user, productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);
    setPreview([...preview, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveImage = (index: number) => {
    if (existingReview && index < (existingReview.images?.length || 0)) {
      const newExisting = [...existingReview.images];
      newExisting.splice(index, 1);
      setExistingReview({ ...existingReview, images: newExisting });
      setPreview([...newExisting, ...images.map((f) => URL.createObjectURL(f))]);
    } else {
      const newImages = [...images];
      newImages.splice(index - (existingReview?.images?.length || 0), 1);
      setImages(newImages);
      setPreview([...preview.filter((_, i) => i !== index)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please add rating and comment");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", user!._id);
      formData.append("productId", productId);
      if (orderId) formData.append("orderId", orderId);
      formData.append("rating", String(rating));
      formData.append("title", title);
      formData.append("comment", comment);
      images.forEach((file) => formData.append("images", file));

      if (existingReview) {
        formData.append("existingImages", JSON.stringify(existingReview.images || []));
        await axios.patch(`/api/review/${existingReview._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Review updated successfully!");
      } else {
        await axios.post("/api/review", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Review submitted successfully!");
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`/api/review/${existingReview._id}`);
      toast.success("Review deleted successfully!");
      router.back();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2  outline-none"
          />

          <textarea
            placeholder="Write your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2  outline-none resize-none"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition">
              <Upload className="w-5 h-5 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Click to upload images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {preview.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-full h-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition flex justify-center items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : existingReview ? "Update Review" : "Submit Review"}
            </button>

            {existingReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition flex justify-center items-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
