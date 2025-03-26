import { Carousel } from "antd";
import "./Home.css";
import slide1 from "../../assets/Slide1.jpg";
import slide2 from "../../assets/Slide2.jpg";
import slide3 from "../../assets/Slide3.jpg";
import slide4 from "../../assets/Slide4.jpg";
import pregnancy from "../../assets/pregnancy.png";
import booking from "../../assets/booking.jpg";
import packageImg from "../../assets/package.png";
import communityImg from "../../assets/community.png";
import { useNavigate } from "react-router-dom";
import intro1 from "../../assets/intro1.jpg";
import intro2 from "../../assets/intro2.jpg";
import intro3 from "../../assets/intro3.jpg";
import intro4 from "../../assets/intro4.jpg";
import { useState, useEffect } from "react";
import api from "../../config/api";
import vitaminImg from "../../assets/vitamin.jpg";
import stretchMarkImg from "../../assets/stretchMark.jpg";
import pillowImg from "../../assets/pillow.jpg";
import breastPumpImg from "../../assets/breastPump.jpg";
import maternityDressImg from "../../assets/maternityDress.jpg";
const Home = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(2);
  const [currentPackage, setCurrentPackage] = useState("Free");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedWeek = localStorage.getItem("currentWeek");
        if (storedWeek) {
          setCurrentWeek(parseInt(storedWeek, 10));
        }

        const response = await api.get(`/authentications/current-user`);
        setCurrentPackage(response.data.subscription);
      } catch (error) {
        console.error("error fetching current user: ", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleNavigation = (path) => {
    if (
      currentPackage === "Free" &&
      (path.includes("pregnancy") || path.includes("booking"))
    ) {
      alert("Vui lòng nâng cấp gói để sử dụng tính năng này!");
      return;
    }
    navigate(path);
  };

  return (
    <div className="home">
      <main className="main-content">
        <section className="introduction">
          <div className="slide-container">
            <Carousel autoplay>
              <div>
                <img
                  src={slide1}
                  alt="Slide 1"
                  style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                />
              </div>
              <div>
                <img
                  src={slide2}
                  alt="Slide 2"
                  style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                />
              </div>
              <div>
                <img
                  src={slide3}
                  alt="Slide 3"
                  style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                />
              </div>
              <div>
                <img
                  src={slide4}
                  alt="Slide 4"
                  style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                />
              </div>
            </Carousel>
          </div>

          <div className="feature-container">
            <div
              className={`feature-card ${
                currentPackage === "free" ? "disabled" : ""
              }`}
              onClick={() => handleNavigation(`/pregnancy/${currentWeek}`)}
            >
              <img src={pregnancy} alt="Theo dõi thai kỳ" />
              <h3>Theo dõi thai kỳ</h3>
              <p>
                📅 Cập nhật sự phát triển của bé theo từng tuần. Hành trình
                tuyệt vời đang chờ đón mẹ!
              </p>
              {currentPackage === "free" && (
                <div className="overlay">Vui lòng nâng cấp gói</div>
              )}
            </div>
            <div
              className={`feature-card ${
                currentPackage === "free" ? "disabled" : ""
              }`}
              onClick={() => handleNavigation(`/booking/${currentWeek}`)}
            >
              <img src={booking} alt="Đặt lịch khám" />
              <h3>Đặt lịch khám</h3>
              <p>
                🏥 Đặt lịch hẹn với bác sĩ dễ dàng, giúp mẹ yên tâm suốt thai
                kỳ.
              </p>
              {currentPackage === "free" && (
                <div className="overlay">Vui lòng nâng cấp gói</div>
              )}
            </div>
            <div
              className={`feature-card ${
                currentPackage === "free" ? "disabled" : ""
              }`}
              onClick={() => handleNavigation("/package-list")}
            >
              <img src={packageImg} alt="Dịch vụ chăm sóc" />
              <h3>Dịch vụ</h3>
              <p>
                💆‍♀️ Các dịch vụ thư giãn, chăm sóc sức khỏe tốt nhất cho mẹ bầu.
              </p>
              {currentPackage === "free" && (
                <div className="overlay">Vui lòng nâng cấp gói</div>
              )}
            </div>
            <div
              className={`feature-card ${
                currentPackage === "free" ? "disabled" : ""
              }`}
              onClick={() => handleNavigation("/community")}
            >
              <img src={communityImg} alt="Diễn đàn mẹ bầu" />
              <h3>Diễn đàn mẹ bầu</h3>
              <p>
                👩‍👩‍👦 Kết nối với các mẹ bầu khác, chia sẻ kinh nghiệm & niềm vui.
              </p>
              {currentPackage === "free" && (
                <div className="overlay">Vui lòng nâng cấp gói</div>
              )}
            </div>
          </div>

          <div className="introduction-form">
            <div className="introduction-gallery">
              <div className="introduction-gallery1">
                <img
                  className="introduction-img1"
                  src={intro1}
                  alt="Giới thiệu 1"
                />
                <img
                  className="introduction-img2"
                  src={intro2}
                  alt="Giới thiệu 2"
                />
              </div>
              <div className="introduction-gallery1">
                <img
                  className="introduction-img3"
                  src={intro3}
                  alt="Giới thiệu 3"
                />
                <img
                  className="introduction-img4"
                  src={intro4}
                  alt="Giới thiệu 4"
                />
              </div>
            </div>
            <div className="introduction-text">
              <h2>CHÀO MỪNG MẸ ĐẾN VỚI MATERNITY CARE</h2>
              <p>
                <strong>Maternity Care</strong> ra đời với sứ mệnh đồng hành cùng mẹ trong suốt chín tháng mười ngày, mang đến những công cụ hỗ trợ cần thiết để hành trình này trở nên nhẹ nhàng, ý nghĩa và trọn vẹn hơn.
              </p>
              <p>
                <p>🎯 Tại sao mẹ cần Maternity Care?</p>
              </p>
              <ul>
                <li>🍼Hiểu rõ từng giai đoạn phát triển của bé: Chúng tôi giúp mẹ cập nhật thông tin chi tiết về sự phát triển của bé, những thay đổi trong cơ thể mẹ và những điều cần lưu ý để chăm sóc tốt nhất cho cả hai.</li>
                <li>
                  📅Chủ động chăm sóc sức khỏe: Maternity Care giúp mẹ dễ dàng đặt lịch khám, lưu trữ thông tin sức khỏe và luôn sẵn sàng cho mỗi cột mốc quan trọng.
                </li>
                <li>
                  💖Kết nối với cộng đồng: Mẹ không hề đơn độc trong hành trình này. Hàng ngàn mẹ bầu khác cũng đang trải qua những cảm xúc, lo lắng và niềm vui giống mẹ.
                  dưỡng.
                </li>
                <li>
                  👩‍👩‍👦 Chuẩn bị sẵn sàng cho ngày gặp con: Thai kỳ không chỉ là chín tháng mong chờ mà còn là khoảng thời gian để mẹ chuẩn bị tốt nhất cho hành trình làm mẹ. 
                </li>
              </ul>
              <p>
                🌿 Hãy để Maternity Care trở thành người bạn đồng hành của mẹ – giúp mẹ yên tâm tận hưởng từng khoảnh khắc của hành trình kỳ diệu này. Vì mỗi thai kỳ là một câu chuyện đẹp, và chúng tôi muốn cùng mẹ viết nên những trang đầu tiên trọn vẹn nhất. 🌿
              </p>
            </div>
          </div>
          <div className="suggested-products">
          <h2>Sản phẩm gợi ý</h2>
  <div className="carousel-wrapper">
    <div className="product-list">
      <div className="product-card">
        <img src={vitaminImg} alt="Vitamin cho bà bầu" />
        <h3>Vitamin Bầu</h3>
        <p>Bổ sung dưỡng chất cho mẹ và bé.</p>
      </div>
      <div className="product-card">
        <img src={stretchMarkImg} alt="Kem trị rạn da" />
        <h3>Kem Trị Rạn</h3>
        <p>Giúp da đàn hồi, giảm rạn da khi mang thai.</p>
      </div>
      <div className="product-card">
        <img src={pillowImg} alt="Gối ôm bầu" />
        <h3>Gối Ôm Bầu</h3>
        <p>Hỗ trợ giấc ngủ thoải mái cho mẹ.</p>
      </div>
      <div className="product-card">
        <img src={breastPumpImg} alt="Máy hút sữa" />
        <h3>Máy Hút Sữa</h3>
        <p>Giúp mẹ hút sữa dễ dàng, tiện lợi.</p>
      </div>
      <div className="product-card">
        <img src={maternityDressImg} alt="Đầm bầu" />
        <h3>Đầm Bầu</h3>
        <p>Thời trang bầu đẹp, thoải mái.</p>
      </div>
    </div>
    {/* Nhân đôi để tạo vòng lặp mượt hơn */}
    <div className="product-list">
      <div className="product-card">
        <img src={vitaminImg} alt="Vitamin cho bà bầu" />
        <h3>Vitamin Bầu</h3>
        <p>Bổ sung dưỡng chất cho mẹ và bé.</p>
      </div>
      <div className="product-card">
        <img src={stretchMarkImg} alt="Kem trị rạn da" />
        <h3>Kem Trị Rạn</h3>
        <p>Giúp da đàn hồi, giảm rạn da khi mang thai.</p>
      </div>
      <div className="product-card">
        <img src={pillowImg} alt="Gối ôm bầu" />
        <h3>Gối Ôm Bầu</h3>
        <p>Hỗ trợ giấc ngủ thoải mái cho mẹ.</p>
      </div>
      <div className="product-card">
        <img src={breastPumpImg} alt="Máy hút sữa" />
        <h3>Máy Hút Sữa</h3>
        <p>Giúp mẹ hút sữa dễ dàng, tiện lợi.</p>
      </div>
      <div className="product-card">
        <img src={maternityDressImg} alt="Đầm bầu" />
        <h3>Đầm Bầu</h3>
        <p>Thời trang bầu đẹp, thoải mái.</p>
      </div>
    </div>
  </div>
        </div>
        </section>
        
      </main>
    </div>
  );
};

export default Home;
