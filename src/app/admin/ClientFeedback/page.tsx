import React from 'react';
import TestimonialTable from '@/components/Admin/Testimonial/clientfeedback';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Client Feedback | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1>Client Feedback</h1>
      <TestimonialTable />
    </div>
  );
}

export default page;
