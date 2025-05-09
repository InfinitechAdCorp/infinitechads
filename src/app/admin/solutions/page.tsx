import React from 'react';
import SolutionList from '@/components/Admin/Solution/SolutionList';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Solutions | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1>Create a New Solution </h1>
      <SolutionList />
    </div>
  );
}

export default page;
