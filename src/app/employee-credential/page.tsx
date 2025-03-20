import Credential from '@/components/Aboutus/credential'
import React from 'react'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Credentials | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}


const page = () => {
  return (
    <div>

     <Credential />
 

    </div>

  )
}
export default page
