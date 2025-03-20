import React from 'react';
import AdminCertificates from '@/components/Admin/AboutUs/Admincertificates';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Certificates | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1>Add New Certificates</h1>
      <AdminCertificates />
    </div>
  );
}

export default page;
