import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import Hero from "@/models/LandingPage/HeroSection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const hero = await Hero.findOne();
    return NextResponse.json({ success: true, data: hero }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subTitle = formData.get("subTitle") as string;
    const description = formData.get("description") as string;
    const note = formData.get("note") as string;
    const heroImage = formData.get("heroImage") as File | null;

    let uploadedImageUrl = "";
    const imageFile = formData.get("heroImage") as File | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedThumb = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/hero_section",
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
      uploadedImageUrl = uploadedThumb.secure_url;
    }

    const newHero = await Hero.create({
      title,
      subTitle,
      description,
      note,
      heroImage: uploadedImageUrl,
    });

    return NextResponse.json({ success: true, data: newHero }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subTitle = formData.get("subTitle") as string;
    const description = formData.get("description") as string;
    const note = formData.get("note") as string;
    const heroImage = formData.get("heroImage") as File | null;

    let hero = await Hero.findOne();

    if (!hero) {
      return NextResponse.json(
        { success: false, message: "Hero not found" },
        { status: 404 }
      );
    }

    let updatedImageUrl = hero.heroImage;

    if (heroImage) {
      const buffer = Buffer.from(await heroImage.arrayBuffer());

      const uploaded = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/hero_section",
            public_id: heroImage.name.replace(/\.[^/.]+$/, ""),
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

      updatedImageUrl = uploaded.secure_url;
    }

    const updatedHero = await Hero.findOneAndUpdate(
      {},
      {
        title,
        subTitle,
        description,
        note,
        heroImage: updatedImageUrl,
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedHero },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
