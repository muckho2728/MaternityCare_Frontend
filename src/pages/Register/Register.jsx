import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./index.css";
import api from './config/axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    dateOfBirth: "",
    cccd: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = ValidateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/register", formData);// Navigate to login page
        toast.success("Đăng kí thành công");
        navigate("/login");
      } catch (err) {
        console.log(err.response.data.detail);
        toast.error(err.response.data.detail || "Đăng kí thất bại");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const ValidateForm = () => {
    const newErrors = {};
    if (ActiveTab === "register") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }
    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập đầy đủ họ và tên";
    if (!formData.username) newErrors.username = "Vui lòng nhập đầy đủ tên người dùng";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Vui lòng nhập ngày sinh";
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu không trùng khớp";
    }
    if (!formData.cccd) newErrors.cccd = "Vui lòng nhập số CCCD";
    return newErrors;
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="slide-in-left">
      <div className="register-container">
        <div className="register-form">
          <h2 className="register-title">Đăng ký</h2>
          <div className="form-group">
            <p>Họ và tên</p>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              placeholder="vd:Nguyễn Văn A"
              className={`input-field ${errors.fullName ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <p>Email</p>
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="vd:ABC@gmail.com"
              className={`input-field ${errors.email ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <p>Tài khoản</p>
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="vd:nguyenvana"
              className={`input-field ${errors.username ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          <div className="form-group">
            <p>Ngày sinh</p>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              className={`input-field ${errors.dateOfBirth ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>
          <div className="form-group">
            <p>CCCD</p>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              placeholder="vd:012345678912"
              className={`input-field ${errors.cccd ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.cccd && <span className="error-message">{errors.cccd}</span>}
          </div>
          <div className="form-group">
            <p>Mật khẩu</p>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="vd:12345678"
              className={`input-field ${errors.password ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="form-group">
            <p>Xác nhận mật khẩu</p>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="vd:12345678"
              className={`input-field ${errors.confirmPassword ? "error" : ""}`}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className={`register-button ${ActiveTab === "register" ? "active-class" : ""}`} onClick={handleRegister}>Đăng ký</button>
          <p>Đã có tài khoản? <button><Link to="/login" className="login-reg-button">Đăng nhập ngay</Link></button></p>
        </div>
        <div className="picture">Picture</div>
      </div>
    </div>
  );
};

export default Register;
