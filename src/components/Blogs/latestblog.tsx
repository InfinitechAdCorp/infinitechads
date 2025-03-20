'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, Skeleton } from "@nextui-org/react";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  authorName: string;
  image: string | null;
}

const LatestBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/LatestBlog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data: BlogPost[] = await response.json();

        const blogsWithImages = await Promise.all(
          data.map(async (blog: BlogPost) => {
            if (blog.image && !blog.image.startsWith('data:image')) {
              const imageResponse = await fetch(blog.image);
              const imageBlob = await imageResponse.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              return { ...blog, image: imageUrl };
            }
            return blog;
          })
        );

        setBlogs(blogsWithImages);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="font-[sans-serif] my-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
            LATEST BLOGS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
          {loading
            ? [...Array(blogs.length || 3)].map((_, index) => (  
              <div key={index} className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300 w-full">
                <Card className="space-y-5 p-4">
                  <Skeleton className="w-full h-60 rounded-lg bg-gray-300"></Skeleton>

                  <div className="p-6 space-y-4">
                    <Skeleton className="w-3/5 h-3 rounded-lg bg-gray-200"></Skeleton>

                    <Skeleton className="w-4/5 h-3 rounded-lg bg-gray-200"></Skeleton>

                    <Skeleton className="w-2/5 h-3 rounded-lg bg-gray-300"></Skeleton>

                    <Skeleton className="w-full h-16 rounded-lg bg-gray-200"></Skeleton>
                  </div>
                </Card>
              </div>
            ))
            : blogs.map((blog) => (
              <div key={blog.id} className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300 w-full">
                <Image
                  src={blog.image || '/uploads/default.jpg'}
                  alt={`Blog Post: ${blog.title}`}
                  className="w-full h-60 object-cover"
                  width={200}
                  height={100}
                />
                <div className="p-6">
                  <span className="text-sm block text-gray-400 mb-2">
                    {new Date(blog.date).toLocaleDateString()} | BY {blog.authorName}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{blog.title}</h3>
                  <hr className="my-4" />
                  <p className="text-gray-400 text-sm">{blog.content}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LatestBlog;
