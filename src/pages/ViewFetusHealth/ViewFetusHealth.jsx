import { useContext, useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Layout, Menu, Input, Button, Form, Space, message } from 'antd';
import { UserOutlined, HeartOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FetusContext } from '../../constants/FetusContext';
import api from '../../config/api';
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
                const response = await api.get(`users/${userId}/fetuses`);
                console.log(response)
                if (response.data.length === 0) {
                    message.error("Không có dữ liệu thai nhi!");
                    return;
                }
                
                let fetusID = localStorage.getItem('fetusId') || response.data[response.data.length - 1].id;
                localStorage.setItem('fetusId', fetusID);
                
                if(fetusID !== response.data[response.data.length - 1].id) {
                    localStorage.setItem('fetusId', response.data[response.data.length - 1].id);
                }
                
                const responseHealth = await api.get(`fetuses/${fetusID}/fetus-healths`);
                
                if (responseHealth.data.length === 0) {
                    message.error("Không có dữ liệu sức khỏe thai nhi!");
                    return;
                }

                const latestHealthData = responseHealth.data[responseHealth.data.length - 1];
                setFetusData(response.data[response.data.length - 1]);
                setHealthData(latestHealthData);
                localStorage.setItem('currentWeek', latestHealthData.week);
                
                form.setFieldsValue({
                    conceptionDate: response.data[response.data.length - 1].conceptionDate,
                    ...latestHealthData
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
            await api.put(`users/${userId}/fetuses/${fetusData.id}`, {
                conceptionDate: values.conceptionDate
            });
            console.log(fetusData);
            
            await api.put(`fetuses/${fetusData.id}/fetus-healths/${healthData.week}`, {
                headCircumference: values.headCircumference,
                amnioticFluidLevel: values.amnioticFluidLevel,
                crownRumpLength: values.crownRumpLength,
                biparietalDiameter: values.biparietalDiameter,  
                femurLength: values.femurLength,
                estimatedFetalWeight: values.estimatedFetalWeight,
                abdominalCircumference: values.abdominalCircumference,
                gestationalSacDiameter: values.gestationalSacDiameter
            });
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
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Content style={{ padding: '15px', marginTop: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ borderRadius: '8px', padding: '10px' }}>
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
                                    icon: <MessageOutlined />,
                                    label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link>,
                                },
                                {
                                    key: '4',
                                    icon: <MessageOutlined />,
                                    label: <Link to="/manage-preg">Quản lý thai kỳ</Link>,
                                },
                                {key: '5', icon: <BookOutlined />, label: <Link to="/viewBookedSlot">Xem lịch đã đặt</Link> }
                            ]} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card style={{ borderRadius: '10px', padding: 24 }}>
                            <Title level={2} style={{ textAlign: 'center' }}>Thông tin sức khỏe thai nhi</Title>
                            <Form form={form} layout="vertical">
                                <Row gutter={16}>
                                    <Col span={12}><Form.Item label="Ngày thụ thai" name="conceptionDate"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Tuần thai" name="week"><Input disabled /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chu vi đầu (mm)" name="headCircumference"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Mức nước ối" name="amnioticFluidLevel"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chiều dài đầu mông (mm)" name="crownRumpLength"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Đường kính lưỡng đỉnh (mm)" name="biparietalDiameter"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chiều dài xương đùi (mm)" name="femurLength"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Trọng lượng thai (g)" name="estimatedFetalWeight"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Chu vi bụng (mm)" name="abdominalCircumference"><Input disabled={!isEditing} /></Form.Item></Col>
                                    <Col span={12}><Form.Item label="Đường kính túi thai (mm)" name="gestationalSacDiameter"><Input disabled={!isEditing} /></Form.Item></Col>
                                </Row>
                                <Form.Item>
                                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                                        {!isEditing ? (
                                            <Button type="primary" onClick={() => setIsEditing(true)}>Cập nhật</Button>
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
