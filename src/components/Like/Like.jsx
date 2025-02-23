import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaReply } from "react-icons/fa";


const Like = () => {
    
    const [Like, setLike] = useState(false);
    const [LikeCount, setLikeCount] = useState(42);

    const handleLike = () => {
        setLike(!Like);
        setLikeCount(prev => Like? prev - 1 : prev + 1);
    };

    return(
        <div>
            <button onClick={handleLike}>
                {Like ? (
                    <FaHeart/>
                ) : (
                    <FaRegHeart/>
                )}
            </button>
            <span>{LikeCount} Likes</span>
        </div>
    );
};
export default Like;