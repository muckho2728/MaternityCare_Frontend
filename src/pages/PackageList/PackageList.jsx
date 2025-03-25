import { Card, Col, Row, Button, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PackageList.css';
import { useEffect, useState } from 'react';
import api from '../../config/api';

const PackageList = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState("Free");
  const userId = localStorage.getItem('userId');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get(`/authentications/current-user`);
        setCurrentPackage(response.data.subscription);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("packages/active-packages");
        console.log(response.data);

        const updatedPackages = response.data.map(pkg => ({
          ...pkg,
          features: pkg.feature.split(';')
        }));

        setPackages(updatedPackages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick =async(id) => {
    console.log('id: ', id);

    //navigate('/payment-detail', { state: { selectedPackage: pkg } }); // Chuyển hướng và truyền thông tin gói
    navigate(`/payment-detail/${id}`)
   
   
  };

  return (
    <div className="package-list">
      <header className="package-list-header">
        <h2>Danh sách gói</h2>
      </header>
      <main className="package-list-content">
        <Row gutter={18} justify="center">
          {packages?.map(pkg => (
            <Col span={9} key={pkg.id}>
              <Card title={pkg.type} bordered={true} className="package-card">
                <div className="package-container">
                  <p className="package-price">Giá: {pkg.price === 0 ? 'Miễn phí' : `${pkg.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} `}</p>
                  <p className="package-duration">Thời hạn: {pkg.duration} tháng</p>
                  <p className="package-features">Tính năng: </p>
                </div>
                <ul className="package-features-container">
                  {pkg.features.map((feature) => (
                    <li key={feature.id}>{feature.trim()}</li>
                  ))}
                </ul>
                {pkg.price !== 0 && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {currentPackage === pkg.type ? (
                      <Button type="primary" onClick={() => navigate('/feedback')}>Feedback</Button>
                    ) : (
                      <Button type="primary" onClick={() => handleBuyClick(pkg.id)}>Mua</Button>
                    )}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
};

export default PackageList;