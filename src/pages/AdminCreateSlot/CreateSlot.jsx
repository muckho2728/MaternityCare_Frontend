import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { format } from "date-fns";
import api from '../../constants/axios';

const DoctorSlotManagement = () => {
    const [slots, setSlots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        startTime: "",
        endTime: ""
    });
    useEffect(() => {
        const fetchCurrentUser = async (url) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("no token found!");
                return;
            }
            const fetchDoctors = async (url) => {
                const doctorId = localStorage.getItem('id');
                if (!doctorId) {
                    console.log('no Doctor found!');
                    return;
                }
            }
            fetchDoctors('https://maternitycare.azurewebsites.net/api/doctors?PageNumber=1&PageSize=100');
            try {
                const response = await api.post("https://maternitycare.azurewebsites.net/api/doctors/1094ec20-65a1-463b-fc15-08dd56f6b269/slots", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    doctorId: formData.doctorId
                });
                setSlots(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');

    });

    const validateSlot = () => {
        const now = new Date();
        const selectedDate = new Date(formData.date);
        const startTime = new Date(`${formData.date} ${formData.startTime}`);
        const endTime = new Date(`${formData.date} ${formData.endTime}`);

        if (selectedDate < now.setHours(0, 0, 0, 0)) {
            setErrorMessage("Cannot create slots in the past");
            return false;
        }

        if (startTime >= endTime) {
            setErrorMessage("End time must be after start time");
            return false;
        }

        const hasOverlap = slots.some(slot => {
            const existingStart = new Date(`${slot.date} ${slot.startTime}`);
            const existingEnd = new Date(`${slot.date} ${slot.endTime}`);
            return (
                slot.doctorId === formData.doctorId &&
                slot.date === formData.date &&
                ((startTime >= existingStart && startTime < existingEnd) ||
                    (endTime > existingStart && endTime <= existingEnd))
            );
        });

        if (hasOverlap) {
            setErrorMessage("Time slot overlaps with existing slot");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateSlot()) {
            const newSlot = {
                id: Date.now().toString(),
                ...formData
            };
            setSlots([...slots, newSlot]);
            setShowModal(false);
            setFormData({ doctorId: "", date: "", startTime: "", endTime: "" });
            setSuccessMessage("Slot created successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleDelete = (slotId) => {
        if (window.confirm("Are you sure you want to delete this slot?")) {
            setSlots(slots.filter(slot => slot.id !== slotId));
            setSuccessMessage("Slot deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const filteredSlots = slots.filter(slot => {
        return (
            slot.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            slot.date.includes(searchTerm)
        );
    });

    const totalPages = Math.ceil(filteredSlots.length / ITEMS_PER_PAGE);
    const paginatedSlots = filteredSlots.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Doctor Slot Management</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <FaPlus /> Add New Slot
                        </button>
                    </div>

                    <div className="mb-4 flex gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search slots..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedSlots.map((slot) => (
                                    <tr key={slot.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{slot.doctorId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{slot.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{slot.startTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{slot.endTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(slot.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Slot</h2>
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.doctorId}
                                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                >
                                    <option value="">Select Doctor</option>
                                    {mockDoctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setErrorMessage("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Create Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSlotManagement;