'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Partner = {
  id: string | number;
  imageUrl: string;
};

const PartnerComponent = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPartners(data);
    } catch {
      toast.error('Error fetching partners.');
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    if (!file) return toast.error('Please select a file.');
    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error();
      fetchPartners();
      setShowModal(false);
      toast.success('Partner added successfully!');
    } catch {
      toast.error('Error adding partner.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchPartners();
      toast.success('Partner deleted successfully!');
    } catch {
      toast.error('Error deleting partner.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col items-center py-6 w-full">
      <ToastContainer autoClose={1500} />
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Partner Management</h1>

      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">

        <button
          onClick={() => setShowModal(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Partner
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl mx-auto sm:mx-4">
        {partners.map((partner) => (
          <div key={partner.id} className="relative border p-2 shadow-lg rounded-md">
            <img
              src={partner.imageUrl}
              alt={`Partner ${partner.id}`}
              // width={200}
              // height={120}
              className="h-[120px] w-[200px] object-contain cursor-pointer rounded-md hover:opacity-90"
              onClick={() => setModalImage(partner.imageUrl)}
            />
            <button
              onClick={() => handleDelete(partner.id)}
              className="absolute top-2 right-2 flex items-center px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold">Add Partner</h2>
            <form onSubmit={handleAdd}>
              <input
                type="file"
                onChange={handleFileChange}
                required
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
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-0 right-1 p-3 text-white text-2xl"
            >
              x
            </button>
            <Image
              src={modalImage}
              alt="Large View"
              width={500}
              height={500}
              className="object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerComponent;