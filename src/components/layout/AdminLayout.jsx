import { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  ReadOutlined,
  TransactionOutlined,
  CommentOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../constants/AuthContext';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const items = [
    {
      key: '/admin/manage-user',
      icon: <PieChartOutlined />,
      label: <Link to="/admin/manage-user">User</Link>,
    },
    {
      key: '/admin/manage-packages',
      icon: <DesktopOutlined />,
      label: <Link to="/admin/manage-packages">Packages</Link>,
    },
    {
      key: 'doctor',
      icon: <TeamOutlined />,
      label: 'Doctor',
      children: [
        {
          key: '/admin/manage-doctor',
          icon: <CalendarOutlined />,
          label: <Link to="/admin/manage-doctor">Quản lý Doctor</Link>,
        },
        {
          key: '/admin/create-doctor-slot',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/create-doctor-slot">Tạo Slot Doctor</Link>,
        },
      ],
    },
    {
      key: 'blog',
      icon: <ReadOutlined />,
      label: 'Blog',
      children: [
        {
          key: '/admin/manage-blog',
          label: <Link to="/admin/manage-blog">Quản lý bài viết</Link>,
        },
      ],
    },
    {
      key: 'transaction',
      icon: <TransactionOutlined />,
      label: <Link to="/admin/manage-transaction">Transaction</Link>,
    },
    {
      key: 'feedback',
      icon: <CommentOutlined  />,
      label: <Link to="/admin/manage-feedback">Feedback</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span style={{ color: 'red' }}>Logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu 
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={items} 
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            {location.pathname.includes('manage-user') && <Breadcrumb.Item>Manage Users</Breadcrumb.Item>}
            {location.pathname.includes('manage-packages') && <Breadcrumb.Item>Manage Packages</Breadcrumb.Item>}
            {location.pathname.includes('manage-doctor') && <Breadcrumb.Item>Manage Doctor</Breadcrumb.Item>}
            {location.pathname.includes('create-doctor-slot') && <Breadcrumb.Item>Tạo Slot Doctor</Breadcrumb.Item>}
            {location.pathname.includes('manage-transaction') && <Breadcrumb.Item>Manage Transaction</Breadcrumb.Item>}
            {location.pathname.includes('manage-feedback') && <Breadcrumb.Item>Manage Feedback</Breadcrumb.Item>}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
