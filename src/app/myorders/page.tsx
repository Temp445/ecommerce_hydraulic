"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import { Loader2, ShoppingBag, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  _id: string; // ✅ ensure itemId exists here
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  discountPriceAtPurchase?: number;
  deliveryCharge?: number;
  orderStatus: string;
};

type Order = {
  _id: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedProducts, setReviewedProducts] = useState<string[]>([]);
  const router = useRouter();

  const fetchOrders = async (userId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/orders?userId=${userId}`);
      setOrders(res.data.data || res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewedProducts = async (userId: string, orders: Order[]) => {
    try {
      const reviewed: string[] = [];
      for (const order of orders) {
        for (const item of order.items) {
          try {
            const res = await axios.get(
              `/api/review?userId=${userId}&productId=${item.productId}`
            );
            if (res.data.data?.length > 0) reviewed.push(item.productId);
          } catch (err) {
            console.error(err);
          }
        }
      }
      setReviewedProducts(reviewed);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchOrders(user._id);
  }, [user]);

  useEffect(() => {
    if (user?._id && orders.length) fetchReviewedProducts(user._id, orders);
  }, [orders, user?._id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "text-orange-600";
      case "Packed":
      case "Shipped":
        return "text-blue-600";
      case "Out for Delivery":
      case "Delivered":
        return "text-green-600";
      case "Cancelled":
      case "Returned":
      case "Refunded":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 animate-pulse">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>

          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white shadow mb-4 rounded">
              <div className="bg-gray-200 px-6 py-3 flex justify-between items-center rounded-t">
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-28 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const flattenedItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order._id,
      orderDate: order.orderDate,
      paymentMethod: order.paymentMethod,
    }))
  );

  if (!flattenedItems.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <ShoppingBag className="w-32 h-32 text-gray-300 mb-6" strokeWidth={1} />
        <h2 className="text-2xl font-medium text-gray-800 mb-2">No orders found</h2>
        <p className="text-gray-600 mb-8 text-center">
          Looks like you haven’t placed any orders yet.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 rounded text-white px-8 py-3 font-medium transition-colors shadow-md"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">My Orders</h1>

        <div className="space-y-4">
          {flattenedItems.map((item, index) => {
            const hasReviewed = reviewedProducts.includes(item.productId);
            const statusColor = getStatusColor(item.orderStatus);

            return (
              <div key={index} className="bg-white shadow">
                <div className="bg-gray-700 text-gray-200 px-6 py-3 flex flex-col md:flex-row justify-between md:items-center">
                  <span className="text-xs">
                    Ordered on:{" "}
                    {new Date(item.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-gray-400">Order #{item.orderId}</span>
                </div>

                <Link
                  href={`/myorders/${item.orderId}/item/${item._id}`}
                  className="block hover:bg-gray-50 transition"
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain flex-shrink-0"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 line-clamp-2 mb-2">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
                      <p className="text-sm  text-gray-800 font-sans">
                       SubTotal ₹
                        {(
                          ((item.discountPriceAtPurchase || item.priceAtPurchase) *
                          item.quantity) + (item.deliveryCharge || 0)
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className={`font-medium ${statusColor}`}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              statusColor.includes("green")
                                ? "bg-green-600"
                                : statusColor.includes("blue")
                                ? "bg-blue-600"
                                : statusColor.includes("orange")
                                ? "bg-orange-600"
                                : "bg-red-600"
                            }`}
                          ></span>
                          <span className="text-sm">{item.orderStatus}</span>
                        </div>
                      </div>

                      {item.orderStatus === "Delivered" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/review/${item.productId}?orderId=${item.orderId}`);
                          }}
                          className="mt-3 text-sm border border-gray-300 rounded-sm text-blue-600 px-4 py-2 font-medium hover:bg-gray-100 transition flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          {hasReviewed ? "Edit Review" : "Add Review"}
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;