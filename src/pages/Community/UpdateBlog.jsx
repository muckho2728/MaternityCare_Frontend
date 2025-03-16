import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [blog, setBlog] = useState({
        title: "",
        content: "",
        tagId: "",
        image: null,
    });

    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchBlog();
        fetchTags();
    }, [blogId]);

    const fetchBlog = async () => {
        if (!blogId) {
            console.error("Blog ID không hợp lệ!");
            return;
        }

        try {
            const response = await api.get(`users/${userId}/blogs/${blogId}`);
            setBlog({
                title: response.data.title,
                content: response.data.content,
                tagId: response.data.tag?.id || "",
                image: response.data.image || null,
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
            formData.append("title", blog.title);
            formData.append("content", blog.content);
            formData.append("tagId", blog.tagId);
            if (blog.image instanceof File) {
                formData.append("image", blog.image);
            }

            await api.put(`users/${userId}/blogs/${blogId}`, formData);
            toast.success("Cập nhật bài viết thành công!");
            setTimeout(() => navigate("/view-blog-user"), 2000);
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <div>
            <h1>Cập nhật bài viết</h1>
            <input type="text" placeholder="Tiêu đề" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} />
            <textarea placeholder="Nội dung" value={blog.content} onChange={(e) => setBlog({ ...blog, content: e.target.value })} />
            <select value={blog.tagId} onChange={(e) => setBlog({ ...blog, tagId: e.target.value })}>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
            <input type="file" onChange={(e) => setBlog({ ...blog, image: e.target.files[0] })} />
            <button onClick={handleUpdate}>Cập nhật</button>
            <button onClick={() => navigate("/view-blog-user")}>Hủy</button>
            <ToastContainer />
        </div>
    );
};

export default UpdateBlog;
