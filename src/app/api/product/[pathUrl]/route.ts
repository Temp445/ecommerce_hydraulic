import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pathUrl: string }> }
) {
  try {
    await dbConnect();
    const { pathUrl } = await params;

    const product = await Product.findOne({ pathUrl }).populate("category");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ pathUrl: string }> }
) {
  try {
    await dbConnect();
    const { pathUrl } = await params;
    const formData = await req.formData();

    const product = await Product.findOne({ pathUrl });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const model = formData.get("model") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const discountPrice = formData.get("discountPrice")
      ? Number(formData.get("discountPrice"))
      : undefined;
    const stock = formData.get("stock") ? Number(formData.get("stock")) : undefined;
    const deliveryCharge = formData.get("deliveryCharge")
      ? Number(formData.get("deliveryCharge"))
      : 0;
    
    const isNewArrival = formData.get("isNewArrival") === "true";
    const returnPolicy = formData.get("returnPolicy") === "true";
    const warranty = formData.get("warranty") as string;

    const technicalDetailsRaw = formData.get("technicalDetails") as string;
    const technicalDetails = technicalDetailsRaw
      ? JSON.parse(technicalDetailsRaw)
      : product.technicalDetails;

    const benefitsRaw = formData.get("benefits") as string;
    const benefits = benefitsRaw ? JSON.parse(benefitsRaw) : product.benefits;

    if (name && name !== product.name) {
      const existing = await Product.findOne({ name });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Product name already exists" },
          { status: 409 }
        );
      }
      product.name = name;
    }

    if (description) product.description = description;
    if (model) product.model = model;
    if (brand) product.brand = brand;
    if (category) product.category = new mongoose.Types.ObjectId(category);
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (deliveryCharge !== undefined) product.deliveryCharge = deliveryCharge;
    if (technicalDetails) product.technicalDetails = technicalDetails;
    if (benefits) product.benefits = benefits;
    if (formData.get("isNewArrival") !== null)
      product.isNewArrival = isNewArrival;
    if (formData.get("returnPolicy") !== null)
      product.returnPolicy = returnPolicy;
    if (warranty) product.warranty = warranty;

    const thumbnailFile = formData.get("thumbnail") as File | null;
    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const uploadedThumb = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/thumbnails",
            public_id: thumbnailFile.name.replace(/\.[^/.]+$/, ""),
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
      product.thumbnail = uploadedThumb.secure_url;
    }

    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles && imageFiles.length > 0) {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadedImage = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "ecom_products/gallery",
              public_id: file.name.replace(/\.[^/.]+$/, ""),
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
        imageUrls.push(uploadedImage.secure_url);
      }
      product.images = imageUrls;
    }

    await product.save();

    return NextResponse.json(
      { success: true, message: "Product updated successfully", data: product },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Product update error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ pathUrl: string }> }
) {
  try {
    await dbConnect();

    const { pathUrl } = await params;
    const product = await Product.findOneAndDelete({ pathUrl });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted Successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
