import React, { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Table, Button, Space, Modal, Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';

export default function ManagePackagePage() {
    const [packages, setPackages] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const [form] = useForm();

    const fetchData = async () => {
        try {
            const response = await api.get("packages");
            console.log(response.data);

            // Map through the response data and convert feature string to an array
            const updatedPackages = response.data.map(pkg => ({
                ...pkg,
                features: pkg.feature.split(';').map(feature => feature.trim()) // Convert feature string to array
            }));

            setPackages(updatedPackages);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnFinish = async (values) => {
        console.log('Received values:', values);

        if (values.id) {
            await api.put(`packages/${values.id}`, values);
        } else {
            await api.post("packages", values)
        }
        form.resetFields(); // Reset form sau khi tạo'
        fetchData();
        handleCloseModal();
    };
    const handleSubmit = () => {
        form.submit();
    }
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Loại gói',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${text} VND`,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Tính năng',
            dataIndex: 'features',
            key: 'features',
            render: (features) => (
                <ul>
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => {
                        const newRecord = {...record}
                        console.log(record)
                        form.setFieldsValue(newRecord)
                        handleOpenModal();
                    }} >Cập nhật</Button>
                    <Button danger type="primary">Xóa</Button>
                </Space>
            ),
        },
    ];

    function handleCloseModal() {
        setIsOpenModal(false)
    }

    function handleOpenModal() {
        setIsOpenModal(true)
    }

    return (
        <div>
            <Button onClick={handleOpenModal} type="primary">Add new  </Button>
            <Modal title="Add new package" open={isOpenModal} onCancel={handleCloseModal} onOk={handleSubmit} >

                <Form form={form} onFinish={handleOnFinish} >
                    <Form.Item name={"id"}  hidden >
                    <Input placeholder="Enter package type" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Package Type"
                        rules={[{ required: true, message: 'Please input the package type!' }]}
                    >
                        <Input placeholder="Enter package type" />
                    </Form.Item>
                    <Form.Item
                        name="feature"
                        label="Package feature"
                        rules={[{ required: true, message: 'Please input the package feature!' }]}
                    >
                        <TextArea placeholder="Enter package feature" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Package price"
                        rules={[{ required: true, message: 'Please input the package price!' }]}
                    >
                        <InputNumber placeholder="Enter package price" />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Package duration"
                        rules={[{ required: true, message: 'Please input the package duration!' }]}
                    >
                        <InputNumber placeholder="Enter package duration" />
                    </Form.Item>
                </Form>

            </Modal>
            <h2>Danh sách gói</h2>
            <Table columns={columns} dataSource={packages} rowKey="id" pagination={{ pageSize: 5 }} />
        </div>
    );
}
