import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import Review from "@/models/Review";
import Order from "@/models/Order"; 


export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const query: any = {};
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      query.productId = productId;
    }

    const reviews = await Review.find(query)
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .populate({
        path: "productId",
        select: "name",
      })
      .sort({ rating: -1 });

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const productId = formData.get("productId") as string;
    const title = formData.get("title") as string;
    const comment = formData.get("comment") as string;
    const rating = Number(formData.get("rating")) || 1;
    const imageFiles = formData.getAll("images") as File[];

    if (!userId || !productId || !comment || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const deliveredOrder = await Order.findOne({
      userId,
      "items.productId": productId,
      orderStatus: "Delivered",
    });

    const isVerifiedPurchase = !!deliveredOrder;

    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (typeof file === "string") continue; 
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/reviews",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrls.push(uploadedImage.secure_url);
    }

    const newReview = await Review.create({
      userId,
      productId,
      orderId: deliveredOrder?._id || null,
      rating,
      title,
      comment,
      images: imageUrls,
      isVerifiedPurchase,
    });

    return NextResponse.json(
      { success: true, data: newReview },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}




