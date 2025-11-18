import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const categories = await Category.findById(id);

    if (!categories) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const formData = await req.formData();
    const Name = formData.get("Name") as string | null;
    const CatImageFile = formData.get("CatImage") as File | null;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    if (Name && Name !== category.Name) {
      const existing = await Category.findOne({ Name });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Category name already exists" },
          { status: 409 }
        );
      }
      category.Name = Name; 
    }

   
    if (CatImageFile) {
      const buffer = Buffer.from(await CatImageFile.arrayBuffer());

      const uploadedImage = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/categories",
            public_id: CatImageFile.name.replace(/\.[^/.]+$/, ""),
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

      category.CatImage = uploadedImage.public_id; 
    }

    await category.save();

    return NextResponse.json(
      { success: true, message: "Category updated successfully", data: category },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category, products exist with this category.",
        },
        { status: 400 }
      );
    }

    await category.deleteOne();

    return NextResponse.json(
      { success: true, message: "Category Deleted Successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}