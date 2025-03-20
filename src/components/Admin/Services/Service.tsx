'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface Service {
  id: number;
  image: string;
  title: string;
  description: string;
}

const ServiceTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();

      const updatedServices = await Promise.all(data.map(async (service: Service) => {
        if (service.image) {
          const imageRes = await fetch(service.image);
          const imageBlob = await imageRes.blob();
          service.image = URL.createObjectURL(imageBlob);
        }
        return service;
      }));

      setServices(updatedServices);
    } catch {
      toast.error("Error fetching services. Please try again later.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const method = isEditing ? 'PUT' : 'POST';
    const id = isEditing ? formData.get('id') : null;

    try {
      const res = await fetch(`/api/services${id ? `?id=${id}` : ''}`, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save service");

      fetchServices();
      setIsEditing(false);
      setShowModal(false);
      form.reset();
      toast.success(isEditing ? "Service updated successfully!" : "Service added successfully!");
    } catch {
      toast.error("Error saving service. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete service");

      fetchServices();
      toast.success("Service deleted successfully!");
    } catch {
      toast.error("Error deleting service. Please try again later.");
    }
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("lightbox2");
    }
  }, []);

  const columns = [
    { key: 'title', header: 'Service' },
    {
      key: "description",
      header: "Description",
      renderCell: (row: Service) => <SeeMoreText text={row.description} maxLength={100} />,
    },
    {
      key: 'image', header: 'Image', renderCell: (row: Service) => (
        <div className="mx-auto">
          <a
            data-lightbox="gallery"
            data-title={row.title}
            href={row.image}
          >
            <img
              src={row.image}
              alt={row.title}
              className="h-full w-full max-h-12 object-contain"
            />
          </a>
        </div>
      ),
    },
    {
      key: 'actions', header: 'Actions', renderCell: (row: Service) => (
        <>
          <Button onClick={() => handleEdit(row)} color="blue">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="red">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <ToastContainer autoClose={1500} />

      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Our Services</h1>

      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Service
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={services} />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData?.id || ''} />

              <input
                type="text"
                name="title"
                placeholder="Title"
                defaultValue={formData?.title || ''}
                required
                className="w-full mb-2 border rounded p-2 focus:ring focus:ring-blue-300"
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={formData?.description || ''}
                required
                className="w-full mb-2 border rounded p-2 focus:ring focus:ring-blue-300"
              />

              <input
                type="file"
                name="image"
                required={!isEditing}
                className="w-full mb-4 focus:outline-none"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 focus:outline-none"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                  {isEditing ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative">
            <button onClick={closeModal} className="absolute top-0 right-1 p-3 text-white text-2xl focus:outline-none">
              ×
            </button>
            <Image
              src={modalImage}
              alt="Large View"
              width={500}
              height={500}
              className="object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );

};

export default ServiceTable;