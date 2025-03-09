import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
//import logo from '../../assets/MaternityCare.png';
import { useAuth } from '../../constants/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications] = useState(3); // Giả sử có 3 thông báo
    const dropdownRef = useRef(null);
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // const showSidebar = () => {
    //     const sidebar = document.querySelector('.sidebar');
    //     sidebar.style.display = 'flex';
    // };

    // const hideSidebar = () => {
    //     const sidebar = document.querySelector('.sidebar');
    //     sidebar.style.display = 'none';
    // };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-section"  onClick={() => navigate('/')}>
                    <Link to="/src/assets/Vector.png" className="logo-link">
                        <img src="/src/assets/Vector.png" alt="Baby Logo" className="logo" />
                        <span className="brand-name">Maternity Care</span>
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        <li><Link to="/community">Diễn Đàn</Link></li>
                        <li><Link to="/create-fetus">Đăng ký thông tin thai nhi</Link></li>
                        <li><Link to="/package-list">Dịch Vụ</Link></li>
                        <li><Link to="/booking">Đặt Lịch</Link></li>
                    </ul>
                </nav>

                <script>
                    {`
                    function showSiderbar() {
                        const sidebar = document.querySelector('.sidebar');
                        sidebar.style.display = 'flex';
                    }
                    function hideSiderbar() {
                        const sidebar = document.querySelector('.sidebar');
                        sidebar.style.display = 'none';
                    }
                    `}
                </script>

                <div className="header-actions">
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm..." />
                        <button className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    {/* 🔔 Nút thông báo với số lượng */}
                    <div className="notification-container">
                        <button className="notification-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
                        </button>
                    </div>

                    {user ? (
                        <div className="profile-dropdown" ref={dropdownRef}>
                            <button className="profile-button" onClick={toggleDropdown}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">Hồ sơ người dùng</Link>
                                    <Link to="/view-fetus-health" className="dropdown-item">Hồ sơ sức khỏe</Link>
                                    {/* 🔴 Đăng xuất */}
                                    <button className="dropdown-item logout-button" onClick={handleLogout}>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="login-link">Đăng nhập</Link> 
                            <Link to="/register" className="register-link">/Đăng Ký</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
