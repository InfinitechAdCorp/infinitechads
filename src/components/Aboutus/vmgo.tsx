"use client";
import React from 'react';

function VMGO() {
  return (
    <div className="vmg px-4 sm:px-6 lg:px-8" data-aos="fade-up" data-aos-duration="1000">
      <div className="flex flex-wrap justify-between items-start pt-10 ">
        <div className="w-full sm:w-1/3 text-center p-4 border-r-2 border-gray-300">
          <span className="vmg-header text-2xl sm:text-xl md:text-2xl font-bold">Mission</span>
          <p className="mt-2 text-sm sm:text-base md:text-lg">
            They are committed to helping their clients reach operational excellence and sustainable growth through specialized, technology-driven strategies that solve difficult problems.
          </p>
        </div>
        <div className="w-full sm:w-1/3 text-center p-4 border-r-2 border-gray-300">
          <span className="vmg-header text-2xl sm:text-xl md:text-2xl font-bold">Vision</span>
          <p className="mt-2 text-sm sm:text-base md:text-lg">
            Infinitech aims to be a top choice for businesses looking to enhance their digital presence. By using the latest technology and creative ideas, they want to lead the industry and help clients grow and succeed.
          </p>
        </div>
        <div className="w-full sm:w-1/3 text-center p-4">
          <span className="vmg-header text-2xl sm:text-xl md:text-2xl font-bold">Goal</span>
          <p className="mt-2 text-sm sm:text-base md:text-lg">
            To successfully adapt the latest technological advancements and continuously innovate in digital advertising strategies, ensuring the delivery of unique and measurable results for clients.
          </p>
        </div>
      </div>
      <style jsx>{`
        .vmg-header {
          border-bottom: 2px solid #2f63a8;
          padding-bottom: 4px;
          margin-bottom: 10px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default VMGO;
