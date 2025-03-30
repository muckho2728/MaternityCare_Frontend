import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Input, Button, Form, Typography, Card, Row, Col, Space, message, Upload, Table } from 'antd';
import { UserOutlined, HeartOutlined, EditOutlined, CameraOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons';
import { updateUserByIdAction, changePassworbyUserIdAction, fetchUserByIdAction } from '../../store/redux/action/userAction';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import './Profile.css';
import { Tag } from 'antd';
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
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get(`/users/${userId}/transactions`);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  const fetchUserPackage = async () => {
    try {
      const response = await api.get(`/authentications/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subscription = response.data.subscription;

      setUserPackage({
        name: subscription,
      });
    } catch (error) {
      console.error('Failed to fetch user package:', error);
    }
  };

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await api.get(`/users/${userId}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptionDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription details:', error);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchUserPackage();
      fetchPaymentHistory();
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async (url) => {
      if (!token) return;

      try {
        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data); 
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(fetchUserByIdAction(currentUser.id));
      fetchSubscriptionDetails(currentUser.id);
      fetchPaymentHistory(currentUser.id);
    }
  }, [currentUser, dispatch]);



  // const fetchPaymentHistory = async (userId) => {
  //   try {
  //     const response = await api.get(`/api/users/${userId}/transactions`);
  //     setPaymentHistory(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch payment history:', error);
  //   }
  // };

  useEffect(() => {
    if (userDetailData) {
      profileForm.setFieldsValue({
        // roleId: userDetailData.role?.name || '',
        username: userDetailData?.username,
        email: userDetailData?.email,
        fullName: userDetailData?.fullName,
        dateOfBirth: userDetailData?.dateOfBirth,
        avatar: userDetailData?.avatar,
        experience: userDetailData?.experience,
        status: userDetailData?.status,
        cccd: userDetailData?.cccd,
      });
      if (userDetailData.avatar) {
        setPreviewAvatar(userDetailData.avatar);
      }
    }
  }, [userDetailData, profileForm]);

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

  const handleSubmitPassword = (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu mới không khớp!');
      return;
    }

    const userDetails = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    dispatch(changePassworbyUserIdAction(userDetailData.id, userDetails))
      .then(() => {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
      })
      .catch((error) => {
        message.error('Đổi mật khẩu thất bại: ' + (error.message || 'Lỗi không xác định'));
      });
  };

  const handleAvatarChange = (info) => {
    const file = info.file;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewAvatar(userDetailData.avatar);
    setAvatarFile(null);
    profileForm.setFieldsValue({
      roleId: userDetailData.role?.name || '',
      username: userDetailData?.username,
      email: userDetailData?.email,
      fullName: userDetailData?.fullName,
      dateOfBirth: userDetailData?.dateOfBirth,
      avatar: userDetailData?.avatar,
      experience: userDetailData?.experience,
      status: userDetailData?.status,
      cccd: userDetailData?.cccd,
    });
  };

  const paymentHistoryColumns = [
    { 
      title: 'Số tiền', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) 
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { 
      title: 'Ngày', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      render: (text) => new Date(text).toLocaleString() 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusText = status.toLowerCase();
        let color, text;
    
        switch (statusText) {
          case 'success':
            color = 'green';
            text = 'Thành công';
            break;
          case 'failed':
            color = 'red';
            text = 'Thất bại';
            break;
          // case 'pending':
          //   color = 'orange';
          //   text = 'Đang chờ';
          //   break;
          default:
            color = 'default';
            text = status;
        }
    
        return (
          <Tag color={color} style={{ fontWeight: 500 }}>
            {text}
          </Tag>
        );
      },
    }
    // { title: 'Id đăng kí', dataIndex: 'subscriptionId', key: 'subscriptionId' },
  ];

  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Content style={{ padding: '15px', maxWidth: '1200px', margin: '0 auto', background: 'transparent' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card span={0} style={{ textAlign: 'center' }}>
              <Title level={3} style={{ color: '#4caf93' }}>Ảnh đại diện</Title>
              <div style={{ position: 'relative', margin: '0 auto', width: '150px', height: '150px' }}>
                <img
                  src={previewAvatar || 'https://via.placeholder.com/150?text=Avatar'}
                  alt="avatar"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #4caf93',
                  }}
                />
                {isEditing && (
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleAvatarChange({ file });
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
              <Title level={4}>{userDetailData?.fullName || userLogin?.fullName}</Title>
              <p>{userDetailData?.email || userLogin?.email}</p>
              <p>{userLogin?.phone}</p>
              <p>{userLogin?.address}</p>
            </Card>
            <Card
              style={{
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                padding: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Menu mode="vertical" defaultSelectedKeys={['1']} style={{ border: 'none', backgroundColor: 'transparent' }} items={[
                { key: '1', icon: <UserOutlined />, label: 'Thông tin người dùng' },
                { key: '2', icon: <HeartOutlined />, label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link> },
                { key: '3', icon: <MessageOutlined />, label: <Link to="/manage-pregnancy">Quản lý thông tin thai kỳ</Link> },
                { key: '4', icon: <MessageOutlined />, label: <Link to="/manage-preg">Quản lý thai kỳ</Link> },
                { key: '5', icon: <BookOutlined />, label: <Link to="/viewBookedSlot">Xem lịch đã đặt</Link> }
              ]} />
            </Card>
          </Col>

          <Col span={18}>
            <Card
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '24px',
                backgroundColor: '#ffffff'
              }}
            >
              <Row gutter={24}>


                <Col span={24}>
                  <Title level={3} style={{ color: '#4caf93' }}>Thông tin cá nhân</Title>
                  <Form
                    form={profileForm}
                    layout="vertical"
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                    onFinish={handleSubmit}
                  >
                    <Row gutter={24}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Họ và Tên" name="fullName">
                          <Input disabled={!isEditing} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Email" name="email">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Tên đăng nhập" name="username">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Căn cước công dân" name="cccd">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Ngày Sinh" name="dateOfBirth">
                          <Input className="profile-input" type="date" disabled={!isEditing} />
                        </Form.Item>
                      </Col>
                      {/* <Col xs={24} sm={12}>
                        <Form.Item label="Vai Trò" name="roleId">
                          <Input disabled />
                        </Form.Item>
                      </Col> */}
                    </Row>
                    <Form.Item>
                      <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        {!isEditing ? (
                          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                            Chỉnh sửa
                          </Button>
                        ) : (
                          <>
                            <Button type="primary" onClick={() => profileForm.submit()} style={{ width: '100%' }}>
                              Lưu
                            </Button>
                            <Button onClick={handleCancelEdit} style={{ width: '100%', background: '#f55b5b' }}>
                              Hủy
                            </Button>
                          </>
                        )}
                      </Space>
                    </Form.Item>
                  </Form>
                  {/* Thông tin gói */}
                  <Title level={3} style={{ color: '#4caf93' }}>Thông tin gói</Title>
                  <Card
                    style={{
                      marginBottom: '24px',
                      backgroundColor: '#f9f9f9',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    <p><strong>Gói hiện tại:</strong> {userPackage ? (userPackage.name === 'Free' ? ' Miễn phí' : ' Cao cấp') : ' Miễn phí'}</p>
                    <p><strong>Ngày bắt đầu:</strong> {subscriptionDetails?.[0]?.startDate || 'Không có'}</p>
                    <p><strong>Ngày hết hạn:</strong> {subscriptionDetails?.[0]?.endDate || 'Không có'}</p>
                  </Card>
                  {/*lich su thanh toan */}
                  <Title level={3} style={{ color: '#4caf93' }}>Lịch sử thanh toán</Title>
                  <Table
                    columns={paymentHistoryColumns}
                    dataSource={paymentHistory}
                    rowKey="id"
                    pagination={false}
                    style={{ backgroundColor: '#4caf93', borderRadius: '8px' }}
                    locale={{
                      emptyText: (
                        <div style={{ padding: '16px', textAlign: 'center' }}>
                          <p style={{ fontSize: '16px', color: '#666' }}>Hiện tại không có giao dịch nào được ghi nhận</p>
                        </div>
                      )
                    }}
                  />

                  <Title level={3} style={{ color: '#4caf93' }}>Đổi mật khẩu</Title>
                  <Form form={passwordForm} layout="vertical" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }} onFinish={handleSubmitPassword}>
                    <Row gutter={24}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Mật Khẩu Cũ"
                          name="currentPassword"
                          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Mật Khẩu Mới"
                          name="newPassword"
                          rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Nhập Lại Mật Khẩu"
                          name="confirmPassword"
                          rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                          Lưu
                        </Button>
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