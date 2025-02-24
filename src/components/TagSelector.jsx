import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TagSelector = ({ onSelectTag }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch("https://maternitycare.azurewebsites.net/api/tags", {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  return (
    <div>
      <h3>Select a Tag:</h3>
      <select onChange={(e) => onSelectTag(e.target.value)}>
        <option value="">All</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};
TagSelector.propTypes = {
  onSelectTag: PropTypes.func.isRequired,
};

export default TagSelector;