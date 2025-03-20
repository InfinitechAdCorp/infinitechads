import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();
async function saveImageFile(imageFile: File) {
  const filename = imageFile.name;

  const blob = await put(`uploads/${filename}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN, 
  });

  return blob.url;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        
        if (id) {
            const teamMember = await prisma.teamMember.findUnique({
                where: { id: Number(id) },
                include: { certificates: true },
            });
            if (!teamMember) return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
            return NextResponse.json(teamMember.certificates);
        } else {
            const teamMembers = await prisma.teamMember.findMany({
                include: { certificates: true },
            });
            return NextResponse.json(teamMembers);
        }
    } catch {
        return NextResponse.json({ error: 'Failed to fetch team members or certificates' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
      const data = await request.formData();
      const imageFile = data.get('imageFile') as File | null;
      const certificateFiles = data.getAll('certificateFiles') as File[];

      if (certificateFiles.length > 0) {
          const certificates = await Promise.all(
              certificateFiles.map(async (file) => ({
                  imageUrl: await saveImageFile(file),
              }))
          );
          const savedCertificates = await prisma.certificate.createMany({
              data: certificates,
          });
          return NextResponse.json({ message: 'Certificates saved successfully!', savedCertificates }, { status: 201 });
      }

      const name = data.get('name') as string;
      const title = data.get('title') as string;
      const credentials = data.get('credentials') as string;
      const imageUrl = imageFile ? await saveImageFile(imageFile) : null;

      const teamMember = await prisma.teamMember.create({
          data: {
              name,
              title,
              credentials,
              imageUrl: imageUrl || '',
          },
      });
      return NextResponse.json({ message: 'Team member added successfully!', teamMember }, { status: 201 });
  } catch {
      return NextResponse.json({ error: 'Failed to save team member or certificate images' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
      const { searchParams } = request.nextUrl;
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

      const data = await request.formData();
      const name = data.get('name') as string | undefined;
      const title = data.get('title') as string | undefined;
      const imageFile = data.get('imageFile') as File | null;
      const credentials = data.get('credentials') as string | undefined;
      const certificateFiles = data.getAll('certificateFiles') as File[];

      const updateData: { name?: string; title?: string; credentials?: string; imageUrl?: string } = {};
      if (name) updateData.name = name;
      if (title) updateData.title = title;
      if (credentials) updateData.credentials = JSON.stringify(credentials.split(',').map((cred) => cred.trim()));
      if (imageFile) updateData.imageUrl = await saveImageFile(imageFile);

      const newCertificates = certificateFiles.map(async (file) => ({
          imageUrl: await saveImageFile(file),
      }));

      const updatedTeamMember = await prisma.teamMember.update({
          where: { id: Number(id) },
          data: {
              ...updateData,
              certificates: {
                  create: await Promise.all(newCertificates),
              },
          },
      });

      return NextResponse.json({ message: 'Team member updated successfully!', updatedTeamMember }, { status: 200 });
  } catch {
      return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const teamMemberId = searchParams.get('id');
    const certificateId = searchParams.get('certificateId');

    if (!teamMemberId) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        const member = await prisma.teamMember.findUnique({
            where: { id: Number(teamMemberId) },
            include: { certificates: true },
        });
        if (!member) return NextResponse.json({ error: 'Team member not found' }, { status: 404 });

        if (certificateId) {
            const certificate = member.certificates.find(
                (cert) => cert.id === Number(certificateId)
            );
            if (!certificate) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });

            if (certificate.imageUrl) {
                await del(certificate.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
            }

            await prisma.teamMemberCertificate.delete({
                where: { id: Number(certificateId) },
            });

            return NextResponse.json({ message: 'Certificate deleted successfully' }, { status: 200 });
        }

        for (const certificate of member.certificates) {
            if (certificate.imageUrl) {
                await del(certificate.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
            }
            await prisma.teamMemberCertificate.delete({
                where: { id: certificate.id },
            });
        }

        if (member.imageUrl) {
            await del(member.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
        }

        await prisma.teamMember.delete({
            where: { id: Number(teamMemberId) },
        });

        return NextResponse.json({ message: 'Team member and certificates deleted successfully' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to delete team member or certificates' }, { status: 500 });
    }
}
