import React from 'react';
import VideoTestimonials from '@/components/Admin/Testimonial/VideoTestimonial';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Video Testimonial | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}


const page = () => {
    return (
        <div>
            <br></br>
            <h1>Create a Video Testimonial</h1>
            <VideoTestimonials />
        </div>
    );
}

export default page;
