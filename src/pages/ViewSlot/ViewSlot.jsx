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
    const pageSize = 3;
    const [userId, setUserId] = useState("");
    const [availableDates, setAvailableDates] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);


    useEffect(() => {
        const fetchDoctors = async () => {

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

    const handleDoctorClick = (doctor) => {
        console.log("Selected Doctor:", doctor.id, doctor.fullName);
        setSelectedDoctor(doctor);
        generateAvailableDates();
        setSelectedDate(null);
        setTimeSlots([]);
    };

    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const newDate = new Date();
            newDate.setDate(today.getDate() + i);
            dates.push(newDate);
        }
        setAvailableDates(dates);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        generateTimeSlots(date);
    };

    const generateTimeSlots = (date) => {
        const day = date.getDay();
        const slots = [];
        let startHour = 7;
        let endHour = day === 0 ? 12 : 16.5;
        while (startHour < endHour) {
            slots.push(`${startHour}:00 - ${startHour + 1.5}:30`);
            startHour += 1.5;
        }
        setTimeSlots(slots);
    };

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
                    <div key={doctor.doctorId || index} onClick={() => handleDoctorClick(doctor)}>
                        <img src={doctor.avatar} alt={doctor.fullName} style={{ width: '100px', borderRadius: '50%' }} />
                        <h3>{doctor.fullName}</h3>
                        <p>Email: {doctor.email}</p>
                        <p>Phone: {doctor.phoneNumber}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <p>Experience: {doctor.yearsOfExperience} years</p>
                    </div>
                ))}
                {selectedDoctor && (
                    <div>
                        <h2>Available Dates</h2>
                        {availableDates.map((date, index) => (
                            <button key={index} onClick={() => handleDateClick(date)}>
                                {date.toDateString()}
                            </button>
                        ))}
                    </div>
                )}

                {selectedDate && (
                    <div>
                        <h2>Available Time Slots</h2>
                        {timeSlots.map((slot, index) => (
                            <button key={index} onClick={() => setSelectedSlot(slot)}>
                                {slot}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewSlot;
