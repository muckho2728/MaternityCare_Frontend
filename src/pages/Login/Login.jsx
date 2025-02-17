import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../constants/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../constants/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  //code remember me
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
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
      if(ActiveTab == "login") {
        
    try {
      const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/login", formData);
      console.log(response);
      // Lưu thông tin người dùng vào AuthContext
      login({ 
        token: response.data.accessToken, 
        username: formData.username 
      });
      
      // Chuyển hướng về trang chủ sau khi đăng nhập
      navigate('/');
      
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.log(error.response);
      toast.error(error || "Đăng nhập thất bại");
    } finally {
      setErrors({});
    }
  }
  }
  };

  //form login
  return (
    <div className="login-page">
      <h1>Đăng Nhập</h1>
      <form>
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
        <button type="submit" className={`login-button ${ActiveTab == "login" ? "active class" : ""}`} disabled={loading} onClick={handleSubmit}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        <div className="register">
          Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;