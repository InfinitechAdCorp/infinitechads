'use client';

import React from 'react';
import Image from 'next/image';

function FloatingSocialMedia() {
    return (
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 space-y-4 z-50 hidden md:block">
            {/* Facebook Icon */}
            <a href="https://www.facebook.com/profile.php?id=100080647808810&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/fb.png"
                        alt="Facebook"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a>

            {/* Gmail Icon */}
            <a href="mailto:infinitechcorp.ph@gmail.com" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/gmail.png"
                        alt="Gmail"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a>

            {/* Telegram Icon */}
            <a href="https://t.me/+639622530149" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/tg.png"
                        alt="Telegram"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a>

            {/* Instagram Icon */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/ig.png"
                        alt="Instagram"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a>

            {/* Tiktok Icon */}
            {/* <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/tik.png"
                        alt="Tiktok"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a> */}

            {/* Reddit Icon */}
            {/* <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/red.png"
                        alt="Reddit"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a> */}

            {/* Twitter Icon */}
            {/* <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 bg-[#004f83] text-white rounded-full flex items-center justify-center hover:bg-[#004f83e7] transition duration-300 my-2">
                    <Image
                        src="/img/SocialMedia/twit.png"
                        alt="Twitter"
                        width={35}
                        height={35}
                        className="object-contain"
                    />
                </div>
            </a> */}
        </div>
    );
}

export default FloatingSocialMedia;
