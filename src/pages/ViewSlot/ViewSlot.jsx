import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../../constants/axios';
import moment from 'moment';
import 'moment/locale/vi';
import { Modal, Form, Input, Button, Card, Space } from "antd";

const ViewSlot = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [doctors, setDoctors] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [slots, setSlots] = useState([]);
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

    const fetchSlots = async (selectedDoctorId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/${selectedDoctorId}/slots?Date=2025-03-12&PageNumber=1&PageSize=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSlots(response.data);
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Error fetching slots: " + (error.response?.data?.message || error.message));
        }
    };




    const extractSpecialties = (doctorsList) => {
        const uniqueSpecialties = [...new Set(doctorsList.map(doctor => doctor.specialization))];
        setSpecialties(uniqueSpecialties);
    };

    const handlePageChange = (newPage) => {
        setPageNumber(newPage);
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (specialtyFilter === "all" || doctor.specialization === specialtyFilter)
    );

    return (
        <div>
            <h1>Chọn bác sĩ</h1>
            <input
                type="text"
                placeholder="Tìm kiếm bác sĩ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
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
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
                            onClick={() => { setSelectedDoctorId(doctor.id); fetchSlots(doctor.id); }}>
                            <img src={doctor.avatar} alt={doctor.fullName} style={{ width: '100px', borderRadius: '50%', marginRight: '20px' }} />
                            <div style={{ flexGrow: 1 }}>
                                <h3>{doctor.fullName}</h3>
                                <p>Email: {doctor.email}</p>
                                <p>Số điện thoại: {doctor.phoneNumber}</p>
                                <p>Chuyên môn: {doctor.specialization}</p>
                                <p>Kinh nghiệm: {doctor.yearsOfExperience} years</p>
                            </div>
                        </div>

                        {selectedDoctorId === doctor.id && slots.map(slot => (
                            <Space direction="vertical" style={{ marginLeft: "10px" }}>
                                <Card>
                                    <div key={slot.id} style={{ marginTop: '10px', padding: '5px', border: '1px solid #ccc' }}>
                                        <p>Ngày: {slot.date}</p>
                                        <p>Giờ bắt đầu: {slot.startTime}</p>
                                        <p>Giờ kết thúc: {slot.endTime}</p>
                                        <Button color="cyan" variant="solid" > Đặt Lịch</Button>
                                    </div>
                                </Card>
                            </Space>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSlot;