'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import Image from 'next/image';

interface VideoTestimonial {
  id: number;
  videoUrl: string;
  thumbnail: string;
  clientName: string;
}

const VideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [formData, setFormData] = useState<Partial<VideoTestimonial & { videoUrl: File | string; thumbnailUrl: File | string }>>({
    videoUrl: '',
    thumbnailUrl: '',
    clientName: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/VideoTestimonial');
        const data = await response.json();
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
      }
    };

    fetchTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = editMode ? 'PATCH' : 'POST';
    const id = editMode ? formData.id : null;

    const formDataToSend = new FormData();

    if (formData.videoUrl) {
      formDataToSend.append('videoUrl', formData.videoUrl);
    }

    if (formData.thumbnailUrl) {
      formDataToSend.append('thumbnailUrl', formData.thumbnailUrl);
    }

    formDataToSend.append('clientName', formData.clientName || '');

    try {
      const response = await fetch(`/api/VideoTestimonial${id ? `?id=${id}` : ''}`, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to add/update the video testimonial.');
      }

      const newTestimonial = await response.json();

      setTestimonials((prev) =>
        editMode
          ? prev.map((testimonial) => (testimonial.id === newTestimonial.id ? newTestimonial : testimonial))
          : [...prev, newTestimonial]
      );

      setFormData({ videoUrl: '', thumbnailUrl: '', clientName: '' });
      setEditMode(false);
      setModalOpen(false);

      toast.success(editMode ? 'Video testimonial updated successfully!' : 'Video testimonial added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add/update the video testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (testimonial: VideoTestimonial) => {
    setFormData(testimonial);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/VideoTestimonial?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTestimonials((prev) => prev.filter((testimonial) => testimonial.id !== id));
      toast.success('Video testimonial deleted successfully!');
    } else {
      toast.error('Failed to delete the video testimonial.');
    }
  };

  const handleImageClick = (thumbnail: string) => {
    setModalImage(thumbnail);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const columns = [
    { key: "clientName", header: "Client Name", renderCell: (row: VideoTestimonial) => row.clientName },
    {
      key: "videoUrl",
      header: "Video",
      renderCell: (row: VideoTestimonial) => (
        <a href={row.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Watch Video
        </a>
      ),
    },
    {
      key: "thumbnail",
      header: "Thumbnail",
      renderCell: (row: VideoTestimonial) =>
        row.thumbnail ? (
          <div className="mx-auto">
            <img
              src={row.thumbnail}
              alt={row.clientName}
              width={60}
              height={40}
              onClick={() => handleImageClick(row.thumbnail)}
              className="cursor-pointer"
            />
          </div>
        ) : (
          "No Thumbnail"
        ),
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: (row: VideoTestimonial) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEdit(row)} color="blue">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="red">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Video Testimonials</h1>
      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setModalOpen(true); setEditMode(false); }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Video Testimonial
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={testimonials} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{editMode ? 'Edit' : 'Add'} Video Testimonial</h2>
            <form onSubmit={handleSubmit}>
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                placeholder="Enter client name"
                value={formData.clientName || ''}
                onChange={handleInputChange}
                required
                className="w-full mb-2 border rounded p-2"
              />
              <label>Video</label>
              <input
                type="file"
                name="videoUrl"
                onChange={handleInputChange}
                required={!editMode}
                accept="video/*"
                className="w-full mb-2 border rounded p-2"
              />
              <label>Thumbnail</label>
              <input
                type="file"
                name="thumbnailUrl"
                onChange={handleInputChange}
                required={!editMode}
                accept="image/*"
                className="w-full mb-2 border rounded p-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                disabled={isSaving}
              >
                {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                {editMode ? 'Update' : 'Add'} Video Testimonial
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative">
            <button onClick={closeModal} className="absolute top-0 right-1 p-3 text-white text-2xl">x</button>
            <Image src={modalImage} alt="Large View" width={500} height={500} className="object-contain" />
          </div>
        </div>
      )}

      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default VideoTestimonials;