import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../../constants/axios';
import moment from 'moment';
import 'moment/locale/vi';

const ViewSlot = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [doctors, setDoctors] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const [availableDates, setAvailableDates] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [specialties, setSpecialties] = useState([]);


    useEffect(() => {
        const fetchDoctors = async () => {

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/active-doctors?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
                extractSpecialties(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error.response?.data || error.message);
                toast.error("Error fetching doctors: " + (error.response?.data?.message || error.message));
            }
        };

        fetchDoctors();
    }, [pageNumber]);

    const extractSpecialties = (doctorsList) => {
        const uniqueSpecialties = [...new Set(doctorsList.map(doctor => doctor.specialization))];
        setSpecialties(uniqueSpecialties);
    };

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
        setSelectedDoctor(doctor);
        console.log("doctor ID:", doctor.id, ", doctor name:", doctor.fullName);
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
            <h1>Chọn bác sĩ</h1>
            <input
                type="text"
                placeholder="Tìm kiếm bác sĩ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
                <option value="all">Toàn bộ</option>
                {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                ))}
            </select>

            <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>Trước</button>
            <button onClick={() => handlePageChange(pageNumber + 1)}>Sau</button>

            <div>
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id}>
                        <div onClick={() => handleDoctorClick(doctor)}>
                            <img src={doctor.avatar} alt={doctor.fullName} style={{ width: '100px', borderRadius: '50%' }} />
                            <h3>{doctor.fullName}</h3>
                            <p>Email: {doctor.email}</p>
                            <p>Số điện thoại: {doctor.phoneNumber}</p>
                            <p>Chuyên môn: {doctor.specialization}</p>
                            <p>Kinh nghiệm: {doctor.yearsOfExperience} years</p>
                        </div>
                        {selectedDoctor?.id === doctor.id && (
                            <div>
                                <h2>Chọn ngày</h2>
                                {availableDates.map((date, index) => (
                                    <button key={index} onClick={() => handleDateClick(date)}>
                                        {moment(date).format('dddd, DD/MM/YYYY')}
                                    </button>
                                ))}
                                {selectedDate && (
                                    <div>
                                        <h2>Chọn giờ</h2>
                                        {timeSlots.map((slot, index) => (
                                            <button key={index} onClick={() => setSelectedSlot(slot)}>
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSlot;
