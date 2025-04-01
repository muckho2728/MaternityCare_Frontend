import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import api from '../../constants/axios';
import { toast } from 'react-toastify';
// import registBanner from '../../assets/registachnen.png';
// import logo from '../../assets/MaternityCare.png';

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
    setLoading(true);
    const newErrors = ValidateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await api.post("https://maternitycare.azurewebsites.net/api/authentications/register", formData);
        console.log(response);
        toast.success("Đăng kí thành công, xin hãy xác thực email của bạn");
        console.log(formData);
        navigate("/login");
      } catch (err) {
        console.log(err.response);
        toast.error("Đăng kí thất bại");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      setLoading(false);
    }
  };
  const ValidateForm = () => {
    const newErrors = {};
    if (ActiveTab === "register") {
      if (!formData.email) {
        newErrors.email = "Email không được để trống";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không được nhập đúng định dạng";
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
    <div className="register-page">
      {/* <div className="register-image">
        <img src={registBanner} alt="Register" />
      </div> */}
      <div className="register-container">
        <Link to="/" className="logo-link">
          <img src="https://i.pinimg.com/736x/1b/eb/d1/1bebd1f8eeaca63322da4858e57edaea.jpg" alt="Baby Logo" className="logo" style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }} />
        </Link>
        <h1 className="register-title">Đăng ký</h1>
        <div className="form-group">
          <p>Họ và tên</p>
          <input type="text" name="fullName" value={formData.fullName} placeholder="vd: Nguyễn Văn A" className={`form-control ${errors.fullName ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.fullName && <span className="invalid-feedback">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <p>Email</p>
          <input type="email" name="email" value={formData.email} placeholder="vd: ABC@gmail.com" className={`form-control ${errors.email ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.email && <span className="invalid-feedback">{errors.email}</span>}
        </div>
        <div className="form-group">
          <p>Tài khoản</p>
          <input type="text" name="username" value={formData.username} placeholder="vd: nguyenvana" className={`form-control ${errors.username ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.username && <span className="invalid-feedback">{errors.username}</span>}
        </div>
        <div className="form-group">
          <p>Ngày sinh</p>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.dateOfBirth && <span className="invalid-feedback">{errors.dateOfBirth}</span>}
        </div>
        <div className="form-group">
          <p>CCCD</p>
          <input type="text" name="cccd" value={formData.cccd} placeholder="vd: 012345678912" className={`form-control ${errors.cccd ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.cccd && <span className="invalid-feedback">{errors.cccd}</span>}
        </div>
        <div className="form-group">
          <p>Mật khẩu</p>
          <input type="password" name="password" value={formData.password} placeholder="vd: 12345678" className={`form-control ${errors.password ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.password && <span className="invalid-feedback">{errors.password}</span>}
        </div>
        <div className="form-group">
          <p>Xác nhận mật khẩu</p>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="vd: 12345678" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} onChange={handleInputChange} />
          {errors.confirmPassword && <span className="invalid-feedback">{errors.confirmPassword}</span>}
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleRegister}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
        <div className="login-link-container">
          <p>Đã có tài khoản?</p>
          <Link to="/login" className="login-link"> Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;