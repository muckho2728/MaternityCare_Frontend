import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Input, Button, Form, Typography, Card, Row, Col, Space, message, Upload, Table } from 'antd';
import { UserOutlined, HeartOutlined, EditOutlined, CameraOutlined } from '@ant-design/icons';
import { updateUserByIdAction, changePassworbyUserIdAction, fetchUserByIdAction } from '../../store/redux/action/userAction';
import api from '../../constants/axios';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const userLogin = useSelector((state) => state.userReducer.currentUser);
  const userDetailData = useSelector((state) => state.userReducer.user);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userPackage, setUserPackage] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userId && token) {
      fetchUserPackage();
      fetchPaymentHistory();
    }
  }, []);

  const fetchUserPackage = async () => {
    try {
      const response = await api.get(`/authentications/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPackage({ name: response.data.subscription });
    } catch (error) {
      console.error('Failed to fetch user package:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get(`/users/${userId}/transactions`);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('dateOfBirth', values.dateOfBirth);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    dispatch(updateUserByIdAction(userDetailData.id, formData))
      .then(() => {
        message.success('Cập nhật thông tin thành công!');
        dispatch(fetchUserByIdAction(userDetailData.id));
      })
      .catch((error) => {
        message.error('Cập nhật thông tin thất bại: ' + (error.message || 'Lỗi không xác định'));
      });
    setIsEditing(false);
  };

  return (
    <Layout style={{ backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', padding: '10px' }}>
              <Menu mode="vertical" defaultSelectedKeys={['1']} style={{ border: 'none', backgroundColor: 'transparent' }}>
                <Menu.Item key="1" icon={<UserOutlined />}>Thông tin người dùng</Menu.Item>
                <Menu.Item key="2" icon={<HeartOutlined />}>
                  <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link>
                </Menu.Item>
              </Menu>
            </Card>
          </Col>

          <Col span={18}>
            <Card style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24 }}>
              <Row gutter={24}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Title level={3}>Ảnh đại diện</Title>
                  <div style={{ position: 'relative', margin: '0 auto', width: '150px', height: '150px' }}>
                    <img
                      src={previewAvatar || 'https://via.placeholder.com/150?text=Avatar'}
                      alt="avatar"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #EC407A',
                      }}
                    />
                    {isEditing && (
                      <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          setAvatarFile(file);
                          return false;
                        }}
                      >
                        <Button
                          icon={<CameraOutlined />}
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            borderRadius: '50%',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                          }}
                        />
                      </Upload>
                    )}
                  </div>
                </Col>

                <Col span={16}>
                  <Form form={profileForm} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Họ và Tên" name="fullName">
                      <Input disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item>
                      <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        {!isEditing ? (
                          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                          </Button>
                        ) : (
                          <>
                            <Button type="primary" onClick={() => profileForm.submit()}>
                              Lưu
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                              Hủy
                            </Button>
                          </>
                        )}
                      </Space>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Profile;
