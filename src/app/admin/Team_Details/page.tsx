import React from 'react';
import { Metadata } from 'next';
import TeamMemberTable from '@/components/Admin/Team/TeamDetails';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Team Details | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}



const page = () => {
  return (
    <div>
      <br></br>
      <h1> Team Details </h1>
      <TeamMemberTable />
    </div>
  );
}

export default page;
