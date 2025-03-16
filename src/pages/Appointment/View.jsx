import React, { useState, useEffect } from "react";
import { FiDownload, FiTrash2, FiSearch, FiCalendar, FiClock } from "react-icons/fi";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../constants/axios';


const View = ({ userId, slotId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/users/${userId}/slots/${slotId}/appointments`);
                setAppointments(response.data);
            } catch (error) {
                console.log(error.response)
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [userId, slotId]);

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const confirmCancelAppointment = () => {
        setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment.id));
        setShowModal(false);
        setSelectedAppointment(null);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(appointments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Appointments");
        XLSX.writeFile(wb, "appointments.xlsx");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Appointment Dashboard</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search appointments..."
                    onChange={handleSearch}
                    value={searchTerm}
                />
                <button onClick={exportToExcel}>Export</button>
            </div>

            {filteredAppointments.length === 0 ? (
                <div>No appointments found</div>
            ) : (
                <div>
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id}>
                            <h3>{appointment.doctorName}</h3>
                            <p>{appointment.specialization}</p>
                            <span>{appointment.status}</span>
                            <div>
                                <span>{appointment.date}</span>
                                <span>
                                    {appointment.startTime} - {appointment.endTime}
                                </span>
                            </div>
                            <button onClick={() => handleCancelAppointment(appointment)}>
                                Cancel Appointment
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default View;
