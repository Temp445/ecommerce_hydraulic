import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const user = await User.find().sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch users data" },
      { status: 500 }
    );
  }
}
