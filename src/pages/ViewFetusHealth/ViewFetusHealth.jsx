import React, { useContext, useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Layout, Menu, Input, Button, Form, Space, message } from 'antd';
import { UserOutlined, HeartOutlined, TeamOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FetusContext } from '../../constants/FetusContext';
import api from '../../config/api';
import './ViewFetusHealth.css';
import { useForm } from 'antd/es/form/Form';

const { Content } = Layout;
const { Title } = Typography;

const ViewFetusHealth = () => {
    const { fetusData, setFetusData, healthData, setHealthData } = useContext(FetusContext);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                // Fetch danh sách thai nhi
                const response = await api.get(`users/${userId}/fetuses`);
                
                if (response.data.length === 0) {
                    message.error("Không có dữ liệu thai nhi!");
                    return;
                }

                const fetusID = response.data[0].id;
                localStorage.setItem('fetusId', fetusID); // Lưu vào localStorage

                // Fetch thông tin sức khỏe thai nhi
                const responseHealth = await api.get(`fetuses/${fetusID}/fetus-healths`);

                setFetusData(response.data[0]);
                setHealthData(responseHealth.data[0]);
                form.setFieldsValue({
                    conceptionDate: response.data[0].conceptionDate,
                    ...responseHealth.data[0]
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải dữ liệu, vui lòng thử lại!");
            }
        };

        fetchData();
    }, [form, setFetusData, setHealthData]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const userId = localStorage.getItem('userId');

            if (!fetusData || !healthData) {
                message.error("Không có dữ liệu để cập nhật!");
                return;
            }

            console.log("Updating fetus health for:", fetusData.id, "Week:", healthData.week);

            // Cập nhật thông tin thai nhi
            await api.put(`users/${userId}/fetuses/${fetusData.id}`, values);

            // Cập nhật thông tin sức khỏe thai nhi
            await api.put(`fetuses/${fetusData.id}/fetus-healths/${healthData.week}`, values);

            message.success('Cập nhật thông tin thành công!');
            setHealthData(values);
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            message.error('Cập nhật thất bại, vui lòng thử lại!');
        }
    };

    if (!fetusData || !healthData) {
        return <div>Không có dữ liệu thai nhi.</div>;
    }

    return (
        <Layout>
            <Content style={{ padding: '12px', marginTop: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', padding: '10px' }}>
                            <Menu mode="vertical" defaultSelectedKeys={['2']} style={{ border: 'none' }} items={[
                                {
                                    key: '1',
                                    icon: <UserOutlined />,
                                    label: <Link to="/profile">Thông tin người dùng</Link>,
                                },
                                {
                                    key: '2',
                                    icon: <HeartOutlined />,
                                    label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link>,
                                },
                                {
                                    key: '3',
                                    icon: <TeamOutlined />,
                                    label: 'Quản lý',
                                    children: [
                                        {
                                            key: '3-1',
                                            icon: <FileSearchOutlined />,
                                            label: <Link to="/Censor">Quản lý người dùng</Link>,
                                        },
                                        {
                                            key: '3-2',
                                            icon: <FileSearchOutlined />,
                                            label: <Link to="/Censor">Quản lý thông tin thai kỳ</Link>,
                                        },
                                        {
                                            key: '3-3',
                                            icon: <FileSearchOutlined />,
                                            label: 'Quản lý bài viết',
                                            children: [
                                                {
                                                    key: '3-3-1',
                                                    icon: <FileSearchOutlined />,
                                                    label: <Link to="/Censor">Duyệt bài viết</Link>,
                                                }
                                            ]
                                        },
                                    ],
                                },
                            ]} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24 }}>
                            <Title level={2} style={{ textAlign: 'center' }}>Thông tin sức khỏe thai nhi</Title>
                            <Form form={form} layout="vertical">
                                <Row gutter={16}>
                                    <Col span={12}><Form.Item label="Ngày thụ thai" name="conceptionDate"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Tuần thai" name="week"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chu vi đầu (mm)" name="headCircumference"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Mức nước ối" name="amnioticFluidLevel"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chiều dài đầu mông (mm)" name="crownRumpLength"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Đường kính lưỡng đỉnh (mm)" name="biparietalDiameter"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chiều dài xương đùi (mm)" name="femurLength"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Trọng lượng thai (kg)" name="estimatedFetalWeight"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chu vi bụng (mm)" name="abdominalCircumference"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Đường kính túi thai (mm)" name="gestationalSacDiameter"><Input disabled={!isEditing} /></Form.Item></Col>
                                </Row>
                                <Form.Item>
                                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                                        {!isEditing ? (
                                            <Button type="primary" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                                        ) : (
                                            <>
                                                <Button type="primary" onClick={handleSave}>Lưu</Button>
                                                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                                            </>
                                        )}
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ViewFetusHealth;
