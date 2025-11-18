import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT (req: Request,  { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { userName, userRole, description } = body;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { userName, userRole, description },
        { new: true }
    );
    if (!updatedTestimonial) {
        return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
        { success: true, data: updatedTestimonial, message: "Testimonial updated successfully" },
        { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE (req: Request,  { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
        if (!deletedTestimonial) {
            return NextResponse.json(
            { success: false, message: "Testimonial not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
            { success: true, message: "Testimonial deleted successfully" },
            { status: 200 }
        );
      } catch (error: any) {
        return NextResponse.json(
          { success: false, message: error.message || "Failed to delete testimonial" },
          { status: 500 }
        );
      }
}