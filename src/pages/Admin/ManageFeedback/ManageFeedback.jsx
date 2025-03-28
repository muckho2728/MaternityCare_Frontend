import { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Table } from 'antd';

export default function ManageFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await api.get(`feedbacks?pageNumber=${page}&pageSize=${pageSize}`);

            // Xử lý thông tin phân trang từ header
            const paginationHeader = response.headers['x-pagination'];
            if (paginationHeader) {
                const paginationData = JSON.parse(paginationHeader);
                setPagination({
                    current: paginationData.CurrentPage,
                    pageSize: paginationData.PageSize,
                    total: paginationData.TotalCount,
                    totalPages: paginationData.TotalPages,
                    hasPrevious: paginationData.HasPrevious,
                    hasNext: paginationData.HasNext
                });
            }

            setFeedbacks(response.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Điểm đánh giá',
            dataIndex: 'score',
            key: 'score',
            render: (text) => `${text}/5`,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Danh sách phản hồi</h2>
            <Table
                columns={columns}
                dataSource={feedbacks}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}