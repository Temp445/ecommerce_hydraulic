import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import "@/models/Product";
import Cart from "@/models/Cart";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return NextResponse.json({ cart: { items: [] } }, { status: 200 });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    const user = verifyAuthToken(authHeader);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const sanitized = items
      .filter((i: any) => i.productId && Number(i.quantity) > 0)
      .map((i: any) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
      }));

    let userCart = await Cart.findOne({ userId: user.userId });

    if (!userCart) {
      userCart = new Cart({
        userId: user.userId,
        items: sanitized,
      });
    } else {
      for (const incoming of sanitized) {
        const existing = userCart.items.find(
          (i: { productId: { toString: () => any; }; }) => i.productId.toString() === incoming.productId
        );
        if (existing) {
           return NextResponse.json({success: false, message: "Already in cart"})
        } else {
          userCart.items.push({
            productId: incoming.productId,
            quantity: incoming.quantity,
          });
        }
      }
    }

    await userCart.save();
    const updatedCart = await Cart.findById(userCart._id).populate("items.productId");

    return NextResponse.json({ success: true, cart: updatedCart }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}


