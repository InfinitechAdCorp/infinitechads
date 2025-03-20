import React from 'react';
import HeroSection from '@/components/Services/servicehero';
import ServicesOffer from '@/components/Services/serviceoffer';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <HeroSection />
      <div className="my-8">
      <ServicesOffer showSeeMoreButton={false} showAllServices={true} />
      </div>
    </div>
  );
};

export default page;
