import React, { useState, useEffect } from 'react';
import api from '../../constants/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comment = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [userId, setUserId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const fetchCurrentUser = async (url) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Không tìm thấy token');
        toast.error('Không tìm thấy token đăng nhập');
        return;
      }

      try {
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin người dùng: ' + (error.response?.data || error.message), {
          autoClose: 3000,
        });
      }
    };

    fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(
          `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/comments?PageNumber=${pageNumber}&PageSize=${pageSize}`
        );
        setComments(response.data);
      } catch (error) {
        toast.error('Lỗi khi lấy bình luận: ' + (error.response?.data || error.message), {
          autoClose: 3000,
        });
      }
    };
    fetchComments();
  }, [blogId, pageNumber]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() && userId) {
      try {
        const response = await api.post(`https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments`, {
          content: newComment
        });
        console.log('Comment ID:', response.data.id);
        setComments([{ id: response.data.id, user: response.data.user, text: newComment }, ...comments]);
        setNewComment('');
        setPageNumber(prev => prev + 1);
      } catch (error) {
        toast.error('Lỗi khi đăng bình luận: ' + (error.response?.data || error.message), {
          autoClose: 3000,
        });
      }
    }
  };

  const handleEditComment = async () => {
    if (editContent.trim() && commentId) {
      try {
        await api.put(`https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments/${commentId}`, {
          content: editContent
        });
        toast.success('Cập nhật bình luận thành công!', {
          autoClose: 3000,
        });
        setComments(comments.map(comment =>
          comment.id === commentId ? { ...comment, text: editContent } : comment
        ));
        setCommentId(null);
        setEditContent('');
      } catch (error) {
        toast.error('Lỗi khi cập nhật bình luận: ' + (error.response?.data || error.message), {
          autoClose: 3000,
        });
      }
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments/${id}`);
      toast.success('Xóa bình luận thành công!', {
        autoClose: 3000,
      });
      setComments(comments.filter(comment => comment.id !== id));
    } catch (error) {
      toast.error('Lỗi khi xóa bình luận: ' + (error.response?.data || error.message), {
        autoClose: 3000,
      });
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

      <ToastContainer closeButton position="top-right" />
    </div>
  );
};

export default Comment;
