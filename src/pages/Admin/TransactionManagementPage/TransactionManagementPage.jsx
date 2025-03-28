import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';
import { useAuth } from '../../../constants/AuthContext';

const { Title, Text } = Typography;

const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    hasPrevious: false,
    hasNext: false,
    totalPages: 1
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const response = await api.get(`transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      
      // Lấy thông tin phân trang từ header
      const paginationHeader = response.headers['x-pagination'];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        setPagination({
          current: paginationData.CurrentPage,
          pageSize: paginationData.PageSize,
          total: paginationData.TotalCount,
          hasPrevious: paginationData.HasPrevious,
          hasNext: paginationData.HasNext,
          totalPages: paginationData.TotalPages
        });
      }

      const updatedTransactions = response.data.map(transaction => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt).toLocaleString(),
        fullName: transaction.subscription?.user?.fullName || 'N/A',
        email: transaction.subscription?.user?.email || 'N/A',
        cccd: transaction.subscription?.user?.cccd || 'N/A'
      }));

      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền truy cập trang này.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleTableChange = (pagination) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text) => <Text copyable>{text}</Text>
    },
    {
      title: 'Khách hàng',
      children: [
        {
          title: 'Họ tên',
          dataIndex: 'fullName',
          key: 'fullName',
          width: 150
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: 200
        },
        {
          title: 'CCCD',
          dataIndex: 'cccd',
          key: 'cccd',
          width: 120
        }
      ]
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
      align: 'right',
      render: (text) => `${text.toLocaleString('vi-VN')} VND`,
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
          case 'pending':
            color = 'orange';
            text = 'Đang chờ';
            break;
          case 'failed':
            color = 'red';
            text = 'Thất bại';
            break;
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
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
  ];

  return (
    <div className="transaction-management" style={{ padding: '24px' }}>
      <Title level={2}>Quản lý giao dịch</Title>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
          pageSizeOptions: ['10', '20', '50', '100'],
          showQuickJumper: false,
          position: ['bottomRight']
        }}
        onChange={handleTableChange}
        rowKey="id"
        bordered
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default TransactionManagementPage;