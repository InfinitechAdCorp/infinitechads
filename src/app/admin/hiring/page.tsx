import React from 'react'
import Hiring from '@/components/Admin/Blog/hiring'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hiring | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <br></br>
      <h1>Create a New Hiring Position</h1>
      <Hiring />
    </div>

  )
}

export default page
