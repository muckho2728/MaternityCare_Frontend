import { Card, Col, Row, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../config/api';
import './PackageList.css';


const PackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState("Free");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get(`/authentications/current-user`);
        setCurrentPackage(response.data.subscription);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("packages/active-packages");
        const updatedPackages = response.data.map(pkg => ({
          ...pkg,
          features: pkg.feature.split(';')
        }));
        setPackages(updatedPackages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick = (id) => {
    navigate(`/payment-detail/${id}`);
  };

  return (
    <div className="package-list">
      {/* 🌟 Hero Section */}
      <header className="hero-section">
        <h1>🌿 Gói Dịch Vụ Chăm Sóc Thai Kỳ - Đồng Hành Cùng Mẹ & Bé 🌿</h1>
        <p>Chọn gói dịch vụ phù hợp để theo dõi thai kỳ một cách an toàn & khoa học.</p>
      </header>

      {/* 📊 Bảng So Sánh Gói Dịch Vụ */}
      <section className="comparison-section">
        <h2>So Sánh Gói Dịch Vụ</h2>
        <Table
          dataSource={[
            { key: '1', feature: 'Truy cập Blog Cộng Đồng', free: '✔️', premium: '✔️' },
            { key: '2', feature: 'Bình luận & Thảo luận', free: '✔️', premium: '✔️' },
            { key: '3', feature: 'Theo dõi Thai Nhi', free: '❌', premium: '✔️' },
            { key: '4', feature: 'Đặt lịch khám trực tuyến', free: '❌', premium: '✔️' },
            { key: '5', feature: 'Hỗ trợ ưu tiên', free: '❌', premium: '✔️' },
          ]}
          columns={[
            { title: 'Tính Năng', dataIndex: 'feature', key: 'feature' },
            { title: 'Miễn Phí 🆓', dataIndex: 'free', key: 'free', align: 'center' },
            { title: 'Cao Cấp 🌟', dataIndex: 'premium', key: 'premium', align: 'center' },
          ]}
          pagination={false}
          bordered
        />
      </section>

      {/* 💳 Gói Dịch Vụ (Card UI) */}
      <section className="package-list-content">
  <h2>📦 Chọn Gói Dịch Vụ Phù Hợp Cho Bạn</h2>
  <p className="package-description">
    Hãy lựa chọn gói phù hợp với nhu cầu của bạn để có trải nghiệm theo dõi thai kỳ tốt nhất.  
    Gói Cao Cấp 🌟 mang đến nhiều quyền lợi đặc biệt giúp bạn chăm sóc thai kỳ toàn diện hơn.
  </p>
  
  <Row gutter={30} justify="center">
    {packages.map(pkg => (
      <Col xs={24} sm={12} md={8} key={pkg.id}>
        <Card 
          title={pkg.type} 
          bordered={true} 
          className={`package-card ${pkg.type === currentPackage ? "current-package" : ""} ${pkg.type === "Premium" ? "highlight-package" : ""}`}
        >
          <div className="package-price">{pkg.price === 0 ? 'Miễn phí' : `${pkg.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</div>
          <div className="package-duration">⏳ Thời hạn: {pkg.duration} tháng</div>
          <ul className="package-features">
            {pkg.features.map((feature, index) => (
              <li key={index}>✅ {feature.trim()}</li>
            ))}
          </ul>
          {pkg.price !== 0 && (
            <Button type="primary" className="buy-btn" onClick={() => handleBuyClick(pkg.id)}>Nâng Cấp Ngay</Button>
          )}
        </Card>
      </Col>
    ))}
  </Row>
</section>


      {/* 🔥 CTA Cuối Trang */}
      <section className="cta-section">
        <h2>🌟 Chăm sóc thai kỳ toàn diện chưa bao giờ dễ dàng đến thế! 🌟</h2>
        <p>Nâng cấp ngay để tận hưởng đầy đủ tiện ích và sự hỗ trợ từ chuyên gia.</p>
        <Button type="primary" size="large" onClick={() => navigate('/register')}>Chọn Gói Ngay</Button>
      </section>
    </div>
  );
};

export default PackageList;
