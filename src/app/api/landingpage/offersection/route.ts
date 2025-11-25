import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/LandingPage/OfferSection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const offer = await Offer.findOne();
    return NextResponse.json({ success: true, data: offer }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { title, description, note, active } = body;

    const offer = new Offer({
      title,
      description,
      note,
      active: active ?? false,
    });

    await offer.save();

    return NextResponse.json(
      { success: true, data: offer },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const offer = await Offer.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(
      { success: true, data: offer },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
