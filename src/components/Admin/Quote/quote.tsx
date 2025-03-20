'use client'

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface Plan {
  id: number;
  name: string;
  serviceTitle: string;
  description: string;
  price: number;
}

const planTypes = ["Basic", "Standard", "Advance", "Premium", "Vip", "Addons"];

const ManagePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/quote');
      if (!res.ok) throw new Error("Failed to fetch plans");
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error("Error fetching plans. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const method = isEditing ? 'PUT' : 'POST';
    const id = isEditing ? formData.get('id') : null;

    try {
      const res = await fetch(`/api/quote${id ? `?id=${id}` : ''}`, {
        method,
        body: JSON.stringify({
          name: formData.get('name'),
          serviceTitle: formData.get('serviceTitle'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price') as string),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error("Failed to save plan");

      fetchPlans();
      setIsEditing(false);
      setShowModal(false);
      form.reset();
      toast.success(isEditing ? "Plan updated successfully!" : "Plan added successfully!");
    } catch {
      toast.error("Error saving plan. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setFormData(plan);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/quote?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete plan");

      fetchPlans();
      toast.success("Plan deleted successfully!");
    } catch {
      toast.error("Error deleting plan. Please try again later.");
    }
  };

  const columns = [
    { key: 'name', header: 'Plan' },
    { key: 'serviceTitle', header: 'Service Title' },
    {
          key: "description",
          header: "Description",
          renderCell: (row: Plan) => <SeeMoreText text={row.description} maxLength={100} />,
        },
    {
      key: 'price',
      header: 'Price',
      renderCell: (row: Plan) => row.price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }),
    },
    {
      key: 'actions',
      header: 'Actions',
      renderCell: (row: Plan) => (
        <>
          <Button onClick={() => handleEdit(row)} color="blue">Edit</Button>
          <Button onClick={() => handleDelete(row.id)} color="red">Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <ToastContainer autoClose={1500} />

      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800"> Quotations</h1>

      <div className="w-full max-w-5xl mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Plan
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <DataTable columns={columns} data={plans} />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Plan' : 'Add Plan'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData?.id || ''} />

              <select name="name" defaultValue={formData?.name || ''} required className="w-full mb-2 border rounded p-2">
                <option value="">Select Plan Type</option>
                {planTypes.map((planType) => (
                  <option key={planType} value={planType}>{planType}</option>
                ))}
              </select>

              <input
                type="text"
                name="serviceTitle"
                placeholder="Service Title"
                defaultValue={formData?.serviceTitle || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <textarea
                name="description"
                placeholder="Description"
                defaultValue={formData?.description || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                defaultValue={formData?.price || ''}
                required
                className="w-full mb-2 border rounded p-2"
              />

              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                  {isEditing ? 'Save Changes' : 'Add Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
