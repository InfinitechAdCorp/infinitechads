import React from 'react'
import HeroSection from '@/components/Solutions/solutionhero'
import Solution from '@/components/Solutions/solution'
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
      <HeroSection/>
      <div className="my-8">
        <Solution />
      </div>

    </div>

  )
}

export default page
