'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

interface Service {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface ServicesOfferProps {
  showSeeMoreButton: boolean;
  showAllServices: boolean;
}

const ServicesOffer: React.FC<ServicesOfferProps> = ({ showSeeMoreButton, showAllServices }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();

        const servicesWithImages = await Promise.all(
          data.map(async (service: Service) => {
            if (service.image.startsWith('data:image')) {
              return service;
            }
            const imageResponse = await fetch(service.image);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { ...service, image: imageUrl };
          })
        );

        setServices(servicesWithImages);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchServices();
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const servicesToDisplay = showAllServices ? services : services.slice(0, 4);

  return (
    <div className="container mx-auto relative px-4">
      <div className="headingstyle" data-aos="fade-up" data-aos-duration="1000">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f83] mb-8">
          What We Do?
        </h1>
      </div>
      {showSeeMoreButton && !showAllServices && (
        <div className="my-6 md:my-8 text-right">
          <a
            href="/services"
            className="inline-flex items-center justify-center bg-[#004f83] text-white py-3 px-6 rounded-full text-xs sm:text-sm md:text-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg"
          >
            <span>See More</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 74 74"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-3 transition-transform transform group-hover:translate-x-1"
            >
              <circle cx="37" cy="37" r="35.5" stroke="white" strokeWidth="3" />
              <path
                d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      )}
      <div className="offer flex justify-center" data-aos="zoom-in-up" data-aos-duration="1000">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="w-[300px] space-y-5 p-4 shadow-lg"
                radius="lg"
              >
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-center text-xs sm:text-sm mx-10">
            {servicesToDisplay.map((service) => (
              <div
                key={service.id}
                className="offer-content cursor-pointer"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <Image src={service.image} alt={service.title} className="mx-auto mb-4" width={200} height={250} />
                <h2 className="text-lg sm:text-xl font-bold mb-2">{service.title}</h2>
                <p className="offer-desc text-xs sm:text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesOffer;
