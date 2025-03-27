import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "axios";

const Like = ({blogId}) => {
    const [Like, setLike] = useState(false);
    const [LikeCount, setLikeCount] = useState(0);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchCurrentUser = async (url) => {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Current user data:', response.data);
                setUserId(response.data.id);
            } catch (error) {
                console.error('Failed to fetch current user:', error.response ? error.response.data : error.message);
                toast.error("Lỗi khi lấy thông tin người dùng. Vui lòng thử lại!", { autoClose: 3000 });
            }
        };

        const fetchLikeCount = async () => {
            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/blogs/${blogId}/number-of-likes`);
                setLikeCount(response.data.likeCount || 0);
            } catch (error) {
                console.error("Lỗi khi lấy số lượng like:", error.message);
                toast.error(error.message ||"Lỗi khi lấy số lượng like. Vui lòng thử lại!", { autoClose: 3000 });
            }
        };

        fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
        fetchLikeCount();
    }, [blogId]);

    useEffect(() => {
        const fetchUserLikeStatus = async () => {
            if (!userId) return;
            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/blogs/${blogId}/likes/${userId}`);
                setLike(response.data.isLiked || false);
            } catch (error) {
                console.error("Lỗi khi lấy trạng thái like của người dùng:", error.message);
                toast.error(error.message ||"Lỗi khi lấy trạng thái like. Vui lòng thử lại!", { autoClose: 3000 });
            }
        };

        if (userId) {
            fetchUserLikeStatus();
        }
    }, [userId, blogId]);

    const handleLike = async () => {
        try {
            const response = await api({
                url: `https://maternitycare.azurewebsites.net/api/blogs/${blogId}/users/${userId}/likes`,
                method: Like ? "DELETE" : "POST",
                headers: {
                    "accept": "*/*",
                },
                data: Like ? undefined : ""
            });

            setLike(!Like);
            setLikeCount(response.data.likeCount || LikeCount);
        } catch (error) {
            console.error("Lỗi khi cập nhật like:", error.message);
            toast.error("Đã xảy ra lỗi khi cập nhật like. Vui lòng thử lại!", { autoClose: 3000 });
        }
    };

    return (
        <div>
            <button onClick={handleLike} disabled={!userId}>
                {Like ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span>{LikeCount} Likes</span>
            <ToastContainer position="top-right" hideProgressBar={false} />
        </div>
    );
};

export default Like;
