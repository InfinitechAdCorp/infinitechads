import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const partners = await prisma.partner.findMany();
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const data = await request.formData();
  const imageFile = data.get("imageFile") as File | null;
  const blobToken = data.get("blobToken") as string | undefined; // ✅ Get blobToken from formData

  // ❗️ Check if image file is present
  if (!imageFile) {
    return NextResponse.json(
      { error: "Image file is required" },
      { status: 400 }
    );
  }

  // ❗️ Check if blobToken is present
  if (!blobToken) {
    return NextResponse.json(
      { error: "Blob token is missing" },
      { status: 400 }
    );
  }

  try {
    // ✅ Use blobToken dynamically
    const blob = await put(
      `uploads/${imageFile.name}`,
      await imageFile.arrayBuffer(),
      {
        access: "public",
        contentType: imageFile.type,
        token: blobToken, // Use token from request
      }
    );

    // ✅ Create new partner with uploaded image URL
    const newPartner = await prisma.partner.create({
      data: { imageUrl: blob.url },
    });

    return NextResponse.json(
      { message: "Partner created successfully!", newPartner },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const blobToken = searchParams.get("blobToken"); // ✅ Get blobToken from query params

  // ❗️ Check if ID is provided
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // ❗️ Check if blobToken is present
  if (!blobToken) {
    return NextResponse.json(
      { error: "Blob token is missing" },
      { status: 400 }
    );
  }

  try {
    // ✅ Find the partner to delete
    const partner = await prisma.partner.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    // ❗️ Check if the partner exists
    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    // ✅ Delete the image if imageUrl is present
    if (partner.imageUrl) {
      await del(partner.imageUrl, { token: blobToken }); // ✅ Use blobToken dynamically
    }

    // ✅ Delete partner from the database
    await prisma.partner.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Partner and image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}