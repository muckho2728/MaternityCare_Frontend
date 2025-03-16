import React, { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Table, Button, Space, Modal, Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';

export default function ManagePackagePage() {
    const [packages, setPackages] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [form] = useForm();

    const fetchData = async () => {
        try {
            const response = await api.get("packages");
            console.log(response.data);

            // Map through the response data and convert feature string to an array
            const updatedPackages = response.data.map(pkg => ({
                ...pkg,
                features: pkg.feature.split('\n').map(feature => feature.trim()) // Convert feature string to array
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
            await api.post("packages", values);
        }
        form.resetFields(); // Reset form sau khi tạo
        fetchData();
        handleCloseModal();
    };

    const handleSubmit = () => {
        form.submit();
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`packages/${id}`); // Gọi API xóa package
            fetchData(); // Cập nhật lại danh sách package sau khi xóa
        } catch (error) {
            console.error("Error deleting package:", error);
        }
    };

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
            title: 'Thời hạn',
            dataIndex: 'duration',
            key: 'duration',
            render: (text) => `${text} VND`
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
                    <Button
                        type="primary"
                        onClick={() => {
                            const newRecord = { ...record };
                            console.log(record);
                            form.setFieldsValue(newRecord);
                            handleOpenModal();
                        }}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => {
                            Modal.confirm({
                                title: 'Xác nhận xóa',
                                content: 'Bạn có chắc chắn muốn xóa gói này?',
                                onOk: () => handleDelete(record.id), // Gọi hàm xóa nếu người dùng xác nhận
                            });
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    function handleCloseModal() {
        setIsOpenModal(false);
    }

    function handleOpenModal() {
        setIsOpenModal(true);
    }

    return (
        <div>
            <Button onClick={handleOpenModal} type="primary">Thêm gói mới</Button>
            <Modal title="Thêm gói mới" open={isOpenModal} onCancel={handleCloseModal} onOk={handleSubmit}>
                <Form form={form} onFinish={handleOnFinish}>
                    <Form.Item name={"id"} hidden>
                        <Input placeholder="Enter package type" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại gói"
                        rules={[{ required: true, message: 'Vui lòng nhập loại gói!' }]}
                    >
                        <Input placeholder="Nhập loại gói" />
                    </Form.Item>
                    <Form.Item
                        name="feature"
                        label="Tính năng"
                        rules={[{ required: true, message: 'Vui lòng nhập tính năng!' }]}
                    >
                        <TextArea placeholder="Nhập tính năng" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber placeholder="Nhập giá" />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Thời hạn"
                        rules={[{ required: true, message: 'Vui lòng nhập thời hạn!' }]}
                    >
                        <InputNumber placeholder="Nhập thời hạn" />
                    </Form.Item>
                </Form>
            </Modal>
            <h2>Danh sách gói</h2>
            <Table columns={columns} dataSource={packages} rowKey="id" pagination={{ pageSize: 5 }} />
        </div>
    );
}