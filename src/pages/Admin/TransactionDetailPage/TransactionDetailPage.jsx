import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Descriptions, Typography, Spin } from 'antd';
import api from '../../../config/api'; // Điều chỉnh đường dẫn tùy theo cấu trúc dự án của bạn
import { useAuth } from '../../../constants/AuthContext'; // Sử dụng context để kiểm tra quyền truy cập

const { Title } = Typography;

const TransactionDetailPage = () => {
  const { transactionId } = useParams(); // Lấy transactionId từ URL
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User:", user); // Log thông tin người dùng
    console.log("Transaction ID:", transactionId); // Log transactionId

    // Kiểm tra quyền truy cập
    if (user && user.role === 'Admin') {
      fetchTransactionDetails();
    } else {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [transactionId, user]);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`transactions/${transactionId}`);
      console.log("Transaction Details:", response.data); // Log chi tiết giao dịch
      setTransaction(response.data);
    } catch (error) {
      console.error('Error fetching transaction details:', error); // Log lỗi
      if (error.response && error.response.status === 404) {
        alert('Không tìm thấy giao dịch.');
        navigate('/transaction-management-page');
      } else if (error.response && error.response.status === 403) {
        alert('Bạn không có quyền truy cập trang này.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />; // Hiển thị spinner khi đang tải dữ liệu
  }

  if (!transaction) {
    return <div>Không tìm thấy thông tin giao dịch.</div>; // Hiển thị thông báo nếu không có dữ liệu
  }

  return (
    <div className="transaction-detail">
      <Title level={2}>Chi tiết giao dịch</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{transaction.id}</Descriptions.Item>
        <Descriptions.Item label="Người dùng">{transaction.userName}</Descriptions.Item>
        <Descriptions.Item label="Gói">{transaction.packageName}</Descriptions.Item>
        <Descriptions.Item label="Số tiền">{transaction.amount} VND</Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">{transaction.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{transaction.status}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{new Date(transaction.createdAt).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Chi tiết bổ sung">
          {/* Hiển thị các thông tin bổ sung nếu có */}
          {transaction.additionalDetails || 'Không có thông tin bổ sung.'}
        </Descriptions.Item>
      </Descriptions>

      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={() => navigate('/transaction-management-page')}
      >
        Quay lại
      </Button>
    </div>
  );
};

export default TransactionDetailPage;