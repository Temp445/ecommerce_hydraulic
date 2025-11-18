import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import "@/models/Category";
import Product from "@/models/Product";
import { generatePathUrl } from "@/lib/pathUrl";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");
    const filter = categoryId ? { category: categoryId } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("category", "_id Name");

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const model = formData.get("model") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const discountPrice = Number(formData.get("discountPrice")) || 0;
    const stock = Number(formData.get("stock"));
    const deliveryCharge = Number(formData.get("deliveryCharge")) || 0;
    const isNewArrival = formData.get("isNewArrival") === "true";
    const returnPolicy = formData.get("returnPolicy") === "true";
    const warranty = formData.get("warranty") as string;

    const technicalDetailsRaw = formData.get("technicalDetails") as string;
    const benefitsRaw = formData.get("benefits") as string;

    const technicalDetails = technicalDetailsRaw
      ? JSON.parse(technicalDetailsRaw)
      : {};
    const benefits = benefitsRaw ? JSON.parse(benefitsRaw) : [];

    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const pathUrl = generatePathUrl(name, 50);

    const existing = await Product.findOne({ $or: [{ name }, { pathUrl }] });
    if (existing) {
      const message =
        existing.name === name
          ? "Product name already exists"
          : "Path URL already exists";
      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    let thumbnailUrl = "";
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
      thumbnailUrl = uploadedThumb.secure_url;
    }

    const imageFiles = formData.getAll("images") as File[];
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

    const product = await Product.create({
      name,
      pathUrl,
      description,
      model,
      brand,
      price,
      discountPrice,
      stock,
      deliveryCharge,
      category: new mongoose.Types.ObjectId(category),
      thumbnail: thumbnailUrl,
      images: imageUrls,
      technicalDetails,
      benefits,
      isNewArrival,
      isActive: true,
      returnPolicy,
      warranty,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
