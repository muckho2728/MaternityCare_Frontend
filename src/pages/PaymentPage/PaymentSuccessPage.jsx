import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-page">
      <Result
        status="success"
        title="Thanh Toán Thành Công!"
        subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Trang Chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccessPage;