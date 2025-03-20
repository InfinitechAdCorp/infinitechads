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
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const authorName = data.get('authorName') as string;
  const imageFile = data.get('imageFile') as File | null;

  if (!title || !content || !authorName || !imageFile) {
    return NextResponse.json({ error: 'Title, content, author name, and image are required' }, { status: 400 });
  }

  try {
    // Upload image to Vercel Blob
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Save the blog post data with image URL to the database
    const newBlogPost = await prisma.blogPost.create({
      data: { title, content, authorName, image: blob.url },
    });

    return NextResponse.json({ message: 'Blog post created successfully!', newBlogPost }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await request.formData();
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const authorName = data.get('authorName') as string;
  const imageFile = data.get('imageFile') as File | null;

  if (!title || !content || !authorName || !imageFile) {
    return NextResponse.json({ error: 'Title, content, author name, and image are required' }, { status: 400 });
  }

  try {
    // Find the existing blog post to get the current image URL
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!existingBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete the old image from Vercel Blob if it exists
    if (existingBlogPost.image) {
      await del(existingBlogPost.image, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    // Upload the new image to Vercel Blob
    const blob = await put(`uploads/${imageFile.name}`, await imageFile.arrayBuffer(), {
      access: 'public',
      contentType: imageFile.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Update the blog post with the new data and image URL
    const updatedBlogPost = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: { title, content, authorName, image: blob.url },
    });

    return NextResponse.json({ message: 'Blog post updated successfully!', updatedBlogPost }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
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
