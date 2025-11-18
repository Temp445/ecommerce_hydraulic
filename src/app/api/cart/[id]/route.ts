import { NextResponse } from "next/server";
import dbconnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function PUT(req: Request, { params }: { params: Promise <{ id: string }> }) {
  try {
    await dbconnect();
    const {id} = await params
    
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid quantity" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ "items._id": id });
    if (!cart)
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );

    const item = cart.items.id(id);
    if (!item)
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    item.quantity = quantity;
    await cart.save();

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to update cart", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise <{ id: string }> }) {
  try {
    await dbconnect();
    const { id } = await params

    const cart = await Cart.findOne({ "items._id": id });
    if (!cart)
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );

       await Cart.updateOne(
      { _id: cart._id },
      { $pull: { items: { _id: id } } }
    );

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to remove item", error: error.message },
      { status: 500 }
    );
  }
}
