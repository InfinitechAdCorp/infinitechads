import React from 'react';
import Image from 'next/image';
import HeroSection from '@/components/Aboutus/abouthero';
import VMGO from '@/components/Aboutus/vmgo';
import Team from '@/components/Aboutus/team';
import Certificates from '@/components/Aboutus/certificates';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <HeroSection />

      <div className="flex flex-col items-center my-8 px-4 sm:px-0">
        <Image
          src="/img/ourstory.png"
          alt="Descriptive Alt Text"
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 rounded shadow-lg"
          width={600}
          height={400}
        />
        <p className="mt-4 text-center text-sm sm:text-base md:text-md lg:text-lg">
          Building and nurturing strong partnerships to deliver better outcomes for both Infinitech and clients.
        </p>
      </div>

      <div className="my-8">
        <VMGO />
      </div>

      <div className="my-8">
        <Team />
      </div>

      <div className="my-8">
        <Certificates />
      </div>
    </div>
  );
};

export default page;
