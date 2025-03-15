import { useState, useEffect } from 'react';
import api from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
    const [newBlog, setNewBlog] = useState({
      title: '',
      content: '',
      image: null,
      tagId: '',
    });
    const [tags, setTags] = useState([]);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
           try {
            const response = await api.get('tags');
            setTags(response.data);
           } catch (error) {
            console.error('Error fetching tags:', error);
           }
        }
        fetchTags();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlog((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setNewBlog((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', newBlog.title);
        formData.append('content', newBlog.content);
        if (newBlog.image) {
            formData.append('image', newBlog.image);
        }
        formData.append('tagId', newBlog.tagId);

        try {
            const response = await api.post(`users/${userId}/blogs`, formData);
            toast.success('Tạo bài viết thành công, đang chờ duyệt bài');
            setTimeout(() => navigate("/community"), 2000); 
            console.log(response);
        } catch (error) {
            console.error('Error creating blog:', error);
            setError(error.response?.data?.message || 'Lỗi khi tạo blog. Vui lòng thử lại.');
            toast.error('Lỗi khi tạo bài viết!');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <h1>Tạo Bài Viết Mới</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Tiêu Đề" value={newBlog.title} onChange={handleChange} required />
                <textarea name="content" placeholder="Nội Dung" value={newBlog.content} onChange={handleChange} required />
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                <select name="tagId" value={newBlog.tagId} onChange={handleChange}>
                    <option value="">Chọn Tag</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </select>
                <button type="submit" disabled={loading}>{loading ? 'Đang Tạo' : 'Tạo Bài Viết'}</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateBlog;