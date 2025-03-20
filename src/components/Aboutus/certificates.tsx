'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

export interface Certificate {
  id: number;
  imageUrl: string;
}

function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificatess');
        if (!response.ok) throw new Error();
        const data = await response.json();

        const updatedCertificates = await Promise.all(data.map(async (certificate: Certificate) => {
          if (certificate.imageUrl) {
            const imageRes = await fetch(certificate.imageUrl);
            const imageBlob = await imageRes.blob();
            certificate.imageUrl = URL.createObjectURL(imageBlob);
          }
          return certificate;
        }));

        setCertificates(updatedCertificates);
      } catch {
        console.error("Failed to fetch certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#004f83]" data-aos="fade-up">
        Our Certificates
      </h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 justify-items-center">
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
            certificates.map((certificate) => (
              <div key={certificate.id} className="bg-white shadow-lg transition-transform transform hover:scale-105 overflow-hidden m-4" data-aos="fade-up">
                <Image src={certificate.imageUrl} alt={`Certificate ${certificate.id}`} className="object-cover" width={400} height={300} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Certificates;
