'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  feedback: string;
  imageUrl: string;
}

const TestimonialTable = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [formData, setFormData] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/Testimonial');
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();

      const updatedTestimonials = await Promise.all(data.map(async (testimonial: Testimonial) => {
        if (testimonial.imageUrl) {
          const imageRes = await fetch(testimonial.imageUrl);
          const imageBlob = await imageRes.blob();
          testimonial.imageUrl = URL.createObjectURL(imageBlob);
        }
        return testimonial;
      }));

      setTestimonials(updatedTestimonials);
    } catch {
      toast.error("Error fetching testimonials. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const method = isEditing ? 'PUT' : 'POST';
    const id = isEditing ? formData.get('id') : null;

    try {
      const res = await fetch(`/api/Testimonial${id ? `?id=${id}` : ''}`, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save testimonial");

      fetchTestimonials();
      setIsEditing(false);
      setShowModal(false);
      form.reset();
      toast.success(isEditing ? "Testimonial updated successfully!" : "Testimonial added successfully!");
    } catch {
      toast.error("Error saving testimonial. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/Testimonial?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete testimonial");

      fetchTestimonials();
      toast.success("Testimonial deleted successfully!");
    } catch {
      toast.error("Error deleting testimonial. Please try again later.");
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
    { key: "name", header: "Name", renderCell: (row: Testimonial) => row.name },
    { key: "position", header: "Position", renderCell: (row: Testimonial) => row.position },
    { key: "company", header: "Company", renderCell: (row: Testimonial) => row.company },
    {
      key: "feedback",
      header: "Feedback",
      renderCell: (row: Testimonial) => <SeeMoreText text={row.feedback} maxLength={100} />,
    },
    {
      key: "imageUrl",
      header: "Image",
      renderCell: (row: Testimonial) =>
        row.imageUrl ? (
          <div className="mx-auto">
            <img
              src={row.imageUrl}
              alt={row.name}
              width={60}
              height={60}
              onClick={() => handleImageClick(row.imageUrl)}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          "No Image"
        ),
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: (row: Testimonial) => (
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
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Testimonials</h1>
      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">

        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Testimonial
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={testimonials} />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData?.id || ''} />

              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={formData?.name || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="text"
                name="position"
                placeholder="Position"
                defaultValue={formData?.position || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="text"
                name="company"
                placeholder="Company"
                defaultValue={formData?.company || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <textarea
                name="feedback"
                placeholder="Feedback"
                defaultValue={formData?.feedback || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="file"
                name="image"
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
                  {isEditing ? 'Update' : 'Add'} Testimonial
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

export default TestimonialTable;
