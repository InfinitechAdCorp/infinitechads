"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaBriefcase, FaMapPin } from "react-icons/fa"

interface Job {
  id: number
  link: string
  position: string
  location: string
  jobType: string
}

const Hiring = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/hiring")
      if (!res.ok) throw new Error("Failed to fetch jobs")
      const data = await res.json()
      setJobs(data)
      setLoading(false)
    } catch {
      toast.error("Error fetching jobs. Please try again later.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, []) //Fixed useEffect dependency

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
            WE ARE HIRING!
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (

              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl">
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{job.position}</h3>
                  <div className="flex items-center mb-2 text-gray-600">
                    <FaMapPin className="w-5 h-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center mb-4 text-gray-600">
                    <FaBriefcase className="w-5 h-5 mr-2" />
                    <span>{job.jobType}</span>
                  </div>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Hiring