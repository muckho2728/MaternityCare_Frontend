import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';
import { useAuth } from '../../../constants/AuthContext';

const { Title } = Typography;

const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchData();
    } else {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [user, pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("transactions", {
        params: {
          PageNumber: pagination.current,
          PageSize: pagination.pageSize,
        },
      });
      console.log("API Response:", response.data);

      setTransactions(response.data.items);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error); 
      if (error.response && error.response.status === 403) {
        alert('Bạn không có quyền truy cập trang này.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Gói',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${text} VND`,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    console.log('Xem chi tiết giao dịch:', record); 
    navigate(`/transaction-detail/${record.id}`); 
  };

  return (
    <div className="transaction-management">
      <Title level={2}>Quản lý giao dịch</Title>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
};

export default TransactionManagementPage;