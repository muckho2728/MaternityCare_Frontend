import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../constants/axios';
import './CreateFetusHealth.css';

const CreateFetusHealth = () => {
    const navigate = useNavigate();
    const [healthData, setHealthData] = useState({
        week: '',
        headCircumference: '',
        amnioticFluidLevel: '',
        crownRumpLength: '',
        biparietalDiameter: '',
        femurLength: '',
        estimatedFetalWeight: '',
        abdominalCircumference: '',
        gestationalSacDiameter: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHealthData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`https://maternitycare.azurewebsites.net/api/fetuses/1/fetuses-healths`, healthData);
            toast.success("Thông tin sức khỏe thai nhi đã được lưu!");
            navigate('/dashboard');
        } catch {
            toast.error("Lỗi khi lưu thông tin sức khỏe. Vui lòng thử lại.");
        }
    };

    return (
        <div className="fetus-health-container">
            <h1 className="page-title">Theo dõi sức khỏe thai kỳ</h1>

            <div className="content">
                {/* Cột trái: Hình ảnh minh họa */}
                <div className="left-section">
                    <img src="/images/baby_growth.png" alt="Thai nhi phát triển" className="baby-image" />
                    <p className="growth-info">
                        Theo dõi các chỉ số thai nhi để đánh giá sự phát triển của bé qua từng tuần.
                    </p>
                </div>

                {/* Cột phải: Form nhập dữ liệu */}
                <div className="right-section">
                    <form className="health-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tuần thai (Week)</label>
                            <input type="number" name="week" value={healthData.week} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Chu vi đầu (mm)</label>
                            <input type="number" name="headCircumference" value={healthData.headCircumference} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Mức độ nước ối</label>
                            <select name="amnioticFluidLevel" value={healthData.amnioticFluidLevel} onChange={handleChange} required>
                                <option value="">Chọn mức độ</option>
                                <option value="normal">Bình thường</option>
                                <option value="low">Thấp</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateFetusHealth;
