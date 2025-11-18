"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  AlertCircle,
  ChevronDown,
  ClockFading,
  CalendarDays,
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  WalletCards,
  PackageX,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/orders");
      if (res.data.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = async (
    orderId: string,
    itemId: string,
    data: any
  ) => {
    try {
      setUpdatingId(itemId);

      await axios.patch(`/api/orders/${orderId}/items/${itemId}`, data);

      // Update state locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item: any) =>
                  item._id === itemId ? { ...item, ...data } : item
                ),
              }
            : order
        )
      );

      toast.success("Item updated successfully");
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<
      string,
      { bg: string; text: string; icon: any; label: string }
    > = {
      Processing: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: Clock,
        label: "Processing",
      },
      Packed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: Package,
        label: "Packed",
      },
      Shipped: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        icon: Truck,
        label: "Shipped",
      },
      "Out for Delivery": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: Truck,
        label: "Out for Delivery",
      },
      Delivered: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: CheckCircle2,
        label: "Delivered",
      },
      Cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return (
      config[status] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        icon: Package,
        label: status,
      }
    );
  };

  const filteredOrders = orders.filter((order) => {
    const name = order?.shippingAddress?.Name || "";
    return (
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const stats = {
    total: orders.reduce((acc, order) => acc + order.items.length, 0),
    processing: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Processing")
          .length,
      0
    ),
    shipped: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Shipped")
          .length,
      0
    ),
    delivered: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Delivered")
          .length,
      0
    ),
    cancelled: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Cancelled")
          .length,
      0
    ),
  };

  if (!loading && filteredOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 xl:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium md:text-3xl text-gray-900 mb-2">
            Orders
          </h1>
          <p className="text-gray-600">
            Manage and track all customer orders in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className=" rounded p-4 border ">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Package className="w-10 h-10" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  Processing
                </p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {stats.processing}
                </p>
              </div>
              <ClockFading className="w-10 h-10 text-yellow-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Shipped</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.shipped}
                </p>
              </div>
              <Truck className="w-10 h-10 text-blue-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stats.delivered}
                </p>
              </div>
              <PackageCheck className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {stats.cancelled}
                </p>
              </div>
              <PackageX className="w-10 h-10 text-red-600 opacity-80" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm  outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order._id)
                    }
                  >
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row  md:items-center gap-4 mb-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Order ID
                          </p>
                          <p className="font-mono font-bold text-sm text-blue-600">
                            {order._id}
                          </p>
                        </div>
                        <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Customer:{" "}
                            <span className="font-semibold text-gray-900">
                              {order.shippingAddress?.Name}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 font-sans">
                            Amount:{" "}
                            <span className="font-semibold text-gray-900">
                              ₹{order.totalAmount.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex gap-2 items-center">
                          <CalendarDays className="w-5 h-5" />{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                        <span className="flex gap-2 items-center">
                          <Package className="w-6 h-6" /> {order.items.length}{" "}
                          item{order.items.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex gap-2 items-center">
                          <WalletCards className="w-5 h-5" />{" "}
                          {order.paymentMethod}
                        </span>
                        <span className="flex gap-2 items-center">
                          {order.isFullyRefunded}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <>
                      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex flex-wrap gap-5 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Phone</p>
                            <p className="font-medium text-gray-900">
                              {order.shippingAddress?.MobileNumber}
                            </p>
                          </div>

                          {order.paymentMethod === "Online" ? (
                            <div className="flex gap-10">
                              <div>
                                <p className="text-gray-600 mb-1">Payment ID</p>
                                <p className="font-mono text-xs text-gray-900 truncate">
                                  {order.razorpayPaymentId}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">Order ID</p>
                                <p className="font-mono text-xs text-gray-900 truncate">
                                  {order.razorpayOrderId}
                                </p>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">
                            Delivery Address
                          </p>
                          <p className="text-gray-900 text-sm">
                            {order.shippingAddress?.Address}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-6 py-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Items
                        </h4>
                        <div className="space-y-4">
                          {order.items.map((item: any, index: number) => {
                            const statusConfig = getStatusConfig(
                              item.orderStatus
                            );
                            const StatusIcon = statusConfig.icon;
                            return (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 mb-3">
                                      {item.productName}
                                    </h5>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                                      <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                          Quantity
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {item.quantity}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                          Subtotal
                                        </p>
                                        <p className="font-semibold text-gray-900 font-sans">
                                          ₹
                                          {(item.discountPriceAtPurchase > 0
                                            ? item.discountPriceAtPurchase
                                            : item.priceAtPurchase) *
                                            item.quantity}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                          Delivery
                                        </p>
                                        <p className="font-semibold text-gray-900 font-sans">
                                          {item.deliveryCharge > 0
                                            ? `₹${item.deliveryCharge}`
                                            : "Free"}
                                        </p>
                                      </div>

                                      {order.paymentMethod === "COD" ? (
                                        <div className="text-center">
                                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                            Payment Status
                                          </p>
                                          <select
                                            value={
                                              item.orderStatus === "Cancelled"
                                                ? "User Cancelled"
                                                : item.itemPaymentStatus
                                            }
                                            onChange={(e) =>
                                              handleItemUpdate(
                                                order._id,
                                                item._id,
                                                {
                                                  itemPaymentStatus:
                                                    e.target.value,
                                                }
                                              )
                                            }
                                            disabled={
                                              updatingId === item._id ||
                                              item.orderStatus ===
                                                "Cancelled" ||
                                              item.itemPaymentStatus ===
                                                "Paid" ||
                                              item.orderStatus !== "Delivered"
                                            }
                                            className={`${
                                              item.orderStatus === "Cancelled"
                                                ? "bg-red-50 text-red-700"
                                                : item.itemPaymentStatus ===
                                                  "Paid"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-amber-50 text-amber-700"
                                            } rounded px-3 py-2 text-sm font-medium transition cursor-pointer outline-none ${
                                              updatingId === item._id ||
                                              item.orderStatus ===
                                                "Cancelled" ||
                                              item.itemPaymentStatus ===
                                                "Paid" ||
                                              item.orderStatus !== "Delivered"
                                                ? "opacity-80 cursor-not-allowed"
                                                : ""
                                            }`}
                                          >
                                            <option
                                              value="Pending"
                                              disabled={
                                                item.orderStatus !==
                                                  "Delivered" ||
                                                item.orderStatus ===
                                                  "Cancelled" ||
                                                item.itemPaymentStatus ===
                                                  "Paid"
                                              }
                                            >
                                              Pending
                                            </option>
                                            <option
                                              value="Paid"
                                              disabled={
                                                item.orderStatus !==
                                                  "Delivered" ||
                                                item.orderStatus ===
                                                  "Cancelled" ||
                                                item.itemPaymentStatus ===
                                                  "Paid"
                                              }
                                            >
                                              Paid
                                            </option>
                                            <option
                                              value="User Cancelled"
                                              disabled
                                            >
                                              User Cancelled
                                            </option>
                                          </select>
                                        </div>
                                      ) : (
                                        <div className="text-center">
                                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                            Payment Status
                                          </p>
                                          <p className="text-gray-900 font-medium">
                                            {item.itemPaymentStatus}
                                          </p>
                                        </div>
                                      )}

                                      {item.itemRefundAmount > 0 ? (
                                        <div className="border border-dashed w-fit p-1 border-orange-600 md:text-center">
                                          <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                                            Refund Amount
                                          </p>
                                          <p className="font-semibold text-gray-900 font-sans">
                                            ₹{item.itemRefundAmount}
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>

                                  <div className="md:text-right">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">
                                      Status
                                    </p>
                                    {item.orderStatus === "Cancelled" ? (
                                      <div>
                                        <div
                                          className={`${statusConfig.bg} ${statusConfig.text} inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm mb-3`}
                                        >
                                          <StatusIcon size={16} />
                                          Cancelled
                                        </div>
                                        {item.cancelReason && (
                                          <div className="mt-2 text-xs text-gray-600 text-right">
                                            <p>
                                              {" "}
                                              Cancelled At:{" "}
                                              {new Date(
                                                item.cancelledAt
                                              ).toLocaleDateString("en-IN")}
                                            </p>
                                            <p className="font-medium mb-1">
                                              Reason: {item.cancelReason}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : item.orderStatus === "Delivered" ? (
                                      <div>
                                        <div
                                          className={`${statusConfig.bg} ${statusConfig.text} inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm mb-3`}
                                        >
                                          <StatusIcon size={16} />
                                          Delivered
                                        </div>
                                      </div>
                                    ) : (
                                      <select
                                        value={item.orderStatus}
                                        onChange={(e) =>
                                          handleItemUpdate(
                                            order._id,
                                            item._id,
                                            { orderStatus: e.target.value }
                                          )
                                        }
                                        disabled={updatingId === item._id}
                                        className={`${statusConfig.bg} ${
                                          statusConfig.text
                                        }  rounded px-3 py-2 text-sm font-medium transition cursor-pointer outline-none ${
                                          updatingId === item._id
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                      >
                                        <option value="Processing">
                                          Processing
                                        </option>
                                        <option value="Packed">Packed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">
                                          Out for Delivery
                                        </option>
                                        <option value="Delivered">
                                          Delivered
                                        </option>
                                      </select>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
