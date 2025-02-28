import { Card, Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './PackageList.css';
import { useEffect, useState } from 'react';  
import api from '../../config/api';


const PackageList = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [packages, setPackages] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("packages");
        console.log(response.data);
        
        // Map through the response data and convert feature string to an array
        const updatedPackages = response.data.map(pkg => ({
          ...pkg,
          features: pkg.feature.split(';') // Split the feature string into an array
        }));

        setPackages(updatedPackages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick = () => {
    navigate('/payment-detail');
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
                <p className="package-price">Giá: {pkg.price}</p>
                <ul>
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature.trim()}</li> // Trim whitespace from features
                  ))}
                </ul>
                <Button type="primary" onClick={handleBuyClick}>Mua</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
};

export default PackageList;