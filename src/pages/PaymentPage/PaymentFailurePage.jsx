import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-failure-page">
      <Result
        status="error"
        title="Thanh Toán Thất Bại"
        subTitle="Vui lòng kiểm tra lại thông tin thanh toán và thử lại."
        extra={[
          <Button type="primary" key="retry" onClick={() => navigate('/payment-detail/:packageId')}>
            Thử Lại
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            Trang Chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentFailurePage;