import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (id && isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    if (id) {
      const teamMemberDetails = await prisma.teamMemberDetail.findMany({
        where: { teamMemberId: Number(id) },
        include: { teamMember: true, images: true },
      });

      if (teamMemberDetails.length === 0) {
        return NextResponse.json({ error: 'Team member detail not found' }, { status: 404 });
      }

      return NextResponse.json(teamMemberDetails[0]);
    } else {
      const teamMemberDetails = await prisma.teamMemberDetail.findMany({
        include: { teamMember: true, images: true },
      });

      return NextResponse.json(teamMemberDetails);
    }
  } catch (error) {
    console.error('Error fetching team member details:', error);
    return NextResponse.json({ error: 'Failed to fetch team member details' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const teamMemberId = Number(data.get('teamMemberId'));
    const officeAddress = data.get('officeAddress') as string;
    const mobileNumber = data.get('mobileNumber') as string;
    const telephoneNumber = data.get('telephoneNumber') as string;
    const websiteLink = data.get('websiteLink') as string;
    const email = data.get('email') as string;
    const images = data.getAll('images') as File[];

    if (!teamMemberId || !officeAddress || !mobileNumber || !telephoneNumber || !websiteLink || !email || !images.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTeamMemberDetail = await prisma.teamMemberDetail.create({
      data: { teamMemberId, officeAddress, mobileNumber, telephoneNumber, websiteLink, email },
    });

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const blob = await put(`uploads/${image.name}`, await image.arrayBuffer(), {
          access: 'public',
          contentType: image.type,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return prisma.teamMemberImage.create({
          data: { teamMemberId: newTeamMemberDetail.id, imageUrl: blob.url },
        });
      })
    );

    return NextResponse.json({ newTeamMemberDetail, uploadedImages }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create team member detail' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const data = await request.formData();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
    }

    const updateData: Record<string, string | undefined> = {
      officeAddress: data.get('officeAddress') as string,
      mobileNumber: data.get('mobileNumber') as string,
      telephoneNumber: data.get('telephoneNumber') as string,
      websiteLink: data.get('websiteLink') as string,
      email: data.get('email') as string,
    };

    for (const key in updateData) {
      if (!updateData[key]) {
        return NextResponse.json({ error: `${key} cannot be empty` }, { status: 400 });
      }
    }
    

    const updatedTeamMemberDetail = await prisma.teamMemberDetail.update({
      where: { id: Number(id) },
      data: updateData,
    });

    const images = data.getAll('images') as File[];

    if (images.length > 0) {
      const existingImages = await prisma.teamMemberImage.findMany({
        where: { teamMemberId: Number(id) },
      });

      if (existingImages.length > 0) {
        await Promise.all(
          existingImages.map(async (image) => {
            try {
              await del(image.imageUrl);
              await prisma.teamMemberImage.delete({
                where: { id: image.id },
              });
            } catch (err) {
              console.error('Error deleting image:', err);
            }
          })
        );
      }

      // Upload new images
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          try {
            const blob = await put(`uploads/${image.name}`, await image.arrayBuffer(), {
              access: 'public',
              contentType: image.type,
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            return prisma.teamMemberImage.create({
              data: { teamMemberId: updatedTeamMemberDetail.id, imageUrl: blob.url },
            });
          } catch (err) {
            console.error('Error uploading image:', err);
            throw new Error('Failed to upload image');
          }
        })
      );

      return NextResponse.json({ message: 'Team member detail updated successfully!', updatedTeamMemberDetail, uploadedImages }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Team member detail updated successfully!', updatedTeamMemberDetail }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating team member detail:', error);
    return NextResponse.json({ error: 'Failed to update team member detail', details: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
    }

    const teamMemberDetail = await prisma.teamMemberDetail.findUnique({
      where: { id: Number(id) },
    });

    if (!teamMemberDetail) {
      return NextResponse.json({ error: 'Team member detail not found' }, { status: 404 });
    }

    await prisma.teamMemberDetail.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Team member detail deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete team member detail' }, { status: 500 });
  }
}
