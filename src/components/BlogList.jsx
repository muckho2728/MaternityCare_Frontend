import { useState, useEffect } from "react";
import TagSelector from "./TagSelector";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    let url = "https://maternitycare.azurewebsites.net/api/blogs";
    if (selectedTag) {
      url += `?tagId=${selectedTag}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [selectedTag]);

  return (
    <div>
      <TagSelector onSelectTag={setSelectedTag} />
      <h2>Blog Posts</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <small>Tag ID: {blog.tagId}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
