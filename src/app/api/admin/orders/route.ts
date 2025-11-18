import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET() {
  try {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, orders }, {status: 200});
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error"}, {status: 500})
  }
}
