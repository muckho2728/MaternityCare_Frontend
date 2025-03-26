import React, { useState, useEffect } from "react";
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
    const [currentUser, setCurrentUser] = useState(null);

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
            } catch (error) {
                console.log("Error fetching appointments:", error.response?.data || error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAppointmentsAndSlots();
        }
    }, [userId]);

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

    // Filter appointments dynamically based on the current date
    const filteredAppointments = appointments.filter(appointment => {
        const currentDate = new Date(); // Dynamically get the current date
        const appointmentDate = new Date(appointment.slot?.date);
        return (
            appointmentDate >= currentDate && // Only show appointments on or after today
            (appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.slotId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            render: (_, record) => (
                record.user?.avatar ? (
                    <img
                        src={record.user.avatar}
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
            render: (_, record) => record.user?.fullName || 'Không có tên',
        },
        {
            title: 'Ngày',
            key: 'date',
            render: (_, record) => record.slot?.date || 'N/A',
        },
        {
            title: 'Giờ bắt đầu',
            key: 'startTime',
            render: (_, record) => record.slot?.startTime || 'N/A',
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
        return <div>Đang tải...</div>;
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
                </Space>
            </Space>
            <strong><p><i>Lưu ý: </i>Vui lòng tới trước giờ hẹn 15 phút</p></strong>
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