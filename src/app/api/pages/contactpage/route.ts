import { NextResponse } from "next/server";
import Contact from "@/models/Pages/ContactPage";
import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await dbConnect();
    const contact = await Contact.findOne();
    return NextResponse.json({ success: true, data: contact || {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    let logoUrl = "";
    const logoFile = formData.get("logo") as File | null;

    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());

      const uploadedLogo: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ecom_products/contact",
            public_id: logoFile.name.replace(/\.[^/.]+$/, ""),
            use_filename: true,
            unique_filename: false,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        uploadStream.end(buffer);
      });

      logoUrl = uploadedLogo.secure_url;
    }

    const contact = await Contact.create({
      websiteTitle: formData.get("websiteTitle")?.toString(),
      emails: JSON.parse(formData.get("emails") as string),
      numbers: JSON.parse(formData.get("numbers") as string),
      address: formData.get("address")?.toString(),
      timing: formData.get("timing")?.toString(),
      youtube: formData.get("youtube")?.toString(),
      twitter: formData.get("twitter")?.toString(),
      linkedin: formData.get("linkedin")?.toString(),
      instagram: formData.get("instagram")?.toString(),
      logo: logoUrl,
    });

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    let existing = await Contact.findOne();
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    let newLogoUrl = "";
    const logoFile = formData.get("logo") as File | null;

    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());

      const uploadedLogo: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "website/contact",
            public_id: logoFile.name.replace(/\.[^/.]+$/, ""),
            use_filename: true,
            unique_filename: false,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        uploadStream.end(buffer);
      });

      newLogoUrl = uploadedLogo.secure_url;
    }

    const updateData = {
      websiteTitle: formData.get("websiteTitle")?.toString() ?? existing.websiteTitle,
      emails: formData.get("emails")
        ? JSON.parse(formData.get("emails") as string)
        : existing.emails,
      numbers: formData.get("numbers")
        ? JSON.parse(formData.get("numbers") as string)
        : existing.numbers,
      address: formData.get("address")?.toString() ?? existing.address,
      timing: formData.get("timing")?.toString() ?? existing.timing,
      youtube: formData.get("youtube")?.toString() ?? existing.youtube,
      twitter: formData.get("twitter")?.toString() ?? existing.twitter,
      linkedin: formData.get("linkedin")?.toString() ?? existing.linkedin,
      instagram: formData.get("instagram")?.toString() ?? existing.instagram,
      logo: newLogoUrl || existing.logo,
    };

    const updated = await Contact.findOneAndUpdate({}, updateData, { new: true });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
      { status: 500 }
    );
  }
}
