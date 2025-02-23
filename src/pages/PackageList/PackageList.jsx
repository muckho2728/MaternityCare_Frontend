import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './PackageList.css'; 

const PackageList = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const sampleData = [
    { id: 1, name: 'Gói Theo Dõi Cơ Bản', price: '10 US$/tháng', features: ['Cập nhật hàng tuần về sự phát triển của thai nhi', 'Bài viết hướng dẫn chăm sóc sức khỏe', 'Nhắc nhở lịch khám thai', 'Diễn đàn hỗ trợ từ các chuyên gia'] },
    { id: 2, name: 'Gói Theo Dõi Cao Cấp', price: '30 US$/tháng', features: ['Tất cả tính năng của Gói Cơ Bản', 'Tư vấn cá nhân từ chuyên gia dinh dưỡng', 'Khóa học trực tuyến về dinh dưỡng và thể dục cho mẹ bầu', 'Truy cập vào các bài viết chuyên sâu và video hướng dẫn'] },
  ];

  const handleBuyClick = () => {
    navigate('/payment-detail'); // Chuyển hướng đến trang PaymentDetail
  };

  return (
    <div className="package-list">
      <header className="package-list-header">
        <h2>Danh sách gói</h2>
      </header>
      <main className="package-list-content">
        <Row gutter={16} justify="center">
          {sampleData.map(pkg => (
            <Col span={8} key={pkg.id}>
              <Card title={pkg.name} bordered={true} className="package-card">
                <p className="package-price">Giá: {pkg.price}</p>
                <ul>
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Button type="primary" onClick={handleBuyClick}>Mua</Button> {/* Thêm onClick */}
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
};

export default PackageList;