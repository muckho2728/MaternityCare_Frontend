import { useState, useEffect } from 'react';
import api from '../../config/api';
import { Search, Trash2, Edit } from 'lucide-react';
import defaultImage from '../../assets/default-blog.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './Blog.css';

const ViewBlogUser = () => {
    const [blogUser, setBlogUser] = useState([]);
    const userId = localStorage.getItem('userId');
    const [tags, setTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");


    const filteredBlogs = blogUser.filter((blog) => 
        (selectedTag === "" || blog.tag.id === selectedTag) &&
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    useEffect(() => {
        fetchBlogs();
        fetchTags();
    }, []);
    const fetchBlogs = async () => {
        try {
            const response = await api.get(`users/${userId}/blogs`);
            setBlogUser(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };
    const fetchTags = async () => {
        try {
          const response = await api.get("tags");
          setTags(response.data || []);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      const handleDelete = async (blogId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
          try {
            await api.delete(`users/${userId}/blogs/${blogId}`);
            toast.success('Xóa bài viết thành công');
            setBlogUser(blogUser.filter((blog) => blog.id !== blogId));
          } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Xóa bài viết thất bại');
          }
        }
      };

  return (
    <div className="view-blog-container">
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
 {/* Hiển thị tag đã chọn */}
 {selectedTag && (
        <div className="selected-tag">
            <span>Bạn đang xem bài viết có tag: </span>
            <span className="selected-tag-name">
                {tags.find((tag) => tag.id === selectedTag)?.name || "Không xác định"}
            </span>
            <button className="clear-tag-btn" onClick={() => setSelectedTag("")}>Xóa lọc</button>
        </div>
    )}

  {filteredBlogs.length > 0 ? (
    filteredBlogs.map((blog) => (
      
      <div key={blog.id} className="body-blog">
        <img src={blog.image || defaultImage} alt={blog.title} className="blog-image"/>
        <div className="blog-content">
                <h2 className="blog-title">{blog.title}</h2>

                {/* Hiển thị danh sách tag của bài viết */}
                <div className="blog-tags">
                    {blog.tags && blog.tags.length > 0 ? (
                        blog.tags.map((tag) => (
                            <span key={tag.id} className="blog-tag">{tag.name}</span>
                        ))
                    ) : (
                        <span className="blog-tag no-tag">Chưa có tag</span>
                    )}
                </div>

                <p className="blog-summary">
                    {blog.content.length > 150 ? `${blog.content.substring(0, 150)}...` : blog.content}
                </p>
          <div className="view-blog-info">
          <span>{/* Add other blog info if needed */}</span>
          <div className="view-blog-actions">
            <Link to={`/update-blog/${blog.id}`}>
              <button className="view-blog-button edit-btn">
                <Edit size={18} /> Sửa
              </button>
            </Link>
            <button className="view-blog-button delete-btn" onClick={() => handleDelete(blog.id)}>
              <Trash2 size={18} /> Xóa
            </button>
          </div>
        </div>
        </div>
        
        
        
        
      </div>
    ))
  ) : (
    <p className="view-no-data">Không có bài viết nào.</p>
  )}
  <ToastContainer />
</div>

  );
};

export default ViewBlogUser;