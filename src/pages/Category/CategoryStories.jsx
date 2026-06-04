import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { connectSocket, onStoryPublished } from "../../services/socket.service.js";
import "./category.css";

export default function CategoryStories() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const category = params.get("category");
  const topic = params.get("topic");
  const subcategory = params.get("subcategory");
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Connect socket on mount for real-time story updates
  useEffect(() => {
    connectSocket(null); // Connect to receive story published events
    console.log("🔌 Socket connected for category stories");
  }, []);

  useEffect(() => {
    // Support three scenarios:
    // 1. Category + Topic filtering (shows only published stories in that category & topic)
    // 2. Category + Subcategory filtering (shows only published stories with that subcategory)
    // 3. Subcategory only filtering (shows published stories with that subcategory)
    // ✅ All results are automatically filtered to show only PUBLISHED stories

    let hasValidParams = false;
    let url = `${API_BASE_URL}/stories`;
    let queryParams = [];

    // Scenario 1 & 2: Category + (Topic OR Subcategory)
    if (category) {
      queryParams.push(`category=${encodeURIComponent(category)}`);
      hasValidParams = true;
    }

    // Scenario 3: Subcategory alone
    if (subcategory) {
      queryParams.push(`subcategory=${encodeURIComponent(subcategory)}`);
      hasValidParams = true;
    }

    // Also support topic for backward compatibility
    if (topic && !subcategory) {
      queryParams.push(`topic=${encodeURIComponent(topic)}`);
      hasValidParams = true;
    }

    if (!hasValidParams) {
      console.log("⚠️ Missing required filter parameters:", { category, topic, subcategory });
      setStories([]);
      return;
    }

    const fetchStories = async () => {
      try {
        setLoading(true);
        const fullUrl = url + "?" + queryParams.join("&");
        
        console.log("🔍 Fetching PUBLISHED stories from:", fullUrl);
        console.log("📋 Filtering by:", { category, topic, subcategory });
        console.log("✅ Backend automatically filters to show only PUBLISHED stories");
        
        const res = await axios.get(fullUrl);
        
        console.log("✅ API Response: All stories are PUBLISHED");
        console.log("✅ Stories fetched:", res.data.length, "published stories");
        setStories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Story fetch error:", err);
        console.error("Error details:", err.response?.data || err.message);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    // ✅ NEW - Listen for story published events and refresh if they match current filters
    onStoryPublished((storyData) => {
      console.log("📡 Story published event received:", storyData);
      
      // Check if the published story matches current filter criteria
      // Topic can now be either a traditional topic OR a subcategory name
      const topicMatches = !topic || 
        storyData.topic === topic || 
        (storyData.subcategories && storyData.subcategories.includes(topic));
      
      const isMatching = 
        (!category || storyData.category === category) &&
        topicMatches &&
        (!subcategory || (storyData.subcategories && storyData.subcategories.includes(subcategory)));
      
      if (isMatching) {
        console.log("✅ Published story matches current filters, adding to list...");
        fetchStories(); // Refresh stories list
      }
    });

    fetchStories();
  }, [category, topic, subcategory]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px", color: "#1f2937" }}>
        {subcategory ? subcategory : `${category} → ${topic}`}
      </h1>
      
      {/* ✅ Filter Indicator - Shows only published stories */}
      <p style={{ fontSize: "14px", color: "#10b981", marginBottom: "30px", fontWeight: "500" }}>
        📖 Showing {stories.length} published {stories.length === 1 ? 'story' : 'stories'} in this category
      </p>

      {/* STORIES GRID */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>No published stories found.</p>
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
