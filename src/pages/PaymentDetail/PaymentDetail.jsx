import React from 'react';
import { Card, Col, Row, Button, Typography } from 'antd';
import './PaymentDetail.css';
import card from '../../assets/visa.jpg';
const { Title } = Typography;

const PaymentDetail = () => {
  return (
    <div className="payment-detail">
      <Title level={2}>Payment Details</Title>
      <Row gutter={16}>
        <Col span={16}>
        
          
        </Col>
        <Col span={8}>
          <Card title="Payment Summary" className="summary-card">
            <p>Total Due: $2,820</p>
            <p>Commission: $100</p>
            <p>Final Amount: $2,720</p>
            <Button type="primary">Pay Now</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentDetail;