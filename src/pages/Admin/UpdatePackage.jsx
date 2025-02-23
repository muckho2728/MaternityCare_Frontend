import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import './UpdatePackage.css';

const { Title } = Typography;

const UpdatePackage = ({ packageId }) => {
  const [form] = Form.useForm();
  const [packageData, setPackageData] = useState(null);

  // Giả sử bạn có một hàm để lấy dữ liệu gói
  useEffect(() => {
    // Lấy dữ liệu gói từ API hoặc từ props
    const fetchPackageData = async () => {
      // Thay thế với API thực tế
      const data = await fetch(`/api/packages/${packageId}`);
      const result = await data.json();
      setPackageData(result);
      form.setFieldsValue(result); // Đặt giá trị cho form
    };

    fetchPackageData();
  }, [packageId, form]);

  const onFinish = async (values) => {
    console.log('Updated values:', values);
    // Gọi API để cập nhật gói
    await fetch(`/api/packages/${packageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    message.success('Package updated successfully!');
    form.resetFields(); // Reset form sau khi cập nhật
  };

  if (!packageData) return <div>Loading...</div>; // Hiển thị loading nếu chưa có dữ liệu

  return (
    <div className="update-package">
      <Title level={2}>Update Package</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Package Name"
          rules={[{ required: true, message: 'Please input the package name!' }]}
        >
          <Input placeholder="Enter package name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter package description" rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <Input placeholder="Enter package price" />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Duration"
          rules={[{ required: true, message: 'Please input the duration!' }]}
        >
          <Input placeholder="Enter package duration" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePackage;