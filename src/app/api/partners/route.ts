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
  const imageFile = data.get('imageFile') as File | null;

  if (!imageFile) {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  }

  try {
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const newPartner = await prisma.partner.create({
      data: { imageUrl: blob.url },
    });

    return NextResponse.json({ message: 'Partner created successfully!', newPartner }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    if (partner.imageUrl) {
      await del(partner.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    await prisma.partner.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Partner and image deleted successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
