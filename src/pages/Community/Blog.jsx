import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Blog.css";
import api from "../../config/api";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const [commentsByBlog, setCommentsByBlog] = useState({});
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [likesByBlog, setLikesByBlog] = useState({});

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter(
      (blog) =>
        (selectedTag ? blog.tag?.id === selectedTag : true) &&
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBlogs(), fetchTags(), fetchCurrentUser()]);
      setIsLoading(false);
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("blogs/active-blogs");
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách blog:", error);
      toast.error("Không thể tải danh sách blog");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("tags");
      setTags(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tag:", error);
      toast.error("Không thể tải danh sách tag");
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await api.get(
        "https://maternitycare.azurewebsites.net/api/authentications/current-user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(response.data.id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchComments = async (blogId, pageNumber = 1) => {
    try {
      const response = await api.get(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/comments?PageNumber=${pageNumber}&PageSize=${pageSize}`
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: response.data.map((comment) => ({
          id: comment.id,
          user: "Ẩn danh",
          text: comment.content,
        })),
      }));
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      toast.error("Lỗi khi lấy bình luận.");
    }
  };

  const handleCommentSubmit = async (e, blogId) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;
    try {
      const response = await api.post(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments`,
        { content: newComment }
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: [
          {
            id: response.data.id,
            user: response.data.author?.name || "Bạn",
            text: newComment,
          },
          ...(prev[blogId] || []),
        ],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
      toast.error("Lỗi khi đăng bình luận.");
    }
  };

  const handleEditComment = async (blogId) => {
    if (!editContent.trim() || !editCommentId) return;
    try {
      await api.put(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments/${editCommentId}`,
        { content: editContent }
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: prev[blogId].map((comment) =>
          comment.id === editCommentId
            ? { ...comment, text: editContent }
            : comment
        ),
      }));
      setEditCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Lỗi khi sửa bình luận:", error);
      toast.error("Lỗi khi sửa bình luận.");
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    try {
      await api.delete(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments/${commentId}`
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: prev[blogId].filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast.error("Lỗi khi xóa bình luận.");
    }
  };

  const fetchLikeData = async (blogId) => {
    try {
      const likeCountResponse = await api.get(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/number-of-likes`
      );
      const likeCount = likeCountResponse.data.likeCount || 0;

      let isLiked = false;
      if (userId) {
        const likeStatusResponse = await api.get(
          `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/likes/${userId}`
        );
        isLiked = likeStatusResponse.data.isLiked || false;
      }

      setLikesByBlog((prev) => ({
        ...prev,
        [blogId]: { isLiked, likeCount },
      }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu like:", error.message);
      toast.error("Lỗi khi lấy dữ liệu like.");
    }
  };

  const handleLike = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    const currentLikeData = likesByBlog[blogId] || { isLiked: false, likeCount: 0 };
    try {
      await api({
        url: `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/likes`,
        method: currentLikeData.isLiked ? "DELETE" : "POST",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      const likeCountResponse = await api.get(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/number-of-likes`
      );
      const newLikeCount = likeCountResponse.data.likeCount || 0;

      setLikesByBlog((prev) => ({
        ...prev,
        [blogId]: {
          isLiked: !currentLikeData.isLiked,
          likeCount: newLikeCount,
        },
      }));
    } catch (error) {
      console.error("Lỗi khi cập nhật like:", error);
      toast.error("Lỗi khi cập nhật like.");
    }
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

        <Link to="/view-blog-user">
          <button className="blog-btn">Bài Viết Của Tôi</button>
        </Link>
        <Link to="/create-blog">
          <button className="blog-btn">Tạo Bài Viết</button>
        </Link>

        <ToastContainer position="top-right" hideProgressBar={false} />
        <label htmlFor="tagFilter">Lọc theo Tag:</label>
        <select
          id="tagFilter"
          onChange={(e) => setSelectedTag(e.target.value)}
          value={selectedTag}
        >
          <option value="">Tất cả</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTag && (
        <div className="selected-tag">
          <span>Bạn đang xem bài viết có tag: </span>
          <span className="selected-tag-name">
            {tags.find((tag) => tag.id === selectedTag)?.name || "Không xác định"}
          </span>
          <button className="clear-tag-btn" onClick={() => setSelectedTag("")}>
            Xóa lọc
          </button>
        </div>
      )}

      <div className="blog-list">
        {isLoading ? (
          <p>Đang tải...</p>
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => {
            const likeData = likesByBlog[blog.id] || { isLiked: false, likeCount: 0 };
            return (
              <div className="body-blog" key={blog.id}>
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="blog-image" />
                )}
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
                    {blog.content.length > 150
                      ? `${blog.content.substring(0, 150)}...`
                      : blog.content}
                  </p>
                  <div className="blog-info">
                    <span className="blog-time">
                      <button
                        onClick={() => handleLike(blog.id)}
                        disabled={!userId}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => fetchLikeData(blog.id)}
                      >
                        {likeData.isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                      </button>
                      <span style={{ marginLeft: "5px" }}>
                        {likeData.likeCount} Likes
                      </span>
                      {" " + new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="blog-comments">
                    <h2>Bình luận</h2>
                    <form onSubmit={(e) => handleCommentSubmit(e, blog.id)}>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                      />
                      <button type="submit" disabled={!userId}>
                        Đăng
                      </button>
                    </form>

                    <ul>
                      {(commentsByBlog[blog.id] || []).map((comment) => (
                        <li key={comment.id}>
                          <strong>{comment.user}:</strong> {comment.text}
                          {userId && (
                            <>
                              <button
                                onClick={() => {
                                  setEditCommentId(comment.id);
                                  setEditContent(comment.text);
                                  setCurrentBlogId(blog.id);
                                }}
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteComment(blog.id, comment.id)}
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>

                    {editCommentId && currentBlogId === blog.id && (
                      <div>
                        <h3>Chỉnh sửa bình luận</h3>
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <button onClick={() => handleEditComment(blog.id)}>Lưu</button>
                        <button
                          onClick={() => {
                            setEditCommentId(null);
                            setEditContent("");
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => fetchComments(blog.id)}
                      style={{ marginTop: "10px" }}
                    >
                      Tải bình luận
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="blog-no-data">Không có bài viết nào.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;