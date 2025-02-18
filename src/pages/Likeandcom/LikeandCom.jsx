import './LikeandCom.css';
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const BlogLike = () => {
    
    const [Like, setLike] = useState(false);
    const [LikeCount, setLikeCount] = useState(42);
    const [Commnents, setCommnents] = useState([]);
    const [newComments, setNewComments] = useState("");
    const [editingComment, setEdittingComment] = useState(null);
    const [editText, setEdittext] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLike = () => {
        setLike(!Like);
        setLikeCount(prev => liked? prev - 1 : prev + 1);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if(!newComments.trim()) return;
        setLoading(true);
        try{
            const comment = {
                id:Date.now(),
                text: newComments,
                author: "Current User",
                timestamp: new Date(),
                replies: []
            };
            setCommnents(prev => [comment, ...prev]);
            setNewComments("");
        } catch (err){
            setError("Lỗi khi đăng bình luận");
        } finally{
            setLoading(false);
        }
    };

    const handleEdit= (comment) => {
        setEdittingComment(comment.id);
        setEdittext(comment.text);
    };

    const handleUpdate = (id) =>{
        if(!editText.trim()) return;
        setCommnents(prev =>
            prev.map(comment =>
                comment.id === id ? { ...comment, text: editText } : comment
            )
        );
        setEdittingComment(null);
        setEdittext("");
    };

    const handleDelete = (id) => {
        setCommnents(prev => prev.filter(comment => comment.id !== id));
    };
    
    return(
        <div>

        </div>
    );
};
export default BlogLike;