import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany();
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const name = data.get("name") as string;
  const position = data.get("position") as string;
  const company = data.get("company") as string;
  const feedback = data.get("feedback") as string;
  const imageFile = data.get("image") as File | null;
  const blobToken = data.get("blobToken") as string;

  // Ensure all fields and token are present
  if (!name || !position || !company || !feedback || !imageFile || !blobToken) {
    return NextResponse.json(
      { error: "All fields and blob token are required" },
      { status: 400 }
    );
  }

  try {
    // Upload image to Vercel Blob
    const blob = await put(
      `uploads/${imageFile.name}`,
      await imageFile.arrayBuffer(),
      {
        access: "public",
        contentType: imageFile.type,
        token: blobToken, // Use token from formData
      }
    );

    // Create testimonial in the database
    const newTestimonial = await prisma.testimonial.create({
      data: { name, position, company, feedback, imageUrl: blob.url },
    });

    return NextResponse.json(
      { message: "Testimonial created successfully!", newTestimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.formData();
  const id = data.get("id");
  const name = data.get("name") as string;
  const position = data.get("position") as string;
  const company = data.get("company") as string;
  const feedback = data.get("feedback") as string;
  const imageFile = data.get("image") as File | null;
  const blobToken = data.get("blobToken") as string;

  if (!id || !name || !position || !company || !feedback || !imageFile || !blobToken) {
    return NextResponse.json(
      { error: "All fields and blob token are required" },
      { status: 400 }
    );
  }

  try {
    // Upload new image to Vercel Blob
    const blob = await put(
      `uploads/${imageFile.name}`,
      await imageFile.arrayBuffer(),
      {
        access: "public",
        contentType: imageFile.type,
        token: blobToken,
      }
    );

    // Update testimonial in the database
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: { name, position, company, feedback, imageUrl: blob.url },
    });

    return NextResponse.json(
      { message: "Testimonial updated successfully!", updatedTestimonial },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  const data = await request.formData();
  const id = data.get("id");
  const blobToken = data.get("blobToken") as string;

  if (!id || !blobToken) {
    return NextResponse.json(
      { error: "ID and blob token are required" },
      { status: 400 }
    );
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Delete testimonial from the database
    await prisma.testimonial.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
