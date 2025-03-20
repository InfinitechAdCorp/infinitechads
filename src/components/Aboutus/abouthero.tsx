'use client';
import Image from 'next/image';


function HeroSection() {

    return (
        <div
            className="relative flex flex-col md:flex-row h-[50vh] md:h-[70vh] bg-cover bg-center text-white"
            style={{ backgroundImage: "url('/img/hero-background.jpg')" }}
        >
      <div className="absolute inset-0 bg-gradient-to-r from-[#06264d] to-[#1f62b3] opacity-90"></div>

                       <div
                className="relative z-10 flex flex-col items-start justify-center px-6 py-4 md:py-8 text-left max-w-lg mx-auto mt-14 md:mt-0"
            >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F3F4F6] mb-4 mt-12 sm:mt-16 md:mt-6">
                    About Us
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-[#E0E7FF] mb-6">
                    At <strong>Infinitech Advertising Corporation,</strong><br />
                    We believe in delivering high-quality solutions to help you grow your business effectively.
                </p>
            </div>

            <div className="relative flex items-center justify-center flex-1 max-w-full lg:max-w-2xl mx-auto mt-6 md:mt-0">
                <div className="svg flex items-center justify-center max-w-[70%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1">
                    <Image src="/svg/aboutus.svg" alt="SVG Illustration" className="svg-icon" width={500} height={450} />
                </div>
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
