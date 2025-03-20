import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany();
    return NextResponse.json(certificates);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
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

    const newCertificate = await prisma.certificate.create({
      data: { imageUrl: blob.url },
    });

    return NextResponse.json({ message: 'Certificate created successfully!', newCertificate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: Number(id) },
      select: { imageUrl: true },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (certificate.imageUrl) {
      await del(certificate.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    await prisma.certificate.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Certificate and image deleted successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
