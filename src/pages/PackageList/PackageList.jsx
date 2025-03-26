import { Card, Col, Row, Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../config/api";
import "./PackageList.css";

const PackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState("Free");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const packageSectionRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/authentications/current-user");
        setCurrentPackage(response.data.subscription);
        setIsLoggedIn(true);
      } catch (error) {
        console.warn("Người dùng chưa đăng nhập, hiển thị danh sách gói dịch vụ.");
        setIsLoggedIn(false);
        setCurrentPackage("Free"); // Người dùng chưa đăng ký thì mặc định là gói Free
      }
    };
    fetchCurrentUser();
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("packages/active-packages");
        const updatedPackages = response.data.map((pkg) => ({
          ...pkg,
          features: pkg.feature.split(";"),
        }));
        setPackages(updatedPackages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick = (id) => {
    if (!isLoggedIn) {
      navigate("/register");
    } else if (currentPackage === "Premium") {
      message.info("🎉 Bạn đang sử dụng gói Cao Cấp.");
    } else {
      navigate(`/payment-detail/${id}`);
    }
  };
// 🔥 Xử lý sự kiện khi nhấn nút CTA
const handleCTAClick = () => {
  if (!isLoggedIn) {
    navigate("/register");
  } else if (currentPackage === "Premium") {
    message.info("🎉 Bạn đang sử dụng gói Cao Cấp.");
  } else {
    navigate(`/payment-detail/2`);
  }
};


  return (
    <div className="package-list">
      {/* 🌟 Hero Section */}
      <header className="hero-section">
        <h1>🌿 Gói Dịch Vụ Chăm Sóc Thai Kỳ - Đồng Hành Cùng Mẹ & Bé 🌿</h1>
        <p>Chọn gói dịch vụ phù hợp để theo dõi thai kỳ một cách an toàn & khoa học.</p>
      </header>

      {currentPackage !== "Premium" && (
  <section className="cta-section">
    <h2>🌟 Chăm sóc thai kỳ toàn diện chưa bao giờ dễ dàng đến thế! 🌟</h2>
    <p>Nâng cấp ngay để tận hưởng đầy đủ tiện ích và sự hỗ trợ từ chuyên gia.</p>
    <Button type="primary" size="large" onClick={handleCTAClick}>
      Chọn Gói Ngay
    </Button>
  </section>
)}

      {/* 📊 Bảng So Sánh Gói Dịch Vụ */}
      <section className="comparison-section">
        <h2>📊 So Sánh Gói Dịch Vụ</h2>
        <Table
          dataSource={[
            { key: "1", feature: "Truy cập Blog Cộng Đồng 📝", free: "✔️", premium: "✔️" },
            { key: "2", feature: "Bình luận & Thảo luận 💬", free: "✔️", premium: "✔️" },
            { key: "3", feature: "Nhận tài liệu miễn phí 📄", free: "✔️", premium: "✔️" },
            { key: "4", feature: "Theo dõi Thai Nhi 📊", free: "❌", premium: "✔️" },
            { key: "5", feature: "Đặt lịch khám trực tuyến 🏥", free: "❌", premium: "✔️" },
            { key: "6", feature: "Nhắc nhở lịch khám 🔔", free: "❌", premium: "✔️" },
            { key: "7", feature: "Hỗ trợ ưu tiên 📞", free: "❌", premium: "✔️" },
            { key: "8", feature: "💰 Giá", free: "Miễn phí", premium: "200.000 VND/tháng" },
            {
              key: "9",
              feature: "🚀 Chọn ngay",
              free: isLoggedIn ? "" : <Button type="primary" onClick={() => navigate("/register")}>Đăng ký ngay</Button>,
              premium: currentPackage === "Premium" ? "🎉 Bạn đang sử dụng gói Cao Cấp" : (
                <Button type="primary" onClick={() => handleBuyClick(2)}>Nâng cấp ngay</Button>
              ),
            },
          ]}
          columns={[
            { title: "Tính Năng", dataIndex: "feature", key: "feature" },
            { title: "Miễn Phí 🆓", dataIndex: "free", key: "free", align: "center" },
            { title: "Cao Cấp 🌟", dataIndex: "premium", key: "premium", align: "center" },
          ]}
          pagination={false}
          bordered
        />
      </section>

      {/* 💳 Gói Dịch Vụ (Card UI) */}
      <section className="package-list-content" ref={packageSectionRef}>
        <h2>📦 Chọn Gói Dịch Vụ Phù Hợp Cho Bạn</h2>
        <p className="package-description">
          Hãy lựa chọn gói phù hợp với nhu cầu của bạn để có trải nghiệm theo dõi thai kỳ tốt nhất.
          Gói Cao Cấp 🌟 mang đến nhiều quyền lợi đặc biệt giúp bạn chăm sóc thai kỳ toàn diện hơn.
        </p>

        <Row gutter={30} justify="center">
  {packages.map((pkg) => (
    <Col xs={24} sm={12} md={8} key={pkg.id}>
      <Card
        title={pkg.type}
        bordered={true}
        className={`package-card ${pkg.type === currentPackage ? "current-package" : ""} ${pkg.type === "Premium" ? "highlight-package" : ""}`}
      >
        <div className="package-price">
          {pkg.price === 0 ? "Miễn phí" : `${pkg.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}
        </div>
        <div className="package-duration">⏳ Thời hạn: {pkg.duration} tháng</div>
        <ul className="package-features">
          {pkg.features.map((feature, index) => (
            <li key={index}>✅ {feature.trim()}</li>
          ))}
        </ul>

        <div className="package-actions">
          {pkg.price !== 0 ? (
            currentPackage === pkg.type ? (
              <>
                <span className="current-package-label">🎉 Gói hiện tại của bạn</span>
                <br />
                <Button type="primary" className="feedback-btn" onClick={() => navigate('/feedback')}>
                  Gửi Feedback
                </Button>
              </>
            ) : (
              <Button 
                type="primary" 
                className="buy-btn" 
                onClick={() => handleBuyClick(pkg.id)}
              >
                {isLoggedIn ? "Nâng Cấp Ngay" : "Đăng Ký Ngay"}
              </Button>
            )
          ) : (
            currentPackage === "Free" && <span className="current-package-label">🎉 Gói hiện tại của bạn</span>
          )}
        </div>

      </Card>
    </Col>
  ))}
</Row>
      </section>
    </div>
  );
};

export default PackageList;
