import { useState, useEffect } from 'react';
import { Button, Col, Radio, Drawer, Row, Modal, Form, Input, Table, Select, notification, Upload, Space } from 'antd';
import { EyeOutlined, UserSwitchOutlined } from '@ant-design/icons';

const{ confirm } = Modal;

const ManageFetusHealth = () => {
    const data = [
        {
            key: '1',
            name: 'Thai nhi 1',
            dueDate: '2025-05-01',
            week: 30,
        },
        {
            key: '2',
            name: 'Thai nhi 2',
            dueDate: '2025-06-15',
            week: 28,
        },
        // Thêm dữ liệu mẫu khác nếu cần
    ];

    const handleView = (record) => {
        // Logic để hiển thị thông tin chi tiết về sức khỏe thai nhi
        console.log('Viewing details for:', record);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày dự sinh',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: 'Tuần thai',
            dataIndex: 'week',
            key: 'week',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleView(record)}>View</Button>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={data} />
    );
};

export default ManageFetusHealth;