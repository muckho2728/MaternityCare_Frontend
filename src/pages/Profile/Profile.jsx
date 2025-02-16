import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Input, Button, Form, Typography, Card, Row, Col, Space, message, Upload } from 'antd';
import { UserOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';
import { updateUserByIdAction, changePassworbyUserIdAction, fetchUserByIdAction } from '../../../../MaternityCare_Frontend/src/store/redux/action/userAction';
import api from '../../constants/axios';

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const userLogin = useSelector((state) => state.userReducer.currentUser);
  const userDetailData = useSelector((state) => state.userReducer.user);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentUser, setCurrentUser] = useState(null); // Sử dụng currentUser thay vì user
console.log(userDetailData)
  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchCurrentUser = async (url) => {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
        console.log('Current user data:', response.data);
        setCurrentUser(response.data); // Cập nhật currentUser thay vì user
      } catch (error) {
        console.error('Failed to fetch current user:', error.response ? error.response.data : error.message);
        throw error;
      }
    };

    fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
  }, []); // Không phụ thuộc vào user

  if (userLogin) {
    console.log('userDetailData:', userDetailData);
  }
  // Gọi API để lấy thông tin chi tiết người dùng khi currentUser thay đổi
  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(fetchUserByIdAction(currentUser.id));
    }

  }, [currentUser, dispatch]);

  // Cập nhật form khi userDetailData thay đổi
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
    }
  }, [userDetailData, profileForm]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('dateOfBirth', values.dateOfBirth);

    if (previewAvatar) {
      const response = await fetch(previewAvatar);
      const blob = await response.blob();

      // Lấy tên gốc từ URL nếu có
      const fileName = previewAvatar.split('/').pop() || 'avatar.png';

      formData.append('avatar', blob, fileName);
    }

    dispatch(updateUserByIdAction(userDetailData.id, formData))
      .then(() => {
        message.success('Cập nhật thông tin thành công!');
        dispatch(fetchUserByIdAction(userDetailData.id));
      })
      .catch((error) => {
        message.error('Cập nhật thông tin thất bại: ' + (error.message || 'Lỗi không xác định'));
      });
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
        dispatch(fetchUserByIdAction(userDetailData.id));
      })
      .catch((error) => {
        message.error('Đổi mật khẩu thất bại: ' + (error.message || 'Lỗi không xác định'));
      });
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Content style={{ padding: '12px', marginTop: '24px', maxWidth: '1400px', margin: '0 auto', marginLeft: '50px' }}>
        <Row gutter={24}>
          {/* Menu bên trái */}
          <Col span={6}>
            <Card style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', padding: '10px' }}>
              <Menu mode="vertical" defaultSelectedKeys={['1']} style={{ border: 'none' }} items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: 'Thông tin người dùng',
                },
                {
                  key: '2',
                  icon: <HeartOutlined />,
                  label: 'Thông tin sức khỏe thai nhi',
                },
                {
                  key: '3',
                  icon: <TeamOutlined />,
                  label: 'Quản lý đội',
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
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => setPreviewAvatar(e.target.result);
                      reader.readAsDataURL(file);
                      profileForm.setFieldsValue({ avatar: [file] });
                      return false;
                    }}
                  >
                    <img
                      src={previewAvatar || userDetailData.avatar}
                      alt="avatar"
                      style={{
                        width: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </Upload>
                  <Title level={4}>{userLogin?.fullName}</Title>
                  <p>{userLogin?.email}</p>
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
                          <Button type="primary" onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                            Chỉnh sửa
                          </Button>
                        ) : (
                          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Lưu
                          </Button>
                        )}
                      </Space>
                    </Form.Item>
                  </Form>
                  <Title level={3}>Đổi mật khẩu</Title>
                  <Form form={passwordForm} layout="vertical" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Mật Khẩu Cũ" name="currentPassword">
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Mật Khẩu Mới" name="newPassword">
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Nhập Lại Mật Khẩu" name="confirmPassword">
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