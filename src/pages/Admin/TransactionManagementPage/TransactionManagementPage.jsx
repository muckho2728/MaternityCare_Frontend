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
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    try {
      const response = await api.get("transactions");
      console.log("API Response:", response.data);

      // Xử lý dữ liệu trả về nếu cần
      const updatedTransactions = response.data.map(transaction => ({
        ...transaction,
        // Ví dụ: Chuyển đổi định dạng ngày tháng
        createdAt: new Date(transaction.createdAt).toLocaleString(),
      }));

      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response && error.response.status === 403) {
        alert('Bạn không có quyền truy cập trang này.');
        navigate('/');
      }
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || 'Không có mô tả', 
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        // Tùy chỉnh hiển thị trạng thái (ví dụ: thêm màu sắc hoặc icon)
        switch (text) {
          case 'success':
            return <span style={{ color: 'green' }}>Thành công</span>;
          case 'pending':
            return <span style={{ color: 'orange' }}>Đang chờ</span>;
          case 'failed':
            return <span style={{ color: 'red' }}>Thất bại</span>;
          default:
            return <span>{text}</span>;
        }
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(), // Định dạng ngày tháng
    },
    {
      title: 'ID đăng ký',
      dataIndex: 'subscriptionId',
      key: 'subscriptionId',
      render: (text) => text || 'Không có', // Hiển thị subscriptionId, nếu không có thì hiển thị "Không có"
    },
  ];



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