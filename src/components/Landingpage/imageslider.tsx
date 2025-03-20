'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

function ImageSlider() {
  const images = [
    '/img/abic.png',
    '/img/dmci.png',
    '/img/s5.png',
    '/img/manpower.png',
    '/img/leluxe.png',
    '/img/abic.png',
    '/img/dmci.png',
    '/img/s5.png',
    '/img/manpower.png',
    '/img/leluxe.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden flex items-center justify-center">

      <div className="absolute left-0 transform -rotate-5 scale-95 opacity-60 blur-sm w-1/2 h-64">
        <Image
          src={images[prevIndex]}
          alt="Previous background image"
          layout="fill"
          className="object-cover"
        />
      </div>

      <div className="absolute right-0 transform rotate-4 scale-95 opacity-60 blur-sm w-1/2 h-64">
        <Image
          src={images[nextIndex]}
          alt="Next background image"
          layout="fill"
          className="object-cover"
        />
      </div>

      <div className="relative w-2/3 h-80 z-10 mx-auto flex-shrink-0 transition-transform duration-500 transform">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          layout="fill"
          className="object-contain rounded-lg shadow-lg transition-transform duration-500 scale-105"
        />
      </div>

    </div>
  );
}

export default ImageSlider;
