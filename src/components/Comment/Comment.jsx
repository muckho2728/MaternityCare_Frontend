import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../..//config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comment = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token đăng nhập');
        return;
      }
      try {
        const response = await api.get('/authentications/current-user');
        console.log("User data:", response.data); // Kiểm tra dữ liệu API trả về
        setUserId(response.data.id);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast.error('Lỗi khi lấy thông tin người dùng.');
      }
    };
  
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/blogs/${blogId}/comments?PageSize=${pageSize}`);
        console.log("API response:", response.data); // Kiểm tra dữ liệu
        setComments(response.data.map(comment => ({
          id: comment.id,
          user: comment.author?.name || "Ẩn danh",
          text: comment.content
        })));
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        toast.error('Lỗi khi lấy bình luận.');
      }
    };
    fetchComments();
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() && userId) {
      try {
        const response = await api.post(`blogs/${blogId}/users/${userId}/comments`, {
          content: newComment,
        });
        console.log("Blog ID:", blogId);

        console.log("Bình luận mới:", response.data);
        setComments([{ 
          id: response.data.id, 
          user: response.data.author?.name || "Bạn", 
          text: newComment 
        }, ...comments]);
        setNewComment('');
      } catch (error) {
        
        console.error("Lỗi khi đăng bình luận:", error);
        toast.error('Lỗi khi đăng bình luận.');
      }
    }
  };
  const handleEditComment = async () => {
    if (editContent.trim() && commentId) {
      try {
        await api.put(`/blogs/${blogId}/users/${userId}/comments/${commentId}`, {
          content: editContent,
        });
        setComments(comments.map(comment => (comment.id === commentId ? { ...comment, text: editContent } : comment)));
        setCommentId(null);
        setEditContent('');
      } catch (error) {
        console.error(error);
        toast.error('Lỗi khi cập nhật bình luận.');
      }
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/blogs/${blogId}/users/${userId}/comments/${id}`);
      setComments(comments.filter(comment => comment.id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi xóa bình luận.');
    }
  };

  
  return (
    <div>
      <h2>Bình luận</h2>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
        />
        <button type="submit" disabled={!userId}>Đăng</button>
      </form>

      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <strong>{comment.user}:</strong> {comment.text}
            {comment.user === userId && (
              <>
                <button onClick={() => {
                  setCommentId(comment.id);
                  setEditContent(comment.text);
                }}>Sửa</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {commentId && (
        <div>
          <h3>Chỉnh sửa bình luận</h3>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button onClick={handleEditComment}>Lưu</button>
          <button onClick={() => setCommentId(null)}>Hủy</button>
        </div>
      )}

      <ToastContainer autoClose={3000} closeButton position="top-right" />
    </div>
  );
};

Comment.propTypes = {
  blogId: PropTypes.string.isRequired, // Xác định kiểu dữ liệu của blogId
};

export default Comment;
