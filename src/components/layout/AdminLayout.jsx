import { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  ReadOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const location = useLocation();

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
          key: '/admin/manage-blogs',
          label: <Link to="/admin/manage-blogs">Quản lý bài viết</Link>,
        },
        {
          key: '/admin/review-blogs',
          label: <Link to="/admin/review-blogs">Duyệt bài viết</Link>,
        },
      ],
    },
    {
      key: 'transaction',
      icon: <TransactionOutlined />,
      label: <Link to="/admin/manage-transaction">Transaction</Link>,
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
