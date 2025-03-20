import React from 'react';
import HeroSection from '@/components/Landingpage/hero';
import InfinitechStory from '@/components/Landingpage/whoisinfinitech';
import ServicesOffer from '@/components/Services/serviceoffer';
import Partner from '@/components/Landingpage/partner';
import Testimonial from '@/components/Testimonial/testimonial';
import Contactus from '@/components/Contactus/contactus';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}
// 

const page = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <div className="my-8">
        <InfinitechStory />
      </div>
      <div className="my-8">
        <ServicesOffer showSeeMoreButton={true} showAllServices={false} />
      </div>
      <div className="my-8">
        <Partner />
      </div>
      <div className="my-8">
        <Testimonial />
      </div>
      <div className="my-8">
        <Contactus />
      </div>
    </div>
  );
};

export default page;
