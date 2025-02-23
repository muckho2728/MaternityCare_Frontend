import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import './Home.css';
import slide1 from '../../assets/Slide1.png';
import slide2 from '../../assets/Slide2.jpg';
import slide3 from '../../assets/Slide3.jpg';
import slide4 from '../../assets/Slide4.jpg';
import { useNavigate } from 'react-router-dom'; // Import điều hướng

const Home = () => {
    const navigate = useNavigate(); // Hook để điều hướng

    return (
        <div className="home">
            <main className="main-content">
                <section className="introduction">
                    <div className="slide-container">
                        <Carousel autoplay>
                            <div>
                                <img src={slide1} alt="Slide 1" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide2} alt="Slide 2" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide3} alt="Slide 3" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide4} alt="Slide 4" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                        </Carousel>
                    </div>

                    {/* Thêm các ô điều hướng */}
                    <div className="feature-container">
                        <div className="feature-card" onClick={() => navigate('/pregnancy-tracking')}>
                            <img src="https://via.placeholder.com/150" alt="Theo dõi thai kỳ" />
                            <h3>Theo dõi thai kỳ</h3>
                            <p>Cập nhật sự phát triển của bé theo từng tuần.</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/booking')}>
                            <img src="https://via.placeholder.com/150" alt="Đặt lịch khám" />
                            <h3>Đặt lịch khám</h3>
                            <p>Đặt lịch hẹn với bác sĩ sản khoa.</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/services')}>
                            <img src="https://via.placeholder.com/150" alt="Dịch vụ chăm sóc" />
                            <h3>Dịch vụ chăm sóc</h3>
                            <p>Các dịch vụ hỗ trợ sức khỏe mẹ và bé.</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/community')}>
                            <img src="https://via.placeholder.com/150" alt="Diễn đàn mẹ bầu" />
                            <h3>Diễn đàn mẹ bầu</h3>
                            <p>Kết nối và chia sẻ với các mẹ bầu khác.</p>
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
                            <ul>
                                <li>🍼 <strong>Theo dõi thai kỳ:</strong> Cập nhật thông tin phát triển của bé qua từng tuần.</li>
                                <li>📅 <strong>Đặt lịch khám:</strong> Liên hệ bác sĩ sản khoa và đặt lịch trực tuyến nhanh chóng.</li>
                                <li>💖 <strong>Dịch vụ chăm sóc:</strong> Các dịch vụ giúp mẹ bầu thư giãn và chăm sóc sức khỏe tốt nhất.</li>
                                <li>👩‍👩‍👦 <strong>Diễn đàn mẹ bầu:</strong> Kết nối với hàng ngàn mẹ bầu khác để cùng chia sẻ và học hỏi.</li>
                            </ul>
                        </p>
                        <p>
                            Chúng tôi mong muốn trở thành người đồng hành đáng tin cậy của mẹ bầu trong suốt hành trình mang thai.
                            Hãy cùng Maternity Care trải nghiệm một thai kỳ an toàn và hạnh phúc! 🌸
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;