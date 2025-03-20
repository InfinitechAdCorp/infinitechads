'use client'; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Certificate {
    id: number;
    imageUrl: string;
    teamMemberId: number;
}

const Credential = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const { id } = useParams(); 

    useEffect(() => {
        if (id) {
            const fetchCertificates = async () => {
                try {
                    const response = await fetch(`/api/team?id=${id}`);
                    const certData = await response.json();
                    setCertificates(certData || []);
                } catch (error) {
                    console.error('Failed to fetch certificates:', error);
                    setCertificates([]);
                }
            };

            fetchCertificates();
        }
    }, [id]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-10 mt-20">
            {certificates.length > 0 ? (
                certificates.map((cert) => (
                    <div key={cert.id}>
                        <Image
                            className="h-auto max-w-xs"
                            src={cert.imageUrl}  
                            alt={`Certificate ${cert.id}`}
                            width={300}
                            height={300}
                            unoptimized={false} 
                        />
                    </div>
                ))
            ) : (
                <p>No certificates available.</p>
            )}
        </div>
    );
};

export default Credential;
