import { Carousel } from 'antd';
import './Home.css';
import slide1 from '../../assets/Slide1.jpg';
import slide2 from '../../assets/Slide2.jpg';
import slide3 from '../../assets/Slide3.jpg';
import slide4 from '../../assets/Slide4.jpg';
import pregnancy from '../../assets/pregnancy.png';
import booking from '../../assets/booking.jpg';
import packageImg from '../../assets/package.png';
import communityImg from '../../assets/community.png';
import { useNavigate } from 'react-router-dom';
import intro1 from '../../assets/intro1.jpg';
import intro2 from '../../assets/intro2.jpg';
import intro3 from '../../assets/intro3.jpg';
import intro4 from '../../assets/intro4.jpg';
import { useState, useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(2);
    const [currentPackage, setCurrentPackage] = useState("free"); // Thêm state currentPackage

    useEffect(() => {
        const storedWeek = localStorage.getItem('currentWeek');
        if (storedWeek) {
            setCurrentWeek(parseInt(storedWeek, 10));
        }
    }, []);

    const handleNavigation = (path) => {
        if (currentPackage === "free" && path !== "/booking") {
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
                                <img src={slide1} alt="Slide 1" style={{ width: '100%', height: 'auto', maxHeight: '400px' }} />
                            </div>
                            <div>
                                <img src={slide2} alt="Slide 2" style={{ width: '100%', height: 'auto', maxHeight: '400px' }} />
                            </div>
                            <div>
                                <img src={slide3} alt="Slide 3" style={{ width: '100%', height: 'auto', maxHeight: '400px' }} />
                            </div>
                            <div>
                                <img src={slide4} alt="Slide 4" style={{ width: '100%', height: 'auto', maxHeight: '400px' }} />
                            </div>
                        </Carousel>
                    </div>

                    <div className="feature-container">
                        <div
                            className={`feature-card ${currentPackage === "free" ? "disabled" : ""}`}
                            onClick={() => handleNavigation(`/pregnancy/${currentWeek}`)}
                        >
                            <img src={pregnancy} alt="Theo dõi thai kỳ" />
                            <h3>Theo dõi thai kỳ</h3>
                            <p>Cập nhật sự phát triển của bé theo từng tuần.</p>
                            {currentPackage === "free" && <div className="overlay">Vui lòng nâng cấp gói</div>}
                        </div>
                        <div className={`feature-card ${currentPackage === "free" ? "disabled" : ""}`}
                            onClick={() => handleNavigation(`/booking/${currentWeek}`)}>
                            <img src={booking} alt="Đặt lịch khám" />
                            <h3>Đặt lịch khám</h3>
                            <p>Đặt lịch hẹn với bác sĩ.</p>
                            {currentPackage === "free" && <div className="overlay">Vui lòng nâng cấp gói</div>}
                        </div>
                        <div
                            className={`feature-card ${currentPackage === "free" ? "disabled" : ""}`}
                            onClick={() => handleNavigation('/package-list')}
                        >
                            <img src={packageImg} alt="Dịch vụ chăm sóc" />
                            <h3>Dịch vụ</h3>
                            <p>Các dịch vụ hỗ trợ sức khỏe mẹ và bé.</p>
                            {currentPackage === "free" && <div className="overlay">Vui lòng nâng cấp gói</div>}
                        </div>
                        <div
                            className={`feature-card ${currentPackage === "free" ? "disabled" : ""}`}
                            onClick={() => handleNavigation('/community')}
                        >
                            <img src={communityImg} alt="Diễn đàn mẹ bầu" />
                            <h3>Diễn đàn mẹ bầu</h3>
                            <p>Kết nối và chia sẻ với các mẹ bầu khác.</p>
                            {currentPackage === "free" && <div className="overlay">Vui lòng nâng cấp gói</div>}
                        </div>
                    </div>

                    <div className="introduction-form">
                        <div className="introduction-gallery">
                            <div className="introduction-gallery1">
                                <img className="introduction-img1" src={intro1} alt="Giới thiệu 1" />
                                <img className="introduction-img2" src={intro2} alt="Giới thiệu 2" />
                            </div>
                            <div className="introduction-gallery1">
                                <img className="introduction-img3" src={intro3} alt="Giới thiệu 3" />
                                <img className="introduction-img4" src={intro4} alt="Giới thiệu 4" />
                            </div>
                        </div>
                        <div className="introduction-text">
                            <h2>GIỚI THIỆU VỀ MATERNITY CARE</h2>
                            <p>
                                <strong>Maternity Care</strong> là nền tảng hỗ trợ theo dõi thai kỳ và chăm sóc sức khỏe mẹ bầu toàn diện.
                                Chúng tôi giúp mẹ bầu dễ dàng nắm bắt thông tin quan trọng trong suốt thai kỳ, cung cấp lời khuyên khoa học
                                từ chuyên gia, và kết nối với cộng đồng mẹ bầu để chia sẻ kinh nghiệm.
                            </p>
                            <p>
                                Tại <strong>Maternity Care</strong>, bạn có thể:
                            </p>
                            <ul>
                                <li>🍼 <strong>Theo dõi thai kỳ:</strong> Cập nhật thông tin phát triển của bé qua từng tuần.</li>
                                <li>📅 <strong>Đặt lịch khám:</strong> Liên hệ bác sĩ sản khoa và đặt lịch trực tuyến nhanh chóng.</li>
                                <li>💖 <strong>Dịch vụ chăm sóc:</strong> Các dịch vụ giúp mẹ bầu thư giãn và chăm sóc sức khỏe tốt nhất.</li>
                                <li>👩‍👩‍👦 <strong>Diễn đàn mẹ bầu:</strong> Kết nối với hàng ngàn mẹ bầu khác để cùng chia sẻ và học hỏi.</li>
                            </ul>
                            <p>
                                Chúng tôi mong muốn trở thành người đồng hành đáng tin cậy của mẹ bầu trong suốt hành trình mang thai.
                                Hãy cùng Maternity Care trải nghiệm một thai kỳ an toàn và hạnh phúc! 🌸
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;