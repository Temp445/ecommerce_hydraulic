// /api/razorpay/verify

import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid Payment Signature" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    // Save main payment details
    order.paymentStatus = "Paid";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    // IMPORTANT: store the payment ID in each item
    order.items.forEach((item: any) => {
      item.itemPaymentStatus = "Paid";
      item.razorpayPaymentId = razorpay_payment_id; // <-- FIX LINE
    });

    await order.save();

    return NextResponse.json({ message: "Payment Verified", order });
  } catch (err: any) {
    console.log("Verify Payment Error:", err);
    return NextResponse.json(
      { message: "Payment verification failed", error: err.message },
      { status: 500 }
    );
  }
}
