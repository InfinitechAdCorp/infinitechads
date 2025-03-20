'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import { Skeleton } from '@nextui-org/react';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
  id: number;
  image: string;
  title: string;
  content: string;
  authorName: string;
  date: Date;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();

      const updatedEvents = await Promise.all(
        data.map(async (event: Event) => {
          if (event.image && !event.image.startsWith('data:image')) {
            const imageResponse = await fetch(event.image);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { ...event, image: imageUrl }; 
          }
          return event; 
        })
      );

      setEvents(updatedEvents); 
    } catch {
      toast.error("Error fetching events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="font-[sans-serif] p-4">
      <ToastContainer autoClose={1500}/>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
            EVENTS
          </h2>
          <p className="text-gray-600 text-sm mt-6">
            Implementing innovative technology solutions can enhance business operations, improve efficiency, and drive sustainable growth in a competitive marketplace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {loading ? (
            [...Array(events.length || 3)].map((_, index) => (
              <div key={index} className="bg-white cursor-pointer rounded-lg overflow-hidden group relative before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-60">
                <Skeleton className="w-full h-96 rounded-lg" />
                <div className="p-6 absolute bottom-0 left-0 right-0 z-20 space-y-4">
                  <Skeleton className="w-1/3 h-3 rounded-lg bg-gray-300" />
                  <Skeleton className="w-3/4 h-3 rounded-lg bg-gray-300" />
                  <Skeleton className="w-1/2 h-3 rounded-lg bg-gray-300" />
                </div>
              </div>
            ))
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white cursor-pointer rounded-lg overflow-hidden group relative before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-10">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  width={200} 
                  height={200} 
                  className="w-full h-96 object-cover group-hover:scale-110 transition-all duration-300" 
                />
                <div className="p-6 absolute bottom-0 left-0 right-0 z-20">
                  {/* <span className="text-sm block mb-2 text-yellow-400 font-semibold">
                    {new Date(event.date).toLocaleDateString()} | BY {event.authorName}
                  </span> */}
                  <h3 className="text-xl font-bold text-white">{event.title}</h3>
                  <div className="mt-4">
                    <p className="text-gray-200 text-sm">{event.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
