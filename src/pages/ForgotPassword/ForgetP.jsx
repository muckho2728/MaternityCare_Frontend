import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import "./src/index.css";
import api from './config/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stage, setStage] = useState("email");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return requirements;
  };

  const getPasswordStrength = () => {
    const requirements = validatePassword(password);
    const met = Object.values(requirements).filter(Boolean).length;
    if (met <= 2) return { width: "20%", color: "destructive" };
    if (met <= 3) return { width: "40%", color: "chart-4" };
    if (met <= 4) return { width: "60%", color: "chart-2" };
    return { width: "100%", color: "chart-2" };
  };

  const [formData, setFormData] = useState({ email: "" });
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();

    if (!validateEmail(email)) {
      setErrors({ email: "Vui lòng nhập email hợp lệ" });
      return;
    }

    setLoading(true);
    try {
      console.log("Sending email:", formData.email);
      const payload = { email: String(formData.email) };
      console.log("Request Payload:", payload);
      const response = await api.post(
        "https://maternitycare.azurewebsites.net/api/authentications/password-forgeting",
        payload, { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log(response);
      toast.success("Yêu cầu thành công!");
      setStage("verification");
    } catch (error) {
      console.error(error);
      console.error(error.response?.data);
      toast.error(error.response?.data?.title || "Yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!token) {
      setErrors({ token: "Vui lòng nhập token" });
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStage("reset");
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setErrors({ confirm: "Mật khẩu không khớp" });
      return;
    }
    const requirements = validatePassword(password);
    if (!Object.values(requirements).every(Boolean)) {
      setErrors({ password: "Mật khẩu không đáp ứng yêu cầu" });
      return;
    }
    setLoading(true);
    // Simulate API call
    try{
    const response = await api.put("https://maternitycare.azurewebsites.net/api/authentications/password-forgeting", {
      password: "",
      confirmPassword: ""}, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
      console.log(response);
      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    }catch(error){
      console.error(error);
      console.error("Error Response Data:", error.response?.data);
      toast.error(error.response?.data?.title || "Đặt lại mật khẩu thất bại");
      setLoading(false);
    }finally{
      setLoading(false);
    };
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Đặt lại mật khẩu thành công!");
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="container">
      <h1 className="title">Quên mật khẩu</h1>
      {stage === "email" && (
        <div className="input-container">
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
      )}
      {stage === "email" && (
        <>
          <button
            className="submit-btn"
            onClick={handleEmailSubmit}
            disabled={loading || !formData.email}
          >
            {loading ? <BiLoaderAlt className="animate-spin" /> : 'Gửi yêu cầu'}
          </button>
          <button><Link to="/login" className="login-reg-button">Đăng nhập ngay</Link></button>
        </>
      )}
      {stage === "verification" && (
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            name="token"
            placeholder="Nhập token của bạn"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {errors.token && <p className="error-message">{errors.token}</p>}
        </div>
      )}
      {stage === "verification" && (
        <p className="resend-code">
          {timer > 0 ? (
            `Gửi lại mã trong ${timer}s`
          ) : (
            <button
              onClick={() => {
                setTimer(60);
                setToken("");
              }}
              className="resend-btn"
            >
              Gửi lại mã
            </button>
          )}
        </p>
      )}
      {stage === "verification" && (
        <button className="submit-btn" onClick={handleVerificationSubmit} disabled={loading || !token}>
          {loading ? <BiLoaderAlt className="animate-spin" /> : 'Xác minh mã'}
        </button>
      )}
      {stage === "reset" && (
        <div>
          <div className="input-container">
            <label className="label" htmlFor="password">Mật khẩu mới</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="password-strength">
              <div
                className={`password-strength-bar ${getPasswordStrength().color}`}
                style={{ width: getPasswordStrength().width }}
              />
            </div>
          </div>

          <div className="input-container">
            <label className="label" htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirm && <p className="error-message">{errors.confirm}</p>}
          </div>

          <button className="submit-btn" onClick={handlePasswordReset} disabled={loading}>
            {loading ? <BiLoaderAlt className="animate-spin" /> : 'Đặt lại mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;