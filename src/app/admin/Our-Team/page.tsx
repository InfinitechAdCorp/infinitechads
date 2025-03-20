import React from 'react';

import TeamMembers from '@/components/Admin/Team/OurTeam';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Team | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1>Add New Team Member</h1>
      <TeamMembers />
    </div>
  );
}

export default page;
