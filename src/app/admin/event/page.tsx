import React from 'react'
import Events from '@/components/Admin/Blog/events'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Events | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <br></br>
      <h1>Create a New Event</h1>
      <Events />
    </div>

  )
}

export default page
