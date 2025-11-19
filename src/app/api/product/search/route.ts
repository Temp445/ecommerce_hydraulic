// Product Search Api: search product based on product name
// Route: /api/product/search?q=hydraulic

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
