import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Typography, message } from 'antd';
import './PaymentDetail.css';
import api from '../../config/api';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
const { Title, Text } = Typography;

const PaymentDetail = () => {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchPackageData = async () => {
    try {
      const response = await api.get(`packages/${packageId}`);
      console.log("Package Data:", response.data);
      setPkg(response.data);
    } catch (error) {
      console.error('Error fetching package data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userId = localStorage.getItem('userId');
  console.log('packId: ', packageId, '-', userId);


  // Gọi API khi component được render
  useEffect(() => {
    fetchPackageData();
  }, [packageId]);

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    if (responseCode !== null) {
      if (responseCode === "00") {
        navigate("/payment-success");
      } else {
        navigate("/payment-failure");
      }
    }
  }, [searchParams, navigate]);

 
  const handlePaymentClick = async () => {
    try {
      // const userId = localStorage.getItem('userId');
      // Gọi API subscription
      const response = await api.post(`users/${userId}/packages/${packageId}/subscriptions`)

      // Kiểm tra kết quả từ API
      if (response.data) {
        console.log(response.data)
        // navigate(response.data);
        window.location.href = response.data;
      } else {
        message.error('Đăng ký gói thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      message.error('Có lỗi xảy ra khi đăng ký gói. Vui lòng thử lại.');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  if (!pkg) {
    return <div>Không tìm thấy thông tin gói.</div>;
  }

  return (
    <div className="payment-detail-confirm">
      <Title level={2}>Xác Nhận Gói</Title>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={pkg.type} bordered={true} className="package-card">
            <p className="package-price"><Text strong>Giá:</Text> {pkg.price} VND</p>
            <p className="package-duration"><Text strong>Thời hạn:</Text> {pkg.duration} tháng</p>
            <p className="package-features"><Text strong>Tính năng:</Text></p>
            <ul>
              {pkg.feature.split(';').map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
            </ul>

          </Card>
        </Col>
        <Col span={8}>
          <Card className="summary-card" bordered={true}>
            <Title level={4}>Tóm Tắt Thanh Toán</Title>
            <div className="summary-section">
              <p><Text strong>Tạm tính:</Text> {pkg.price} VND</p>
            </div>
            {/* Nút "Thanh Toán" với sự kiện onClick */}
            <Button type="primary" block onClick={handlePaymentClick}>
              Thanh Toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentDetail;