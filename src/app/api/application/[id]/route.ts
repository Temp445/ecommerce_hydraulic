import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise <{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise <{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    let updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadImage = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/applications",
            public_id: imageFile.name.replace(/\.[^/.]+$/, ""),
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      updateData.image = uploadImage.secure_url;
    }

    const updatedApp = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedApp) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedApp }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise <{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server Error" }, { status: 500 });
  }
}
