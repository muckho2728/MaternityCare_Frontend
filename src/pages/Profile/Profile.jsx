import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Input, Button, Form, Typography, Card, Row, Col, Space, message, Upload } from 'antd';
import { UserOutlined, HeartOutlined, TeamOutlined, FileSearchOutlined, EditOutlined, CameraOutlined } from '@ant-design/icons';
import { updateUserByIdAction, changePassworbyUserIdAction, fetchUserByIdAction } from
  '../../store/redux/action/userAction';
import api from '../../constants/axios';
import { Link } from 'react-router-dom';
import './Profile.css';


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
  const [temp, setTemp] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  console.log(userDetailData)

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
        console.log('Current user data:', response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error.response ? error.response.data : error.message);
        throw error;
      }
    };

    fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
  }, []);

  if (userLogin) {
    console.log('userDetailData:', userDetailData);
  }

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(fetchUserByIdAction(currentUser.id));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (userDetailData) {
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

      // Set the avatar from user data
      if (userDetailData.avatar) {
        setPreviewAvatar(userDetailData.avatar);
      }
    }
  }, [userDetailData, profileForm]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('dateOfBirth', values.dateOfBirth);

    // Handle the avatar upload
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
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
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

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Layout >
      <Content style={{ padding: '12px', marginTop: '24px', maxWidth: '1400px', margin: '0 auto', marginLeft: '50px' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', padding: '10px' }}>
              <Menu mode="vertical" defaultSelectedKeys={['1']} style={{ border: 'none', backgroundColor: 'transparent' }} items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: 'Thông tin người dùng',
                },
                {
                  key: '2',
                  icon: <HeartOutlined />,
                  label: <Link to="/view-fetus-health">Xem thông tin sức khỏe</Link>,
                },
              ]} />
            </Card>
          </Col>

          {/* Thông tin người dùng */}
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
                        border: '2px solid #1890ff',
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
                            border: 'none'
                          }}
                        />
                      </Upload>
                    )}
                  </div>
                  <Title level={4}>{userDetailData?.fullName || userLogin?.fullName}</Title>
                  <p>{userDetailData?.email || userLogin?.email}</p>
                  <p>{userLogin?.phone}</p>
                  <p>{userLogin?.address}</p>
                </Col>

                <Col span={16}>
                  <Title level={3}>Thông tin cá nhân</Title>
                  <Form
                    form={profileForm}
                    layout="vertical"
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '20px',
                      borderRadius: '8px',
                    }}
                    onFinish={handleSubmit}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Họ và Tên" name="fullName">
                          <Input disabled={!isEditing} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Email" name="email">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tên đăng nhập" name="username">
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item label="Căn cước công dân" name="cccd">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Ngày Sinh" name="dateOfBirth">
                          <Input type="date" disabled={!isEditing} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Vai Trò" name="roleId">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        {!isEditing ? (
                          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                            Chỉnh sửa
                          </Button>
                        ) : (
                          <>
                            <Button type="primary" onClick={() => profileForm.submit()} style={{ width: '48%' }}>
                              Lưu
                            </Button>
                            <Button onClick={() => {
                              setIsEditing(false);
                              setPreviewAvatar(userDetailData.avatar);
                              setAvatarFile(null);
                              profileForm.resetFields();
                            }} style={{ width: '48%' }}>
                              Hủy
                            </Button>
                          </>
                        )}
                      </Space>
                    </Form.Item>
                  </Form>
                  <Title level={3}>Đổi mật khẩu</Title>
                  <Form form={passwordForm} layout="vertical" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }} onFinish={handleSubmitPassword}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Mật Khẩu Cũ"
                          name="currentPassword"
                          rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu cũ!' }
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
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
                      <Col span={12}>
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