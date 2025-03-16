import { useState, useEffect } from "react";
import { Search, MessageCircle, Heart } from "lucide-react";
import "./Blog.css";
import defaultImage from "../../assets/default-blog.jpg";
import api from "../../config/api";
import { Link } from "react-router-dom";
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const filteredBlogs = Array.isArray(blogs) ? blogs.filter((blog) =>
    (selectedTag ? blog.tag.id === selectedTag : true) &&
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("blogs/active-blogs");
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
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

  return (
    <div className="blog-container">
    <h1 className="blog-title">Diễn Đàn Mẹ Bầu</h1>
    <p className="blog-description">Chia sẻ kinh nghiệm với cộng đồng mẹ bầu!</p>

    {/* Thanh tìm kiếm và bộ lọc */}
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

        <Link to="/view-blog-user">
            <button className="blog-btn">Bài Viết Của Tôi</button>
        </Link>
        <Link to="/create-blog">
            <button className="blog-btn">Tạo Bài Viết</button>
        </Link>

        <div className="blog-filter">
            <label htmlFor="tagFilter">Lọc theo Tag:</label>
            <select id="tagFilter" onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
                <option value="">Tất cả</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
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

    {/* Danh sách bài viết */}
    <div className="blog-list">
    {filteredBlogs.length > 0 ? (
    filteredBlogs.map((blog) => (
        <div className="body-blog" key={blog.id}>
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
                <div className="blog-info">
                    <span className="blog-time">
                        <Heart size={16} /> {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="blog-comments">
                        <MessageCircle size={16} /> {blog.commentsCount || 0} Bình luận
                    </span>
                </div>
            </div>
        </div>
    ))
) : (
    <p className="blog-no-data">Không có bài viết nào.</p>
)}
    </div>
</div>

  );
};

export default Blog;