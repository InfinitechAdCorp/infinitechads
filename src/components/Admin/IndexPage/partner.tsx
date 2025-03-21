"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [blobToken, setBlobToken] = useState<string | undefined>("");

  // New state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    id: string | number;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

    console.log("BLOB Token from useEffect:", token);
    setBlobToken(token);
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPartners(data);
    } catch {
      toast.error("Error fetching partners.");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("imageFile", file);

    if (blobToken) {
      formData.append("blobToken", blobToken);
    } else {
      console.error("❌ Blob token is missing!");
      toast.error("Error: Blob token is missing.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      fetchPartners();
      setShowModal(false);
      toast.success("Partner added successfully!");
    } catch (error) {
      console.error("❌ Error adding partner:", error);
      toast.error("Error adding partner.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (partner: Partner) => {
    setShowDeleteConfirm(partner);
  };

  const handleDelete = async (id: string | number) => {
    if (!blobToken) {
      toast.error("Error: Blob token is missing.");
      return;
    }

    try {
      const res = await fetch(
        `/api/partners?id=${id}&blobToken=${encodeURIComponent(blobToken)}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      fetchPartners();
      toast.success("Partner deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting partner:", error);
      toast.error("Error deleting partner.");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col items-center py-6 w-full">
      <ToastContainer autoClose={1500} />
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">
        Partner Management
      </h1>

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
          <div
            key={partner.id}
            className="relative border p-2 shadow-lg rounded-md"
          >
            <img
              src={partner.imageUrl}
              alt={`Partner ${partner.id}`}
              className="h-[120px] w-[200px] object-contain cursor-pointer rounded-md hover:opacity-90"
              onClick={() => setModalImage(partner.imageUrl)}
            />
            <button
              onClick={() => confirmDelete(partner)}
              className="absolute top-2 right-2 flex items-center px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
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
                  {isSaving && (
                    <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>
                  )}
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-sm">
            <h2 className="mb-4 text-lg font-bold text-center">
              Are you sure you want to delete this partner?
            </h2>
            <img
              src={showDeleteConfirm.imageUrl}
              alt="Partner to delete"
              className="w-[200px] h-[120px] object-contain mx-auto mb-4 rounded-md"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large Image Modal */}
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
