import { useState, useEffect } from "react";
import { Search, MessageCircle } from "lucide-react";
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
  const [isUserLoading, setIsUserLoading] = useState(true);
  const pageSize = 10;

  const [commentsByBlog, setCommentsByBlog] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [likesByBlog, setLikesByBlog] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [activeBlogId, setActiveBlogId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter(
      (blog) =>
        (selectedTag ? blog.tag?.id === selectedTag : true) &&
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setIsUserLoading(false);
        return;
      }

      try {
        const response = await api.get(
          "https://maternitycare.azurewebsites.net/api/authentications/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUser(response.data);
        setUserId(response.data.id);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchCurrentUser();

    // Khôi phục activeBlogId từ localStorage sau khi reload
    const savedActiveBlogId = localStorage.getItem("activeBlogId");
    if (savedActiveBlogId) {
      setActiveBlogId(savedActiveBlogId);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (!isUserLoading) {
        setIsLoading(true);
        await Promise.all([fetchBlogs(), fetchTags()]);
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [isUserLoading]);

  useEffect(() => {
    if (userId && blogs.length > 0) {
      blogs.forEach((blog) => fetchLikeData(blog.id));
    }
  }, [userId, blogs]);

  useEffect(() => {
    const fetchAllCommentsData = async () => {
      if (blogs.length > 0 && !isUserLoading) {
        const counts = {};
        const commentsData = {};
        await Promise.all(
          blogs.map(async (blog) => {
            try {
              const response = await api.get(
                `https://maternitycare.azurewebsites.net/api/blogs/${blog.id}/comments?PageNumber=1&PageSize=${pageSize}`
              );
              counts[blog.id] = response.data.length;
              commentsData[blog.id] = response.data.map((comment) => ({
                avatar: comment.user?.avatar || "https://via.placeholder.com/40",
                id: comment.id,
                user: comment.user?.fullName || "Ẩn Danh",
                userId: comment.user?.id,
                text: comment.content,
              }));
            } catch (error) {
              console.error(`Lỗi khi lấy dữ liệu bình luận cho blog ${blog.id}:`, error);
              counts[blog.id] = 0;
              commentsData[blog.id] = [];
            }
          })
        );
        setCommentCounts(counts);
        setCommentsByBlog(commentsData);
      }
    };

    fetchAllCommentsData();
  }, [blogs, isUserLoading]);

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

  const fetchLikeData = async (blogId) => {
    try {
      const likeCountResponse = await api.get(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/number-of-likes`
      );
      const likeCount = likeCountResponse.data || 0;

      let isLiked = false;
      if (userId) {
        const likeStatusResponse = await api.get(
          `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/likes/${userId}`
        );
        isLiked = likeStatusResponse.data || false;
      }

      setLikesByBlog((prev) => ({
        ...prev,
        [blogId]: { isLiked, likeCount },
      }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu like:", error);
      toast.error("Lỗi khi lấy dữ liệu like.");
    }
  };

  const handleLike = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    const currentLikeData = likesByBlog[blogId] || {
      isLiked: false,
      likeCount: 0,
    };
    const newIsLiked = !currentLikeData.isLiked;
    const newLikeCount = newIsLiked
      ? currentLikeData.likeCount + 1
      : currentLikeData.likeCount - 1;

    setLikesByBlog((prev) => ({
      ...prev,
      [blogId]: {
        isLiked: newIsLiked,
        likeCount: newLikeCount >= 0 ? newLikeCount : 0,
      },
    }));

    try {
      await api({
        url: `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/likes`,
        method: currentLikeData.isLiked ? "DELETE" : "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchLikeData(blogId);
      toast.success(
        newIsLiked ? "Đã thích bài viết!" : "Đã bỏ thích bài viết!"
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật like:", error);
      toast.error("Lỗi khi cập nhật like.");
      setLikesByBlog((prev) => ({
        ...prev,
        [blogId]: currentLikeData,
      }));
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
          avatar: comment.user?.avatar || "https://via.placeholder.com/40",
          id: comment.id,
          user: comment.user?.fullName || "Ẩn Danh",
          userId: comment.user?.id,
          text: comment.content,
        })),
      }));
      setCommentCounts((prev) => ({
        ...prev,
        [blogId]: response.data.length,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      toast.error("Lỗi khi lấy bình luận.");
    }
  };

  const handleCommentsToggle = (blogId) => {
    if (activeBlogId === blogId) {
      setActiveBlogId(null);
      localStorage.removeItem("activeBlogId"); // Xóa khi đóng phần bình luận
    } else {
      setActiveBlogId(blogId);
      localStorage.setItem("activeBlogId", blogId); // Lưu khi mở phần bình luận
    }
  };

  const handleCommentSubmit = async (e, blogId) => {
    e.preventDefault();
    const commentText = newComments[blogId] || "";
    if (!commentText.trim() || !userId) return;
    try {
      await api.post(
        `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/comments`,
        { content: commentText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewComments((prev) => ({ ...prev, [blogId]: "" }));
      toast.success("Đã đăng bình luận thành công!");

      // Lưu activeBlogId trước khi reload
      localStorage.setItem("activeBlogId", blogId);
      // Tự động reload trang để lấy dữ liệu mới nhất
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
      toast.error("Lỗi khi đăng bình luận.");
    }
  };

  const handleEditComment = async (blogId) => {
    if (!editContent.trim() || !editCommentId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để chỉnh sửa bình luận!");
      return;
    }

    try {
      await api.put(
        `https://maternitycare.azurewebsites.net/api/users/${userId}/comments/${editCommentId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
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
      toast.success("Đã cập nhật bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi sửa bình luận:", error);
      toast.error("Lỗi khi sửa bình luận.");
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xóa bình luận!");
      return;
    }

    if (!commentId) {
      console.error("commentId is undefined in handleDeleteComment");
      toast.error("Không tìm thấy ID bình luận để xóa!");
      return;
    }

    console.log("Attempting to delete comment with:", { blogId, commentId, userId });
    console.log("Request URL:", `https://maternitycare.azurewebsites.net/api/users/${userId}/comments/${commentId}`);

    try {
      await api.delete(
        `https://maternitycare.azurewebsites.net/api/users/${userId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: prev[blogId].filter((comment) => comment.id !== commentId),
      }));
      setCommentCounts((prev) => ({
        ...prev,
        [blogId]: Math.max((prev[blogId] || 0) - 1, 0),
      }));
      toast.success("Đã xóa bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error("Lỗi khi xóa bình luận: " + (error.response?.data?.message || "Không xác định"));
    }
  };

  if (isUserLoading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="blog-container">
      <h1 className="blog-title">Diễn Đàn Mẹ Bầu</h1>
      <p className="blog-description">
        Chia sẻ kinh nghiệm với cộng đồng mẹ bầu!
      </p>

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

      <div className="blog-list">
        {isLoading ? (
          <p>Đang tải...</p>
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => {
            const likeData = likesByBlog[blog.id] || {
              isLiked: false,
              likeCount: 0,
            };
            return (
              <div className="body-blog" key={blog.id}>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-image"
                  />
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
                  <input
                    type="checkbox"
                    id={`toggle-${blog.id}`}
                    className="blog-toggle"
                  />
                  <p className="blog-summary">
                    {blog.content.length < 150
                      ? `${blog.content.substring(0, 150)}...`
                      : blog.content}
                  </p>

                  {blog.content.length > 150 && (
                    <label
                      htmlFor={`toggle-${blog.id}`}
                      className="blog-toggle-label"
                    ></label>
                  )}
                  <div className="blog-info">
                    <span className="blog-time">
                      <button
                        onClick={() => handleLike(blog.id)}
                        disabled={!userId}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        {likeData.isLiked ? (
                          <FaHeart color="red" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      {likeData.likeCount} Thích
                    </span>
                    <span
                      onClick={() => handleCommentsToggle(blog.id)}
                      style={{ marginTop: "10px", cursor: "pointer" }}
                      className={`blog-comments ${activeBlogId === blog.id ? "active" : ""}`}
                    >
                      <MessageCircle size={16} />{" "}
                      {commentCounts[blog.id] !== undefined
                        ? `${commentCounts[blog.id]} Bình luận`
                        : "Đang tải..."}
                    </span>
                  </div>

                  <div>
                    <form
                      className="upcomment"
                      onSubmit={(e) => handleCommentSubmit(e, blog.id)}
                    >
                      <input
                        type="text"
                        value={newComments[blog.id] || ""}
                        onChange={(e) =>
                          setNewComments((prev) => ({
                            ...prev,
                            [blog.id]: e.target.value,
                          }))
                        }
                        placeholder="Viết bình luận..."
                        disabled={!userId}
                      />
                      <button type="submit" disabled={!userId}>
                        Đăng
                      </button>
                    </form>

                    {activeBlogId === blog.id && (
                      <div className="comments-section">
                        {(commentsByBlog[blog.id] || []).map((comment) => (
                          <div key={comment.id} className="comment">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src={comment.avatar}
                                alt={comment.user}
                                className="comment-avatar"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  marginRight: "8px",
                                }}
                              />
                              <strong>{comment.user}:</strong>
                            </div>
                            {editCommentId === comment.id ? (
                              <div className="edit-comment">
                                <input
                                  type="text"
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
                                />
                                <button
                                  onClick={() => {
                                    setEditCommentId(null);
                                    setEditContent("");
                                  }}
                                >
                                  Hủy
                                </button>
                                <button
                                  className="save"
                                  onClick={() => handleEditComment(blog.id)}
                                >
                                  Lưu
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`comment-text ${comment.text.length > 100 ? "long" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  id={`toggle-${comment.id}`}
                                  className="comment-toggle"
                                />
                                <span className="short-text">
                                  {comment.text.length > 100
                                    ? comment.text.slice(0, 100) + "..."
                                    : comment.text}
                                </span>
                                <span className="full-text">
                                  {comment.text}
                                </span>
                                {comment.text.length > 100 && (
                                  <label
                                    htmlFor={`toggle-${comment.id}`}
                                    className="read-more"
                                  ></label>
                                )}
                              </div>
                            )}

                            {currentUser?.id === comment.userId &&
                              editCommentId !== comment.id && (
                                <div className="comment-btn">
                                  <button
                                    onClick={() => {
                                      setEditCommentId(comment.id);
                                      setEditContent(comment.text);
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
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="blog-no-data">Không có bài viết nào.</p>
        )}
      </div>

      <ToastContainer position="top-right" hideProgressBar={false} />
    </div>
  );
};

export default Blog;