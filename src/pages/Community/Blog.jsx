import { useState, useEffect } from "react";
import { Search, MessageCircle, Heart } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Blog.css";
import defaultImage from "../../assets/default-blog.jpg";
import api from "../../config/api";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [userId, setUserId] = useState(null);
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
        (selectedTag ? blog.tag.id === selectedTag : true) &&
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  useEffect(() => {
    fetchBlogs();
    fetchTags();
    fetchCurrentUser();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("blogs/active-blogs");
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách blog:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("tags");
      setTags(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tag:", error);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token");
      return;
    }
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
    if (newComment.trim() && userId) {
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
    }
  };

  const handleEditComment = async (blogId) => {
    if (editContent.trim() && editCommentId) {
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
      toast.error("Lỗi khi lấy dữ liệu like. Vui lòng thử lại!", {
        autoClose: 3000,
      });
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
      // Gửi yêu cầu POST hoặc DELETE để cập nhật trạng thái like
      await api({
        url: `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/likes`,
        method: currentLikeData.isLiked ? "DELETE" : "POST",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      // Gọi lại API để lấy số lượt thích mới nhất
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
      console.error("Lỗi khi cập nhật like:", error.response?.data || error.message);
      toast.error("Lỗi khi cập nhật like. Vui lòng thử lại!", {
        autoClose: 3000,
      });
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

        <div className="blog-filter">
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
      </div>

      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => {
          const likeData = likesByBlog[blog.id] || { isLiked: false, likeCount: 0 };

          return (
            <div key={blog.id}>
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              <img
                src={blog.image || defaultImage}
                alt={blog.title}
                style={{ width: "300px", height: "200px" }}
              />
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
                  <span style={{ marginLeft: "5px" }}>{likeData.likeCount} Likes</span>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="blog-comments">
                  <div>
                    <h2>Bình luận</h2>
                    <form
                      onSubmit={(e) => {
                        setCurrentBlogId(blog.id);
                        handleCommentSubmit(e, blog.id);
                      }}
                    >
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
                                onClick={() =>
                                  handleDeleteComment(blog.id, comment.id)
                                }
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
                        <button onClick={() => handleEditComment(blog.id)}>
                          Lưu
                        </button>
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
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="blog-no-data">Không có bài viết nào.</p>
      )}
      <ToastContainer position="top-right" hideProgressBar={false} />
    </div>
  );
};

export default Blog;