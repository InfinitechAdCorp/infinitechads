import React from 'react';
import LatestBlog from '@/components/Admin/Blog/latestBlog';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blogs | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <br></br>
      <h1>Create a New Blog Post</h1>
      <LatestBlog />
    </div>
  );
}

export default page;
