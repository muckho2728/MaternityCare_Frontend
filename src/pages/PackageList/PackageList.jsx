import { Card, Col, Row, Button, message } from "antd";
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
        setCurrentPackage("Free");
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
      navigate("/login");
    } else if (currentPackage === "Premium") {
      // Xử lý khi đã dùng gói Premium
      navigate("/feedback");
    } else {
      navigate(`/payment-detail/${id}`);
    }
  };

  const premiumPackage = packages.find((pkg) => pkg.type === "Premium");

  const handleCTAClick = () => {
    if (packageSectionRef.current) {
      packageSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="package-list">
      {/* 🌟 Hero Section */}
      <header className="hero-section">
        <h1>🌿 Gói Dịch Vụ Chăm Sóc Thai Kỳ - Đồng Hành Cùng Mẹ & Bé 🌿</h1>
        <Button type="primary" size="large" onClick={handleCTAClick}>
          Tìm hiểu ngay
        </Button>
      </header>

      {/* 💳 Gói Dịch Vụ (Card UI) */}
      <section className="package-list-content" ref={packageSectionRef}>
        <h2>📦 Chọn Gói Dịch Vụ Phù Hợp Cho Bạn</h2>
        <p className="package-description">
          Hãy lựa chọn gói phù hợp với nhu cầu của bạn để có trải nghiệm theo
          dõi thai kỳ tốt nhất. Gói Cao Cấp 🌟 mang đến nhiều quyền lợi đặc biệt
          giúp bạn chăm sóc thai kỳ toàn diện hơn.
        </p>
        <Row gutter={[30, 30]} justify="center" align="stretch">
          {packages.map((pkg) => (
            <Col xs={24} sm={12} md={8} key={pkg.id} style={{ display: "flex" }}>
              <Card
                title={pkg.type}
                bordered={true}
                className={`package-card ${
                  pkg.type === currentPackage ? "current-package" : ""
                } ${pkg.type === "Premium" ? "highlight-package" : ""}`}
              >
                <div className="package-price">
                  {pkg.price === 0
                    ? "Miễn phí"
                    : `${pkg.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}`}
                </div>
                <div className="package-duration">
                  ⏳ Thời hạn: {pkg.duration} tháng
                </div>
                <ul className="package-features">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature.trim()}</li>
                  ))}
                </ul>
                <div className="package-actions">
                  {pkg.price !== 0 ? (
                    currentPackage === pkg.type ? (
                      <>
                        <span className="current-package-label">
                          🎉 Gói hiện tại của bạn
                        </span>
                        <br />
                        <Button
                          type="primary"
                          className="feedback-btn"
                          onClick={() => navigate("/feedback")}
                        >
                          Gửi Feedback
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="primary"
                        className="buy-btn"
                        onClick={() => handleBuyClick(pkg.id)}
                      >
                        {currentPackage === "Premium" ? "Gửi phản hồi" : isLoggedIn ? "Nâng Cấp Ngay" : "Đăng Ký Ngay"}
                      </Button>
                    )
                  ) : isLoggedIn ? (
                    currentPackage === "Free" && (
                      <span className="current-package-label">
                        🎉 Gói hiện tại của bạn
                      </span>
                    )
                  ) : (
                    <Button
                      type="primary"
                      className="register-btn"
                      onClick={() => navigate("/login")}
                    >
                      Đăng Ký Ngay
                    </Button>
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