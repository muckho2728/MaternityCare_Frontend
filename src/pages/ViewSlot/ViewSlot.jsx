import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../../constants/axios';

const ViewSlot = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [doctors, setDoctors] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [currentUser, setCurrentUser] = useState(null);
    const pageSize = 5;
    const [userId, setUserId] = useState("");


    useEffect(() => {
        const fetchDoctors = async (url) => {

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error.response?.data || error.message);
                toast.error("Error fetching doctors: " + (error.response?.data?.message || error.message));
            }
        };

        fetchDoctors();
    }, [pageNumber]);

    const handlePageChange = (newPage) => {
        setPageNumber(newPage);
    };

    const filteredDoctors = doctors.filter(doctor => {
        return (
            doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (specialtyFilter === "all" || doctor.specialization === specialtyFilter)
        );
    });

    return (
        <div>
            <h1>Book Your Appointment</h1>
            <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
                <option value="all">All Specialties</option>
                <option value="Teeth">Teeth</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
            </select>

            <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>Previous</button>
            <button onClick={() => handlePageChange(pageNumber + 1)}>Next</button>

            <div>
                {filteredDoctors.map((doctor, index) => (
                    <div key={doctor.doctorId || index} onClick={() => console.log('Doctor ID:', doctor, 'Name:', doctor.fullName)}>
                        <img src={doctor.avatar} alt={doctor.fullName} style={{ width: '100px', borderRadius: '50%' }} />
                        <h3>{doctor.fullName}</h3>
                        <p>Email: {doctor.email}</p>
                        <p>Phone: {doctor.phoneNumber}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <p>Experience: {doctor.yearsOfExperience} years</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSlot;
