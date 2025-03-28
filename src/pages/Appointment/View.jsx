import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout, Row, Col, Card, Menu } from "antd";  // Ant Design components
import { Link } from "react-router-dom";  // React Router link
import { UserOutlined, HeartOutlined, MessageOutlined, BookOutlined } from "@ant-design/icons";
import api from '../../constants/axios';
import { Table, Button, Input, Modal, Space, Typography } from 'antd';


const { Title } = Typography;
const { Search } = Input;
const { Content } = Layout;

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
                    Hủy lịch hẹn
                </Button>
            ),
        },
    ];

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <Layout style={{ backgroundColor: "transparent" }}>
            <Content style={{ padding: "15px", marginTop: "24px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
                <Row gutter={24}>
                    {/* Menu bên trái */}
                    <Col span={6}>
                        <Card style={{ borderRadius: "8px", padding: "10px" }}>
                            <Menu
                                mode="vertical"
                                defaultSelectedKeys={["5"]}
                                style={{ border: "none" }}
                                items={[
                                    { key: "1", icon: <UserOutlined />, label: <Link to="/profile">Thông tin người dùng</Link> },
                                    { key: "2", icon: <HeartOutlined />, label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link> },
                                    { key: "3", icon: <MessageOutlined />, label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link> },
                                    { key: "4", icon: <MessageOutlined />, label: <Link to="/manage-preg">Quản lý thai kỳ</Link> },
                                    { key: "5", icon: <BookOutlined />, label: <Link to="/viewBookedSlot">Xem lịch đã đặt</Link> },
                                ]}
                            />
                        </Card>
                    </Col>

                    {/* Nội dung chính */}
                    <Col span={18}>
                        <Card style={{ borderRadius: "10px", padding: 24 }}>
                            <Title level={2}>Lịch khám</Title>

                            <Space direction="vertical" style={{ width: "100%", marginBottom: "20px" }}>
                                <Space>
                                    <Search placeholder="Tìm kiếm lịch hẹn..." onSearch={handleSearch} enterButton style={{ width: 300 }} />
                                </Space>
                            </Space>

                            <strong>
                                <p><i>Lưu ý: </i>Vui lòng tới trước giờ hẹn 30 phút</p>
                            </strong>

                            <Table columns={columns} dataSource={filteredAppointments} rowKey="id" pagination={{ pageSize: 10 }} />

                            <Modal
                                title="Xác nhận hủy lịch hẹn"
                                open={showModal}
                                onOk={confirmCancelAppointment}
                                onCancel={() => setShowModal(false)}
                                cancelText="Quay lại"
                                okText="Xác nhận hủy"
                                okButtonProps={{ style: { backgroundColor: "green", borderColor: "green" } }}
                                cancelButtonProps={{ style: { backgroundColor: "red", borderColor: "red", color: "white" } }}
                            >
                                <p>Bạn có chắc muốn hủy lịch hẹn này không?</p>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default View;