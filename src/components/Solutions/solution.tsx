'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";


export interface Solution {
  id: number;
  imageUrl: string;
  link: string;
  name: string;
}

function Solutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch('/api/solutions');
        const data = await response.json();
        setSolutions(data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();

    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="bg-gray-50 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#004f83]" data-aos="fade-up" data-aos-duration="1000">
        Our Solutions
      </h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="w-[400px] space-y-5 p-4" radius="lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300" />
                  </Skeleton>
                  <div className="space-y-3">
                    <Skeleton className="w-4/5 rounded-lg">
                      <div className="h-8 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-5/5 rounded-lg">
                      <div className="h-8 w-4/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg">
                      <div className="h-8 w-2/5 rounded-lg bg-default-300" />
                    </Skeleton>
                  </div>
                </Card>
              ))}
            </>
          ) : (
            solutions.map((solution) => (
              <div
                className="relative group border border-[#004f83] rounded-lg overflow-hidden"
                key={solution.id}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <Image
                  src={solution.imageUrl}
                  alt={`Image of ${solution.name}`}
                  className="w-full h-auto"
                  width={400}
                  height={200}
                  unoptimized={true}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex-grow flex items-center justify-center w-full">
                    <p className="text-3xl text-white bg-[#464747] bg-opacity-70 py-2 px-8 uppercase font-bold w-full text-center">
                      {solution.name}
                    </p>
                  </div>
                  <a
                    href={solution.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-[#004f83] text-white font-semibold rounded-md hover:bg-[#004f83] hover:text-[#c5c7c9] border-2 border-[#004f83] transition-colors mb-4"
                  >
                    VISIT SITE
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Solutions;
