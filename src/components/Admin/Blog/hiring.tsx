'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface Job {
    id: number;
    link: string;
    position: string;
    location: string;
    jobType: string;
}

const Hiring = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [formData, setFormData] = useState<Job | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);


    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/hiring');
            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data = await res.json();
            setJobs(data);
        } catch {
            toast.error("Error fetching jobs. Please try again later.");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const method = isEditing ? 'PUT' : 'POST';
        const id = isEditing ? formData.get('id') : null;

        try {
            const res = await fetch(`/api/hiring${id ? `?id=${id}` : ''}`, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to save job");

            fetchJobs();
            setIsEditing(false);
            setShowModal(false);
            form.reset();
            toast.success(isEditing ? "Job updated successfully!" : "Job added successfully!");
        } catch {
            toast.error("Error saving job. Please try again later.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (job: Job) => {
        setFormData(job);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/hiring?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete job");

            fetchJobs();
            toast.success("Job deleted successfully!");
        } catch {
            toast.error("Error deleting job. Please try again later.");
        }
    };

    const columns = [
        { key: "position", header: "Position", renderCell: (row: Job) => row.position },
        { key: "location", header: "Location", renderCell: (row: Job) => row.location },
        { key: "jobType", header: "Job Type", renderCell: (row: Job) => row.jobType },
        {
            key: "link",
            header: "Job Link",
            renderCell: (row: Job) => (
                <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View Job
                </a>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            renderCell: (row: Job) => (
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
            <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Hiring</h1>
            <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">

                <button
                    onClick={() => { setIsEditing(false); setShowModal(true); }}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add New Job
                </button>
            </div>

            <div className="w-full max-w-5xl mx-auto overflow-x-auto">
                <DataTable columns={columns} data={jobs} />
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Job' : 'Add Job'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="id" value={formData?.id || ''} />
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
                                name="location"
                                placeholder="Location"
                                defaultValue={formData?.location || ''}
                                required
                                className="w-full mb-2 border rounded p-2"
                            />
                            <input
                                type="text"
                                name="jobType"
                                placeholder="Job Type (Full-Time | Part-Time)"
                                defaultValue={formData?.jobType || ''}
                                required
                                className="w-full mb-2 border rounded p-2"
                            />
                            <input
                                type="text"
                                name="link"
                                placeholder="Link"
                                defaultValue={formData?.link || ''}
                                required
                                className="w-full mb-2 border rounded p-2"
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
                                    {isEditing ? 'Update' : 'Add'} Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hiring;
