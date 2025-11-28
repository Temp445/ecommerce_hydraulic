import { NextResponse } from "next/server";
import Seo from "@/models/Pages/Seo";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request, { params }: { params: Promise <{ path: string }> }) {
  try {
    await dbConnect();

    const { path } = await params;
    const seoEntry = await Seo.findOne({ path });

    if (!seoEntry) {
      return NextResponse.json(
        { success: false, message: "SEO entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: seoEntry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise <{ path: string }> }) {
  try {
    await dbConnect();

    const { path } = await params;
    const body = await req.json();

    const updatedSeo = await Seo.findOneAndUpdate({ path }, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeo) {
      return NextResponse.json(
        { success: false, message: "SEO entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSeo });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
