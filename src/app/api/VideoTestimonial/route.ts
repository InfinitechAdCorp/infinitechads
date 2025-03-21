import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

interface VideoTestimonial {
  id: number;
  videoUrl: string;
  thumbnail: string;
  clientName: string;
}

export async function GET() {
  try {
    const testimonials = await prisma.videoTestimonial.findMany();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  const data = await request.formData();
  
  // Log all form data entries
  console.log("Form Data Entries:");
  for (const pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  const videoFile = data.get("videoUrl") as File;
  const thumbnailFile = data.get("thumbnailUrl") as File;
  const clientName = data.get("clientName") as string;
  const blobToken = data.get("blobToken") as string; // ✅ Get blobToken

  // Log individual values to check
  console.log("Video File:", videoFile);
  console.log("Thumbnail File:", thumbnailFile);
  console.log("Client Name:", clientName);
  console.log("Blob Token:", blobToken);

  if (!videoFile || !thumbnailFile || !blobToken) {
    console.error("Missing required fields.");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const videoBlob = await put(
      `videos/${videoFile.name}`,
      await videoFile.arrayBuffer(),
      {
        access: "public",
        contentType: videoFile.type,
        token: blobToken, // ✅ Use blobToken here
      }
    );

    const thumbnailBlob = await put(
      `thumbnails/${thumbnailFile.name}`,
      await thumbnailFile.arrayBuffer(),
      {
        access: "public",
        contentType: thumbnailFile.type,
        token: blobToken, // ✅ Use blobToken here
      }
    );

    const newTestimonial: VideoTestimonial =
      await prisma.videoTestimonial.create({
        data: {
          videoUrl: videoBlob.url,
          thumbnail: thumbnailBlob.url,
          clientName,
        },
      });

    console.log("Testimonial created successfully:", newTestimonial);

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create video testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await request.formData();
  const videoFile = data.get("videoUrl") as File | undefined;
  const thumbnailFile = data.get("thumbnailUrl") as File | undefined;
  const clientName = data.get("clientName") as string | undefined;
  const blobToken = data.get("blobToken") as string; // ✅ Get blobToken

  if (!blobToken) {
    return NextResponse.json({ error: "Blob token is required" }, { status: 400 });
  }

  const updateData: Partial<VideoTestimonial> = {};

  if (clientName) {
    updateData.clientName = clientName;
  }

  try {
    if (videoFile && videoFile instanceof Blob) {
      const videoBlob = await put(
        `videos/${videoFile.name}`,
        await videoFile.arrayBuffer(),
        {
          access: "public",
          contentType: videoFile.type,
          token: blobToken, // ✅ Use blobToken here
        }
      );
      updateData.videoUrl = videoBlob.url;
    }

    if (thumbnailFile && thumbnailFile instanceof Blob) {
      const thumbnailBlob = await put(
        `thumbnails/${thumbnailFile.name}`,
        await thumbnailFile.arrayBuffer(),
        {
          access: "public",
          contentType: thumbnailFile.type,
          token: blobToken, // ✅ Use blobToken here
        }
      );
      updateData.thumbnail = thumbnailBlob.url;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid data to update" }, { status: 400 });
    }

    const updatedTestimonial: VideoTestimonial =
      await prisma.videoTestimonial.update({
        where: { id: Number(id) },
        data: updateData,
      });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update video testimonial" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');  // Extract id from the query parameter
  const body = await request.json(); // Parse the body to get blobToken
  const blobToken = body.blobToken;  // Extract blobToken from the request body
  
  console.log("Received ID:", id); // Check if the ID is correctly parsed
  console.log("Received Blob Token:", blobToken); // Check if blobToken is received

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (!blobToken) {
    return NextResponse.json({ error: 'Blob token is required' }, { status: 400 });
  }

  try {
    await prisma.videoTestimonial.delete({
      where: { id: Number(id) },  // Delete the video testimonial by ID
    });
    return NextResponse.json({ message: 'Video testimonial deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete video testimonial' }, { status: 500 });
  }
}
