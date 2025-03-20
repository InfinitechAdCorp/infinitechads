import React from 'react';
import { Metadata } from 'next';
import EventVid from '@/components/Admin/Blog/eventvid';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Video Event | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}


const page = () => {
    return (
        <div>
            <br></br>
            <h1>Create a Event Video</h1>
            <EventVid />
        </div>
    );
}

export default page;
