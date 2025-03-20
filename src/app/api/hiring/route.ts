import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Hiring {
  id: number;
  position: string;
  location: string;
  jobType: string;
  link: string;
}

// FETCH ALL HIRED POSITIONS
export async function GET() {
  const jobs = await prisma.hiring.findMany();
  return NextResponse.json(jobs);
}

// ADD
export async function POST(request: NextRequest) {
    const data = await request.formData();
  
    const position = data.get('position') as string;
    const location = data.get('location') as string;
    const jobType = data.get('jobType') as string;
    const link = data.get('link') as string;
  
    if (!position || !location || !jobType || !link) {
      return NextResponse.json({ error: 'Position, location, jobType, and link are required' }, { status: 400 });
    }
  
    try {
      const newPosition = await prisma.hiring.create({
        data: { position, location, jobType, link },
      });
      return NextResponse.json({ message: 'Position created successfully!', newPosition }, { status: 201 });
    } catch (error) {
      console.error('Failed to create position:', error);
      return NextResponse.json({ error: 'Failed to create position' }, { status: 500 });
    }
  }
  

// EDIT A POSITION
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await request.formData();
  const position = data.get('position') as string | undefined;
  const location = data.get('location') as string | undefined;
  const jobType = data.get('jobType') as string | undefined;
  const link = data.get('link') as string | undefined;

  const updateData: Partial<Hiring> = {};
  if (position) updateData.position = position;
  if (location) updateData.location = location;
  if (jobType) updateData.jobType = jobType;
  if (link) updateData.link = link;

  try {
    const updatedPosition = await prisma.hiring.update({
      where: { id: Number(id) },
      data: updateData,
    });
    return NextResponse.json({ message: 'Position updated successfully!', updatedPosition }, { status: 200 });
  } catch (error) {
    console.error('Failed to update position:', error);
    return NextResponse.json({ error: 'Failed to update position' }, { status: 500 });
  }
}

// DELETE A POSITION
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.hiring.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Position deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting position:', error);
    return NextResponse.json({ error: 'Failed to delete position' }, { status: 500 });
  }
}
