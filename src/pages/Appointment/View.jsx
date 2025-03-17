import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../constants/axios';
import { Table, Button, Input, Modal, Space, Typography } from 'antd';

const { Title } = Typography;
const { Search } = Input;

const View = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [userId, setUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const [slots, setSlots] = useState({});
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchCurrentUser = async (url) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserId(response.data.id);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Failed to fetch current user:', error.response ? error.response.data : error.message);
            }
        };

        fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/active-doctors?PageNumber=1&PageSize=100`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
                console.log("Doctors data:", response.data); // Log dữ liệu doctors để kiểm tra
            } catch (error) {
                console.error("Error fetching doctors:", error.response?.data || error.message);
                toast.error("Error fetching doctors: " + (error.response?.data?.message || error.message));
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchAppointmentsAndSlots = async () => {
            const token = localStorage.getItem('token');
            if (!token || !userId) {
                console.error('No token or userId found');
                return;
            }
            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/users/${userId}/appointments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const appointmentsData = response.data;
                setAppointments(appointmentsData);
                console.log("Appointments data:", appointmentsData);

                const slotsData = {};
                await Promise.all(
                    appointmentsData.map(async (appointment) => {
                        if (appointment.slotId) {
                            const doctorId = appointment.doctorId || doctors.find(doc => doc.slots?.includes(appointment.slotId))?.id;
                            console.log(`doctorId for slotId ${appointment.slotId}:`, doctorId); // Log doctorId
                            if (doctorId) {
                                const slotResponse = await api.get(
                                    `https://maternitycare.azurewebsites.net/api/doctors/${doctorId}/slots/${appointment.slotId}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                console.log(`Slot data for slotId ${appointment.slotId}:`, slotResponse.data);
                                slotsData[appointment.slotId] = slotResponse.data;
                            } else {
                                console.log(`No doctorId found for slotId ${appointment.slotId}`);
                            }
                        } else {
                            console.log("No slotId found for appointment:", appointment);
                        }
                    })
                );
                setSlots(slotsData);
                console.log("All slots data:", slotsData);
            } catch (error) {
                console.log("Error fetching appointments or slots:", error.response?.data || error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAppointmentsAndSlots();
        }
    }, [userId, doctors]);

    const handleSearch = (value) => setSearchTerm(value);

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const confirmCancelAppointment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Missing token');
            return;
        }

        try {
            await api.delete(
                `https://maternitycare.azurewebsites.net/api/users/${userId}/slots/${selectedAppointment.slotId}/appointments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment.id));
            toast.success("Hủy lịch hẹn thành công!");
        } catch (error) {
            console.error('Failed to cancel appointment:', error.response ? error.response.data : error.message);
            toast.error("Không thể hủy lịch hẹn: " + (error.response?.data?.message || error.message));
        } finally {
            setShowModal(false);
            setSelectedAppointment(null);
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(appointments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Appointments");
        XLSX.writeFile(wb, "appointments.xlsx");
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.slotId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            render: () => (
                currentUser && currentUser.avatar ? (
                    <img
                        src={currentUser.avatar}
                        alt="Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                ) : (
                    <span>No Avatar</span>
                )
            ),
        },
        {
            title: 'Họ tên',
            key: 'fullName',
            render: () => currentUser && currentUser.fullName ? currentUser.fullName : 'Không có tên',
        },
        {
            title: 'Ngày',
            key: 'date',
            render: (_, record) => slots[record.slotId]?.date || 'N/A',
        },
        {
            title: 'Giờ bắt đầu',
            key: 'startTime',
            render: (_, record) => slots[record.slotId]?.startTime || 'N/A',
        },
        {
            title: 'Giờ kết thúc',
            key: 'endTime',
            render: (_, record) => slots[record.slotId]?.endTime || 'N/A',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => handleCancelAppointment(record)}
                >
                    Hủy
                </Button>
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Lịch khám</Title>

            <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
                <Space>
                    <Search
                        placeholder="Tìm kiếm lịch hẹn..."
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<FiDownload />}
                        onClick={exportToExcel}
                    >
                        Export
                    </Button>
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredAppointments}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Xác nhận hủy lịch hẹn"
                open={showModal}
                onOk={confirmCancelAppointment}
                onCancel={() => setShowModal(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc muốn hủy lịch hẹn này không?</p>
            </Modal>
        </div>
    );
};

export default View;