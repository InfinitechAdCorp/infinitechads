import React from 'react';
import HeroSection from '@/components/Blogs/bloghero';
import Latestblog from '@/components/Blogs/latestblog';
import Events from '@/components/Blogs/events';
import Hiring from '@/components/Blogs/hiring';
import { Metadata } from 'next';
import EventVid from '@/components/Blogs/eventvid';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'News and Blogs | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}


const page = () => {
  return (
    <div>
      <HeroSection />
      <div className="my-8">
        <Latestblog />
      </div>

      <div className="my-8">
        <Events />
      </div>

      <div className="my-8">
        <EventVid />
      </div>

      <div className="my-8">
        <Hiring />
      </div>
    </div>
  );
};

export default page;
