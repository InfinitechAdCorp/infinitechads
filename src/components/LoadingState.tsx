'use client'
import React from 'react';
import Image from 'next/image';
import "@/style/loader.css";

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute animate-spin rounded-full h-20 w-20 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-32 lg:w-32 border-t-4 border-b-4 border-blue-500"></div>
      <Image src="/img/loaderlogo.png" className="rounded-full h-16 w-16 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-28 lg:w-28" alt="loader" width={100} height={100}/>
    </div>
  );
}

export default LoadingState;
