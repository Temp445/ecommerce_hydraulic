import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import "@/models/User";
import Order from "@/models/Order";
import Address from "@/models/Address";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await dbConnect();

    const { orderId } = await params

    const order = (await Order.findById(orderId)
      .populate("userId", "name email")
      .populate({
        path: "shippingAddress",
        model: Address,
        select:
          "Name MobileNumber PinCode Address City LandMark State Country",
      })) 

    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const formattedOrder = {
      _id: order?._id?.toString() || "",
      user: order?.userId
        ? {
            _id: order.userId?._id?.toString() || "",
            name: order.userId?.name || "",
            email: order.userId?.email || "",
          }
        : null,

      items: Array.isArray(order?.items)
        ? order.items.map((item: any) => ({
            productId: item.productId?.toString() || "",
            productName: item.productName || "",
            productImage: item.productImage || "",
            quantity: item.quantity || 0,
            priceAtPurchase: item.priceAtPurchase || 0,
          }))
        : [],

      shippingAddress: order?.shippingAddress
        ? {
            _id: order.shippingAddress?._id?.toString() || "",
            name: order.shippingAddress?.Name || "",
            mobileNumber: order.shippingAddress?.MobileNumber || "",
            pinCode: order.shippingAddress?.PinCode || "",
            address: order.shippingAddress?.Address || "",
            city: order.shippingAddress?.City || "",
            landMark: order.shippingAddress?.LandMark || "",
            state: order.shippingAddress?.State || "",
            country: order.shippingAddress?.Country || "",
          }
        : null,

      totalAmount: order?.totalAmount || 0,
      paymentMethod: order?.paymentMethod || "",
      paymentStatus: order?.paymentStatus || "",
      paymentId: order?.paymentId || "",
      orderStatus: order?.orderStatus || "",
      orderDate: order?.orderDate || null,
      deliveredAt: order?.deliveredAt || null,
      createdAt: order?.createdAt || null,
      updatedAt: order?.updatedAt || null,
    };

    return NextResponse.json(formattedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Failed to fetch order details", error: error.message },
      { status: 500 }
    );
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await dbConnect();

    const { orderId } = await params;
    const body = await req.json();

    const {
      orderStatus,
      trackingId,
      courierPartner,
      expectedDelivery,
      deliveredAt,
      cancelledAt,
      returnRequestedAt,
      refundedAt,
      paymentStatus,
    } = body;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus; 
      order.items.forEach((item: any) => {
        item.paymentStatus = paymentStatus; 
      });
    }

    if (orderStatus)
      order.items.forEach((item: any) => (item.orderStatus = orderStatus));

    if (trackingId)
      order.items.forEach((item: any) => (item.trackingId = trackingId));

    if (courierPartner)
      order.items.forEach((item: any) => (item.courierPartner = courierPartner));

    if (expectedDelivery)
      order.items.forEach((item: any) => (item.expectedDelivery = expectedDelivery));

    if (deliveredAt)
      order.items.forEach((item: any) => (item.deliveredAt = deliveredAt));

    if (cancelledAt)
      order.items.forEach((item: any) => (item.cancelledAt = cancelledAt));

    if (returnRequestedAt)
      order.items.forEach((item: any) => (item.returnRequestedAt = returnRequestedAt));

    if (refundedAt)
      order.items.forEach((item: any) => (item.refundedAt = refundedAt));

    await order.save();

    return NextResponse.json(
      { message: "Order updated successfully", order },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal server error"},
      { status: 500 }
    );
  }
}

