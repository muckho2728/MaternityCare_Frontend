import React from 'react';
import { Result, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get("vnp_ResponseCode");
  useEffect(() => {
    handlePaymentStatus();
  }, [searchParams, navigate]);

  const handlePaymentStatus = async () => {
    const status = responseCode == '00' ? 'Success' : 'Fail';
    try {
      const response = await api.get(`transactions ? Status = ${status}`);
      if (response.data.status === 'Success') {
        navigate('/payment-success');
      } else {
        navigate('/payment-failure');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    }

  }

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