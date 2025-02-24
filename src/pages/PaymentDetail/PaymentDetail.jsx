import React from 'react';
import { Card, Col, Row, Button, Typography } from 'antd';
import './PaymentDetail.css';
import card from '../../assets/visa.jpg';
const { Title, Text } = Typography;

const PaymentDetail = () => {


  return (
    <div className="payment-detail">
      <Title level={2}>Xác Nhận Gói</Title>
      <Row gutter={16}>
        <Col span={16}>
          
          <Card title="Chi Tiết Gói" bordered={true}>
            <p>Thông tin mô tả đã chọn.</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="summary-card" bordered={true}>
            <Title level={4}>Tóm Tắt Thanh Toán</Title>
            <p><Text strong>Tổng số tiền phải trả:</Text> </p>
            <p><Text strong>Số tiền cuối cùng:</Text></p>
            <Button type="primary" block>Thanh Toán</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentDetail;