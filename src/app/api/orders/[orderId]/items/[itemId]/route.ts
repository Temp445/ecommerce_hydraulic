import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  try {
    await dbConnect();

    const { orderId, itemId } = await params;

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const item = order.items.id(itemId);
    if (!item)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const fullItem = {
      ...item.toObject(),
      razorpayPaymentId: item.razorpayPaymentId || order.razorpayPaymentId,
    };

    return NextResponse.json({ item: fullItem });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  try {
    await dbConnect();

    const { orderId, itemId } = await params;
    const body = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found in this order" }, { status: 404 });
    }

    const allowedFields = [
      "orderStatus",
      "expectedDelivery",
      "itemPaymentStatus"
    ];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        item[key] = body[key];
      }
    }

    if (body.orderStatus === "Delivered") {
      item.deliveredAt = new Date();
    }

    await order.save();

    return NextResponse.json(
      { message: "Item updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
