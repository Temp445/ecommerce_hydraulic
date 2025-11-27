import dbConnect from "@/lib/dbConnect";
import Policy from "@/models/Pages/Policy";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const policies = await Policy.find().sort({ updatedAt: -1 });

    return new Response(
      JSON.stringify({ success: true, data: policies }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching policies" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const existing = await Policy.findOne({ category: body.category });
    if (existing) {
      return new Response(
        JSON.stringify({ success: false, message: "Policy already exists" }),
        { status: 400 }
      );
    }

    const newPolicy = await Policy.create({
      category: body.category,
      title: body.title,
      shortDescription: body.shortDescription,
      effectiveDate: body.effectiveDate,
      content: body.content,
      updatedAt: Date.now(),
    });

    return new Response(JSON.stringify({ success: true, data: newPolicy }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error creating policy" }),
      { status: 500 }
    );
  }
}
