"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface Testimonial {
  imageUrl: string
  name: string
  position: string
  company: string
  feedback: string
}

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/Testimonial")
        if (!response.ok) throw new Error("Failed to fetch testimonials")
        const data: Testimonial[] = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  if (!testimonials.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="ml-4">
          <div className="w-1/2 h-6 mb-2 bg-gray-200 animate-pulse"></div>
          <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    )

  return (
    <div className="mt-6 font-sans">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">What Our Happy Clients Say</h2>
          <p className="mt-4 text-gray-600">
            Discover how we&apos;ve helped our clients achieve their goals and exceed their expectations.
          </p>
        </div>

        <div className="mt-12 relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialSlide key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialSlide: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="w-full flex-shrink-0 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Image
            src={testimonial.imageUrl || "/placeholder.svg"}
            className="w-24 h-24 rounded-full object-cover shadow-lg"
            width={96}
            height={96}
            alt={`${testimonial.name}'s testimonial`}
          />
          <div className="mt-4">
            <h4 className="text-xl font-semibold text-gray-800">{testimonial.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {testimonial.position}, {testimonial.company}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 leading-relaxed">{testimonial.feedback}</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCarousel