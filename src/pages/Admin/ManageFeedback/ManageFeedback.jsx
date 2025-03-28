import { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Table, Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';

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
    const [selectedStar, setSelectedStar] = useState(null); // Trạng thái cho mức sao được chọn

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
            setFilteredFeedbacks(response.data); 
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
            setFilteredFeedbacks(feedbacks.filter(feedback => feedback.score === star)); // Lọc theo sao
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
            <div style={{ marginBottom: '20px' }}>
                <h4>Lọc theo sao:</h4>
                {[1, 2, 3, 4, 5].map(star => (
                    <Button
                        key={star}
                        type={selectedStar === star ? 'primary' : 'default'}
                        onClick={() => handleStarFilter(star)}
                        style={{ marginRight: '8px' }}
                    >
                        {star} <StarOutlined />
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