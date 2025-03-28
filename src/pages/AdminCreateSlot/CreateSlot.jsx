import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../../constants/axios';
import moment from 'moment';
import 'moment/locale/vi';
import { Modal, Form, Input, Button } from "antd";

const ViewSlot = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [doctors, setDoctors] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null); // Theo dõi bác sĩ được chọn
    const [slots, setSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

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

    const fetchSlots = async (doctorId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/${doctorId}/slots?PageNumber=1&PageSize=10`, {
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

    const handleDoctorClick = (doctorId) => {
        if (selectedDoctorId === doctorId) {
            // Nếu đã chọn bác sĩ này thì đóng slot bằng cách set selectedDoctorId về null
            setSelectedDoctorId(null);
            setSlots([]); // Xóa danh sách slot khi đóng
        } else {
            // Nếu chọn bác sĩ mới thì mở slot
            setSelectedDoctorId(doctorId);
            fetchSlots(doctorId);
        }
    };

    const handleCreateSlot = async (values) => {
        const { date, startTime, endTime } = values;
        if (!selectedDoctorId || !date || !startTime || !endTime) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await api.post(
                `https://maternitycare.azurewebsites.net/api/doctors/${selectedDoctorId}/slots`,
                {
                    date: date,
                    startTime: startTime,
                    endTime: endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Slot created successfully");
            setIsModalOpen(false);
            form.resetFields();
            fetchSlots(selectedDoctorId);
            console.log(response.data);
        } catch (error) {
            console.error("Error creating slot:", error);
            toast.error("Error creating slot: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSlot = async (doctorId, slotId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            await api.delete(`https://maternitycare.azurewebsites.net/api/doctors/${doctorId}/slots/${slotId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            fetchSlots(doctorId);
        } catch (error) {
            console.log(error);
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

            <div>
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleDoctorClick(doctor.id)}
                        >
                            <img src={doctor.avatar} alt={doctor.fullName} style={{ width: '100px', borderRadius: '50%', marginRight: '20px' }} />
                            <div style={{ flexGrow: 1 }}>
                                <h3>{doctor.fullName}</h3>
                                <p>Email: {doctor.email}</p>
                                <p>Số điện thoại: {doctor.phoneNumber}</p>
                                <p>Chuyên môn: {doctor.specialization}</p>
                                <p>Kinh nghiệm: {doctor.yearsOfExperience} years</p>
                            </div>
                            <div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn sự kiện click lan sang div cha
                                        setSelectedDoctorId(doctor.id);
                                        setIsModalOpen(true);
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Tạo Slot
                                </button>
                            </div>
                        </div>

                        {selectedDoctorId === doctor.id && slots.length > 0 && (
                            <div style={{ marginLeft: '20px' }}>
                                {slots.map(slot => (
                                    <div key={slot.id} style={{ marginTop: '10px', padding: '5px', border: '1px solid #ccc' }}>
                                        <p>Ngày: {slot.date}</p>
                                        <p>Giờ bắt đầu: {slot.startTime}</p>
                                        <p>Giờ kết thúc: {slot.endTime}</p>
                                        <button onClick={() => handleDeleteSlot(doctor.id, slot.id)}>Xóa Slot</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>Trước</button>
            <button onClick={() => handlePageChange(pageNumber + 1)}>Sau</button>

            <Modal title="Tạo Slot" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} onFinish={handleCreateSlot}>
                    <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng nhập giờ bắt đầu' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Vui lòng nhập giờ kết thúc' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => setIsModalOpen(false)}>Quay lại</Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>Xác nhận</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ViewSlot;