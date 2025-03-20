"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MdDashboard, MdRequestQuote, MdLocalOffer, MdRateReview } from "react-icons/md";
import { BiSolidBriefcaseAlt2, BiSolidBusiness } from "react-icons/bi";
import { RiTeamFill } from "react-icons/ri";
import { FaListAlt, FaMicroblog } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isBlogOpen, setBlogOpen] = useState(false);
  const [isTestimonialsOpen, setTestimonialsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleBlogDropdown = () => setBlogOpen((prev) => !prev);
  const toggleTestimonialsDropdown = () => setTestimonialsOpen((prev) => !prev);

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a
                href="https://www.facebook.com/people/Infinitech-Advertising-Corp/100080647808810/?mibextid=ZbWKwL"
                target="_blank"
                className="flex items-center ms-2 md:me-24"
              >
                <img
                  src="/img/logooo.png"
                  className="h-8 sm:h-10 sm:w-12 lg:h-10 lg:w-60 me-3"
                  alt="Logo"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white border-r border-gray-200 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <Link
              href="/admin/Dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <MdDashboard />
              <span className="ms-3">Dashboard</span>
            </Link>
            <Link
              href="/admin/quotation"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <MdRequestQuote />
              <span className="ms-3">Quotation</span>
            </Link>
            <Link
              href="/admin/admin-services"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <MdLocalOffer />
              <span className="ms-3">Services</span>
            </Link>
            <Link
              href="/admin/solutions"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <BiSolidBriefcaseAlt2 />
              <span className="ms-3">Solutions</span>
            </Link>
            <Link
              href="/admin/Our-Team"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <RiTeamFill />
              <span className="ms-3">Our Team</span>
            </Link>
            {/* <Link
              href="/admin/Team_Details"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <FaListAlt />
              <span className="ms-3">Team Details</span>
            </Link> */}
            <Link
              href="/admin/certificatess"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <PiCertificateFill />
              <span className="ms-3">Our Certificates</span>
            </Link>
            <Link
              href="/admin/partners"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              onClick={closeSidebar}
            >
              <BiSolidBusiness />
              <span className="ms-3">Our Partners</span>
            </Link>
            <li>
              <button
                onClick={toggleBlogDropdown}
                className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaMicroblog />
                <span className="ms-3">Blog</span>
                <svg
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${isBlogOpen ? "rotate-180" : ""
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 5.5l7 7 7-7H1.5z" />
                </svg>
              </button>
              {isBlogOpen && (
                <ul className="ml-6 space-y-1 mt-1">
                  <Link
                    href="/admin/latest-blog"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Latest News
                  </Link>
                  <Link
                    href="/admin/event"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Events
                  </Link>
                  <Link
                    href="/admin/eventvid"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Events Video
                  </Link>
                  <Link
                    href="/admin/hiring"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Hiring
                  </Link>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={toggleTestimonialsDropdown}
                className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <MdRateReview />
                <span className="ms-3">Testimonials</span>
                <svg
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${isTestimonialsOpen ? "rotate-180" : ""
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 5.5l7 7 7-7H1.5z" />
                </svg>
              </button>
              {isTestimonialsOpen && (
                <ul className="ml-6 space-y-1 mt-1">
                  <Link
                    href="/admin/ClientFeedback"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Feedbacks
                  </Link>
                  <Link
                    href="/admin/VideoTestimonial"
                    className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Video Testimonial
                  </Link>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
