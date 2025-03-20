'use client';
import React from 'react';
import SlidingLogo from '@/components/Landingpage/SlidingLogo';
import ImageSlider from './imageslider';

function HeroSection() {
    return (
        <div className="relative flex flex-col md:flex-row h-[50vh] md:h-[70vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('/img/hero-background.jpg')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06264d] to-[#1f62b3] opacity-90"></div>

            <div className="relative z-10 flex flex-col items-start justify-center px-6 py-4 md:py-8 text-left max-w-lg mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 mt-12 sm:mt-4 md:mt-6">High Quality, <strong>Lower Price</strong></h1>
                <p className="text-sm sm:text-base md:text-lg mb-6">
                    At <strong>Infinitech Advertising Corporation,</strong><br />
                    We offer excellent products without breaking the bank.
                </p>
                <a
                    href="/about-us"
                    className="flex items-center gap-2 px-4 py-1 text-white bg-[#2f63a8] rounded-md shadow hover:bg-[#25549a] transition-colors text-sm sm:text-base md:text-lg"
                >
                    <span>Explore More</span>
                    <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="37" cy="37" r="35.5" stroke="white" strokeWidth="3" />
                        <path
                            d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                            fill="white"
                        />
                    </svg>
                </a>
            </div>
            <div className="flex-1 flex items-center justify-center max-w-full lg:max-w-2xl mx-auto mt-6 md:mt-0">
                <ImageSlider />
            </div>

            <div className="absolute bottom-12 w-full">
                <SlidingLogo />
            </div>

            <div className="absolute inset-x-0 bottom-0 w-full rotate-180 overflow-hidden">
                <svg
                    className="w-full h-16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        fill="#FFFFFF"
                    ></path>
                </svg>
            </div>
        </div>
    );
}

export default HeroSection;
    