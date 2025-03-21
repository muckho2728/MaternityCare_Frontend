import { useState, useEffect, useCallback } from 'react';
import api from '../../config/api';
import { Search, Trash2, Edit } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Blog.css';

const ViewBlogUser = () => {
    const [blogUser, setBlogUser] = useState([]);
    const userId = localStorage.getItem('userId');
    const [tags, setTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [editingBlog, setEditingBlog] = useState(null);
    const [updatedBlog, setUpdatedBlog] = useState({
        title: '',
        content: '',
        tagId: '',
        image: null,
        previewImage: null,
    });

    useEffect(() => {
        fetchBlogs();
        fetchTags();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get(`users/${userId}/blogs`);
            setBlogUser(response.data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await api.get('tags');
            setTags(response.data || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleDelete = useCallback(async (blogId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
        try {
            await api.delete(`users/${userId}/blogs/${blogId}`);
            toast.success('Xóa bài viết thành công');
            setBlogUser((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Xóa bài viết thất bại');
        }
    }, [userId]);

    const handleEditClick = (blog) => {
        setEditingBlog(blog.id);
        setUpdatedBlog({
            title: blog.title,
            content: blog.content,
            tagId: blog.tag.id,
            image: null,
            previewImage: blog.image
        });
    };

    const handleUpdateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append('title', updatedBlog.title);
            formData.append('content', updatedBlog.content);
            formData.append('tagId', updatedBlog.tagId);
            if (updatedBlog.image) {
                formData.append('image', updatedBlog.image);
            }

            await api.put(`users/${userId}/blogs/${editingBlog}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Cập nhật bài viết thành công!');
            setEditingBlog(null);
            fetchBlogs();
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error('Cập nhật thất bại!');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedBlog({
                ...updatedBlog,
                image: file,
                previewImage: URL.createObjectURL(file),
            });
        }
    };

    const filteredBlogs = blogUser.filter((blog) =>
        (selectedTag ? blog.tag.id === selectedTag : true) &&
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="blog-container"> 
            <h1 className="blog-title">Bài Viết Của Tôi</h1>
            <div className="blog-controls">
                <div className="blog-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="blog-search-input"
                    />
                    <button className="blog-search-btn">
                        <Search size={18} />
                    </button>
                </div>
                <div className="blog-filter">
                    <label htmlFor="tagFilter">Lọc theo Tag:</label>
                    <select id="tagFilter" onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
                        <option value="">Tất cả</option>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div >
            {editingBlog && (
                <div className="blog-form-container">
                    <h1>Cập nhật bài viết</h1>
                    <form className='blog-form'>
                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={updatedBlog.title}
                        onChange={(e) => setUpdatedBlog({ ...updatedBlog, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Nội dung"
                        value={updatedBlog.content}
                        onChange={(e) => setUpdatedBlog({ ...updatedBlog, content: e.target.value })}
                    />
                    <select
                        value={updatedBlog.tagId}
                        onChange={(e) => setUpdatedBlog({ ...updatedBlog, tagId: e.target.value })}
                    >
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <input type="file" onChange={handleImageChange} />
                    {updatedBlog.previewImage && <img src={updatedBlog.previewImage} alt="Preview" className="preview-image" />}
                    <div className='blog-info'>
                        <button className='update-btn' onClick={handleUpdateBlog}>Cập nhật</button>
                        
                        <button className='cancel-btn' onClick={() => setEditingBlog(null)}>
                             Hủy
                        </button>
                    </div>
                    
                    </form>
                </div>
            )}
            </div>
            

            <div className="blog-list">
            {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                    <div key={blog.id} className="body-blog">
                        {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
                        <div className="blog-content">
                            <h2 className="blog-title">{blog.title}</h2>
                            <div className="blog-tags">
                                {blog.tag ? (
                                    <span className="blog-tag">{blog.tag.name}</span>
                                ) : (
                                    <span className="blog-tag no-tag">Chưa có tag</span>
                                )}
                            </div>
                            <p className="blog-summary">
                                {blog.content.length > 150 ? `${blog.content.substring(0, 150)}...` : blog.content}
                            </p>
                            <div className="blog-info" >
                                <button className="update-btn" onClick={() => handleEditClick(blog)}>
                                    <Edit size={18} /> Sửa
                                </button>
                                <button className="cancel-btn" onClick={() => handleDelete(blog.id)}>
                                    <Trash2 size={18} /> Xóa
                                </button>
                            </div>
                            
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-blogs">Không tìm thấy bài viết nào.</p>
            )}
            <ToastContainer />
            </div>
        </div>
    );
};

export default ViewBlogUser;
