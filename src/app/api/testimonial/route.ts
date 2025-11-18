import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();  
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {userName, userRole, description} = body;

    if (!userName || !userRole || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    const newTestimonial = new Testimonial({
        userName,
        userRole,
        description
    });
    await newTestimonial.save();
    return NextResponse.json(
      { success: true, data: newTestimonial, message: "Testimonial created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}