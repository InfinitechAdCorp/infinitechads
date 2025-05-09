import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

// FETCH DATA
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// ADD
export async function POST(request: NextRequest) {
  const blobToken = request.headers.get('Authorization')?.replace('Bearer ', ''); // Get blobToken from request header
  if (!blobToken) {
    return NextResponse.json({ error: 'Blob token is required' }, { status: 403 });
  }

  const data = await request.formData();
  const title = data.get('title') as string;
  const description = data.get('description') as string;
  const imageFile = data.get('image') as File | null;

  if (!title || !description || !imageFile) {
    return NextResponse.json({ error: 'Title, description, and image are required' }, { status: 400 });
  }

  try {
    // Upload image to Vercel Blob with the received blobToken
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: blobToken,
    });

    // Log the blob URL for debugging
    console.log('Image uploaded successfully: ', blob.url);

    // Save the service data with image URL to the database
    const newService = await prisma.service.create({
      data: { title, description, image: blob.url },
    });

    return NextResponse.json({ message: 'Service created successfully!', newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error); // Log the actual error
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  const blobToken = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!blobToken) {
    return NextResponse.json({ error: 'Blob token is required' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await request.formData();
  const title = data.get('title') as string;
  const description = data.get('description') as string;
  const imageFile = data.get('image') as File | null;

  if (!title || !description || !imageFile) {
    return NextResponse.json({ error: 'Title, description, and image are required' }, { status: 400 });
  }

  try {
    // Find the existing service to get the current image URL
    const existingService = await prisma.service.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Delete old image if it exists
    if (existingService.image) {
      await del(existingService.image, { token: blobToken });
    }

    // Upload new image to Vercel Blob
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: blobToken,
    });

    // Update the service with the new data and image URL
    const updatedService = await prisma.service.update({
      where: { id: Number(id) },
      data: { title, description, image: blob.url },
    });

    return NextResponse.json({ message: 'Service updated successfully!', updatedService }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  const blobToken = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!blobToken) {
    return NextResponse.json({ error: 'Blob token is required' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Delete the image from Vercel Blob
    if (service.image) {
      await del(service.image, { token: blobToken });
    }

    // Delete the service from the database
    await prisma.service.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Service and image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
