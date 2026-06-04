
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoryById } from "../../services/story.service";
import { getImageUrl } from "../../config/apiConfig";
import api from "../../services/api";
import "./storyDetail.css";

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ✅ SINGLE SOURCE OF TRUTH */
  const [isFollowingState, setIsFollowingState] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [chapters, setChapters] = useState([]);

  const token = localStorage.getItem("token");
  const rawUser = JSON.parse(localStorage.getItem("user")); // ✅ FIXED: use "user" not "user_v2"
  const loggedInUserId = rawUser?.id || rawUser?._id;
  
  console.log("🔍 DEBUG - StoryDetail Author Check:");
  console.log("loggedInUserId from localStorage:", loggedInUserId);
  console.log("token:", token);
  console.log("rawUser:", rawUser);

  /* ===========================
     FETCH STORY
  =========================== */
  useEffect(() => {
    getStoryById(id)
      .then((data) => {
        console.log("📖 Story fetched:", data);
        console.log("👤 Author data:", data?.author);
        setStory(data);

        if (loggedInUserId && data?.author?.followers) {
          const followed = data.author.followers.some(
            (uid) => uid.toString() === loggedInUserId
          );
          setIsFollowingState(followed);
        }

        setFollowersCount(data?.author?.followers?.length || 0);
      })
      .catch((err) => {
        console.error("Error fetching story:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id, loggedInUserId, location.key]);

  /* ===========================
     FETCH CHAPTERS (FIXED)
  =========================== */
  useEffect(() => {
    if (!id) return;

    const loadChapters = async () => {
      try {
        const res = await api.get(`/chapters/${id}`);
        console.log("📦 LOADED CHAPTERS:", res.data);
        setChapters(res.data);
      } catch (err) {
        console.log("Error loading chapters", err);
      }
    };

    loadChapters();
  }, [id]);

  /* ===========================
     FOLLOW / UNFOLLOW
  =========================== */
  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!story.author?._id) {
      alert("Author not found");
      return;
    }

    try {
      // The /follow endpoint toggles follow/unfollow based on current state
      const res = await api.post(
        `/authors/${story.author._id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Follow toggle response:", res.data);

      setStory((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          followers: res.data.followers,
        },
      }));

      setIsFollowingState(res.data.following);
      setFollowersCount(res.data.followersCount || res.data.followers?.length || 0);
    } catch (err) {
      console.error("Follow action error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Follow action failed");
    }
  };
  


  /* ===========================
     ✅ OPEN FOLLOWERS LIST
  =========================== */
  const openFollowers = async () => {
    try {
      const res = await api.get(
        `/authors/${story.author._id}/followers`
      );
      setFollowersList(res.data);
      setShowFollowers(true);
    } catch (err) {
      console.error("Failed to load followers", err);
    }
  };

  // ✅ LOADING/ERROR CHECKS AFTER HOOKS
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!story) return null;

  // ✅ IMPROVED: More robust author check with detailed logging
  const storyAuthorId = story.author?._id;
  console.log("story.author._id:", storyAuthorId);
  console.log("Types - loggedInUserId:", typeof loggedInUserId, "storyAuthorId:", typeof storyAuthorId);
  
  const isAuthor = 
    !!loggedInUserId && 
    !!storyAuthorId && 
    loggedInUserId?.toString() === storyAuthorId?.toString();
  
  console.log("✅ isAuthor:", isAuthor);

  return (
    <div className="story-detail">
      {/* STORY TITLE - DISPLAY AT TOP */}
      <h1 className="story-title-top">{story.title}</h1>

      {/* STORY INFO CARD - HORIZONTAL LAYOUT */}
      <div className="story-info-card">
        {/* COVER IMAGE - LEFT SIDE */}
        <div className="story-cover-wrapper">
          <img
            src={story.coverImage || "https://via.placeholder.com/300x400"}
            alt={story.title}
            className="story-cover"
          />
        </div>

        {/* STORY DETAILS - RIGHT SIDE */}
        <div className="story-details-wrapper">
          {/* TAGS */}
          {story.category && (
            <div className="story-tags">
              <span className="tag">{story.category}</span>
            </div>
          )}

          <p className="story-description">{story.description}</p>

          {/* STATS GRID */}
          <div className="story-stats-grid">
            <div className="stat-box">
              <div className="stat-value">2</div>
              <div className="stat-label">Reading Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{story.readCount || 0}+</div>
              <div className="stat-label">Read Count</div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="story-actions">
            <button
              className="btn-read-now"
              onClick={() => {
                if (!token) {
                  navigate("/login");
                  return;
                }
                navigate(`/story/${story._id}/read`, {
                  state: { story },
                });
              }}
            >
              Read now
            </button>
            
            {isAuthor && (
              <button
                className="btn-add-chapter"
                onClick={() => navigate(`/add-chapter/${story._id}`)}
              >
                + Add Chapter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AUTHOR CARD */}
      {story.author && (
        <div className="author-card">
          <div
            className="author-avatar-section"
            onClick={() => navigate(`/author/${story.author._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="author-avatar">
              {story.author.avatar ? (
                <img 
                  src={getImageUrl(story.author.avatar)}
                  alt={story.author.username}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                story.author.username?.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <div className="author-info">
              <h3>{story.author.username || story.author.penName || "Unknown Author"}</h3>
              <p
                className="followers-link"
                onClick={(e) => {
                  e.stopPropagation();
                  openFollowers();
                }}
              >
                {followersCount} Followers
              </p>
            </div>
          </div>

          {token ? (
            loggedInUserId?.toString() !== story.author._id?.toString() ? (
              <button
                className={`follow-btn ${isFollowingState ? "following" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFollow(e);
                }}
              >
                {isFollowingState ? "Following" : "Follow"}
              </button>
            ) : null
          ) : (
            <button
              className="follow-btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login to Follow
            </button>
          )}
        </div>
      )}

      {/* CHAPTERS SECTION */}
      <div className="chapters-section">
        <h2>Chapters</h2>

        {chapters.length === 0 && (
          <p className="no-chapters">No chapters added yet.</p>
        )}

        {chapters.map((ch, index) => (
          <div
            key={ch._id}
            className="chapter-item"
            onClick={() => navigate(`/story/${story._id}/chapter/${ch._id}`, { state: { chapter: ch, story } })}
          >
            <div className="chapter-info">
              <h3>
                {index + 1}. {ch.title}
              </h3>
              <div className="chapter-meta">
                <span>⏱ {ch.readingTime || "5 min"}</span>
                <span>{new Date(ch.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div className="followers-modal" onClick={() => setShowFollowers(false)}>
          <div
            className="followers-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Followers</h3>

            {followersList.length === 0 ? (
              <p>No followers yet</p>
            ) : (
              followersList.map((u) => (
                <div
                  key={u._id}
                  className="follower-item"
                  onClick={() => navigate(`/author/${u._id}`)}
                >
                  <img
                    src={u.avatar || "https://via.placeholder.com/40"}
                    alt={u.username}
                  />
                  <span>{u.username}</span>
                </div>
              ))
            )}

            <button onClick={() => setShowFollowers(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;