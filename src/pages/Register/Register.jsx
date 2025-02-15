import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import "./index.css";
import api from './config/axios';
=======
import './Register.css';
import api from '../../constants/axios';
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
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
<<<<<<< HEAD
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
=======
        try {
            const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/register", formData);
            toast.success("Đăng kí thành công");
            localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Lưu user vào localStorage
            navigate("/profile");
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

>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2

  const ValidateForm = () => {
    const newErrors = {};
    if (ActiveTab === "register") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }
<<<<<<< HEAD
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
=======
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.username) newErrors.username = "User name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.cccd) newErrors.cccd = "CCCD is required";
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
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
<<<<<<< HEAD
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
=======
    <div className="register-page">
      <h1 className="register-title">Đăng ký</h1>
      <div className="form-group">
        <p>Họ và tên</p>
        <input type="text" name="fullName" value={formData.fullName} placeholder="vd:Nguyễn Văn A" className={`form-control ${errors.fullName ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.fullName && <span className="invalid-feedback">{errors.fullName}</span>}
      </div>
      <div className="form-group">
        <p>Email</p>
        <input type="email" name="email" value={formData.email} placeholder="vd:ABC@gmail.com" className={`form-control ${errors.email ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.email && <span className="invalid-feedback">{errors.email}</span>}
      </div>
      <div className="form-group">
        <p>Tài khoản</p>
        <input type="text" name="username" value={formData.username} placeholder="vd:nguyenvana" className={`form-control ${errors.username ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.username && <span className="invalid-feedback">{errors.username}</span>}
      </div>
      <div className="form-group">
        <p>Ngày sinh</p>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.dateOfBirth && <span className="invalid-feedback">{errors.dateOfBirth}</span>}
      </div>
      <div className="form-group">
        <p>CCCD</p>
        <input type="text" name="cccd" value={formData.cccd} placeholder="vd:012345678912" className={`form-control ${errors.cccd ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.cccd && <span className="invalid-feedback">{errors.cccd}</span>}
      </div>
      <div className="form-group">
        <p>Mật khẩu</p>
        <input type="password" name="password" value={formData.password} placeholder="vd:12345678" className={`form-control ${errors.password ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.password && <span className="invalid-feedback">{errors.password}</span>}
      </div>
      <div className="form-group">
        <p>Xác nhận mật khẩu</p>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="vd:12345678" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} onChange={handleInputChange} />
        {errors.confirmPassword && <span className="invalid-feedback">{errors.confirmPassword}</span>}
      </div>
      <button type="submit" className="btn btn-primary" onClick={handleRegister}>Đăng ký</button>
      <p>Đã có tài khoản? <button><Link to="/login" className="btn btn-link">Đăng nhập ngay</Link></button></p>
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
    </div>
  );
};

<<<<<<< HEAD
export default Register;
=======
export default Register;
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
