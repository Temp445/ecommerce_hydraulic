import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.firstName || ""},</p>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" target="_blank" style="background:#007bff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    return NextResponse.json({ message: "Reset link sent to your email!" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
