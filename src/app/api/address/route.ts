import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address";
import { NextResponse } from "next/server";
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

    const addresses = await Address.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: addresses },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const requiredFields = [
      "userId",
      "Name",
      "MobileNumber",
      "PinCode",
      "Address",
      "City",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newAddress = await Address.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        data: newAddress,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}




