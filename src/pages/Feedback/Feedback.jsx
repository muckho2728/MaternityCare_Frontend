import { useState } from 'react';
import { Rate, Button, Input } from 'antd';
import './Feedback.css';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;
const userId = localStorage.getItem('userId');
const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            if (!userId) {
                alert("Vui lòng đăng nhập để gửi phản hồi!");
                return;
            }
            const response = await api.post('/feedbacks', {
                userId,
                score: rating,
                content: comment,
            });
            console.log('Feedback submitted:', response.data);
            alert('Cảm ơn phản hồi của bạn!');
            navigate('/');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại!');
        }
    };

    return (
        <div className="feedback-container">
    <h2 className="feedback-title">
        🌟 Trải nghiệm của bạn với chúng tôi thế nào?
    </h2>
    <p className="feedback-subtitle">
        Chúng tôi rất mong nhận được đánh giá của bạn để ngày càng hoàn thiện hơn! 💖
    </p>
    
    <Rate
        className="feedback-rating"
        value={rating}
        onChange={handleRatingChange}
        count={5}
    />
    <div className="feedback-labels">
        <span>😞 Không hài lòng</span>
        <span>😍 Rất hài lòng</span>
    </div>

    <h3 className="feedback-message">
        ✨ Mọi đóng góp của bạn đều giúp chúng tôi nâng cao chất lượng dịch vụ! ✨
    </h3>

    <TextArea
        className="feedback-textarea"
        rows={4}
        value={comment}
        onChange={handleCommentChange}
        placeholder="Hãy chia sẻ suy nghĩ của bạn..."
    />

    <Button type="primary" onClick={handleSubmit} className="feedback-submit">
        Gửi phản hồi 💌
    </Button>
</div>

    );
};

export default Feedback;