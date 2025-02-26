import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateFetusHealth.css";
import axios from "../../constants/axios";
import { toast } from "react-toastify";

const CreateFetusHealth = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [fetusHealthId, setFetusHealthId] = useState(null);
    const [healthData, setHealthData] = useState({
        week:+6,
        headCircumference: 0,
        amnioticFluidLevel: 0,
        crownRumpLength: 0,
        biparietalDiameter: 0,
        femurLength: 0,
        estimatedFetalWeight: 0,
        abdominalCircumference: 0,
        gestationalSacDiameter: 0,
    });

    useEffect(() => {
        const fetchFetusData = async () => {
            try {
                const response = await axios.get(
                    `https://maternitycare.azurewebsites.net/api/users/${userId}/fetuses`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.length > 0) {
                    setFetusHealthId(response.data[0].id);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
            }
        };

        fetchFetusData();
    }, [userId, token]);

    const sanitizeHealthData = (data) => {
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = data[key] === "Không có dữ liệu" ? 0 : data[key];
            return acc;
        }, {});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedData = { ...healthData, [name]: value };

        if (name === "week") {
            const week = Number(value);
            updatedData = {
                ...updatedData,
                crownRumpLength: week >= 1 && week <= 4 ? 0 : "",
                headCircumference: week >= 1 && week <= 11 ? 0 : "",
                biparietalDiameter: week >= 1 && week <= 11 ? 0 : "",
            };
        }

        setHealthData(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!fetusHealthId) {
            toast.error("Không tìm thấy ID thai nhi, vui lòng thử lại!");
            return;
        }
    
        const cleanedData = sanitizeHealthData(healthData); // Xử lý dữ liệu trước khi gửi
    
        console.log("Dữ liệu sạch gửi đi:", cleanedData);
    
        try {
            console.log("Data being sent:", cleanedData); // Log the data before sending
            const response = await axios.post(
                `https://maternitycare.azurewebsites.net/api/fetuses/${fetusHealthId}/fetus-healths`,
                cleanedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("Response từ server:", response);
            toast.success("Thông tin sức khỏe thai nhi đã được lưu!");
            navigate("/pregnancy");
        } catch (error) {
            console.error("Lỗi khi gửi request:", error.response?.data || error.message);
            toast.error("Lỗi khi lưu thông tin sức khỏe. Vui lòng thử lại.");
        }
    };
    

    return (
        <div className="create-fetus-health-container">
            <h1 className="page-title">Thông tin sức khỏe thai nhi</h1>
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
                            placeholder={healthData.week >= 1 && healthData.week <= 11 && "Không có dữ liệu"}
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
                            <option value={0}>Chọn mức độ</option>
                            <option value={1}>Bình thường</option>
                            <option value={2}>Thấp</option>
                            <option value={3}>Cao</option>
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
                            placeholder={healthData.week >= 1 && healthData.week <= 4 && "Không có dữ liệu"}
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
                            placeholder={healthData.week >= 1 && healthData.week <= 11 && "Không có dữ liệu"}
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

                <div className="form-row">
                    <div className="form-group">
                        <label>Cân nặng thai nhi ước tính (Estimated Fetal Weight) (g)</label>
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

                <button type="submit" className="submit-button">Lưu thông tin</button>
            </form>
        </div>
    );
};

export default CreateFetusHealth;

