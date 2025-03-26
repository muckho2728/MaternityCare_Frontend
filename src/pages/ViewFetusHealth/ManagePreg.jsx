import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Card, Row, Col, Layout, Menu } from "antd";
import { UserOutlined, HeartOutlined, MessageOutlined, EyeOutlined, BookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../config/api";

const { Content } = Layout;

const ManagePreg = () => {
    const [userId] = useState(localStorage.getItem("userId"));
    const [fetusData, setFetusData] = useState([]);
    const [selectedFetus, setSelectedFetus] = useState(null);
    const [fetusHealthData, setFetusHealthData] = useState([]);
    const [viewOpen, setViewOpen] = useState(false);

    // Gọi API lấy danh sách thai
    const fetchData = async () => {
        if (!userId) {
            message.error("Không tìm thấy userId! Vui lòng kiểm tra lại.");
            return;
        }

        try {
            const response = await api.get(`/users/${userId}/fetuses`);
            setFetusData(response.data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu! Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    // Gọi API lấy danh sách tuần thai của thai nhi khi ấn "Xem"
    const fetchFetusHealth = async (fetusId) => {
        try {
            const response = await api.get(`/fetuses/${fetusId}/fetus-healths`);
            setFetusHealthData(response.data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu sức khỏe thai nhi! Vui lòng thử lại.");
        }
    };

    // Xử lý mở modal xem chi tiết
    const showDetails = async (record) => {
        setSelectedFetus(record);
        await fetchFetusHealth(record.id);
        setViewOpen(true);
    };

    const columns = [
        { title: "Ngày thụ thai", dataIndex: "conceptionDate", key: "conceptionDate" },
        { title: "Ngày dự sinh", dataIndex: "dueDate", key: "dueDate" },
        {
            title: "Hành động",
            render: (_, record) => (
                <Button type="link" icon={<EyeOutlined />} onClick={() => showDetails(record)}>
                    Xem
                </Button>
            ),
        },
    ];

    const healthColumns = [
        { title: "Tuần thai", dataIndex: "week", key: "week" },
        { title: "Chu vi đầu (mm)", dataIndex: "headCircumference", key: "headCircumference" },
        { title: "Mức nước ối", dataIndex: "amnioticFluidLevel", key: "amnioticFluidLevel" },
        { title: "Chiều dài đầu mông (mm)", dataIndex: "crownRumpLength", key: "crownRumpLength" },
        { title: "Trọng lượng thai (g)", dataIndex: "estimatedFetalWeight", key: "estimatedFetalWeight" },
    ];

    return (
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Content style={{ padding: "15px", marginTop: "24px", width: '100%', maxWidth: "1400px", margin: '0 auto'  }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ borderRadius: "8px", padding: "10px" }}>
                            <Menu mode="vertical" defaultSelectedKeys={["4"]} style={{ border: "none" }} items={[
                                { key: "1", icon: <UserOutlined />, label: <Link to="/profile">Thông tin người dùng</Link> },
                                { key: "2", icon: <HeartOutlined />, label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link> },
                                { key: "3", icon: <MessageOutlined />, label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link> },
                                { key: "4", icon: <MessageOutlined />, label: <Link to="/manage-preg">Quản lý thai kỳ</Link> },
                                { key: '5', icon: <BookOutlined />, label: <Link to="/viewBookedSlot">Xem lịch đã đặt</Link> }
                            ]} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card style={{ borderRadius: '10px', padding: 24 }}>
                            <h2>Quản lý thai kỳ</h2>
                            <Table dataSource={fetusData} columns={columns} rowKey="id" />
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Modal title="Chi tiết thai nhi & Sức khỏe thai" open={viewOpen} onCancel={() => setViewOpen(false)} footer={null} width={800}>
                {selectedFetus && (
                    <div>
                        <p><strong>Tên:</strong> {selectedFetus.name}</p>
                        <p><strong>Tuổi thai (tuần):</strong> {selectedFetus.gestationalAge}</p>
                        <p><strong>Ngày dự sinh:</strong> {selectedFetus.dueDate}</p>
                        <p><strong>Ghi chú:</strong> {selectedFetus.notes}</p>
                        <h3 style={{ marginTop: "20px" }}>Danh sách tuần thai</h3>
                        <Table dataSource={fetusHealthData} columns={healthColumns} rowKey="id" pagination={false} />
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default ManagePreg;
