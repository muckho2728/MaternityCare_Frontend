import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentBlog, setCurrentBlog] = useState({ id: null, title: '', content: '' });

    const handleCreate = () => {
        // Logic to create a new blog
        const newBlog = { id: Date.now(), title: currentBlog.title, content: currentBlog.content };
        setBlogs([...blogs, newBlog]);
        setCurrentBlog({ id: null, title: '', content: '' });
    };

    const handleUpdate = (id) => {
        // Logic to update the blog
        const updatedBlogs = blogs.map(blog => (blog.id === id ? currentBlog : blog));
        setBlogs(updatedBlogs);
        setCurrentBlog({ id: null, title: '', content: '' });
    };

    const handleDelete = (id) => {
        // Logic to delete the blog
        const filteredBlogs = blogs.filter(blog => blog.id !== id);
        setBlogs(filteredBlogs);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="blog-container">
            <h1>Xin chào bạn đã đến với trang Comunity của chúng tôi!</h1>
            <p>Trang Blog này là nơi chia sẻ kiến thức, kinh nghiệm và ý tưởng về các chủ đề khác nhau. Bạn có thể tìm kiếm, đọc và chia sẻ các bài viết trên trang này.</p>
            <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
            <div className="blog-list">
                {blogs.filter(blog => blog.title.includes(searchTerm)).map(blog => (
                    <div key={blog.id} className="blog-item">
                        <h2>{blog.title}</h2>
                        <p>{blog.content}</p>
                        <button onClick={() => setCurrentBlog(blog)}>Cập nhật</button>
                        <button onClick={() => handleDelete(blog.id)}>Xóa</button>
                    </div>
                ))}
            </div>
            <div className="blog-form">
                <input type="text" placeholder="Tiêu đề" value={currentBlog.title} onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })} />
                <textarea placeholder="Nội dung" value={currentBlog.content} onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })} />
                <button onClick={currentBlog.id ? () => handleUpdate(currentBlog.id) : handleCreate}>{currentBlog.id ? 'Cập nhật bài viết' : 'Tạo bài viết'}</button>
            </div>
        </div>
    );
};

export default Blog;
