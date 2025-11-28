// app/api/seo/route.ts
import { NextResponse } from "next/server";
import Seo from "@/models/Pages/Seo";
import dbConnect from "@/lib/dbConnect";

// GET: fetch all SEO entries
export async function GET() {
  try {
    await dbConnect();

    const seoData = await Seo.find({});
    return NextResponse.json({ success: true, data: seoData });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { path, title, description, keywords, ogTitle, ogDescription, twitterTitle, twitterDescription } = body;

    const existing = await Seo.findOne({ path });
    if (existing) {
      return NextResponse.json(
        { success: false, message:"SEO entry already exists for this path" },
        { status: 400 }
      );
    }

    const newSeo = await Seo.create({
      path,
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      twitterTitle,
      twitterDescription,
    });

    return NextResponse.json({ success: true, data: newSeo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
