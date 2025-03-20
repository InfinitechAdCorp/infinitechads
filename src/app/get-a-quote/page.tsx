import React from "react";
import HeroSection from "@/components/Quote/quotehero";
import Quotation from "@/components/Quote/quotation";
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
        <HeroSection/>
        <div className="my-8">
        <Quotation />
      </div>
      </div>
  
    )
  }
  
  export default page