import { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Table, Button, Typography, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ManageFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false
    });
    const [selectedStar, setSelectedStar] = useState(null);

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await api.get(`feedbacks?pageNumber=${page}&pageSize=${pageSize}`);

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

            const updatedFeedbacks = response.data.map(feedback => ({
                ...feedback,
                createdAt: new Date(feedback.createdAt).toLocaleString()
            }));

            setFeedbacks(updatedFeedbacks);
            setFilteredFeedbacks(updatedFeedbacks); 
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination) => {
        setPagination(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };

    const handleStarFilter = (star) => {
        if (star === selectedStar) {
            setSelectedStar(null); 
            setFilteredFeedbacks(feedbacks); 
        } else {
            setSelectedStar(star);
            setFilteredFeedbacks(feedbacks.filter(feedback => feedback.score === star));
        }
    };

    useEffect(() => {
        if (selectedStar === null) {
            setFilteredFeedbacks(feedbacks); 
        } else {
            setFilteredFeedbacks(feedbacks.filter(feedback => feedback.score === selectedStar)); 
        }
    }, [selectedStar, feedbacks]);

    const columns = [
        {
            title: 'Khách hàng',
            children: [
                {
                    title: 'Họ tên',
                    dataIndex: ['user', 'fullName'],
                    key: 'fullName',
                    width: 300,
                    render: (text) => text || 'N/A'
                },
                {
                    title: 'Email',
                    dataIndex: ['user', 'email'],
                    key: 'email',
                    width: 300
                }
            ]
        },
        {
            title: 'Điểm đánh giá',
            dataIndex: 'score',
            key: 'score',
            render: (score) => (
                <Tag color={score >= 4 ? 'green' : score >= 3 ? 'orange' : 'red'}>
                    {score}/5
                </Tag>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (text) => text || 'Không có nội dung',
        },
    ];

    return (
        <div className="feedback-management" style={{ padding: '24px' }}>
            <Title level={2}>Quản lý phản hồi</Title>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* <Text strong>Lọc theo sao:</Text> */}
                {[0, 1, 2, 3, 4, 5].map(star => (
                    <Button
                        key={star}
                        type={selectedStar === star ? 'primary' : 'default'}
                        onClick={() => handleStarFilter(star)}
                        icon={<StarOutlined />}
                    >
                        {star}
                    </Button>
                ))}
                <Button
                    type={selectedStar === null ? 'primary' : 'default'}
                    onClick={() => handleStarFilter(null)}
                >
                    Tất cả
                </Button>
            </div>
            
            <Table
                columns={columns}
                dataSource={filteredFeedbacks}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    // showSizeChanger: true,
                    // pageSizeOptions: ['10', '20', '50', '100'],
                    position: ['bottomRight']
                }}
                onChange={handleTableChange}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
            />
        </div>
    );
}