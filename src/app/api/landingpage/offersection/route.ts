import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/LandingPage/OfferSection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const offer = await Offer.find();
    return NextResponse.json(
      { success: true, data: offer },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { title, subTitle, btn, active } = body;

    const offer = new Offer({
      title,
      subTitle,
      btn,
      active: active ?? false,
    });

    await offer.save()

    return NextResponse.json(
      { success: true, data: offer },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
