'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    setCurrentPath(path);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getLinkClassName = (path: string) => {
    return currentPath === path
      ? 'py-2 px-3 text-white font-bold rounded bg-blue-500'
      : 'py-2 px-3 text-white hover:bg-blue-500 rounded transition-colors';
  };

  return (
    <div>
     <nav
  className={`fixed w-full z-50 top-0 left-0 border-b border-gray-200 dark:border-gray-600 transition-all duration-300 ${isScrolled ? 'bg-blue-600' : 'bg-transparent'}`}
  style={{ position: 'fixed', top: 0 }}
>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/img/navlogo.png"
              alt="Home"
              className="h-10 w-auto"
              width={300}
              height={300}
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex md:items-center space-x-6">
            <li>
              <Link
                href="/about-us"
                onClick={() => handleLinkClick('/about-us')}
                className={getLinkClassName('/about-us')}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                onClick={() => handleLinkClick('/services')}
                className={getLinkClassName('/services')}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/solutions"
                onClick={() => handleLinkClick('/solutions')}
                className={getLinkClassName('/solutions')}
              >
                Solutions
              </Link>
            </li>
            <li>
              <Link
                href="/testimonials"
                onClick={() => handleLinkClick('/testimonials')}
                className={getLinkClassName('/testimonials')}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/blogs-news"
                onClick={() => handleLinkClick('/blogs-news')}
                className={getLinkClassName('/blogs-news')}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                onClick={() => handleLinkClick('/contact-us')}
                className={getLinkClassName('/contact-us')}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/get-a-quote">
                <button className="bg-white text-blue-500 font-medium rounded-lg px-4 py-2">
                  Get a Quote
                </button>
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-end text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Off-Canvas Mobile Menu */}
        <div
  className={`fixed top-0 right-0 h-full bg-blue-500 text-white w-64 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}
>
          <button
            className="absolute top-4 right-4 text-white"
            onClick={toggleMenu}
            aria-label="Close Menu"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="flex flex-col items-start space-y-4 p-6">
            <li>
              <Link href="/" onClick={() => handleLinkClick('/')} className={getLinkClassName('/')}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                onClick={() => handleLinkClick('/about-us')}
                className={getLinkClassName('/about-us')}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                onClick={() => handleLinkClick('/services')}
                className={getLinkClassName('/services')}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/solutions"
                onClick={() => handleLinkClick('/solutions')}
                className={getLinkClassName('/solutions')}
              >
                Solutions
              </Link>
            </li>
            <li>
              <Link
                href="/testimonials"
                onClick={() => handleLinkClick('/testimonials')}
                className={getLinkClassName('/testimonials')}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/blogs-news"
                onClick={() => handleLinkClick('/blogs-news')}
                className={getLinkClassName('/blogs-news')}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                onClick={() => handleLinkClick('/contact-us')}
                className={getLinkClassName('/contact-us')}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/get-a-quote">
                <button className="bg-white text-blue-500 font-medium rounded-lg px-4 py-2">
                  Get a Quote
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
