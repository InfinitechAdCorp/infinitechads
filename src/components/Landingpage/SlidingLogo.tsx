'use client'

import React from 'react';
import Image from 'next/image';

function SlidingLogo() {
  return (
    <div className="overflow-hidden">
      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slideIn {
          animation: slideIn 20s linear infinite; 
        }
      `}</style>
      <div className="flex animate-slideIn py-12">
        <Image src="/img/abicman.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/abicreal.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/bcrv.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/joysis.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/matt.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/mng.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/nrg.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/abicman.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/abicreal.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/bcrv.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/joysis.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/matt.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/mng.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/nrg.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/abicman.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/abicreal.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/bcrv.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/joysis.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/matt.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/mng.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/nrg.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/abicman.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/abicreal.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/bcrv.png" alt="Logo 3" className="mx-4" width={150} height={150} />
        <Image src="/img/joysis.png" alt="Logo 4" className="mx-4" width={150} height={150} />
        <Image src="/img/matt.png" alt="Logo 1" className="mx-4" width={150} height={150} />
        <Image src="/img/mng.png" alt="Logo 2" className="mx-4" width={150} height={150} />
        <Image src="/img/nrg.png" alt="Logo 3" className="mx-4" width={150} height={150} />
      </div>
    </div>
  );
}

export default SlidingLogo;
