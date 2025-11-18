import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        await dbConnect()
        const application = await Application.find()

        return NextResponse.json({ success: true, data: application}, {status: 200})

    } catch (err: any) {
         return NextResponse.json( { success:false , message: err.message || "server error"}, {status: 500})
    }
}


export async function POST(req: Request) {
    try{
        await dbConnect()
        const formData = await req.formData()

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        let imageUrl = "";
         const imageFile = formData.get("image") as File | null;

         if(imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const uploadImage = await new Promise<any>((resolve, reject) =>{
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
         )
           stream.end(buffer);
            })
            imageUrl = uploadImage.secure_url
         }

         if(!title || !description || !imageFile) {
            return NextResponse.json({ success: false, message:"Missing required fields"}, {status: 400})
         }

         const application = await Application.create({
            title,
            description,
            image: imageUrl
         })

        return NextResponse.json({success: true, data: application}, {status: 200})

    } catch (err: any) {
        return NextResponse.json({success: false, message: err.message || "Server Error"}, {status: 500})

    }
}
