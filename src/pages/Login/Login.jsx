import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../constants/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../constants/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByIdAction } from '../../store/redux/action/userAction'; // Đảm bảo import đúng action
import Button from '../../components/Button';
import loginBanner from '../../assets/loginbanner.png';
import logo from '../../assets/MaternityCare.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const userDetailData = useSelector((state) => state.userReducer.user);  

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    }
    if (!formData.password || formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Dừng nếu có lỗi

    setLoading(true);
    try {
      const response = await api.post(
        "https://maternitycare.azurewebsites.net/api/authentications/login",
        formData
      );
      console.log(response);

      // Lưu thông tin người dùng vào AuthContext
      login({
        token: response.data.accessToken,
        username: formData.username,
      });

      // Lấy thông tin người dùng hiện tại và dispatch action
      const userResponse = await api.get(
        "https://maternitycare.azurewebsites.net/api/authentications/current-user",
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        }    
      );
      dispatch(fetchUserByIdAction(userResponse.data.id)); // Dispatch action để lưu thông tin người dùng vào Redux

      // Chuyển hướng về trang chủ sau khi đăng nhập
      navigate('/');
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <Link to="/" className="logo-link">
                        <img src={logo} alt="Baby Logo" className="logo" style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}/>
                    </Link>
        <h1>Đăng Nhập</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Tên người dùng"
            className="input-field"
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
  
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
            className="input-field"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
  
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Tự động đăng nhập
            </label>
            <Link to="/forget" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>
  
          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
  
          <div className="register">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="register-link">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
      <div className="login-banner">
        <img src={loginBanner} alt="Login Banner" />
      </div>
    </div>
  );
  
};

export default Login;