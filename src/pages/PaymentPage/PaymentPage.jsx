import React from 'react';
import { Card, Col, Row, Typography, Button } from 'antd';
import './PaymentPage.css'; 

const { Title, Text } = Typography;

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <Title level={2}>Trang Thanh Toán</Title>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Thông Tin Thanh Toán" bordered={true}>
            <p><Text strong>Tên Khách Hàng:</Text> </p>
            <p><Text strong>Email:</Text> </p>
            <p><Text strong>Số Điện Thoại:</Text> </p>
          </Card>
          <Card title="Chi Tiết Đơn Hàng" bordered={true} style={{ marginTop: 16 }}>
            <p><Text strong>Sản Phẩm:</Text> </p>
            <p><Text strong>Tổng Tiền:</Text> </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="summary-card" bordered={true}>
            <Title level={4}>Phương Thức Thanh Toán</Title>
            <p><Text strong>VNPay</Text></p>
            <p><Text>Thanh toán bằng VNPay. Vui lòng nhấn nút dưới đây để tiếp tục.</Text></p>
            <Button type="primary" className="confirm-button">Xác Nhận Thanh Toán</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;