import dbConnect from "@/lib/dbConnect";
import LandingPage from "@/models/Pages/LandingPage";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const landing = await LandingPage.findOne();
    return NextResponse.json({ success: true, data: landing }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const exists = await LandingPage.findOne();
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Only one Landing Page record allowed." },
        { status: 400 }
      );
    }

    const uploadToCloudinary = async (file: File | null, folder: string) => {
      if (!file) return "";

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: file.name.replace(/\.[^/.]+$/, ""),
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );

        stream.end(buffer);
      });

      return uploaded.secure_url;
    };

    // Upload Images
    const heroImageUrl = await uploadToCloudinary(
      formData.get("heroImage") as File,
      "landingpage/hero"
    );

    const aboutImageUrl = await uploadToCloudinary(
      formData.get("aboutImage") as File,
      "landingpage/about"
    );

    
    // Section Headings
    const sectionHeadings = {
      categories: formData.get("categories") as string,
      newArrivals: formData.get("newArrivals") as string,
      newArrivalsTag: formData.get("newArrivalsTag") as string,
      popularProducts: formData.get("popularProducts") as string,
      testimonials: formData.get("testimonials") as string,
      testimonialsSubtitle: formData.get("testimonialsSubtitle") as string,
      testimonialsDesc: formData.get("testimonialsDesc") as string,
      Applications: formData.get("Applications") as string,
      blog: formData.get("blog") as string,
      blogSubtitle: formData.get("blogSubtitle") as string,
    };

    // Offer Section
    const offer = {
      title: formData.get("offerTitle") as string,
      description: formData.get("offerDescription") as string,
      note: formData.get("offerNote") as string,
      active: formData.get("offerActive") === "true" ? true : false,
    };

    const landing = await LandingPage.create({
      hero: {
        title: formData.get("heroTitle"),
        subTitle: formData.get("heroSubTitle"),
        description: formData.get("heroDescription"),
        note: formData.get("heroNote"),
        heroImage: heroImageUrl,
      },
      offer,
      about: {
        title: formData.get("aboutTitle"),
        subTitle: formData.get("aboutSubTitle"),
        description: formData.get("aboutDescription"),
        bgImage: aboutImageUrl,
      },
      sectionHeadings,
    });

    return NextResponse.json({ success: true, data: landing }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server Error" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const landing = await LandingPage.findOne();
    if (!landing) {
      return NextResponse.json(
        { success: false, message: "Landing Page does not exist." },
        { status: 404 }
      );
    }

    const uploadToCloudinary = async (file: File | null, folder: string) => {
      if (!file || file.size === 0) return null;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: file.name.replace(/\.[^/.]+$/, "")
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

      return uploaded.secure_url;
    };

    // Upload only if valid file
    const heroImageUrl = await uploadToCloudinary(
      formData.get("heroImage") as File | null,
      "landingpage/hero"
    );

    const aboutImageUrl = await uploadToCloudinary(
      formData.get("aboutImage") as File | null,
      "landingpage/about"
    );

    // Update hero section
    if (formData.get("heroTitle")) landing.hero.title = formData.get("heroTitle") as string;
    if (formData.get("heroSubTitle")) landing.hero.subTitle = formData.get("heroSubTitle") as string;
    if (formData.get("heroDescription")) landing.hero.description = formData.get("heroDescription") as string;
    if (formData.get("heroNote")) landing.hero.note = formData.get("heroNote") as string;
    if (heroImageUrl) landing.hero.heroImage = heroImageUrl;

    // Update about section
    if (formData.get("aboutTitle")) landing.about.title = formData.get("aboutTitle") as string;
    if (formData.get("aboutSubTitle")) landing.about.subTitle = formData.get("aboutSubTitle") as string;
    if (formData.get("aboutDescription")) landing.about.description = formData.get("aboutDescription") as string;
    if (aboutImageUrl) landing.about.bgImage = aboutImageUrl;

    // Offer section
    if (formData.get("offerTitle")) landing.offer.title = formData.get("offerTitle") as string;
    if (formData.get("offerDescription")) landing.offer.description = formData.get("offerDescription") as string;
    if (formData.get("offerNote")) landing.offer.note = formData.get("offerNote") as string;
    if (formData.get("offerActive") !== null)
      landing.offer.active = formData.get("offerActive") === "true";

    // Section headings
    const headings = [
      "categories", "newArrivals", "newArrivalsTag", "popularProducts",
      "testimonials", "testimonialsSubtitle", "testimonialsDesc",
      "Applications", "blog", "blogSubtitle"
    ];

    headings.forEach((key) => {
      const value = formData.get(key);
      if (value) landing.sectionHeadings[key] = value as string;
    });

    await landing.save();

    return NextResponse.json({ success: true, data: landing }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server Error" },
      { status: 500 }
    );
  }
}

