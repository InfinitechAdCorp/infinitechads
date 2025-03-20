'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

interface TeamMember {
    id: number;
    name: string;
}

interface TeamMemberImage {
    imageUrl: string;
}

interface TeamMemberDetail {
    id?: number | null;
    officeAddress: string;
    mobileNumber: string;
    telephoneNumber: string;
    websiteLink: string;
    email: string;
    teamMemberId: number;
    images?: TeamMemberImage[] | null;
}

const TeamMemberTable = () => {
    const [formData, setFormData] = useState<TeamMemberDetail>({
        officeAddress: '',
        mobileNumber: '',
        telephoneNumber: '',
        websiteLink: '',
        email: '',
        teamMemberId: 0,
        images: [],
    });
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [teamMemberDetails, setTeamMemberDetails] = useState<TeamMemberDetail[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch('/api/team');
            if (!res.ok) throw new Error('Failed to fetch team members');
            const data = await res.json();
            setTeamMembers(data);
        } catch {
            toast.error("Error fetching team members. Please try again later.");
        }
    };

    const fetchTeamMemberDetails = async () => {
        try {
            const res = await fetch('/api/team_details');
            if (!res.ok) throw new Error('Failed to fetch team member details');
            const data = await res.json();
            setTeamMemberDetails(data);
        } catch {
            toast.error("Error fetching team member details. Please try again later.");
        }
    };

    useEffect(() => {
        fetchTeamMembers();
        fetchTeamMemberDetails();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('teamMemberId', String(formData.teamMemberId));
        formDataToSend.append('officeAddress', formData.officeAddress);
        formDataToSend.append('mobileNumber', formData.mobileNumber || '');
        formDataToSend.append('telephoneNumber', formData.telephoneNumber || '');
        formDataToSend.append('websiteLink', formData.websiteLink || '');
        formDataToSend.append('email', formData.email || '');

        formData.images?.forEach((image) => {
            formDataToSend.append('images', image.imageUrl);
        });

        const method = isEditing ? 'PUT' : 'POST';
        const id = isEditing ? formData.id : null;

        try {
            const res = await fetch(`/api/team_details${id ? `?id=${id}` : ''}`, {
                method,
                body: formDataToSend,
            });
            if (!res.ok) throw new Error("Failed to save team member details");

            fetchTeamMembers();
            fetchTeamMemberDetails();
            setIsEditing(false);
            setShowModal(false);
            toast.success(isEditing ? "Team member details updated successfully!" : "Team member details added successfully!");
        } catch {
            toast.error("Error saving team member details. Please try again later.");
        }
    };

    const handleEdit = (teamMember: TeamMember) => {
        const detail = teamMemberDetails.find(detail => detail.teamMemberId === teamMember.id);
        setFormData(detail || {
            id: null,
            officeAddress: '',
            mobileNumber: '',
            telephoneNumber: '',
            websiteLink: '',
            email: '',
            teamMemberId: teamMember.id,
            images: [],
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/team_details?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete team member detail");

            setTeamMemberDetails(prev => prev.filter(detail => detail.id !== id));
            toast.success("Team member detail deleted successfully!");
        } catch {
            toast.error("Error deleting team member detail. Please try again later.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => ({
                imageUrl: URL.createObjectURL(file),
            }));
            setFormData({ ...formData, images: newImages });
        }
    };

    const filteredTeamMembers = teamMembers.filter(member =>
        teamMemberDetails.some(detail => detail.teamMemberId === member.id)
    );

    return (
        <div className="flex flex-col items-center justify-center py-6 w-full">
            <ToastContainer autoClose={1500} />
            <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Team Members Details</h1>

            <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
                <button
                    onClick={() => { setIsEditing(false); setShowModal(true); }}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add New Team Member
                </button>
            </div>

            <div className="w-full max-w-5xl mx-auto">
                <div className="overflow-x-auto sm:overflow-x-auto lg:overflow-visible">
                    {filteredTeamMembers.length > 0 ? (
                        <table className="w-full border text-center">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Office Address</th>
                                    <th className="border px-4 py-2">Mobile Number</th>
                                    <th className="border px-4 py-2">Telephone Number</th>
                                    <th className="border px-4 py-2">Website Link</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Images</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeamMembers.map((member) => {
                                    const memberDetail = teamMemberDetails.find(detail => detail.teamMemberId === member.id);
                                    return (
                                        <tr key={member.id}>
                                            <td className="border px-4 py-2">{member.id}</td>
                                            <td className="border px-4 py-2">{member.name}</td>
                                            {memberDetail ? (
                                                <>
                                                    <td className="border px-4 py-2">{memberDetail.officeAddress}</td>
                                                    <td className="border px-4 py-2">{memberDetail.mobileNumber}</td>
                                                    <td className="border px-4 py-2">{memberDetail.telephoneNumber}</td>
                                                    <td className="border px-4 py-2">{memberDetail.websiteLink}</td>
                                                    <td className="border px-4 py-2">{memberDetail.email}</td>
                                                    <td className="border px-4 py-2">
                                                        {memberDetail.images && memberDetail.images.length > 0 ? (
                                                            memberDetail.images.map((image, index) => (
                                                                image.imageUrl ? (
                                                                    <Image
                                                                        key={index}
                                                                        src={image.imageUrl}
                                                                        alt={`Team Member Image ${index}`}
                                                                        className="w-20 h-20 object-cover"
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                ) : null
                                                            ))
                                                        ) : (
                                                            <span>No images available</span>
                                                        )}
                                                    </td>
                                                </>
                                            ) : (
                                                <td colSpan={7} className="border px-4 py-2">No details available</td>
                                            )}
                                            <td className="border px-4 py-2">
                                                <button onClick={() => handleEdit(member)} className="text-blue-500 hover:underline">Edit</button>
                                                {memberDetail && (
                                                    <button
                                                        onClick={() => handleDelete(memberDetail.id!)}
                                                        className="ml-2 text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500">No team members with details available.</p>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">{isEditing ? 'Edit Team Member' : 'Add Team Member'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="id" value={formData?.teamMemberId} />
                            <label htmlFor="teamMember" className="block mb-2">Select Team Member</label>
                            <select
                                id="teamMember"
                                name="teamMember"
                                className="w-full p-2 border rounded mb-4"
                                onChange={(e) => setFormData({ ...formData, teamMemberId: Number(e.target.value) })}
                                value={formData.teamMemberId}
                            >
                                <option value="">Select a team member</option>
                                {teamMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>

                            <div className="mb-4">
                                <label htmlFor="officeAddress" className="block mb-2">Office Address</label>
                                <input
                                    type="text"
                                    id="officeAddress"
                                    className="w-full p-2 border rounded"
                                    value={formData.officeAddress}
                                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="mobileNumber" className="block mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    className="w-full p-2 border rounded"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="telephoneNumber" className="block mb-2">Telephone Number</label>
                                <input
                                    type="text"
                                    id="telephoneNumber"
                                    className="w-full p-2 border rounded"
                                    value={formData.telephoneNumber}
                                    onChange={(e) => setFormData({ ...formData, telephoneNumber: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="websiteLink" className="block mb-2">Website Link</label>
                                <input
                                    type="text"
                                    id="websiteLink"
                                    className="w-full p-2 border rounded"
                                    value={formData.websiteLink}
                                    onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-2 border rounded"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="images" className="block mb-2">Team Member Images</label>
                                <input
                                    type="file"
                                    id="images"
                                    className="w-full p-2 border rounded"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    multiple
                                />
                            </div>

                            <div className="flex justify-between">
                                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    {isEditing ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMemberTable;
