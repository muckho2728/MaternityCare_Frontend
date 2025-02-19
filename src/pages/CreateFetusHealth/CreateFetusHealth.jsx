import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreateFetusHealth.css';
import axios from '../../constants/axios';
import { toast } from 'react-toastify';

const CreateFetusHealth = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    // const token = localStorage.getItem('token');
    // const fetusId = localStorage.getItem('fetusId');

    // Lấy ngày thụ thai từ CreateFetus
    // const conceptionDate = location.state?.conceptionDate || '';

    const [healthData, setHealthData] = useState({
        week: '',
        headCircumference: '',
        amnioticFluidLevel: '',
        crownRumpLength: '',
        biparietalDiameter: '',
        femurLength: '',
        estimatedFetalWeight: '',
        abdominalCircumference: '',
        gestationalSacDiameter: '',
        // conceptionDate // Gán ngày thụ thai vào dữ liệu sức khỏe
    });

    // useEffect(() => {
    //     if (!conceptionDate) {
    //         toast.error("Không tìm thấy thông tin ngày thụ thai. Vui lòng nhập lại.");
    //         navigate('/create-fetus'); // Quay lại nếu thiếu dữ liệu
    //     }
    // }, [conceptionDate, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`https://maternitycare.azurewebsites.net/api/fetuses/${fetusId}/fetuses-healths`, healthData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Thông tin sức khỏe thai nhi đã được lưu!");
            navigate('/dashboard'); // Chuyển hướng sau khi lưu thành công
        } catch (error) {
            console.error("Lỗi khi gửi request:", error);
            toast.error("Lỗi khi lưu thông tin sức khỏe. Vui lòng thử lại.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'week') {
            if (value >= 1 && value <= 4) {
                setHealthData(prevState => ({
                    ...prevState,
                    crownRumpLength: 'Không có dữ liệu'
                }));
            } else {
                setHealthData(prevState => ({
                    ...prevState,
                    crownRumpLength: ''
                }));
            }
            if (value >= 1 && value <= 11) {
                setHealthData(prevState => ({
                    ...prevState,
                    headCircumference: 'Không có dữ liệu'
                }));
            } else {
                setHealthData(prevState => ({
                    ...prevState,
                    headCircumference: ''
                }));
            }
            if (value >= 1 && value <= 11) {
                setHealthData(prevState => ({
                    ...prevState,
                    biparietalDiameter: 'Không có dữ liệu'
                }));
            } else {
                setHealthData(prevState => ({
                    ...prevState,
                    biparietalDiameter: ''
                }));
            }
        }
        setHealthData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isLoggedIn = true; // giả sử đã đăng nhập

    return (
        <div className="create-fetus-health-container">
            <h1 className="page-title">Thông tin sức khỏe thai nhi</h1>

            {!isLoggedIn ? (
                <p>Bạn cần đăng nhập để nhập dữ liệu.</p>
            ) : (
                <form className="health-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tuần (Week)</label>
                            <input
                                type="number"
                                name="week"
                                value={healthData.week}
                                onChange={handleChange}
                                required
                                min="1"
                                max="41"
                            />
                        </div>

                        <div className="form-group">
                            <label>Chu vi đầu (Head Circumference) (mm)</label>
                            <input
                                type="number"
                                name="headCircumference"
                                value={healthData.headCircumference}
                                onChange={handleChange}
                                required
                                step="1"
                                disabled={healthData.week >= 1 && healthData.week <= 11}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mức độ nước ối (Amniotic fluid)</label>
                            <select
                                name="amnioticFluidLevel"
                                value={healthData.amnioticFluidLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn mức độ</option>
                                <option value="normal">Bình thường</option>
                                <option value="low">Thấp</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label> Chiều dài đầu mông (Crown Rump Length) (cm)</label>
                            <input
                                type="number"
                                name="crownRumpLength"
                                value={healthData.crownRumpLength}
                                onChange={handleChange}
                                required
                                step="0.5"
                                disabled={healthData.week >= 1 && healthData.week <= 4}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label> Đường kính lưỡng đỉnh (Biparietal Diameter) (mm)</label>
                            <input
                                type="number"
                                name="biparietalDiameter"
                                value={healthData.biparietalDiameter}
                                onChange={handleChange}
                                required
                                step="1"
                                disabled={healthData.week >= 1 && healthData.week <= 11}
                            />
                        </div>

                        <div className="form-group">
                            <label>Chiều dài xương đùi (Femur Length) (mm)</label>
                            <input
                                type="number"
                                name="femurLength"
                                value={healthData.femurLength}
                                onChange={handleChange}
                                required
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label> Cân nặng thai nhi ước tính (Estimated Fetal Weight) (g)</label>
                            <input
                                type="number"
                                name="estimatedFetalWeight"
                                value={healthData.estimatedFetalWeight}
                                onChange={handleChange}
                                required
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Chu vi vòng bụng (Abdominal Circumference) (mm)</label>
                            <input
                                type="number"
                                name="abdominalCircumference"
                                value={healthData.abdominalCircumference}
                                onChange={handleChange}
                                required
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Đường kính túi thai (Gestational Sac Diameter) (mm)</label>
                            <input
                                type="number"
                                name="gestationalSacDiameter"
                                value={healthData.gestationalSacDiameter}
                                onChange={handleChange}
                                required
                                step="0.1"
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-button">Lưu thông tin</button>
                </form>
            )}
        </div>
    );
};

export default CreateFetusHealth;