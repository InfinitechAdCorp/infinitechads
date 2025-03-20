'use client'

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/react';


interface VideoTestimonial {
    id: number;
    videoUrl: string;
    clientName: string;
    thumbnail: string;
}

const VideoTestimonial = () => {
    const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
    

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('/api/VideoTestimonial');
                const data = await response.json();
                setTestimonials(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
                setTestimonials([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full max-w-7xl">
                <h2 className="text-4xl font-extrabold text-[#004f83] text-center mb-6">Customer Testimonials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                    {loading ? (
                        [...Array(testimonials.length || 3)].map((_, index) => (
                            <div key={index} className="bg-white cursor-pointer rounded-lg overflow-hidden group relative before:absolute before:inset-0 before:z-10 before:bg-gray-200 before:opacity-60">
                                <Skeleton className="w-full h-60 rounded-lg" />
                                <div className="p-6 absolute bottom-0 left-0 right-0 z-20 space-y-4">
                                    <Skeleton className="w-1/3 h-2 rounded-lg bg-gray-300" />
                                    <Skeleton className="w-3/4 h-2 rounded-lg bg-gray-300" />
                                    <Skeleton className="w-1/2 h-2 rounded-lg bg-gray-300" />
                                </div>
                            </div>
                        ))
                    ) : (testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <video
                                controls
                                className="w-full h-40 md:h-56"
                                poster={testimonial.thumbnail}
                            >
                                <source
                                    src={testimonial.videoUrl}
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-800">{testimonial.clientName}</h3>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoTestimonial;
