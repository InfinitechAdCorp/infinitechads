'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';

interface Solution {
  id: number;
  name: string;
  link: string;
  imageUrl: string;
}

const Solution = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [formData, setFormData] = useState<Solution | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);


  const fetchSolutions = async () => {
    try {
      const res = await fetch('/api/solutions');
      if (!res.ok) throw new Error("Failed to fetch solutions");
      const data = await res.json();

      const updatedSolutions = await Promise.all(data.map(async (solution: Solution) => {
        if (solution.imageUrl) {
          const imageRes = await fetch(solution.imageUrl);
          const imageBlob = await imageRes.blob();
          solution.imageUrl = URL.createObjectURL(imageBlob);
        }
        return solution;
      }));

      setSolutions(updatedSolutions);
    } catch {
      toast.error("Error fetching solutions. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const method = isEditing ? 'PUT' : 'POST';
    const id = isEditing ? formData.get('id') : null;

    try {
      const res = await fetch(`/api/solutions${id ? `?id=${id}` : ''}`, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save solution");

      fetchSolutions();
      setIsEditing(false);
      setShowModal(false);
      form.reset();
      toast.success(isEditing ? "Solution updated successfully!" : "Solution added successfully!");
    } catch {
      toast.error("Error saving solution. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (solution: Solution) => {
    setFormData(solution);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/solutions?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete solution");

      fetchSolutions();
      toast.success("Solution deleted successfully!");
    } catch {
      toast.error("Error deleting solution. Please try again later.");
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
    { key: 'name', header: 'Solution' },
    {
      key: 'link', header: 'Link', renderCell: (row: Solution) => (
        <div className="mx-auto">
          <a
            href={row.link}
            target="_blank"
          >
            <span className="underline text-blue-600">Link</span>
          </a>
        </div>
      ),
    },
    {
      key: 'image', header: 'Image', renderCell: (row: Solution) => (
        <div className="mx-auto">
          <a
            data-lightbox="gallery"
            data-title={row.name}
            href={row.imageUrl}
          >
            <img
              src={row.imageUrl}
              alt={row.name}
              className="h-full w-full max-h-12 object-contain"
            />
          </a>
        </div>
      ),
    },
    {
      key: 'actions', header: 'Actions', renderCell: (row: Solution) => (
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
    <div className="flex flex-col items-center justify-center py-6 w-full px-4 sm:px-6 md:px-8">
      <ToastContainer autoClose={1500} />

      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Our Solutions</h1>

      <div className="w-full max-w-5xl mx-auto sm:mx-4 flex justify-end mb-6">
        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Add New Solution
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={solutions} />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-800">{isEditing ? 'Edit Solution' : 'Add Solution'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData?.id || ''} />

              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={formData?.name || ''}
                required
                className="w-full mb-2 border rounded p-2 text-sm sm:text-base"
              />

              <input
                type="text"
                name="link"
                placeholder="Link"
                defaultValue={formData?.link || ''}
                required
                className="w-full mb-2 border rounded p-2 text-sm sm:text-base"
              />

              <input
                type="file"
                name="imageFile"
                required={!isEditing}
                className="w-full mb-4 text-sm sm:text-base"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                  {isEditing ? 'Update' : 'Add'} Solution
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

export default Solution;
