import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

// FETCH DATA
export async function GET() {
  try {
    const blogPosts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json(blogPosts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// ADD
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const title = data.get("title") as string;
  const content = data.get("content") as string;
  const authorName = data.get("authorName") as string;
  const imageFile = data.get("imageFile") as File | null;
  const blobToken = data.get("blobToken") as string | undefined;

  if (!title || !content || !authorName || !imageFile) {
    return NextResponse.json(
      {
        error: "Title, content, author name, and image are required",
      },
      { status: 400 }
    );
  }

  try {
    // ✅ Use blobToken if provided, fallback to env token
    const tokenToUse = blobToken || process.env.BLOB_READ_WRITE_TOKEN;

    // Upload image to Vercel Blob
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: "public",
      contentType: imageFile.type,
      token: tokenToUse,
    });

    // Save the blog post data with image URL to the database
    const newBlogPost = await prisma.blogPost.create({
      data: { title, content, authorName, image: blob.url },
    });

    return NextResponse.json(
      { message: "Blog post created successfully!", newBlogPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// UPDATE
// UPDATE
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const data = await request.formData();
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const authorName = data.get("authorName") as string;
    const imageFile = data.get("imageFile") as File | null;
    const blobToken = data.get("blobToken") as string | undefined;
    console.log(blobToken)
    // ✅ Fallback to env token if blobToken not provided
    const tokenToUse = blobToken || process.env.BLOB_READ_WRITE_TOKEN;

    if (!tokenToUse) {
      console.error("❌ Blob token is missing or invalid.");
      return NextResponse.json(
        { error: "Blob token is required or invalid." },
        { status: 400 }
      );
    }

    if (!title || !content || !authorName) {
      return NextResponse.json(
        { error: "Title, content, and author name are required" },
        { status: 400 }
      );
    }

    // ✅ Find existing blog post by ID
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!existingBlogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingBlogPost.image;

    // ✅ Upload new image if provided and delete old one
    if (imageFile) {
      try {
        if (existingBlogPost.image) {
          console.log(
            `🗑️ Deleting old image: ${existingBlogPost.image} using token: ${tokenToUse}`
          );
          await del(existingBlogPost.image, { token: tokenToUse });
        }

        // ✅ Upload new image with unique name to avoid conflicts
        const blob = await put(
          `uploads/${Date.now()}_${imageFile.name}`, // Unique filename for safety
          await imageFile.arrayBuffer(),
          {
            access: "public",
            contentType: imageFile.type,
            token: tokenToUse,
          }
        );
        imageUrl = blob.url;
        console.log(`✅ New image uploaded successfully: ${imageUrl}`);
      } catch (uploadError) {
        console.error("❌ Failed to upload or delete image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload or delete image" },
          { status: 500 }
        );
      }
    }

    // ✅ Update the blog post in the database
    const updatedBlogPost = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        authorName,
        image: imageUrl,
      },
    });

    console.log(`✅ Blog post updated successfully with ID: ${id}`);
    return NextResponse.json(
      { message: "Blog post updated successfully!", updatedBlogPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to update blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}



// DELETE
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!blogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete the image from Vercel Blob
    if (blogPost.image) {
      await del(blogPost.image, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    // Delete the blog post from the database
    await prisma.blogPost.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Blog post and image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
