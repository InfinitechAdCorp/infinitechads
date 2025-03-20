'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GiNextButton, GiPreviousButton } from 'react-icons/gi';
import { IoCloseCircleOutline } from "react-icons/io5";
import HeroSection from '@/components/Aboutus/TeamDetails/credentialhero';

interface Certificate {
    id: number;
    imageUrl: string;
    teamMemberId: number;
}

const Credential = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const { id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [modalIndex, setModalIndex] = useState<number>(0);

    useEffect(() => {
        if (id) {
            const fetchCertificates = async () => {
                try {
                    const response = await fetch(`/api/team?id=${id}`);
                    if (!response.ok) throw new Error('Failed to fetch certificates');
                    const certData = await response.json();
    
                    const updatedCertificates = await Promise.all(certData.map(async (cert: Certificate) => {
                        if (cert.imageUrl) {
                            const imageRes = await fetch(cert.imageUrl);
                            if (!imageRes.ok) throw new Error(`Failed to fetch image for certificate: ${cert.imageUrl}`);
                            const imageBlob = await imageRes.blob();
                            cert.imageUrl = URL.createObjectURL(imageBlob);
                        }
                        return cert;
                    }));
    
                    setCertificates(updatedCertificates);
                } catch (err) {
                    const errorMessage = (err as Error).message;
                    toast.error(`Failed to fetch certificates: ${errorMessage}`);
                    setCertificates([]);
                }
            };
    
            fetchCertificates();
        }
    }, [id]);    

    const handleImageClick = (imageUrl: string, index: number) => {
        setModalImage(imageUrl);
        setModalIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalImage(null);
    };

    const handleNext = () => {
        const nextIndex = (modalIndex + 1) % certificates.length;
        setModalImage(certificates[nextIndex].imageUrl);
        setModalIndex(nextIndex);
    };

    const handlePrevious = () => {
        const prevIndex = (modalIndex - 1 + certificates.length) % certificates.length;
        setModalImage(certificates[prevIndex].imageUrl);
        setModalIndex(prevIndex);
    };

    return (
        <div>
            <HeroSection teamMemberId={Number(id)} />
            <div className="my-6 mx-4 md:mx-40">
                <h3 className="text-2xl md:text-4xl font-bold text-[#0e2a47] uppercase">Certificates</h3>

                {certificates.length === 0 ? (
                    <p className="text-lg md:text-xl text-center text-gray-500">No data inserted</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-5">
                        {certificates.map((cert, index) => (
                            <div
                                key={cert.id}
                                className="w-full h-40 border-2 border-gray-300 rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => handleImageClick(cert.imageUrl, index)}
                            >
                                <Image
                                    src={cert.imageUrl}
                                    alt={`Certificate ${index}`}
                                    width={160}
                                    height={160}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-3 mx-4 sm:mx-6">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={handlePrevious}>
                                <GiPreviousButton className="text-lg sm:text-xl" />
                            </button>
                            <button onClick={closeModal}>
                                <IoCloseCircleOutline className="text-lg sm:text-xl" />
                            </button>
                            <button onClick={handleNext}>
                                <GiNextButton className="text-lg sm:text-xl" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <Image
                                src={modalImage || ''}
                                alt="Certificate Modal"
                                width={200}
                                height={200}
                                className="object-contain w-full max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh]"
                            />
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer autoClose={1500} />
        </div>
    );
};

export default Credential;
