import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
    try {
  await dbConnect();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });
  if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: blog });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || "Failed to fetch blog" }, { status: 500 });
    }
}


export async function PUT(req: Request, { params }: { params: Promise <{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const content = formData.get("content") as string;
    const newSlug = formData.get("newSlug") as string; 
    const file = formData.get("file") as File | null;

    const existingBlog = await Blog.findOne({ slug });
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingBlog.imageUrl;

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

    existingBlog.title = title;
    existingBlog.shortDescription = shortDescription;
    existingBlog.content = content;
    existingBlog.slug = newSlug;
    existingBlog.imageUrl = imageUrl;

    await existingBlog.save();

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: existingBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
    try{
  await dbConnect();
  const { slug } = await params;
  const deleted = await Blog.findOneAndDelete({ slug });
  if (!deleted)
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Blog deleted" });
} catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to delete blog" }, { status: 500 });
  }
}
