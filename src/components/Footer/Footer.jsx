import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Maternity Care</h3>
                    <ul>
                        <li><Link to="/create-fetus">Pregnancy Tracker</Link></li>
                        <li><Link to="/health-records">Health Records</Link></li>
                        <li><Link to="/nutrition">Nutrition Guide</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Resources</h3>
                    <ul>
                        <li><Link to="/articles">Community</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/support">Support</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <ul>
                        <li>Email: maternitycare@gmail.com</li>
                        <li>Phone: (123) 456-7890</li>
                        <li>Address: 123 Baby Care St</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Baby Care. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;