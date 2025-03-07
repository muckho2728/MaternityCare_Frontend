import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../../config/api';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [drawerTitle, setDrawerTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [form] = Form.useForm();
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        const res = await api.get(`doctors/active-doctors`);
        setDoctors(res.data);
    };

    const handleAddDoctor = () => {
        setOpen(true);
        setSelectedDoctor(null);
        form.resetFields();
    };

    const handleEditDoctor = (doctor) => {
        setOpen(true);
        setSelectedDoctor(doctor);
        form.setFieldsValue(doctor);
    };

    const handleDeleteDoctor = async (doctorId) => {
        const res = await api.delete(`doctors/${doctorId}`);
        setDoctorId();

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bác sĩ này?',
        });
    };

    const handleSubmit = async (values) => {
        if (selectedDoctor) {
           
        } else {
            
        }
        setOpen(false);
        fetchDoctors();
    };

    const showDrawer = (title, doctor = null) => {
        setOpen(true);
        setSelectedDoctor(doctor);
        setDrawerTitle(title);
    };

    const columns = [
        { title: 'Tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Chuyên khoa', dataIndex: 'specialization', key: 'specialization' },
        { title: 'Kinh nghiệm', dataIndex: 'yearsOfExperience', key: 'yearsOfExperience' },
        { title: 'Hành động', render: (text, record) => (
            <>
                <Button type="link" icon={<EyeOutlined />} onClick={() => showDrawer('View User', record)}>View</Button>
                <Button onClick={() => handleEditDoctor(record)}>Cập nhật</Button>
                <Button danger onClick={() => handleDeleteDoctor(record.id)}>Xóa</Button>
                
            </>
        ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAddDoctor}>Thêm bác sĩ</Button>
            <Table dataSource={doctors} columns={columns} rowKey="id" />
            <Modal
                title={selectedDoctor ? 'Cập nhật bác sĩ' : 'Thêm bác sĩ'}
                visible={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="specialty" label="Chuyên khoa" rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa!' }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">{selectedDoctor ? 'Cập nhật' : 'Thêm'}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Doctor;