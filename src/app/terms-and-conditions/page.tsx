import React from 'react'
import TermsAndCondition from '@/components/Legal/TermsandCondition'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'terms & Conditions | Infinitech Advertising Corporation | Web Develompent',
    description: 'Discover expert web development and system development services tailored to elevate your digital presence. Explore our solutions designed to meet your needs.',
  };
}


const page = () => {
  return (
    <div>
     <TermsAndCondition />

    </div>

  )
}
export default page
