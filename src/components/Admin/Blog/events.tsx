'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface Event {
  id: number;
  image: string;
  title: string;
  content: string;
  authorName: string;
  date: Date;
}

const LatestEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();

      const updatedEvents = await Promise.all(data.map(async (event: Event) => {
        if (event.image) {
          const imageRes = await fetch(event.image);
          const imageBlob = await imageRes.blob();
          event.image = URL.createObjectURL(imageBlob);
        }
        return event;
      }));

      setEvents(updatedEvents);
    } catch {
      toast.error("Error fetching events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const method = isEditing ? 'PUT' : 'POST';
    const id = isEditing ? formData.get('id') : null;

    try {
      const res = await fetch(`/api/events${id ? `?id=${id}` : ''}`, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save event");

      fetchEvents();
      setIsEditing(false);
      setShowModal(false);
      form.reset();
      toast.success(isEditing ? "Event updated successfully!" : "Event added successfully!");
    } catch {
      toast.error("Error saving event. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete event");

      fetchEvents();
      toast.success("Event deleted successfully!");
    } catch {
      toast.error("Error deleting event. Please try again later.");
    }
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  const columns = [
    { key: "title", header: "Title", renderCell: (row: Event) => row.title },
    {
      key: "description",
      header: "Description",
      renderCell: (row: Event) => <SeeMoreText text={row.content} maxLength={100} />,
    },
    { key: "author", header: "Author", renderCell: (row: Event) => row.authorName },
    {
      key: "date",
      header: "Date",
      renderCell: (row: Event) => new Date(row.date).toLocaleDateString(),
    },
    {
      key: "image",
      header: "Image",
      renderCell: (row: Event) =>
        row.image ? (
          <div className="mx-auto">
            <img
              src={row.image}
              alt={row.title}
              width={60}
              height={40}
              onClick={() => handleImageClick(row.image)}
              className="cursor-pointer"
            />
          </div>
        ) : (
          "No Image"
        ),
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: (row: Event) => (
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
      <ToastContainer autoClose={1500} />
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Latest Events</h1>
      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Event
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={events} />
      </div>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Event' : 'Add Event'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData?.id || ''} />

              <input
                type="text"
                name="title"
                placeholder="Title"
                defaultValue={formData?.title || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="text"
                name="content"
                placeholder="Description"
                defaultValue={formData?.content || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="text"
                name="authorName"
                placeholder="Author Name"
                defaultValue={formData?.authorName || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="date"
                name="date"
                defaultValue={formData?.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="file"
                name="imageFile"
                required={!isEditing}
                className="w-full mb-4"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                  {isEditing ? 'Update' : 'Add'} Event
                </button>
              </div>
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
    </div>
  );
};

export default LatestEvents;
