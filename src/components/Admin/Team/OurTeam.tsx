'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';

interface TeamMember {
    id: number;
    name: string;
    title: string;
    imageUrl: string;
    credentials: string[] | string;
}

interface Certificate {
    id: number;
    imageUrl: string;
    teamMemberId: number;
}

interface TeamMemberFormData extends Partial<TeamMember> {
    imageFile?: File | null;
}

const TeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [formData, setFormData] = useState<TeamMemberFormData>({});
    const [editMode, setEditMode] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [certificateModalOpen, setCertificateModalOpen] = useState(false);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [newCertificateFiles, setNewCertificateFiles] = useState<File[]>([]);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const res = await fetch('/api/team');
                if (!res.ok) throw new Error("Failed to fetch team members");
                const data = await res.json();

                const updatedTeamMembers = await Promise.all(data.map(async (member: TeamMember) => {
                    if (member.imageUrl) {
                        const imageRes = await fetch(member.imageUrl);
                        const imageBlob = await imageRes.blob();
                        member.imageUrl = URL.createObjectURL(imageBlob);
                    }
                    return member;
                }));

                setTeamMembers(updatedTeamMembers);
            } catch {
                setTeamMembers([]);
            }
        };

        fetchTeamMembers();
    }, []);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (selectedMemberId !== null) {
                try {
                    const res = await fetch(`/api/team?id=${selectedMemberId}`);
                    if (!res.ok) throw new Error("Failed to fetch certificates");
                    const certData = await res.json();

                    const updatedCertificates = await Promise.all(certData.map(async (certificate: Certificate) => {
                        if (certificate.imageUrl) {
                            const imageRes = await fetch(certificate.imageUrl);
                            const imageBlob = await imageRes.blob();
                            certificate.imageUrl = URL.createObjectURL(imageBlob);
                        }
                        return certificate;
                    }));

                    setCertificates(updatedCertificates);
                } catch (error) {
                    console.error('Failed to fetch certificates:', error);
                    setCertificates([]);
                }
            }
        };

        fetchCertificates();
    }, [selectedMemberId]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, imageFile: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/team/${formData.id}` : '/api/team';

        if (!formData.id && editMode) {
            toast.error('ID is required for editing');
            return;
        }

        const formDataToSend = new FormData();

        formDataToSend.append('name', formData.name || '');
        formDataToSend.append('title', formData.title || '');
        const credentials = Array.isArray(formData.credentials) ? formData.credentials.join(',') : formData.credentials || '';
        formDataToSend.append('credentials', credentials);
        if (formData.imageFile) {
            formDataToSend.append('imageFile', formData.imageFile);
        }

        try {
            console.log('Submitting form with data:', formDataToSend);

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });
            console.log(formDataToSend);

            console.log('Response from server:', response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
            }

            const newMember = await response.json();
            console.log('New member data:', newMember);

            setTeamMembers((prev) =>
                editMode ? prev.map((member) => (member.id === newMember.id ? newMember : member)) : [...prev, newMember]
            );

            setFormData({});
            setEditMode(false);
            setModalOpen(false);
            toast.success(editMode ? 'Team member updated successfully!' : 'Team member added successfully!');
        } catch (error) {
            console.error('Failed to add/update the team member:', error);
            toast.error('Failed to add/update the team member.');
        } finally {
            setIsSaving(false);
        }

    };

    const handleEdit = (member: TeamMember) => {
        setFormData(member);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const response = await fetch(`/api/team?id=${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setTeamMembers((prev) => prev.filter((member) => member.id !== id));
            toast.success('Team member deleted successfully!');
        } else {
            toast.error('Failed to delete the team member.');
        }
    };

    const handleDeleteCertificate = async (certificateId: number, teamMemberId: number) => {
        const response = await fetch(`/api/team?id=${teamMemberId}&certificateId=${certificateId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setCertificates((prev) =>
                prev.filter((certificate) => certificate.id !== certificateId)
            );
            toast.success('Certificate deleted successfully!');
        } else {
            toast.error('Failed to delete the certificate.');
        }
    };


    const handleCertificateClick = async (teamMemberId: number) => {
        setSelectedMemberId(teamMemberId);
        setCertificateModalOpen(true);
        try {
            const response = await fetch(`/api/team?id=${teamMemberId}`);
            const data = await response.json();
            setCertificates(Array.isArray(data) ? data : []);
        } catch {
            setCertificates([]);
        }

    };

    const handleCertificateFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewCertificateFiles(Array.from(e.target.files));
        }
    };

    const handleAddCertificates = async (teamMemberId: number, files: File[]) => {
        try {
            const formData = new FormData();
            formData.append('id', teamMemberId.toString());

            files.forEach(file => {
                formData.append('certificateFiles', file);
            });

            const response = await fetch(`/api/team?id=${teamMemberId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add certificates');
            }

            toast.success('Certificates added successfully!');
            setCertificateModalOpen(false);
        } catch (error) {
            console.error('Failed to add certificates:', error);
            toast.error('Failed to add certificates. Please try again.');
        }
    };

    const closeCertificateModal = () => {
        setCertificateModalOpen(false);
        setNewCertificateFiles([]);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("lightbox2");
        }
    }, []);

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'title', header: 'Position' },
        {
            key: 'image', header: 'Image', renderCell: (row: TeamMember) => (
                <div className="mx-auto">
                    <a
                        data-lightbox="gallery"
                        data-title={row.title}
                        href={row.imageUrl}
                    >
                        <img
                            src={row.imageUrl}
                            alt={row.title}
                            className="h-full w-full max-h-12 object-contain"
                        />
                    </a>
                </div>
            ),
        },
        {
            key: 'actions', header: 'Actions', renderCell: (row: TeamMember) => (
                <>
                    <Button onClick={() => handleEdit(row)} color="blue">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(row.id)} color="red">
                        Delete
                    </Button>
                    <button
                        onClick={() => handleCertificateClick(row.id)}
                        className="text-white w-32 rounded-lg text-sm py-1 me-2 bg-green-600 hover:bg-green-700"
                    >
                        View Certificates
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center py-6 w-full">
            <ToastContainer autoClose={1500} />
            <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Team Members</h1>
            <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">

                <button
                    onClick={() => {
                        setModalOpen(true);
                        setEditMode(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add New Team Member
                </button>
            </div>
            <div className="w-full max-w-5xl mx-auto overflow-x-auto">
                <DataTable columns={columns} data={teamMembers} />
            </div>

            {/* Certificate Modal */}
            {
                certificateModalOpen && selectedMemberId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-3xl">
                            <h2 className="mb-4 text-lg font-bold text-gray-800">Certificates</h2>
                            <div className="mb-4">
                                {certificates.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {certificates.map((certificate) => (
                                            <div key={certificate.id} className="relative flex justify-center">
                                                <Image
                                                    src={certificate.imageUrl}
                                                    alt="Certificate"
                                                    width={200}
                                                    height={120}
                                                    className="mb-2"
                                                />
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteCertificate(certificate.id, selectedMemberId)}
                                                    className="absolute top-2 right-2 flex items-center px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No certificates found for this member.</p>
                                )}
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={handleCertificateFilesChange}
                                className="mb-4"
                            />
                            <button
                                onClick={() =>
                                    newCertificateFiles.length > 0 &&
                                    handleAddCertificates(selectedMemberId, newCertificateFiles)
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Add Certificates
                            </button>
                            <button
                                onClick={closeCertificateModal}
                                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }


            {
                modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md"
                        >
                            <h2 className="mb-4 text-lg font-bold text-gray-800">
                                {editMode ? 'Edit Team Member' : 'Add New Team Member'}
                            </h2>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700">Position</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Enter Position"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700">Credentials</label>
                                <textarea
                                    name="credentials"
                                    value={formData.credentials || ''}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Enter credentials, separated by commas"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-700">Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                                    disabled={isSaving}
                                >
                                    {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                                    {editMode ? 'Update' : 'Add'} Team Member
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div >
    );
};

export default TeamMembers;
