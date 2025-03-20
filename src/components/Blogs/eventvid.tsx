'use client'

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/react';

interface EventVid {
    id: number;
    videoUrl: string;
    title: string;
    thumbnail: string;
}

const EventVid = () => {
    const [eventvids, setEventVid] = useState<EventVid[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchEventVid = async () => {
            try {
                const response = await fetch('/api/eventvid');
                const data = await response.json();
                setEventVid(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching eventvids:", error);
                setEventVid([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEventVid();
    }, []);

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full max-w-7xl">
                <div className="text-center max-w-xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
                        EVENTS CLIPS
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-14">
                    {loading ? (
                        [...Array(eventvids.length || 3)].map((_, index) => (
                            <div key={index} className="bg-white cursor-pointer rounded-lg overflow-hidden group relative before:absolute before:inset-0 before:z-10 before:bg-gray-200 before:opacity-60">
                                <Skeleton className="w-full h-60 rounded-lg" />
                                <div className="p-6 absolute bottom-0 left-0 right-0 z-20 space-y-4">
                                    <Skeleton className="w-1/3 h-2 rounded-lg bg-gray-300" />
                                    <Skeleton className="w-3/4 h-2 rounded-lg bg-gray-300" />
                                    <Skeleton className="w-1/2 h-2 rounded-lg bg-gray-300" />
                                </div>
                            </div>
                        ))
                    ) : (
                        eventvids.map((eventvid) => (
                            <div key={eventvid.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* <iframe
                                    className="w-full h-60 md:h-56"
                                    src={eventvid.videoUrl}
                                    title={`Customer eventvid ${eventvid.id}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe> */}
                                <video
                                    controls
                                    className="w-full h-40 md:h-56"
                                    poster={eventvid.thumbnail}
                                >
                                    <source
                                        src={eventvid.videoUrl}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                                {/* <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-800">{eventvid.title}</h3>
                                </div> */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventVid;
