import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import './PackageList.css'; // Import file CSS

const PackageList = () => {
  // Dữ liệu mẫu để hiển thị
  const sampleData = [
    { id: 1, name: 'Basic Package', description: 'Basic features', price: '$10', duration: '1 Month' },
    { id: 2, name: 'Standard Package', description: 'Standard features', price: '$20', duration: '1 Month' },
    { id: 3, name: 'Premium Package', description: 'All features', price: '$30', duration: '1 Month' },
  ];

  return (
    <div className="package-list">
      <header className="package-list-header">
        <h1>Available Packages</h1>
      </header>
      <main className="package-list-content">
        <Row gutter={16}>
          {sampleData.map(pkg => (
            <Col span={8} key={pkg.id}>
              <Card title={pkg.name} bordered={false} className="package-card">
                <p>{pkg.description}</p>
                <p>Price: {pkg.price}</p>
                <p>Duration: {pkg.duration}</p>
                <Button type="primary">Buy</Button> 
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
};

export default PackageList;