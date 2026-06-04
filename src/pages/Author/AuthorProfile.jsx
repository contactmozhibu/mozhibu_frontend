
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { getImageUrl } from "../../config/apiConfig";
import "./authorProfile.css";

export default function AuthorProfile() {
  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loggedUser?.role === "admin";


  const isMe = !id;


  /* =========================
     FETCH AUTHOR + STORIES
  ========================= */
  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  if (loggedUser?.role === "admin") {
    navigate("/admin");
    return;
  }

  const fetchData = async () => {
    try {
      let authorRes;
      let storiesRes;

      if (isMe) {
        authorRes = await api.get("/authors/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        storiesRes = await api.get("/stories/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthor(authorRes.data.author);
      } else {
  authorRes = await api.get(`/authors/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  storiesRes = await api.get(`/stories/author/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

        const authorData =
          authorRes.data.author ||
          authorRes.data.user ||
          authorRes.data;

        setAuthor(authorData);

        if (authorData?.followers && loggedUser) {
          setIsFollowing(
            authorData.followers.some(
              (fid) => fid.toString() === loggedUser._id
            )
          );
        }
      }

      setStories(storiesRes.data || []);
    } catch (err) {
      console.error(err);
      setAuthor(null);
    }
  };

  fetchData();
}, [id, token]);

const refreshLoggedUser = async () => {
  try {
    const res = await api.get("/authors/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("user", JSON.stringify(res.data.author));
  } catch (err) {
    console.error("Failed to refresh logged user", err);
  }
};

  /* =========================
     STEP 3: FOLLOW / UNFOLLOW
  ========================= */
  const handleFollowToggle = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await api.post(
      `/authors/${id}/follow`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update follow button instantly
    setIsFollowing(res.data.isFollowing);

    // Update viewed author's followers
    setAuthor((prev) => ({
      ...prev,
      followers: res.data.followers,
    }));

    // 🔥 IMPORTANT: refresh logged-in user
    await refreshLoggedUser();

  } catch (err) {
    console.error("Follow toggle failed", err);
  }
};



  if (!author) return <p>Loading author...</p>;

  return (
    <div className="ap-container">
      {/* HEADER */}
      <div className="ap-header">
        <div className="ap-avatar">
          <img
            src={
              author?.avatar
                ? getImageUrl(author.avatar)
                : "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={author.username}
          />
        </div>

        <h1 className="ap-username">{author.username || author.penName}</h1>

{!isMe && !isAdmin && (
  <button
    className={`follow-btn ${isFollowing ? "following" : ""}`}
    onClick={handleFollowToggle}
  >
    {isFollowing ? "Following" : "Follow"}
  </button>
)}



<div className="ap-stats">
  <span>
    <b>{stories.length}</b> Contents
  </span>
  <span>
    <b>{author.followers?.length || 0}</b> Followers
  </span>
  <span>
    <b>{author.following?.length || 0}</b> Following
  </span>
</div>


        {/* EDIT PROFILE (ONLY ME) */}
        {isMe && !isAdmin && (
  <button
    className="edit-profile-btn"
    onClick={() => navigate("/account")}
  >
    ✏ Edit user account
  </button>
)}

      </div>

      {/* TABS */}
      <div className="ap-tabs">
        <button className="ap-tab-active">
          Published Books <span>{stories.length}</span>
        </button>
      </div>

      {/* STORIES GRID */}
      <div className="ap-story-grid">
        {stories.length === 0 ? (
          <p className="ap-empty">No published stories yet.</p>
        ) : (
          stories.map((story) => {
            const avgRating = story.reviews?.length > 0
              ? (story.reviews.reduce((sum, r) => sum + r.rating, 0) / story.reviews.length).toFixed(1)
              : 0;

            return (
              <div
                key={story._id}
                className="story-card"
                onClick={() => navigate(`/story/${story._id}`)}
              >
                {/* Rating Badge */}
                {avgRating > 0 && (
                  <div className="rating-badge">
                    <span className="star">★</span>{avgRating}
                  </div>
                )}

                <img
                  src={
                    story.coverImage ||
                    "https://via.placeholder.com/300x400?text=No+Image"
                  }
                  alt={story.title}
                />

                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p className="category-badge">{story.category}</p>
                  <p className="author-name">by {author?.username || "Unknown"}</p>

                  {/* Stats */}
                  <div className="story-stats">
                    {story.readCount > 0 && (
                      <span className="stat-item">{story.readCount} Reads</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

