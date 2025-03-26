
import { Link } from 'react-router-dom';
import './Footer.css';
import { useState, useEffect } from 'react';

const Footer = () => {
    const [currentWeek, setCurrentWeek] = useState(2);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const storedWeek = localStorage.getItem('currentWeek');
                if (storedWeek) {
                    setCurrentWeek(parseInt(storedWeek, 10));
                }
            } catch (error) {
                console.error("error fetching current user: ", error);
            }
        };
        fetchCurrentUser();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Maternity Care</h3>
                    <ul>
                        <li><Link to={`/pregnancy/${currentWeek}`}>Theo Dõi Thai Kỳ</Link></li>
                        <li><Link to="/view-fetus-health">Hồ Sơ Sức Khỏe</Link></li>
                        <li><Link to="/nutrition">Dinh Dưỡng</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Thư Viện</h3>
                    <ul>
                        <li><Link to="/community">Diễn Đàn</Link></li>
                        <li><Link to="/faq">Câu Hỏi Thường Gặp</Link></li>
                        <li><Link to="/support">Hỗ Trợ</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Liên hệ với chúng tôi tại:</h3>
                    <ul>
                        <li>Email: maternitycare@gmail.com</li>
                        <li>Số điện thoại: (123) 456-7890</li>
                        <li>Địa chỉ: 123 Maternity Care St</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Maternity Care.</p>
                <p>Nguồn thông tin tham khảo từ <a href="https://www.babycenter.com" target="_blank" rel="noopener noreferrer">Babycenter.com</a></p>
            </div>
        </footer>
    );
};

export default Footer;