'use client';

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

export interface Partner {
  id: number;
  imageUrl: string;
}

function Partner() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    AOS.init({ easing: 'ease-out-cubic', duration: 2000 });

    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();

        const updatedPartners = await Promise.all(data.map(async (partner: Partner) => {
          if (partner.imageUrl) {
            const imageRes = await fetch(partner.imageUrl);
            const imageBlob = await imageRes.blob();
            partner.imageUrl = URL.createObjectURL(imageBlob);
          }
          return partner;
        }));

        setPartners(updatedPartners);
      } catch (err) {
        const errorMessage = (err as Error).message;
        toast.error(`Failed to fetch partners: ${errorMessage}`);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);


  if (error) return <p>Error: {error}</p>;

  return (
    <section className="partners py-12">
      <ToastContainer autoClose={1500} />
      <div className="container mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#004f83] mb-8">
          Our Partners
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
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
            partners.map((partner) => (

              <div
                key={partner.id}
                className="p-2 rounded-lg shadow-lg partner-card transform transition duration-300 hover:scale-105"
                data-aos="flip-left"
                data-aos-easing="ease-out-cubic"
                data-aos-duration="2000"
              >
                <img
                  src={partner.imageUrl}
                  alt={`Partner ${partner.id}`}

                  className="h-[150px] w-[150px] object-contain  object-center max-w-full"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Partner;
