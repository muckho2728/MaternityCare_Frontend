import React, { useContext, useEffect, useState } from 'react';
import './ViewFetusHealth.css';
import { FetusContext } from "../../constants/FetusContext";
import api from '../../constants/axios';

const ViewFetusHealth = () => {
    const { fetusData } = useContext(FetusContext);
    const [healthData, setHealthData] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!fetusData) return;

            const fetusId = fetusData.id;
            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/fetuses/${fetusId}/fetus-healths`);
                setHealthData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [fetusData]);

    if (!fetusData || !healthData) {
        return <div>Không có dữ liệu thai nhi hoặc sức khỏe.
        </div>;
    }

    return (
        <div className='view-fetus-health'>
            <h1>Thông tin sức khỏe thai nhi</h1>
            <h2>Thông tin sức khỏe</h2>
            <p>Ngày thụ thai: {fetusData.conceptionDate}</p>
            <p>Chu vi đầu: {healthData.headCircumference} cm</p>
            <p>Mức nước ối: {healthData.amnioticFluidLevel}</p>
            <p>Chiều dài crown-rump: {healthData.crownRumpLength} cm</p>
            <p>Đường kính biparietal: {healthData.biparietalDiameter} cm</p>
            <p>Chiều dài xương đùi: {healthData.femurLength} cm</p>
            <p>Trọng lượng thai ước tính: {healthData.estimatedFetalWeight} kg</p>
            <p>Chu vi bụng: {healthData.abdominalCircumference} cm</p>
            <p>Đường kính túi thai: {healthData.gestationalSacDiameter} cm</p>
        </div>
    );
};

export default ViewFetusHealth;