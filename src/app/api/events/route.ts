import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob'; 

const prisma = new PrismaClient();

interface Event {
  id: number;
  title: string;
  content: string;
  authorName: string;
  date: Date;
  image: string;
}

// FETCH ALL EVENTS
export async function GET() {
  const events = await prisma.eventData.findMany();
  return NextResponse.json(events);
}

// ADD AN EVENT
export async function POST(request: NextRequest) {
  const data = await request.formData();

  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const authorName = data.get('authorName') as string;
  const date = data.get('date') as string;
  const imageFile = data.get('imageFile') as File | null;

  if (!title || !content || !authorName || !date || !(imageFile instanceof File)) {
    return NextResponse.json({ error: 'Title, content, author Name, date, and image are required' }, { status: 400 });
  }

  try {
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const imageUrl = blob.url;

    const newEvent: Event = await prisma.eventData.create({
      data: { title, content, authorName, date: new Date(date), image: imageUrl },
    });

    return NextResponse.json({ message: 'Event created successfully!', newEvent }, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// UPDATE AN EVENT
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await request.formData();
  const title = data.get('title') as string | undefined;
  const content = data.get('content') as string | undefined;
  const authorName = data.get('authorName') as string | undefined;
  const date = data.get('date') as string | undefined;
  const imageFile = data.get('imageFile') as File | null;

  const updateData: Partial<Event> = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (authorName) updateData.authorName = authorName;
  if (date) updateData.date = new Date(date);

  try {
    if (imageFile) {
      const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
        access: 'public',
        contentType: imageFile.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      updateData.image = blob.url;
    }

    const updatedEvent: Event = await prisma.eventData.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({ message: 'Event updated successfully!', updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE AN EVENT
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const event = await prisma.eventData.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.image) {
      const imageUrl = event.image;
      await del(imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    await prisma.eventData.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Event and image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
