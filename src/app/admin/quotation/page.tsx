import React from 'react';

import ManagePlans from '@/components/Admin/Quote/quote';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Quotation | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1>Upload Quotation</h1>
      <ManagePlans />
    </div>
  );
}

export default page;
