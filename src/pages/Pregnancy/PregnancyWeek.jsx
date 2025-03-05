import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Pregnancy.css';

import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import pregnancyData from './pregnancyData';

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
        console.log(standardData);
        console.log(userData);
        // Convert API response into the chart format
        setWeight(standardData.estimatedFetalWeight);
        setUserWeight(userData?.estimatedFetalWeight);
        const updatedData = data.map(item => ({ 
          name: item.name,
          standard:  parseRange(standardData[item.key]) , 
          user: userData ? userData[item.key] : 0, 
          key: item.key
        }));
        console.log(updatedData)
        setChartData(updatedData);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
      }
    };
  
    fetchStandardData();
  }, [week]);
  
  const parseRange = (range) => {
    console.log(range)
    if (!range) return 0;  // Handle null or undefined cases
    const parts = range.split('-').map(Number);
    return parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0]; // Return average or single value
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

        {weekData.images.map((img, index) => (
          <img key={index} src={img} alt={`Week ${week}`} className="ovulation-image" />
        ))}
      </div>
    </div>
  );
};

export default PregnancyWeek;