import React from 'react'
import HeroSection from '@/components/Testimonial/testimonialhero'
import Testimonial from '@/components/Testimonial/testimonial'
import VideoTestimonial from '@/components/Testimonial/videotestimonial'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Testimonials | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <HeroSection/>
      <div className="my-8">
        <Testimonial />
      </div>
      <div className="my-8">
        <VideoTestimonial />
      </div>
    </div>

  )
}

export default page
