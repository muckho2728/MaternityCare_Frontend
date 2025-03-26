import { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, message, Card, Row, Col, Layout, Menu, notification } from "antd";
import { UserOutlined, HeartOutlined, MessageOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../config/api";
import CreateFetusHealth from "../CreateFetusHealth/CreateFetusHealth";

const { Content } = Layout;

const ManagePregnancy = () => {
    const [fetusId] = useState(localStorage.getItem("fetusId"));
    const [fetusHealthData, setFetusHealthData] = useState([]);
    const [selectedFetus, setSelectedFetus] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const notificationRef = useRef(null);

    const fetchData = async () => {
        if (!fetusId) {
            message.error("Không tìm thấy fetusId! Vui lòng kiểm tra lại.");
            return;
        }

        try {
            const response = await api.get(`fetuses/${fetusId}/fetus-healths`);
            setFetusHealthData(response.data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu! Vui lòng thử lại.", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetusId]);

    const showDetails = (record) => {
        setSelectedFetus(record);
        setViewOpen(true);
    };

    const handleSuccess = (messageText) => {
        fetchData();
        setEditOpen(false);
        setIsAdding(false);
        notificationRef.current = notification.success({
            message: "Thành công",
            description: messageText,
        });
    };

    const columns = [
        { title: "Tuần thai", dataIndex: "week", key: "week" },
        {
            title: "Hành động",
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => showDetails(record)}>Xem</Button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: "12px", marginTop: "24px", maxWidth: "1400px", marginLeft: "50px" }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ borderRadius: "8px", backgroundColor: "#f9f9f9", padding: "10px" }}>
                            <Menu mode="vertical" defaultSelectedKeys={["3"]} style={{ border: "none", width: "100%" }} items={[
                                { key: "1", icon: <UserOutlined />, label: <Link to="/profile">Thông tin người dùng</Link> },
                                { key: "2", icon: <HeartOutlined />, label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link> },
                                { key: "3", icon: <MessageOutlined />, label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link> },
                                { key: "4", icon: <MessageOutlined />, label: <Link to="/manage-preg">Quản lý thai kỳ</Link> },
                            ]} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card style={{ padding: "16px", borderRadius: "8px", marginLeft: "50px" }}>
                            <h2>Quản lý thông tin thai nhi</h2>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAdding(true)} style={{ marginBottom: "16px" }}>
                                Thêm tuần thai
                            </Button>
                            <Table dataSource={fetusHealthData} columns={columns} rowKey="id" />
                        </Card>
                    </Col>
                </Row>
            </Content>

            {/* Modal Xem chi tiết */}
            <Modal title="Chi tiết sức khỏe thai nhi" open={viewOpen} onCancel={() => setViewOpen(false)} footer={null}>
                {selectedFetus && (
                    <div>
                        <p><strong>Tuần thai:</strong> {selectedFetus.week}</p>
                        <p><strong>Chu vi đầu (mm):</strong> {selectedFetus.headCircumference}</p>
                        <p><strong>Mức nước ối:</strong> {selectedFetus.amnioticFluidLevel}</p>
                        <p><strong>Chiều dài đầu mông (mm):</strong> {selectedFetus.crownRumpLength}</p>
                        <p><strong>Đường kính lưỡng đỉnh (mm):</strong> {selectedFetus.biparietalDiameter}</p>
                        <p><strong>Chiều dài xương đùi (mm):</strong> {selectedFetus.femurLength}</p>
                        <p><strong>Trọng lượng thai (g):</strong> {selectedFetus.estimatedFetalWeight}</p>
                        <p><strong>Chu vi bụng (mm):</strong> {selectedFetus.abdominalCircumference}</p>
                        <p><strong>Đường kính túi thai (mm):</strong> {selectedFetus.gestationalSacDiameter}</p>
                    </div>
                )}
            </Modal>

            {/* Modal Thêm/Sửa tuần thai */}
            <Modal
                title={selectedFetus ? "Chỉnh sửa tuần thai" : "Thêm tuần thai"}
                open={editOpen || isAdding}
                onCancel={() => { setEditOpen(false); setIsAdding(false); }}
                footer={null}
            >
                <CreateFetusHealth
                    fetusHealthData={selectedFetus}
                    onSuccess={(messageText) => handleSuccess(messageText)}
                />
            </Modal>
        </Layout>
    );
};

export default ManagePregnancy;
