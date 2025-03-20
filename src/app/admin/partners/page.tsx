import React from 'react';
import PartnerComponent from '@/components/Admin/IndexPage/partner';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Partners | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}

const page = () => {
  return (
    <div>
      <br></br>
      <h1>Upload Our Partner</h1>
      <PartnerComponent />
    </div>
  );
}

export default page;
