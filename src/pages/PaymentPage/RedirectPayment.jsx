import React from 'react';
import { Spin } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';

const RedirectPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Chuyển params thành object để dễ sử dụng
  const params = Object.fromEntries(searchParams.entries());

  React.useEffect(() => {
    // Chỉ kiểm tra responseCode và redirect, không xử lý logic phức tạp
    const responseCode = params.vnp_ResponseCode;
    
    if (responseCode === '00') {
      navigate('/payment-success', { 
        state: { 
          paymentData: params  // Truyền toàn bộ params cho trang success
        },
        replace: true  // Xóa lịch sử redirect
      });
    } else {
      navigate('/payment-failure', { 
        state: {
          errorCode: responseCode,
          errorMessage: params.vnp_ResponseMessage || 'Thanh toán thất bại'
        },
        replace: true
      });
    }
  }, [navigate, params]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" tip="Đang chuyển hướng..." />
    </div>
  );
};

export default RedirectPayment;