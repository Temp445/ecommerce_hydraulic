import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  try {
    await dbConnect();

    const { orderId, itemId } = await params;
    const { reason } = await req.json();

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const item = order.items.id(itemId);
    if (!item)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"]
        .includes(item.orderStatus)
    ) {
      return NextResponse.json(
        { message: "Item cannot be cancelled at this stage" },
        { status: 400 }
      );
    }

    item.orderStatus = "Cancelled";
    item.cancelReason = reason || "Cancelled by user";
    item.cancelledAt = new Date();

    if (
      order.paymentMethod === "Online" &&
      item.itemPaymentStatus === "Paid" &&
      !item.razorpayRefundId
    ) {
      if (!item.razorpayPaymentId && !order.razorpayPaymentId) {
        return NextResponse.json(
          {
            message: "Refund failed",
            error: "Missing Razorpay payment ID",
          },
          { status: 400 }
        );
      }

      const paymentId =
        item.razorpayPaymentId || order.razorpayPaymentId;

      const amountPaid =
        (item.discountPriceAtPurchase > 0
          ? item.discountPriceAtPurchase
          : item.priceAtPurchase) *
          item.quantity +
        (item.deliveryCharge || 0);

      const refund = await razorpay.payments.refund(paymentId, {
        amount: Math.round(amountPaid * 100),
      });

      item.itemPaymentStatus = "Refunded";
      item.itemRefundAmount = amountPaid;
      item.razorpayRefundId = refund.id;
      item.refundedAt = new Date();
    }

    if (order.items.every((itm: any) => itm.orderStatus === "Cancelled")) {
      order.overallStatus = "Cancelled";
    }

    await order.save();

    return NextResponse.json({
      message: "Item cancelled successfully",
      refundAmount: item.itemRefundAmount || 0,
      order,
    });
  } catch (err: any) {
    console.error("Cancel Error:", err);

    return NextResponse.json(
      {
        message: "Error cancelling item",
        error: err?.error?.description || err.message,
      },
      { status: 500 }
    );
  }
}
