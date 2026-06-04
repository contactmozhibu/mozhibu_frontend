import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import "./category.css";

export default function CategoryStories() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const category = params.get("category");
  const topic = params.get("topic");
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category || !topic) return;

    const fetchStories = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE_URL}/stories?category=${encodeURIComponent(
          category
        )}&topic=${encodeURIComponent(topic)}`;
        
        console.log("🔍 Fetching stories from:", url);
        
        const res = await axios.get(url);
        
        console.log("✅ Stories fetched:", res.data.length, "stories");
        setStories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Story fetch error:", err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [category, topic]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "30px", color: "#1f2937" }}>
        {category} → {topic}
      </h1>

      {/* STORIES GRID */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>No stories found.</p>
      ) : (
        <div className="story-grid">
          {stories.map((story) => {
            const avgRating = story.reviews?.length > 0
              ? (story.reviews.reduce((sum, r) => sum + r.rating, 0) / story.reviews.length).toFixed(1)
              : 0;

            return (
              <div key={story._id} className="story-card" onClick={() => navigate(`/story/${story._id}`)}>
                {/* Rating Badge */}
                {avgRating > 0 && (
                  <div className="rating-badge">
                    <span className="star">★</span>{avgRating}
                  </div>
                )}

                <img
                  src={story.coverImage || "/placeholder.jpg"}
                  alt={story.title}
                />
                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p className="category-badge">{story.category}</p>
                  <p
                    className="author-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/author/${story.author?._id}`);
                    }}
                  >
                    by {story.author?.username || "Unknown"}
                  </p>

                  {/* Stats */}
                  <div className="story-stats">
                    {story.readCount > 0 && (
                      <span className="stat-item">{story.readCount} Reads</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
