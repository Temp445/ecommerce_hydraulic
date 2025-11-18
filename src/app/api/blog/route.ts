import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try{
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: blogs }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || "Failed to fetch blogs" },
        { status: 500 }
      );
    }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

     if (!title || !slug || !shortDescription || !file) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    const newBlog = await Blog.create({
      title,
      slug,
      shortDescription,
      content,
      imageUrl,
    });

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { success: false, message: "Error creating blog" },
      { status: 500 }
    );
  }
}
