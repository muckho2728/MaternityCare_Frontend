import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [blogData, setBlogData] = useState({
        title: "",
        content: "",
        tagId: "",
        image: null,
    });

    useEffect(() => {
        fetchBlogData();
        fetchTags();
    }, []);

    const fetchBlogData = async () => {
        try {
            const response = await api.get(`blogs/${blogId}`);
            setBlogData({
                title: response.data.title,
                content: response.data.content,
                tagId: response.data.tag.id,
                image: null,
            });
        } catch (error) {
            console.error("Error fetching blog:", error);
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

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("title", blogData.title);
            formData.append("content", blogData.content);
            formData.append("tagId", blogData.tagId);
            if (blogData.image) {
                formData.append("image", blogData.image);
            }

            await api.put(`blogs/${blogId}`, formData);
            toast.success("Cập nhật bài viết thành công");
            setTimeout(() => navigate("/my-blogs"), 2000);
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error("Cập nhật bài viết thất bại");
        }
    };

    return (
        <div>
            <h1>Cập nhật bài viết</h1>
            <input
                type="text"
                placeholder="Tiêu đề"
                value={blogData.title}
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
            />
            <textarea
                placeholder="Nội dung"
                value={blogData.content}
                onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
            />
            <select value={blogData.tagId} onChange={(e) => setBlogData({ ...blogData, tagId: e.target.value })}>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
            <input type="file" onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })} />
            <button onClick={handleUpdate}>Cập nhật</button>
            <button onClick={() => navigate("/community")}>Hủy</button>
            <ToastContainer />
        </div>
    );
};

export default UpdateBlog;
