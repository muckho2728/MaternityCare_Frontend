import { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  HeartOutlined,
  TeamOutlined,
  
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`${key}`}>{label}</Link>,
  };
}

const items = [
  getItem('User', 'manage-user', <PieChartOutlined />),
  getItem('Packages', 'manage-packages', <DesktopOutlined />),
  getItem('Fetus Health', 'manage-fetus-health', <HeartOutlined />), 
  getItem('Doctor', 'manage-doctor', <TeamOutlined />), 
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const location = useLocation();

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            {location.pathname.includes('manage-user') && <Breadcrumb.Item>Manage Users</Breadcrumb.Item>}
            {location.pathname.includes('manage-packages') && <Breadcrumb.Item>Manage Packages</Breadcrumb.Item>}
            {location.pathname.includes('fetus-health') && <Breadcrumb.Item>Fetus Health</Breadcrumb.Item>}
            {location.pathname.includes('manage-doctor') && <Breadcrumb.Item>Manage Doctor</Breadcrumb.Item>}
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
