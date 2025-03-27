import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ state khi redirect
  const paymentData = location.state?.paymentData || {};

  return (
    <div className="payment-success-page" style={{ padding: '24px' }}>
      <Result
        status="success"
        title="Thanh Toán Thành Công!"
        subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
        extra={[
          <Button 
            type="primary" 
            key="home" 
            onClick={() => navigate('/')}
          >
            Trang Chủ
          </Button>
        ]}
      />
    </div>
  );
};

export default PaymentSuccessPage;