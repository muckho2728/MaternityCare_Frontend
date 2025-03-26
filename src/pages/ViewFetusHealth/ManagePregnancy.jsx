import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Card, Row, Col, Layout, Menu } from "antd";
import { UserOutlined, HeartOutlined, MessageOutlined, EyeOutlined, PlusOutlined, BookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../config/api";
import CreateFetusHealth from "../CreateFetusHealth/CreateFetusHealth";
import "./viewfetus.css";

const { Content } = Layout;

const ManagePregnancy = () => {
    const [fetusId] = useState(localStorage.getItem("fetusId"));
    const [fetusHealthData, setFetusHealthData] = useState([]);
    const [selectedFetus, setSelectedFetus] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

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
        message.success({
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
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Content style={{ padding: "15px", marginTop: "24px", width: '100%', maxWidth: "1400px", margin: '0 auto'  }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ borderRadius: "8px", padding: "10px" }}>
                            <Menu mode="vertical" defaultSelectedKeys={["3"]} style={{ border: "none"}} items={[
                                { key: '1', icon: <UserOutlined />, label: 'Thông tin người dùng' },
                                { key: '2', icon: <HeartOutlined />, label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link> },
                                { key: '3', icon: <MessageOutlined />, label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link> },
                                { key: '4', icon: <MessageOutlined />, label: <Link to="/manage-preg">Quản lý thai kỳ</Link> },
                                { key: '5', icon: <BookOutlined />, label: <Link to="/viewBookedSlot">Xem lịch đã đặt</Link> }
                            ]} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card style={{ borderRadius: '10px', padding: 24 }}>
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
            <Modal style={{ width: '950px' }} className="custom" title="Chi tiết sức khỏe thai nhi" open={viewOpen} onCancel={() => setViewOpen(false)} footer={null}>
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
                style={{ width: '950px' }}
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
