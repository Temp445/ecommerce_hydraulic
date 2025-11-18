"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const OrderDetailPage = () => {
  const { itemId, orderId } = useParams();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [itemData, setItemData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !itemId) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/orders/${orderId}/items/${itemId}`
        );
        setItemData(data);
      } catch (error) {
        toast.error("Failed to load order item details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId, itemId]);

  useEffect(() => {
    if (!orderId || !itemId) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setOrderData(data);
      } catch (error) {
        toast.error("Failed to load order item details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId, itemId]);

  const handleCancelItem = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(`/api/orders/${orderId}/items/${itemId}/cancel`, {
        reason: cancelReason,
      });

      toast.success("Item cancelled successfully");
      setShowCancel(false);
      setCancelReason("");

      if (orderId && itemId) {
        try {
          const [{ data: refreshedItem }, { data: refreshedOrder }] =
            await Promise.all([
              axios.get(`/api/orders/${orderId}/items/${itemId}`),
              axios.get(`/api/orders/${orderId}`),
            ]);

          setItemData(refreshedItem);
          setOrderData(refreshedOrder);
        } catch (error) {
          toast.error("Failed to refresh order data");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message?.includes("Shipped") ||
        error.response?.data?.message?.includes("Out for Delivery")
          ? "You can’t cancel this product because it’s already shipped or out for delivery."
          : error.response?.data?.message?.includes("Delivered")
          ? "You can’t cancel this product because it has already been delivered."
          : error.response?.data?.message?.includes("Cancelled")
          ? "This item is already cancelled."
          : "Unable to cancel the item at the moment. Please try again later.";

      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="h-4 bg-gray-300 rounded w-32"></div>

          <div className="bg-white p-2 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="flex justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="w-10 md:w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                <div className="w-24 h-24 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="border-t border-gray-300 pt-3 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-9 bg-gray-300 rounded w-28"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!itemData)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600">
            The order you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );

  const { item } = itemData;
  const { paymentMethod, paymentStatus, shippingAddress } = orderData || {};
  const status =
    paymentMethod === "COD"
      ? "Cash on Delivery"
      : paymentStatus === "Paid"
      ? "Paid Online"
      : paymentStatus === "Pending"
      ? "Payment Pending"
      : "Payment Failed";

  const isDisabled =
    item.orderStatus === "Shipped" ||
    item.orderStatus === "Out for Delivery" ||
    item.orderStatus === "Delivered" ||
    item.orderStatus === "Cancelled";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-2 md:px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/myorders" className="hover:text-blue-600 cursor-pointer">
            My Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Order Details</span>
        </div>

        <div className="bg-white shadow-sm mb-6 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-sm md:text-lg font-semibold`}>
              {item.orderStatus}
            </h1>
            <p className="text-gray-500 text-sm">
              {item.orderStatus === "Delivered"
                ? `Delivered ${
                    item.deliveredAt
                      ? ` on ${new Date(item.deliveredAt).toLocaleDateString()}`
                      : ""
                  }`
                : item.orderStatus === "Cancelled"
                ? `Order cancelled ${
                    item.cancelledAt
                      ? ` on ${new Date(item.cancelledAt).toLocaleDateString()}`
                      : ""
                  }`
                : "Order in Progress"}
            </p>
          </div>

          <div className="flex flex-col items-center relative mt-4 w-full">
            <div className="w-full h-1 relative">
              {(() => {
                type OrderStatus =
                  | "Processing"
                  | "Packed"
                  | "Shipped"
                  | "Out for Delivery"
                  | "Delivered"
                  | "Cancelled";

                const getStageProgress = (status: OrderStatus) => {
                  const width = window.innerWidth;

                  const map: Record<OrderStatus, number> = {
                    Processing: width < 768 ? 8 : width < 1024 ? 5 : 4,
                    Packed: width < 768 ? 27 : width < 1024 ? 2 : 26,
                    Shipped: width < 768 ? 46 : width < 1024 ? 47 : 48,
                    "Out for Delivery":
                      width < 768 ? 70 : width < 1024 ? 0 : 72,
                    Delivered: 100,
                    Cancelled: 100,
                  };

                  return map[status];
                };

                const progress = getStageProgress(
                  item.orderStatus as OrderStatus
                );

                const barColor =
                  item.orderStatus === "Cancelled"
                    ? "bg-gradient-to-r from-red-400 to-red-600"
                    : "bg-gradient-to-r from-green-400 to-green-600";

                return (
                  <div className="h-1 md:h-1.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-between  w-full mt-1 md:mt-2 text-[10px] sm:text-sm">
              <span className=" text-center ">Processing</span>
              <span className=" text-center ">Packed</span>
              <span className=" text-center ">Shipped</span>
              <span className=" text-center">Out for Delivery</span>
              <span className=" text-center ">Delivered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white shadow-sm p-6 rounded-lg">
              <div className="flex gap-4">
                <div className="w-24 h-24  flex-shrink-0 overflow-hidden rounded">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-medium text-gray-900 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm md:text-base font-semibold text-gray-900 font-sans">
                    ₹
                    {(item.discountPriceAtPurchase > 0
                      ? item.discountPriceAtPurchase * item.quantity
                      : item.priceAtPurchase * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {shippingAddress && (
              <div className="bg-white shadow-sm p-6 rounded-lg">
                <h2 className="text-base font-semibold text-gray-900 mb-3 border-b pb-2">
                  Delivery Address
                </h2>
                <div className="text-sm text-gray-800 space-y-1">
                  <p className="font-medium text-gray-900">
                    Name: {shippingAddress.name} |{" "}
                    {shippingAddress.mobileNumber}
                  </p>
                  <p className="text-gray-900 font-medium">Location :</p>
                  <p>
                    {shippingAddress.address} {""}
                    {shippingAddress.city}, {shippingAddress.state} -{" "}
                    {shippingAddress.pinCode}, {shippingAddress.country}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-sm p-6 rounded-lg">
              <p className="flex text-sm justify-between text-gray-800 mb-2">
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
              <p className="flex justify-between text-sm mb-4">
                <span className="font-medium text-sm">Payment Method :</span>{" "}
                {status}
              </p>
              <h2 className="text-base font-semibold text-gray-900 mb-3 border-b pb-2">
                Price Details
              </h2>
              <div className="text-sm space-y-2">
                {item.discountPriceAtPurchase > 0 && (
                  <div className="flex justify-between">
                    <span>Orginal Price</span>
                    <span className=" line-through font-sans text-gray-500 ">
                      ₹{(item.priceAtPurchase * item.quantity).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Buying Price </span>
                  <span className="font-sans">
                    ₹
                    {(item.discountPriceAtPurchase > 0
                      ? item.discountPriceAtPurchase * item.quantity
                      : item.priceAtPurchase * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-sans">
                    {item.deliveryCharge > 0 ? (
                      <span> ₹ {item.deliveryCharge}</span>
                    ) : (
                      "Free"
                    )}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span className="font-sans">
                    ₹
                    {(
                      (item.discountPriceAtPurchase > 0
                        ? item.discountPriceAtPurchase * item.quantity
                        : item.priceAtPurchase * item.quantity) +
                      item.deliveryCharge
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={updating || isDisabled}
                onClick={() => setShowCancel(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isDisabled
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Cancel Item
              </button>
            </div>

            {updating && (
              <p className="text-sm text-blue-600 mt-3 animate-pulse">
                Updating status...
              </p>
            )}
          </div>
        </div>
      </div>
      {showCancel && (
        <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              Cancel Product
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancelling this product:
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your reason (e.g. Ordered by mistake)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowCancel(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                disabled={updating}
                onClick={handleCancelItem}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {updating ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
