import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise <{ categoryId: string }> }
) {
  try {
    await dbConnect();
    const {categoryId} = await params
    const products = await Product.find({ category: categoryId })
      .limit(8)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load related products" },
      { status: 500 }
    );
  }
}
