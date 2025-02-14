import React, { useState } from 'react';
import './CreateFetusHealth.css';

const CreateFetusHealth = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', healthData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHealthData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                            max="42"
                        />
                    </div>

                    <div className="form-group">
                        <label>Chu vi đầu (Head Circumference) (cm)</label>
                        <input
                            type="number"
                            name="headCircumference"
                            value={healthData.headCircumference}
                            onChange={handleChange}
                            required
                            step="0.1"
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
                        <label> Chiều dài đầu mông (Crown Rump Length) (mm)</label>
                        <input
                            type="number"
                            name="crownRumpLength"
                            value={healthData.crownRumpLength}
                            onChange={handleChange}
                            required
                            step="0.1"
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
                            step="0.1"
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
        </div>
    );
};

export default CreateFetusHealth;