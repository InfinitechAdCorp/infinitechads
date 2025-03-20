'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

function InfinitechStory() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="py-10 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6" data-aos="fade-up">
            <h1 className="title-header text-[#004f83] text-lg sm:text-2xl md:text-1xl lg:text-2xl font-bold">
              Who is Infinitech Advertising Corporation?
            </h1>
            <p className="infinitech-desc text-black text-sm sm:text-base md:text-lg text-justify leading-relaxed">
              At Infinitech Advertising Company, our mission is to help businesses thrive by providing top-notch digital solutions that boost growth, streamline operations, and enhance user satisfaction. We are committed to customer satisfaction, offering a guarantee of unique web design and high-quality work. Our expertise spans Website Design and Development, Mobile App Development, Ecommerce Solutions, and IT Outsourcing. Through our innovative solutions, we ensure our clients achieve their goals and experience exceptional service.
            </p>
            <div className="flex justify-end sm:justify-start">
              <a
                href="/about-us"
                className="button btn-hero inline-flex items-center justify-center bg-[#004f83] text-white py-3 px-6 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg"
              >
                <span>Learn More About Us</span>
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

          </div>

          {/* Image Content */}
          <div className="flex justify-center" data-aos="fade-up">
            <div className="overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full max-w-sm sm:max-w-md md:max-w-lg">
              <Image
                width={600}
                height={500}
                src="/img/ourstory.png"
                alt="Infinitech Advertising"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfinitechStory;
