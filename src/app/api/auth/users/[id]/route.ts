import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
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
    const { firstName, lastName, email, phone, role } = await req.json();

    const existingUser = await User.findById(id);

    if (email && email !== existingUser.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "Email id already exists, Use the different Email id",
          },
          { status: 409 }
        );
      }
    }

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    existingUser.firstName = firstName ?? existingUser.firstName;
    existingUser.lastName = lastName ?? existingUser.lastName;
    existingUser.email = email ?? existingUser.email;
    existingUser.phone = phone ?? existingUser.phone;
    existingUser.role = role ?? existingUser.role;

    await existingUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully!",
        data: existingUser,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE (
    req:Request,
    { params }: { params: Promise <{ id: string}>}
) {

    try{
        await dbConnect()
        const { id } = await params
        const user = await User.findByIdAndDelete(id)

        if(!user) {
            return NextResponse.json({ success: false, message: "User not found"}, {status: 404})
        }

        return NextResponse.json({ success: true, message: "User Deleted Successfully!"}, {status: 200})

    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || "Internal server error"}, {status: 500})

    }
}