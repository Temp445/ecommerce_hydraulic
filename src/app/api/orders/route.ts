import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Address from "@/models/Address";
import User from "@/models/User"; 
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query = { userId };
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!userId || !items || items.length === 0 || !shippingAddress || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const addressData = await Address.findById(shippingAddress);
    if (!addressData) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }
    if (String(addressData.userId) !== String(userId)) {
      return NextResponse.json({ error: "Address does not belong to this user" }, { status: 403 });
    }

    const address = {
      Name: addressData.Name,
      MobileNumber: addressData.MobileNumber,
      PinCode: addressData.PinCode,
      Address: addressData.Address,
      City: addressData.City,
      LandMark: addressData.LandMark,
      State: addressData.State,
      Country: addressData.Country,
    };

    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      if (item.quantity > (product.stock || 0)) continue;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.thumbnail || "",
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        discountPriceAtPurchase: item.discountAtPurchase ?? 0,
        deliveryCharge: item.deliveryChargeAtPurchase ?? 0,
        orderStatus: "Processing",
        itemPaymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: "No items available in stock to place the order" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      items: validatedItems,
      shippingAddress: address,
      totalAmount,
      paymentMethod,
      paymentStatus,
      razorpayOrderId: razorpayOrderId ?? null,
      razorpayPaymentId: razorpayPaymentId ?? null,
      razorpaySignature: razorpaySignature ?? null,
    });

    return NextResponse.json(
      { success: true, message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
