import React, { useState, useEffect } from 'react';

const Censor = () => {
  const [blogs, setBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Fetch blogs from API
    setBlogs([]);
  }, []);

  const handleAccept = async (id) => {
    try {
      await fetch(`https://maternitycare.azurewebsites.net/api/blogs/${id}/activation`, {
        method: 'PUT',
        headers: {
          'accept': '*/*'
        }
      });
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'accepted' } : b)));
    } catch (error) {
      console.error('Failed to accept blog:', error);
    }
  };

  const handleReject = (id) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b)));
  };

  return (
    <div>
      <h1>Censor Dashboard</h1>
      <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
      <ul>
        {blogs
          .filter((blog) => statusFilter === 'all' || blog.status === statusFilter)
          .map((blog) => (
            <li key={blog.id}>
              <h2>{blog.title}</h2>
              <p>Status: {blog.status}</p>
              <button onClick={() => handleAccept(blog.id)}>Accept</button>
              <button onClick={() => handleReject(blog.id)}>Reject</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Censor;
