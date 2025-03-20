import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

// FETCH ALL SOLUTIONS
export async function GET() {
  try {
    const solutions = await prisma.solutionData.findMany();
    return NextResponse.json(solutions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}

// ADD A SOLUTION
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const name = data.get('name') as string;
  const link = data.get('link') as string;
  const imageFile = data.get('imageFile') as File | null;

  if (!name || !link || !imageFile) {
    return NextResponse.json({ error: 'Name, link, and image are required' }, { status: 400 });
  }

  try {
    // Upload image to Vercel Blob
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Save the solution data with image URL to the database
    const newSolution = await prisma.solutionData.create({
      data: { name, link, imageUrl: blob.url },
    });

    return NextResponse.json({ message: 'Solution created successfully!', newSolution }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create solution' }, { status: 500 });
  }
}

// UPDATE A SOLUTION
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await request.formData();
  const name = data.get('name') as string;
  const link = data.get('link') as string;
  const imageFile = data.get('imageFile') as File | null;

  if (!name || !link || !imageFile) {
    return NextResponse.json({ error: 'Name, link, and image are required' }, { status: 400 });
  }

  try {
    const existingSolution = await prisma.solutionData.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    if (!existingSolution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    if (existingSolution.imageUrl) {
      await del(existingSolution.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const updatedSolution = await prisma.solutionData.update({
      where: { id: Number(id) },
      data: { name, link, imageUrl: blob.url },
    });

    return NextResponse.json({ message: 'Solution updated successfully!', updatedSolution }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update solution' }, { status: 500 });
  }
}


// DELETE A SOLUTION
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const solution = await prisma.solutionData.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    // Delete the image from Vercel Blob
    if (solution.imageUrl) {
      await del(solution.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    // Delete the solution from the database
    await prisma.solutionData.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Solution and image deleted successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete solution' }, { status: 500 });
  }
}
