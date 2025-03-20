'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';

interface eventvid {
  id: number;
  videoUrl: string;
  title: string;
  thumbnail: string
}

const EventVid = () => {
  const [eventvids, setEventVid] = useState<eventvid[]>([]);
  const [formData, setFormData] = useState<Partial<eventvid & { videoUrl: File | string; thumbnailUrl: File | string }>>({
    videoUrl: '',
    thumbnailUrl: '',
    title: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEventVid = async () => {
      try {
        const response = await fetch('/api/eventvid');
        const data = await response.json();
        console.log("Fetched eventvids:", data);
        setEventVid(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching eventvids:", error);
        setEventVid([]);
      }
    };

    fetchEventVid();
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

  const handleImageClick = (thumbnail: string) => {
    setModalImage(thumbnail);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
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

    formDataToSend.append('title', formData.title || '');

    try {
      const response = await fetch(`/api/eventvid${id ? `?id=${id}` : ''}`, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to add/update the video testimonial.');
      }

      const newEventVid = await response.json();

      setEventVid((prev) =>
        editMode
          ? prev.map((testimonial) => (testimonial.id === newEventVid.id ? newEventVid : testimonial))
          : [...prev, newEventVid]
      );

      setFormData({ videoUrl: '', thumbnailUrl: '', title: '' });
      setEditMode(false);
      setModalOpen(false);

      toast.success(editMode ? 'Video clip updated successfully!' : 'Video clip added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add/update the video event.');
    } finally {
      setIsSaving(false);
    }
  };



  const handleEdit = (eventvid: eventvid) => {
    setFormData(eventvid);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/eventvid?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setEventVid((prev) => prev.filter(eventvid => eventvid.id !== id));
      toast.success('Video clip deleted successfully!');
    } else {
      toast.error('Failed to delete the video clip.');
    }
  };

  const columns = [
    { key: "title", header: "Title", renderCell: (row: eventvid) => row.title },
    {
      key: "videoUrl",
      header: "Video",
      renderCell: (row: eventvid) => (
        <a href={row.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Watch Video
        </a>
      ),
    },
    {
      key: "thumbnail",
      header: "Thumbnail",
      renderCell: (row: eventvid) =>
        row.thumbnail ? (
          <div className="mx-auto">
            <img
              src={row.thumbnail}
              alt={row.title}
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
      renderCell: (row: eventvid) => (
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
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Video Clips</h1>
      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setModalOpen(true); setEditMode(false); }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Video Clips
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={eventvids} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{editMode ? 'Edit' : 'Add'} Video Clips</h2>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title || ''}
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
                {editMode ? 'Update' : 'Add'} Video Clips
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

export default EventVid;
