'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TeamMemberImage {
  imageUrl: string;
}

interface MemberImageSliderProps {
  teamMemberId: number;
}

const MemberImageSlider: React.FC<MemberImageSliderProps> = ({ teamMemberId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/team_details?id=${teamMemberId}`);
        const data = await response.json();
        console.log('API response:', data);
        
        if (data?.images?.length) {
          const updatedImages = await Promise.all(data.images.map(async (image: TeamMemberImage) => {
            if (image.imageUrl) {
              const imageRes = await fetch(image.imageUrl);
              const imageBlob = await imageRes.blob();
              console.log('Fetched image blob for:', image.imageUrl);
              return URL.createObjectURL(imageBlob); 
            }
            return '';  
          }));
          setImages(updatedImages);
          console.log('Updated images:', updatedImages);
        }
      } catch (error) {
        console.error('Failed to fetch images', error);
      } 
    };

    if (teamMemberId) {
      fetchImages();
    }
  }, [teamMemberId]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;



  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden flex items-center justify-center">
      {images.length > 0 && (
        <>
          <div className="absolute left-0 transform -rotate-5 scale-95 opacity-60 blur-sm w-1/2 h-80 z-10 mx-auto ">
            <Image
              src={images[prevIndex] || '/fallback-image.png'} 
              alt="Previous image"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 transform rotate-4 scale-95 opacity-60 blur-sm w-1/2 h-80 z-10 mx-auto ">
            <Image
              src={images[nextIndex] || '/fallback-image.png'} 
              alt="Next image"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-2/3 h-80 z-10 mx-auto flex-shrink-0 transition-transform duration-500 transform">
            <Image
              src={images[currentIndex] || '/fallback-image.png'} 
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-contain rounded-lg shadow-lg transition-transform duration-500 scale-105"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberImageSlider; 