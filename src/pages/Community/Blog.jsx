import Like from "../../components/Like/Like";
import Comment from "../../components/Comment/Comment";
import { useState, useEffect } from "react";
import { Trash2, Search, Plus, Heart, Edit } from "lucide-react";
import "./Blog.css";
import defaultImage from "../../assets/default-blog.jpg";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: "", likes: 0, comments: [] });
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    // Fetch danh sách tags
    fetch("https://maternitycare.azurewebsites.net/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));

    // Fetch danh sách bài viết
    fetch("https://maternitycare.azurewebsites.net/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  // Lọc bài viết theo tag và tìm kiếm
  const filteredBlogs = blogs.filter((blog) => 
    (selectedTag ? blog.tagId === selectedTag : true) &&
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    if (!newBlog.title || !newBlog.content) return;
    setBlogs([...blogs, { ...newBlog, id: Date.now() }]);
    setNewBlog({ title: "", content: "", image: "", likes: 0, comments: [] });
    setIsCreating(false);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setNewBlog({ title: blog.title, content: blog.content, image: blog.image });
  };

  const handleUpdate = () => {
    if (!editingBlog) return;
    setBlogs(blogs.map(blog => (blog.id === editingBlog.id ? { ...editingBlog, ...newBlog } : blog)));
    setEditingBlog(null);
    setNewBlog({ title: "", content: "", image: "" });
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  // Lọc bài viết theo từ khóa
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-container">
      <h1 className="blog-title">Diễn Đàn Mẹ Bầu</h1>
      <p className="blog-description">Chia sẻ kinh nghiệm với cộng đồng mẹ bầu!</p>

      {/* Thanh tìm kiếm & Lọc tag */}
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
            {tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </select>
        </div>
      </div>

      {/* Form tạo bài viết */}
      {!isCreating && <button className="blog-btn blog-btn-new" onClick={() => setIsCreating(true)}> <Plus size={18} /> Đăng bài viết </button>}
      {isCreating && (
        <div className="blog-form">
          <h2>{editingBlog ? "Chỉnh sửa bài viết" : "Đăng bài viết"}</h2>
          <input type="text" placeholder="Tiêu đề bài viết" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} className="blog-input" />
          <textarea placeholder="Nội dung bài viết" value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} className="blog-textarea" />
          <button onClick={editingBlog ? handleUpdate : handleCreate} className="blog-btn-create">{editingBlog ? "Cập nhật" : "Đăng bài"}</button>
        
        </div>
      )}

      {/* Danh sách bài viết */}
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <img src={blog.image || defaultImage} alt="Blog" className="blog-item-image" />
            <div className="blog-item-content">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <small>Tag: {tags.find(tag => tag.id === blog.tagId)?.name || "Không có"}</small>

              {/* Các nút hành động */}
              <div className="blog-item-actions">
                <button className="blog-btn blog-btn-like" onClick={() => handleLike(blog.id)}> 
                  <Heart size={16} /> {blog.likes} 
                </button>
                <button className="blog-btn blog-btn-delete" onClick={() => handleDelete(blog.id)}> 
                  <Trash2 size={16} /> 
                </button>
                {/* <button className="blog-btn blog-btn-comment">
                  <MessageCircle size={16} /> Bình luận
                </button> */}
                <button className="blog-btn" onClick={() => handleEdit(blog)}> 
                  <Edit size={16} /> Chỉnh sửa 
                </button>
              </div>

              {/* Bình luận */}
              <div className="blog-comments">
                {blog.comments.map(comment => (
                  
                    <div key={comment.id} className="blog-comment">
                      <strong>{comment.user}</strong>:  
                      {editingComment?.id === comment.id ? (
                        <input 
                          type="text" 
                          value={commentInputs[comment.id] || comment.text} 
                          onChange={(e) => setCommentInputs({ ...commentInputs, [comment.id]: e.target.value })} 
                          className="blog-input"
                        />
                      ) : (
                        <span> {comment.text} </span>
                      )}
                      
                      <button className="comment-like" onClick={() => handleLikeComment(blog.id, comment.id)}> 
                        <Heart size={14} /> {comment.likes} 
                      </button>
                      
                      {editingComment?.id === comment.id ? (
                        <button className="comment-save" onClick={() => handleUpdateComment(blog.id, comment.id)}>Lưu</button>
                      ) : (
                        <button className="comment-edit" onClick={() => setEditingComment(comment)}> 
                          <Edit size={14} /> 
                        </button>
                      )}
                      
                      <button className="comment-delete" onClick={() => handleDeleteComment(blog.id, comment.id)}> 
                        <Trash2 size={14} /> 
                      </button>
                    </div>
  
                ))}

                {/* Ô nhập bình luận */}
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="blog-input"
                  value={commentInputs[blog.id] || ""}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [blog.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleComment(blog.id)}
                />
              </div>
            </div>
            <Comment/>
          </div>
        ))
      ) : (
        <p className="blog-no-data">Không có bài viết nào.</p>
      )}
    </div>
  );
};

export default Blog;
