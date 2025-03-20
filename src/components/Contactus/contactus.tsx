"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Contactus = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
  
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, number, message }),
      });
  
      const textResponse = await response.text();
      
      if (response.ok) {
        // Success: Show success toast and reset form fields
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setNumber("");
        setMessage("");
      } else {
        let errorMessage = "Failed to send message.";
        try {
          const errorData = JSON.parse(textResponse);
          errorMessage = errorData.error || errorMessage;
        } catch {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      // Handle fetch errors (e.g., network issues)
      toast.error("Something went wrong. Please try again.");
    } finally {
      // Always stop the loading animation (whether successful or not)
      setIsSending(false);
    }
  };
  

  return (
    <section className="py-12">
      <ToastContainer autoClose={1500} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className="bg-white p-8 shadow-md rounded-lg"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-extrabold text-[#004f83] mb-6">Contact Us</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004f83]"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004f83]"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004f83]"
                  placeholder="Enter your phone number"
                  maxLength={11}
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setNumber(value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Message</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004f83]"
                  placeholder="Enter your message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button
  type="submit"
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
  disabled={isSending}
>
  {isSending && (
    <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>
  )}
  Send Message
</button>
  
            </form>
          </div>
          <div
            className="rounded-lg overflow-hidden shadow-md"
            data-aos="fade-up"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.686618330031!2d121.01093307590381!3d14.559904978070104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90b830e5f29%3A0x89fe307dfecd3c0d!2sCampos%20Rueda%20Building!5e0!3m2!1sen!2sph!4v1721716690771!5m2!1sen!2sph"
              width="100%"
              height={600}
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="bg-white p-6 text-center mt-4 rounded-lg shadow-md">
              <a
                href="https://maps.app.goo.gl/fVLeGtpQ55YQSK318"
                className="text-gray-700 mt-2"
                target="_blank"
              >
                Unit 202, Campos Rueda Building, Urban Avenue, Makati City, Philippines
              </a>
              <br />
              <a
                href="tel:(02) 7001-6157"
                className="text-gray-700 mt-1"
                target="_blank"
              >
                Phone: +63962-253-0149
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactus;
