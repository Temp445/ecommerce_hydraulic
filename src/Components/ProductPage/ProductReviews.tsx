"use client";

import { useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";

interface Review {
  _id: string;
  userId?: { firstName?: string; lastName?: string };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
}

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      else
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch(`/api/review?productId=${productId}`);
        const data = await res.json();
        setReviews(data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchReviews();
  }, [productId]);

  const totalItems = reviews.length;
  const start = (page - 1) * limit;
  const currentReviews = reviews.slice(start, start + limit);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"></div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div className="h-fit py-12 md:px-4 ">
      <div className="mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl text-gray-900 mb-2">Customer Reviews</h2>
          <p className="text-gray-600">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from
            verified customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 lg:sticky lg:top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-medium text-gray-900 mb-2">
                  {averageRating}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(parseFloat(averageRating))
                          ? "text-gray-900 fill-gray-900"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map(({ star, count, percentage }) => {
                  const barColor =
                    star >= 3
                      ? "bg-emerald-700"
                      : star === 2
                      ? "bg-orange-500"
                      : "bg-red-500";
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-8 flex items-center gap-0.5">
                        {star}
                        <Star className="w-3 h-3 text-gray-900 fill-gray-900" />
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              {currentReviews.map((review) => (
                <article
                  key={review._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-gray-100 to-white px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        {review.title && (
                          <h3 className="text-xl font-medium text-gray-900">
                            {review.title}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-gray-900 fill-gray-900"
                                : "text-gray-300 fill-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="mt-6 flex gap-3">
                        {review.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                          >
                            <img
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className=" px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center divide-x divide-gray-800">
                        {review.isVerifiedPurchase && (
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5 text-gray-800" />
                            <span className="text-xs font-medium text-gray-800 pr-1">
                              Verified Purchase
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-800 pl-1">
                          {review.userId?.firstName || "Anonymous"}{" "}
                          {review.userId?.lastName || ""}
                        </span>
                      </div>
                      <time className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div>
              <Pagination
                currentPage={page}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
