<<<<<<< HEAD
import React, { useState } from 'react';
import './Blog.css';
import Like from "../Likeandcom/Like";
import Comment from "../Likeandcom/Comment";
=======
import React, { useState } from "react";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import "./Blog.css";
>>>>>>> ccf4c17918c099088f115ff79b4b8b9a4ab91061

const Blog = () => {
  const [blogs, setBlogs] = useState([
    // { id: 1, title: "Bài viết đầu tiên", content: "Đây là nội dung bài viết đầu tiên." },
    // { id: 2, title: "Bài viết thứ hai", content: "Nội dung của bài viết thứ hai." },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [editingBlog, setEditingBlog] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Thêm bài viết mới
  const handleCreate = () => {
    if (!newBlog.title || !newBlog.content) return;
    setBlogs([...blogs, { ...newBlog, id: Date.now() }]);
    setNewBlog({ title: "", content: "" });
    setIsCreating(false);
  };

  // Cập nhật bài viết
  const handleUpdate = () => {
    if (!editingBlog.title || !editingBlog.content) return;
    setBlogs(blogs.map((blog) => (blog.id === editingBlog.id ? editingBlog : blog)));
    setEditingBlog(null);
  };

  // Xóa bài viết
  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  // Lọc bài viết theo từ khóa
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

<<<<<<< HEAD
    return (
        <div className="blog-container">
            <h1>Xin chào bạn đã đến với trang Comunity của chúng tôi!</h1>
            <p>Trang Blog này là nơi chia sẻ kiến thức, kinh nghiệm và ý tưởng về các chủ đề khác nhau. Bạn có thể tìm kiếm, đọc và chia sẻ các bài viết trên trang này.</p>
            <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
            {isCreating ? (
                <div className="blog-form">
                    <input
                        type="text"
                        placeholder="Tiêu đề bài viết"
                        value={currentBlog.title}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Nội dung bài viết"
                        value={currentBlog.content}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                    />
                    <button onClick={handleCreate}>Đăng bài viết</button>
                </div>
            ) : (
                <button onClick={handleCreatePost}>Tạo bài viết</button>
            )}
            <div className="blog-list">
                {blogs.filter(blog => blog.title.includes(searchTerm)).map(blog => (
                    <div key={blog.id} className="blog-item">
                        <h2>{blog.title}</h2>
                        <p>{blog.content}</p>
                        <button onClick={() => setCurrentBlog(blog)}>Cập nhật</button>
                        <button onClick={() => handleDelete(blog.id)}>Xóa</button>
                        <Like/>
                       <Comment/>

                    </div>
                ))}
            </div>
=======
  return (
    <div className="blog-container">
      <h1 className="blog-title">Diễn Đàn</h1>
      <h1 className="blog-title">Xin chào bạn đã đến với trang Diễn Đàn của chúng tôi!</h1>
      <p className="blog-description">Trang này là nơi chia sẻ kiến thức, kinh nghiệm và ý tưởng về các chủ đề khác nhau. Bạn có thể tìm kiếm, đọc và chia sẻ các bài viết trên trang này</p>

     {/* Thanh tìm kiếm */}
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

      {/* Nút tạo bài viết mới */}
      {!isCreating && (
        <button className="blog-btn blog-btn-new" onClick={() => setIsCreating(true)}>
          <Plus size={18} /> Thêm bài viết mới
        </button>
      )}

      {/* Form thêm/sửa bài viết */}
      {isCreating && (
        <div className="blog-form">
          <h2>Thêm bài viết mới</h2>
          <input
            type="text"
            placeholder="Tiêu đề bài viết"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className="blog-input"
          />
          <textarea
            placeholder="Nội dung bài viết"
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            className="blog-textarea"
          />
          <button onClick={handleCreate} className="blog-btn blog-btn-create">
            Đăng bài viết
          </button>
>>>>>>> ccf4c17918c099088f115ff79b4b8b9a4ab91061
        </div>
      )}

      {editingBlog && (
        <div className="blog-form">
          <h2>Cập nhật bài viết</h2>
          <input
            type="text"
            placeholder="Tiêu đề bài viết"
            value={editingBlog.title}
            onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
            className="blog-input"
          />
          <textarea
            placeholder="Nội dung bài viết"
            value={editingBlog.content}
            onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
            className="blog-textarea"
          />
          <button onClick={handleUpdate} className="blog-btn blog-btn-update">
            Cập nhật
          </button>
        </div>
      )}

      {/* Danh sách bài viết */}
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <h3 className="blog-item-title">{blog.title}</h3>
            <p className="blog-item-content">{blog.content}</p>
            <div className="blog-item-actions">
              <button className="blog-btn blog-btn-edit" onClick={() => setEditingBlog(blog)}>
                <Edit size={16} />
              </button>
              <button className="blog-btn blog-btn-delete" onClick={() => handleDelete(blog.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="blog-no-data">Không có bài viết nào.</p>
      )}
    </div>
  );
};

export default Blog;
