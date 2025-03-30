import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Pregnancy.css';
import { Modal, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import pregnancyData from './pregnancyData';

import week2 from "../../assets/2.png";
import week3 from "../../assets/3.png";
import week4 from "../../assets/4.png";
import week5 from "../../assets/5.png";
import week6 from "../../assets/6.png";
import week7 from "../../assets/7.png";
import week8 from "../../assets/8.png";
import week9 from "../../assets/9.png";
import week10 from "../../assets/10.png";
import week11 from "../../assets/11.png";
import week12 from "../../assets/12.png";
import week13 from "../../assets/13.png";
import week14 from "../../assets/14.png";
import week15 from "../../assets/15.png";
import week16 from "../../assets/16.png";
import week17 from "../../assets/17.png";
import week18 from "../../assets/18.png";
import week19 from "../../assets/19.png";
import week20 from "../../assets/20.png";
import week21 from "../../assets/21.png";
import week22 from "../../assets/22.png";
import week23 from "../../assets/23.png";
import week24 from "../../assets/24.png";
import week25 from "../../assets/25.png";
import week26 from "../../assets/26.png";
import week27 from "../../assets/27.png";
import week28 from "../../assets/28.png";
import week29 from "../../assets/29.png";
import week30 from "../../assets/30.png";
import week31 from "../../assets/31.png";
import week32 from "../../assets/32.png";
import week33 from "../../assets/33.png";
import week34 from "../../assets/34.png";
import week35 from "../../assets/35.png";
import week36 from "../../assets/36.png";
import week37 from "../../assets/37.png";
import week38 from "../../assets/38.png";
import week39 from "../../assets/39.png";
import week40 from "../../assets/40.png";

const weekImages = {
  2: week2, 3: week3, 4: week4, 5: week5, 6: week6, 7: week7, 8: week8, 9: week9, 
  10: week10, 11: week11, 12: week12, 13: week13, 14: week14, 15: week15, 16: week16, 
  17: week17, 18: week18, 19: week19, 20: week20, 21: week21, 22: week22, 23: week23, 
  24: week24, 25: week25, 26: week26, 27: week27, 28: week28, 29: week29, 30: week30, 
  31: week31, 32: week32, 33: week33, 34: week34, 35: week35, 36: week36, 37: week37, 
  38: week38, 39: week39, 40: week40     
};

const data = [
  { name: 'Chu vi đầu', standard: 0, user: 0, key: 'headCircumference' },
  { name: 'Chiều dài đầu mông', standard: 0, user: 0, key: 'crownRumpLength' },
  { name: 'Đường kính lưỡng đỉnh', standard: 0, user: 0, key: 'biparietalDiameter' },
  { name: 'Chiều dài xương đùi', standard: 0, user: 0, key: 'femurLength' },
  { name: 'Chu vi bụng', standard: 0, user: 0, key: 'abdominalCircumference' },
  { name: 'Đường kính tựi thai', standard: 0, user: 0, key: 'gestationalSacDiameter' }
];

const PregnancyWeek = () => {
  const [chartData, setChartData] = useState(data);
  const [weight, setWeight] = useState(0);
  const [userWeight, setUserWeight] = useState(0);
  const { week } = useParams();
  const weekData = pregnancyData[week];
  const [dueDate, setDueDate] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFetusData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`users/${userId}/fetuses`);
        const fetusData = response.data[0];
        setDueDate(fetusData.dueDate);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thai kỳ:", error);
      }
    }
    fetchFetusData();
  }, []);

  useEffect(() => {
    const fetchStandardData = async () => {
      try {
        const response = await api.get(`fetuses/${localStorage.getItem('fetusId')}/fetus-healths/${week}`);
        const standardData = response.data.standardFetusHealth;
        const userData = response.data.fetusHealth ? response.data.fetusHealth : null;
  
        setWeight(standardData.estimatedFetalWeight || 0);
        setUserWeight(userData?.estimatedFetalWeight || 0);

        let alertsList = [];
        const updatedData = data.map(item => {
          const standardValue = standardData[item.key] ? parseRange(standardData[item.key]) : 0;
          const userValue = userData && userData[item.key] ? userData[item.key] : 0;

          if (userData && Math.abs(userValue - standardValue) > 5) {
            alertsList.push({
              name: item.name,
              userValue: userValue,
              range: { min: standardValue - 5, max: standardValue + 5 }
            });
          }

        // if (userData && standardValue > 0 && Math.abs(userValue - standardValue) > standardValue * 0.1) {
        //   alertsList.push({
        //     name: item.name,
        //     userValue: userValue,
        //     range: { min: standardValue * 0.9, max: standardValue * 1.1 }
        //   });
        // }

          return {
            name: item.name,
            standard: standardValue,
            user: userValue,
            key: item.key
          };
        });
  
        setChartData(updatedData);
        setAlerts(alertsList);
        handleRefresh(); 
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
      }
    };
  
    fetchStandardData();
  }, [week, refresh]); 

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const parseRange = (range) => {
    if (!range || range === null) return 0; 
    const parts = range.split('-').map(Number);
    return parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0]; 
  };
  

  if (!weekData) {
    return <h2>Không tìm thấy dữ liệu cho tuần {week}</h2>;
  }
 

  return (
    <div className="pregnancy-container">
      <h1 className="text-2xl font-bold mb-4 text-center">Theo Dõi Thai Kỳ</h1>
      <h2>Ngày dự sinh: {new Date(dueDate).toLocaleDateString("vi-VN")}</h2>

      <div className="rectangle-box">
        {parseInt(week) > 2 && (
          <Button
            style={{ backgroundColor: "#4CAF50", color: "white", float: "left", marginLeft: "-20px", marginTop: "50px" }}
            onClick={() => navigate(`/pregnancy/${parseInt(week) - 1}`)}
          >
            {parseInt(week) - 1}
          </Button>
        )}
        {parseInt(week) < 40 && (
          <Button
            style={{ backgroundColor: "#4CAF50", color: "white", float: "right", marginRight: "-20px", marginTop: "50px" }}
            onClick={() => navigate(`/pregnancy/${parseInt(week) + 1}`)}
          >
            {parseInt(week) + 1}
          </Button>
        )}
        <div className="circle-box">
          <h3>{weekData.title}</h3>
        </div>
      </div>

      <div className="chart-container">
        <h3>Biểu đồ tăng trưởng</h3>
        <ResponsiveContainer width="96%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 400]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="standard" stroke="#ff0000" name="Dữ liệu chuẩn" />
            <Line type="monotone" dataKey="user" stroke="#0000ff" name="Dữ liệu người dùng" />
          </LineChart>
        </ResponsiveContainer>
      </div>

        <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginTop: '20px' }}>
        Xem cảnh báo
      </Button>

      <Modal title="Cảnh báo chỉ số bất thường" open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        {alerts.length > 0 ? alerts.map((alert, index) => (
          <div key={index} style={{ border: '1px solid red', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#ffebeb' }}>
            <h4>{alert.name} ({alert.userValue} mm)</h4>
            <p>Chỉ số an toàn: {alert.range.min} - {alert.range.max} mm</p>
            <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Chỉ số ngoài phạm vi an toàn!</p>
          </div>
        )) : <p>Không có chỉ số bất thường.</p>}
      </Modal>

      <div className='weight-table'>
        <div className='weight-box'>
          <div className='weight-section'>
            <h4>Trọng lượng thai người dùng</h4>
            <p className='weight-value'> {userWeight}  g</p>
          </div>
          <div className='divider'></div>
          <div className='weight-section'>
            <h4>Trọng lượng thai tiêu chuẩn</h4>
            <p className='weight-value'> {weight}  g</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Điểm nổi bật trong tuần này</h3>
        {weekData.highlights.map((text, index) => (
          <p key={index}>{text}</p>
        ))}

        <h3>Sự phát triển của bé ở tuần này</h3>
        {weekData.development.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
        <div className="image-container">
          <img src={weekImages[week]} alt={`Tuần ${week}`} />
        </div>

        <h3>Thụ Tinh</h3>
        {weekData.symptoms.map((text, index) => (
          <p key={index}>{text}</p>
        ))}

        <h3>Các triệu chứng mang thai trong tuần này</h3>
        {weekData.checklist.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
        <h3>Danh sách kiểm tra thai kỳ ở tuần này</h3>
        {weekData.descriptions.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default PregnancyWeek;