import { useState, useEffect } from "react";
import { Trash2, Search, Plus, Heart, Edit, Save } from "lucide-react";
import Comment from "../../components/Comment/Comment";
import defaultImage from "../../assets/default-blog.jpg";
import "./Blog.css";
import PropTypes from 'prop-types';Comment.propTypes = {
  blogId: PropTypes.string.isRequired, // hoặc .number tùy theo kiểu dữ liệu
};
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: "", likes: 0, comments: [] });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("https://maternitycare.azurewebsites.net/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));

    fetch("https://maternitycare.azurewebsites.net/swagger/api/blogs")
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

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingBlog({ ...editingBlog, image: reader.result });
        } else {
          setPreviewImage(reader.result);
          setNewBlog({ ...newBlog, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCreate = () => {
    if (!newBlog.title.trim() || !newBlog.content.trim()) return;

    const generatedTag = tags.length > 0 ? tags[Math.floor(Math.random() * tags.length)].id : null;

    const newEntry = {
      ...newBlog,
      id: Date.now(),
      tagId: generatedTag,
      image: newBlog.image || defaultImage,
    };

    setBlogs([...blogs, newEntry]);
    setNewBlog({ title: "", content: "", image: "", likes: 0, comments: [] });
    setPreviewImage(null);
    setIsCreating(false);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
  };

  const handleSaveEdit = () => {
    setBlogs(blogs.map((b) => (b.id === editingBlog.id ? editingBlog : b)));
    setEditingBlog(null);

    setNewBlog({ title: "", content: "", image: "" });
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const handleDeleteComment = (blogId, commentId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          comments: blog.comments.filter(comment => comment.id !== commentId)
        };
      }
      return blog;
    }));
  };

  const handleLikeComment = (blogId, commentId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          comments: blog.comments.map(comment =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          )
        };
      }
      return blog;
    }));
  };

  const handleUpdateComment = (blogId, commentId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          comments: blog.comments.map(comment =>
            comment.id === commentId ? { ...comment, text: commentInputs[commentId] || comment.text } : comment
          )
        };
      }
      return blog;
    }));
    setEditingComment(null);
  };

  const handleLike = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
    ));
  };

  const handleComment = (blogId) => {
    const commentText = commentInputs[blogId];
    if (!commentText) return;

    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          comments: [...blog.comments, { id: Date.now(), user: "Anonymous", text: commentText, likes: 0 }]
        };
      }
      return blog;
    }));

    setCommentInputs({ ...commentInputs, [blogId]: "" });

  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">Diễn Đàn Mẹ Bầu</h1>
      <p className="blog-description">Chia sẻ kinh nghiệm với cộng đồng mẹ bầu!</p>

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

      {!isCreating && (
        <button className="blog-btn blog-btn-new" onClick={() => setIsCreating(true)}>
          <Plus size={18} /> Đăng bài viết
        </button>
      )}

      {isCreating && (
        <div className="blog-form">

          <h2>Đăng bài viết</h2>
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

          <div className="blog-image-upload">
            <label>Chọn ảnh bài viết:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {previewImage && <img src={previewImage} alt="Preview" className="blog-image-preview" />}
          </div>

          <button onClick={handleCreate} className="blog-btn-create">
            Đăng bài
          </button>

        </div>
      )}

      {blogs.length > 0 ? (
        blogs.map((blog) => (
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

                )
                )

                }

                {/* Ô nhập bình luận */}

                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="blog-input"
                />
                <textarea
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="blog-textarea"
                />
                <div className="blog-image-upload">
                  <label>Thay đổi ảnh:</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                  {editingBlog.image && <img src={editingBlog.image} alt="Preview" className="blog-image-preview" />}
                </div>
                <button onClick={handleSaveEdit} className="blog-btn-save">
                  <Save size={16} /> Lưu
                </button>
              </div>

            ) : (
              <>
                <img src={blog.image || defaultImage} alt="Blog" className="blog-item-image" />
                <div className="blog-item-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.content}</p>
                  <small>Tag: {tags.find((tag) => tag.id === blog.tagId)?.name || "Không có"}</small>
                  <div className="blog-item-actions">
                    <button className="blog-btn blog-btn-like">
                      <Heart size={16} /> {blog.likes}
                    </button>
                    <button className="blog-btn blog-btn-edit" onClick={() => handleEdit(blog)}>
                      <Edit size={16} />
                    </button>
                    <button className="blog-btn blog-btn-delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <Comment/>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="blog-no-data">Không có bài viết nào.</p>
      )}
    </div>
  );
};

export default Blog;
