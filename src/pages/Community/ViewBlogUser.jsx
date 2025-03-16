import { useState, useEffect } from 'react';
import api from '../../config/api';
import { Search, Trash2, Edit } from 'lucide-react';
import defaultImage from '../../assets/default-blog.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
const ViewBlogUser = () => {
    const [blogUser, setBlogUser] = useState([]);
    const userId = localStorage.getItem('userId');
    const [tags, setTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [editingBlog, setEditingBlog] = useState(null);
    const [updatedBlog, setUpdatedBlog] = useState({
        title: "",
        content: "",
        tagId: "",
        image: null,
    });

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
    <div>
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
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <img src={blog.image || defaultImage} alt={blog.title} style={{ width: '300px', height: '200px' }}/>
            <Link to={`/update-blog/${blog.id}`}>
              <button className="blog-edit">
                <Edit size={18} /> Sửa
              </button>
            </Link>
            <button className="blog-delete" onClick={() => handleDelete(blog.id)}>
              <Trash2 size={18} /> Xóa
            </button>
          </div>
        ))
      ) : (
        <p className="blog-no-data">Không có bài viết nào.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewBlogUser;
