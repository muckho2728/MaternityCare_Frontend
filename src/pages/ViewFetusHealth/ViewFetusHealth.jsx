import React, { useContext, useEffect, useState } from 'react';
import './ViewFetusHealth.css';
import { FetusContext } from "../../constants/FetusContext";
import api from '../../constants/axios';

const ViewFetusHealth = () => {
    const { fetusData , setFetusData , healthData ,setHealthData } = useContext(FetusContext);
   
    
    useEffect(() => {
      const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
            const response = await api.get(`https://maternitycare.azurewebsites.net/api/users/${localStorage.getItem('userId')}/fetuses`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the headers
                }
            });
            const fetusID = response.data[0].id;
            const responseHealth = await api.get(`https://maternitycare.azurewebsites.net/api/fetuses/${fetusID}/fetus-healths`, {
              headers: {
                Authorization: `Bearer ${token}` // Add the token to the headers
            }
            })
            setFetusData(response.data[0]);
            console.log(responseHealth.data)
            
            setHealthData(responseHealth.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

        fetchData();
    }, []);

    if (!fetusData || !healthData) {
        return <div>Không có dữ liệu thai nhi .
        </div>;
    }

    return (
        <div className='view-fetus-health'>
            <h1>Thông tin sức khỏe thai nhi</h1>
            <p>Chu vi đầu: {healthData.headCircumference} cm</p>
            <p>Mức nước ối: {healthData.amnioticFluidLevel}</p>
            <p>Chiều dài đầu mỏng: {healthData.crownRumpLength} cm</p>
            <p>Đường kính lưỡng đỉnh: {healthData.biparietalDiameter} cm</p>
            <p>Chiều dài xương đùi: {healthData.femurLength} cm</p>
            <p>Trọng lượng thai ước tính: {healthData.estimatedFetalWeight} kg</p>
            <p>Chu vi bụng: {healthData.abdominalCircumference} cm</p>
            <p>Đường kính túi thai: {healthData.gestationalSacDiameter} cm</p>
        </div>
    );
};

export default ViewFetusHealth;