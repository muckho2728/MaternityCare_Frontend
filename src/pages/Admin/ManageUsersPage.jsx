import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Radio, Drawer, Row, Modal, Form, Input, Table, Select, notification, Upload, Space } from 'antd';
import { EyeOutlined, UserSwitchOutlined } from '@ant-design/icons';
import styles from '../../assets/ManageUsersPage.module.scss';
import { fetchUsersAction, updateUserByIdAction, fetchUserByIdAction, activateUserAction } from '../../store/redux/action/userAction';
const { confirm } = Modal;
const { Option } = Select;

const ManageUsersPage = () => {
  const [open, setOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [filterRole, setFilterRole] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const dispatch = useDispatch();
  const usersData = useSelector(state => state.userReducer.listUser);
  const userDetailData = useSelector(state => state.userReducer.user);

  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchValue(value.toLowerCase());
  };

  const filteredUsersData = Array.isArray(usersData) ? usersData.filter(user => {
    const userRole = user.role?.name?.toLowerCase() || '';
    const matchesRole = filterRole === 'all' || userRole === filterRole;
    const matchesSearch = !searchValue ||
      (user.fullName && user.fullName.toLowerCase().includes(searchValue)) ||
      (user.email && user.email.toLowerCase().includes(searchValue)) ||
      (user.address && user.address.toLowerCase().includes(searchValue));
    return matchesRole && matchesSearch;
  }) : [];

  const showDrawer = (title, user = null) => {
    setDrawerTitle(title);
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      await form.validateFields();
      const userId = selectedUser?.id || userDetailData?.id;
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('dateOfBirth', values.dateOfBirth);

      if (previewAvatar) {
        const response = await fetch(previewAvatar);
        const blob = await response.blob();
        const fileName = previewAvatar.split('/').pop() || 'avatar.png';
        formData.append('avatar', blob, fileName);
      }

      await dispatch(updateUserByIdAction(userId, formData));
      
      notification.success({
        message: 'Success',
        description: 'User information updated successfully',
      });

      closeDrawer();
      dispatch(fetchUsersAction());
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update user information',
      });
    }
  };

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        id: userDetailData.id,
        fullName: userDetailData.fullName || '',
        username: userDetailData.username || '',
        dateOfBirth: userDetailData.dateOfBirth || '',
        email: userDetailData.email || '',
        roleId: userDetailData.role?.name || '',
        avatar: userDetailData.avatar || '',
        experience: userDetailData.experience || 0,
        isActive: userDetailData.isActive ? 'true' : 'false',
        subscription: userDetailData.subscription || '',
      });
    }
  }, [userDetailData, selectedUser, form]);

  const closeDrawer = () => {
    setOpen(false);
    setSelectedUser(null);
    setPreviewAvatar(null);
    form.resetFields();
  };

  const handleView = async (id) => {
    try {
      dispatch(fetchUserByIdAction(id));
      showDrawer('View User', { userId: id });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const handleToggleStatus = (id) => {
    const user = usersData.find(user => user.id === id);
    if (user) {
      confirm({
        title: `Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`,
        onOk() {
          dispatch(activateUserAction(user.id))
            .then(() => {
              notification.success({
                message: 'Success',
                description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
              });
              dispatch(fetchUsersAction());
            })
            .catch(() => {
              notification.error({
                message: 'Error',
                description: `Failed to ${user.isActive ? 'deactivate' : 'activate'} user`,
              });
            });
        },
      });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: role => role.name || 'Unknown' },
    { title: 'Birthday', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'status', 
      render: isActive => (isActive ? 'Active' : 'Inactive') 
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>View</Button>
          <Button disabled={record.isActive} type="link" icon={<UserSwitchOutlined />} onClick={() => handleToggleStatus(record.id)}>
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.manageUsersPage}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
      </Row>
      <Radio.Group 
        onChange={(e) => setFilterRole(e.target.value)} 
        value={filterRole}
        style={{ marginBottom: 16 }}>
        <Radio.Button value="all">All</Radio.Button>
        <Radio.Button value="manager">Manager</Radio.Button>
        <Radio.Button value="member">Member</Radio.Button>
        <Radio.Button value="staff">Staff</Radio.Button>
      </Radio.Group>
      <Table 
        dataSource={filteredUsersData} 
        columns={columns} 
        rowKey="id" 
      />
      <Drawer
        title={drawerTitle}
        width={640}
        onClose={closeDrawer}
        visible={open}
        afterVisibleChange={(visible) => {
          if (!visible) {
            form.resetFields();
          }
        }}
        // extra={
        //   <Space>
        //     <Button onClick={closeDrawer}>Cancel</Button>
        //     <Button type="primary" onClick={form.submit}>
        //       Save
        //     </Button>
        //   </Space>
        // }
      >
        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          <Form.Item name="fullName" label="Full Name">
            <Input placeholder="Please enter the full name" disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Please enter the email" disabled />
          </Form.Item>
          <Form.Item name="roleId" label="Role">
            <Select placeholder="Please select the role" disabled>
              <Option value="manager">Manager</Option>
              <Option value="staff">Staff</Option>
              <Option value="member">Member</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth">
            <Input type="date" placeholder="Please enter the date of birth" disabled />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input placeholder="Please enter the username" disabled />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewAvatar(e.target.result);
                reader.readAsDataURL(file);

                form.setFieldsValue({ avatar: [file] });
                return false; // Ngăn chặn upload tự động
              }}
            >
              <img 
                src={previewAvatar || userDetailData.avatar} 
                alt="avatar" 
                style={{ 
                  width: '100%', 
                  borderRadius: '50%',  
                  objectFit: 'cover'    
                }} 
              />
            </Upload>
          </Form.Item>
          <Form.Item name="experience" label="Experience">
            <Input type="number" placeholder="Please enter the experience" disabled />
          </Form.Item>
          <Form.Item name="isActive" label="Status">
            <Select placeholder="Please select the status" disabled>
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subscription" label="Subscription">
            <Input disabled />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ManageUsersPage;