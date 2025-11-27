import dbConnect from "@/lib/dbConnect";
import AboutPage from "@/models/Pages/AboutPage";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    const about = await AboutPage.findOne();

    return NextResponse.json(
      { success: true, data: about || null },
      { status: 200 }
    );
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

    const existing = await AboutPage.findOne();
    const body = await req.json();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "About Page already exists." },
        { status: 400 }
      );
    }

    const created = await AboutPage.create(body);

    return NextResponse.json(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const about = await AboutPage.findOne();

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Page not found. Create new about page." },
        { status: 404 }
      );
    }

    const updated = await AboutPage.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
