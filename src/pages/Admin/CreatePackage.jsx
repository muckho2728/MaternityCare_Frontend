import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import './CreatePackage.css';

const { Title } = Typography;

const CreatePackage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    message.success('Package created successfully!');
    form.resetFields(); // Reset form sau khi tạo
  };

  return (
    <div className="create-package">
      <Title level={2}>Create New Package</Title>
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
            Create Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePackage;