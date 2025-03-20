import Image from 'next/image';
import { BsFillTelephoneFill, BsPhoneFill } from "react-icons/bs";
import { FaViber, FaTelegramPlane, FaMapMarkedAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="bg-gray-100 mt-20">
            <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <section className="mb-2 md:mb-0 text-center">
                        <a href="#" className="flex items-center justify-center mb-1">
                            <Image src="/img/logo1.png" className="h-18 me-1" alt="Infinitech Logo" width={100} height={300} />
                            {/* <span className="sm:text-base md:text-2xl lg:text-3xl self-center font-semibold whitespace-nowrap">
                                Infinitech Advertising Corporation
                            </span> */}
                        </a>
                        <p className="text-sm text-neutral-800 mb-4">We specialize in customized IT solutions to enhance online visibility and streamline business processes.</p>
                        <a href="/apk/infinitech.apk" className="inline-block bg-blue-600 text-white text-sm py-2 px-4 mt-4 rounded-full hover:bg-blue-700 transition duration-300">
                            Download App
                        </a>
                    </section>
                    <div className="grid grid-cols-1 gap-4 sm:gap-10 sm:grid-cols-3">
                        <section>
                            <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase">Quick Links</h2>
                            <ul className="text-neutral-800 font-medium">
                                <li><a href="/about-us" className="hover:underline">About Us</a></li>
                                <li><a href="/services" className="hover:underline">Services</a></li>
                                <li><a href="/solutions" className="hover:underline">Solutions</a></li>
                                <li><a href="/testimonials" className="hover:underline">Testimonials</a></li>
                                <li><a href="/blogs-news" className="hover:underline">Blogs</a></li>
                                <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase">Contact Us</h2>
                            <ul className="text-neutral-800 font-medium">
                                <li><a href="tel:(02) 7001-6157" className="hover:underline" target="_blank"><BsFillTelephoneFill className="mr-2 inline" /> (02) 7001-6157</a></li>
                                <li><a href="tel:+639622530149" className="hover:underline" target="_blank"><BsPhoneFill className="mr-2 inline" /> +63962-253-0149</a></li>
                                <li><a href="viber://chat?number=%2B639622530149" className="hover:underline" target="_blank"><FaViber className="mr-2 inline" /> +63962-253-0149</a></li>
                                <li><a href="https://t.me/infinitechcorp" className="hover:underline" target="_blank"><FaTelegramPlane className="mr-2 inline" /> +63962-253-0149</a></li>
                                <li><a href="mailto:infinitechcorp.ph@gmail.com" className="hover:underline text" target="_blank"><MdEmail className="mr-2 inline text-sm" /> infinitechcorp.ph@gmail.com</a></li>
                                <li><a href="https://maps.app.goo.gl/fVLeGtpQ55YQSK318" className="hover:underline" target="_blank"><FaMapMarkedAlt className="mr-2 inline" /> Site Map</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                            <ul className="text-neutral-800 font-medium">
                                <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                                <li><a href="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-neutral-800 sm:text-center">© 2025 <a href="#" className="hover:underline">Infinitech Advertising Corporation</a>. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
