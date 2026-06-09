import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import "./EditStory.css";
export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    subcategories: []
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/stories/${id}`).then((res) => {
      setStory(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  /*const updateStory = async () => {
    await axios.put(`${API_BASE_URL}/stories/${id}`, story, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Updated successfully");
    navigate(-1);
    
  };*/
  const updateStory = async () => {
  try {
    console.log("Story ID:", id);

    const res = await axios.put(
      `${API_BASE_URL}/stories/${id}`,
      story,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Updated successfully");
    navigate(-1);

  } catch (err) {
    console.error("STATUS:", err.response?.status);
    console.error("DATA:", err.response?.data);

    alert(
      err.response?.data?.message ||
      "Failed to update story"
    );
  }
};
/*
  return (
    <div>
      <h2>Edit Story</h2>

      <input name="title" value={story.title} onChange={handleChange} />
      <textarea name="description" value={story.description} onChange={handleChange} />
      <textarea name="content" value={story.content} onChange={handleChange} />

      <button onClick={updateStory}>Update</button>
    </div>
  );
}
*/

return (
  <div className="edit-story-container">
    <h2 className="edit-story-title">Edit Story</h2>

    <div className="edit-form-group">
      <label>Title</label>
      <input
        className="edit-input"
        name="title"
        value={story.title}
        onChange={handleChange}
      />
    </div>

    <div className="edit-form-group">
      <label>Description</label>
      <textarea
        className="edit-textarea"
        name="description"
        value={story.description}
        onChange={handleChange}
      />
    </div>

    <div className="edit-form-group">
      <label>Content</label>
      <textarea
        className="edit-textarea edit-content"
        name="content"
        value={story.content}
        onChange={handleChange}
      />
    </div>

    <div className="edit-actions">
      <button
        className="cancel-btn"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>

      <button
        className="update-btn"
        onClick={updateStory}
      >
        Update Story
      </button>
    </div>
  </div>
);
}