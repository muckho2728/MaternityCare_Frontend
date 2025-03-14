import { Card, Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './PackageList.css';
import { useEffect, useState } from 'react';
import api from '../../config/api';

const PackageList = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [packages, setPackages] = useState([]);

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

  const handleBuyClick = (id) => {
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
        <Row gutter={16} justify="center">
          {packages?.map(pkg => (
            <Col span={8} key={pkg.id}>
              <Card title={pkg.type} bordered={true} className="package-card">
                <div className="package-container">
                  <p className="package-price">Giá: {pkg.price}</p>
                  <p className="package-duration">Thời hạn: {pkg.duration}</p>
                  <p className="package-features">Tính năng: </p>
                </div>
                <ul className="package-features-container">
                  {pkg.features.map((feature) => (
                    <li key={feature.id}>{feature.trim()}</li>
                  ))}
                </ul>
                <Button type="primary" onClick={() => handleBuyClick(pkg.id)}>Mua</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
};

export default PackageList;