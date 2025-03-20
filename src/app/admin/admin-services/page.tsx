import React from 'react';
import ServiceTable from '@/components/Admin/Services/Service';
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
      <br></br>
      <h1>Add New Services</h1>
      <ServiceTable />
    </div>
  );
}

export default page;
