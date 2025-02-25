import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import api from '../../constants/axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stage, setStage] = useState("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length > 4;
  };

  const handleSendToken = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      
      await api.post("https://maternitycare.azurewebsites.net/api/authentications/password-forgeting", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Mã OTP đã được gửi tới email của bạn!");
      setStage("verification");
    } catch (error) {
      toast.error("Gửi mã thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Mật khẩu phải có ít nhất 5 ký tự");
      return;
    }
    setLoading(true);
    try {
      await api.put("https://maternitycare.azurewebsites.net/api/authentications/password-forgeting", {
        email, otp: token, password, confirmPassword
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Quên mật khẩu</h1>
      <Link to="/login" className="back-to-login">Quay lại đăng nhập</Link>
      {stage === "email" && (
        <div className="input-container">
          <FiMail className="icon" />
          <input type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSendToken} disabled={loading}>
            {loading ? <BiLoaderAlt className="animate-spin" /> : 'Gửi mã'}
          </button>
        </div>
      )}
      {stage === "verification" && (
        <div className="input-container">
          <input type="text" placeholder="Nhập mã OTP" value={token} onChange={(e) => setToken(e.target.value)} />
          <button onClick={() => setStage("reset")}>
            Xác minh
          </button>
        </div>
      )}
      {stage === "reset" && (
        <div className="input-container">
          <FiLock className="icon" />
          <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          <input type={showConfirmPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          <button onClick={handlePasswordReset} disabled={loading}>
            {loading ? <BiLoaderAlt className="animate-spin" /> : 'Đặt lại mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
