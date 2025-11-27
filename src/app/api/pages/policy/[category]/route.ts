import dbConnect from "@/lib/dbConnect";
import Policy from "@/models/Pages/Policy";


export async function GET(req: Request, { params }: { params: Promise <{ category: string }> }) {
  try {
    await dbConnect();
    const {category} = await params

    const policy = await Policy.findOne( { category } );

    if (!policy) {
      return new Response(
        JSON.stringify({ success: false, message: "Policy not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: policy }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching policy" }),
      { status: 500 }
    );
  }
}


export async function PUT(req: Request, { params }: { params: Promise <{ category: string }> }) {
  try {
    await dbConnect();
    const {category} = await params

    const body = await req.json();

    const updated = await Policy.findOneAndUpdate(
      { category },
      { ...body, updatedAt: Date.now() },
      { new: true, upsert: true } 
    );

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error updating policy" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise <{ category: string }> }) {
  try {
    await dbConnect();
    const {category} = await params

    const deleted = await Policy.deleteOne({ category });

    if (deleted.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Policy not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, message: "Policy deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting policy" }),
      { status: 500 }
    );
  }
}
