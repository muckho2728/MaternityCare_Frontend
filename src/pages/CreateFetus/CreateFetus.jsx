import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFetus.css';
import axios from '../../constants/axios';

const CreateFetus = () => {
    const navigate = useNavigate();
    const [fetusData, setFetusData] = useState({
        dueDate: '',
        birthDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', fetusData);
        // Navigate to CreateFetusHealth page
        navigate('/create-fetus-health');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFetusData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="create-fetus-container">
            <h1 className="page-title">Theo dõi thai kỳ</h1>

            <div className="info-sections">
                <div className="info-card">
                    <h3>Theo dõi thai kỳ</h3>
                    <p>Được thiết kế dành riêng cho mẹ nhằm cung cấp các thông tin hữu ích hằng ngày cũng như theo dõi các chỉ số của bé trong suốt thai kỳ.</p>
                </div>

                <div className="info-box pink">
                    <h4>Theo dõi chỉ số của bé trong suốt thai kỳ</h4>
                    <p>App mẹ bầu Maternity Care sẽ hỗ trợ theo dõi các chỉ số cần thiết của bé như: Cân nặng, chiều dài, chu vi đầu, chiều dài xương đùi, đường kính lưỡng đỉnh giúp đề xuất dánh giá sự phát triển của thai nhi trong suốt thai kỳ, đồng thời biết dấu hiệu bất thường.</p>
                </div>

                <div className="info-box blue">
                    <h4>Theo dõi các chỉ số sức khỏe của mẹ</h4>
                    <p>App theo dõi thai kỳ Maternity Care theo dõi các chỉ số sức khỏe của mẹ như: Cân nặng, huyết áp, số đo đường huyết ngẫu nhiên, đường thai, xương thai và các vấn đề về thai thai nghén để giúp mẹ theo dõi và chăm sóc thai kỳ theo đúng quy trình khoa học và đúng theo độ tuổi thai giá.</p>
                </div>

                <div className="info-box purple">
                    <h4>Theo dõi, nhắc nhở lịch khám</h4>
                    <p>Ứng dụng cho mẹ bầu Maternity Care cung cấp lịch khám thai tiêu chuẩn giúp mẹ nắm được thời gian phù hợp. Đặc biệt sẽ đồng thời theo dõi tình trạng sức khỏe của mẹ và xem phát hiện những dấu hiệu bất thường của bé. Nhắc phép tập thể dục, dặm bảo thai kỳ theo từng tuần.</p>
                </div>
            </div>

            <form className="fetus-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Ngày thụ thai</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={fetusData.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Lưu thông tin</button>
            </form>
        </div>
    );
};

export default CreateFetus;

