import React, { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import "./index.css";
import api from './config/axios';
import { toast } from 'react-toastify';
const Login = () => {
=======
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../constants/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../constants/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
  //code remember me
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [ActiveTab, setActiveTab] = useState('login');

  const handleCheckboxChange = () => {
    setRemember(!remember);
  }
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim() || formData.username.length < 1) {
      newErrors.username = "Username cannot be empty";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return newErrors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
<<<<<<< HEAD
      if (ActiveTab == "login") {
        try {
          const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/login", formData);
          console.log(response);
        } catch (error) {
          console.log(error.response.data.detail)
          toast.error(error.response.data.detail);
        }
=======
      try {
        const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/login", formData);
        
        // Lưu thông tin người dùng vào AuthContext
        login({ 
          token: response.data.token, 
          username: formData.username 
        });
        
        // Chuyển hướng về trang chủ sau khi đăng nhập
        navigate('/');
        
        toast.success("Đăng nhập thành công!");
      } catch (error) {
        toast.error(error.response?.data?.detail || "Đăng nhập thất bại");
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
      }
    } else {
      setErrors(newErrors);
    }
  };

  //form login
  return (
<<<<<<< HEAD
    <div className="login-wrapper">

      <div className="slide-in-left">
        <div className="login-container">
          <div className="login-form">
            <h2>Đăng nhập</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Tên người dùng"
              className="input-field"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
              className="input-field"
            />
            <div className="options">
              <label>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Tự động đăng nhập
              </label>
              <Link to="/forget" className="forgot-password">Quên mật khẩu?</Link>
            </div>
            <button type="submit" className={`login-button ${ActiveTab == "login" ? "active class" : ""}`} onClick={handleSubmit} >Đăng nhập</button>
            <div className="register">
              Chưa có tài khoản? <Link to="/regis" className="register-link">Đăng kí ngay</Link>
            </div>
          </div>
        </div>
      </div>
=======
    <div className="login-page">
      <h1>Đăng Nhập</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Tên người dùng"
          className="input-field"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Mật khẩu"
          className="input-field"
        />
        <div className="options">
          <label>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Tự động đăng nhập
          </label>
          <Link to="/forget" className="forgot-password">Quên mật khẩu?</Link>
        </div>
        <button type="submit" className={`login-button ${ActiveTab == "login" ? "active class" : ""}`} >Đăng nhập</button>
        <div className="register">
          Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link>
        </div>
      </form>
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
    </div>
  );
};

export default Login;
