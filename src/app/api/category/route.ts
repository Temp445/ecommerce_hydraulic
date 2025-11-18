import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/Category";
import { NextResponse } from "next/server";


export async function GET() {
    try{
        await dbConnect();
        const categories = await Category.find();
        return NextResponse.json({ success: true, data: categories }, {status: 200});
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || "Failed to fetch Category" }, {status: 500})
    }
}

export async function POST(req: Request) {
    try{
        await dbConnect();
        const formData = await req.formData();

        const Name = formData.get("Name") as string;
        const CatImageFile = formData.get("CatImage") as File

        if (!Name || !CatImageFile) {
            return NextResponse.json({ success: false, message: "Name and Image required" }, {status: 400})
        }
        
        const existing = await Category.findOne({Name})
         
        if (existing){
            return NextResponse.json({ success:false, message: "Category already exists" }, {status: 409})
        }

        const buffer = Buffer.from(await CatImageFile.arrayBuffer());

        // upload image
        const uploadedImage = await new Promise<any>((resolve, reject) =>{
            const stream = cloudinary.uploader.upload_stream(
                {folder: "ecom_products/categories",
                 public_id: CatImageFile.name.replace(/\.[^/.]+$/, ""),
                 use_filename: true, 
                 unique_filename: false,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result)
                }
            );
            stream.end(buffer);
        })
        
        const CatImage = uploadedImage.secure_url;

        const newCategory = await Category.create({
            Name,
            CatImage
        })

        return NextResponse.json({ success: true, data: newCategory}, {status: 201})

    }catch (err: any) {
        return NextResponse.json({ success:false, message: err.message || "Failed to create category."}, {status: 500})

    }
}


