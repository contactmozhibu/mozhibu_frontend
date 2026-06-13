
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import {
  getNotifications,
  markAsRead,
  markAllRead
} from "../../services/notification.service";
import { getImageUrl } from "../../config/apiConfig";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // For author profile modal
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorStats, setAuthorStats] = useState(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
  markAllRead();
}, []);


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

const handleNotificationClick = async (notif) => {
  try {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }

    if (notif.story?._id && notif.type !== "FOLLOW") {
      navigate(`/story/${notif.story._id}`);
    } else if (notif.fromUser?._id && notif.type === "FOLLOW") {
      navigate(`/author/${notif.fromUser._id}`);
    } else if (notif.story?._id) {
      navigate(`/story/${notif.story._id}`);
    }
  } catch (err) {
    console.error("Notification click error", err);
  }
};

// Open author profile modal
const openAuthorModal = async (author) => {
  try {
    setSelectedAuthor(author);
    setShowAuthorModal(true);
    setShowFollowersList(false);
    setShowFollowingList(false);
    
    // Fetch author stats
    const res = await api.get(`/authors/${author._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    setAuthorStats(res.data.author || res.data.user || res.data);
  } catch (err) {
    console.error("Failed to load author", err);
  }
};

// Load followers
const loadFollowers = async () => {
  try {
    const res = await api.get(`/authors/${selectedAuthor._id}/followers`);
    setFollowersList(res.data);
    setShowFollowersList(true);
  } catch (err) {
    console.error("Failed to load followers", err);
  }
};

// Load following
const loadFollowing = async () => {
  try {
    const res = await api.get(`/authors/${selectedAuthor._id}/following`);
    setFollowingList(res.data);
    setShowFollowingList(true);
  } catch (err) {
    console.error("Failed to load following", err);
  }
};

  return (
    <div className="notif-page">
      <h2>{t("notif_title") || "Notifications"}</h2>

      {notifications.length === 0 && (
        <p className="empty">{t("notif_empty") || "No notifications"}</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notif-card ${n.isRead ? "" : "unread"}`}
        >
          <img
            src={
              n.fromUser?.avatar 
                ? getImageUrl(n.fromUser.avatar)
                : "https://via.placeholder.com/50"
            }
            alt=""
            className="avatar"
            onClick={() => openAuthorModal(n.fromUser)}
            style={{ cursor: "pointer" }}
          />

          <div className="content" onClick={() => handleNotificationClick(n)} style={{ cursor: "pointer" }}>
            <p className="message">{n.message}</p>

            {n.story && (
              <div className="story-details">
                <span className="story-title">📖 {n.story.title}</span>
                {n.type === "REVIEW" && (
                  <span className="review-badge">
                    {"⭐".repeat(n.review?.rating || 0)} Review
                  </span>
                )}
              </div>
            )}

            {n.review?.comment && (
              <div className="review-comment">
                <span className="comment-text">"{n.review.comment}"</span>
              </div>
            )}
            
            {n.type === "FOLLOW" && (
              <span className="follow-badge">👥 Following</span>
            )}

            <span className="time">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}

      {/* ===========================
          AUTHOR PROFILE MODAL
      =========================== */}
      {showAuthorModal && selectedAuthor && authorStats && (
        <div className="modal-overlay" onClick={() => setShowAuthorModal(false)}>
          <div className="author-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAuthorModal(false)}>✕</button>
            
            <div className="author-modal-header">
              <img
                src={
                  authorStats?.avatar
                    ? getImageUrl(authorStats.avatar)
                    : "https://via.placeholder.com/100"
                }
                alt={authorStats.username}
                className="modal-avatar"
              />
              
              <div className="author-info">
                <h2>{authorStats.username || authorStats.penName}</h2>
                
                <div className="author-stats-row">
                  <div className="stat">
                    <strong>{authorStats.stories?.length || 0}</strong>
                    <span>Stories</span>
                  </div>
                  <div 
                    className="stat clickable"
                    onClick={loadFollowers}
                  >
                    <strong>{authorStats.followers?.length || 0}</strong>
                    <span>Followers</span>
                  </div>
                  <div 
                    className="stat clickable"
                    onClick={loadFollowing}
                  >
                    <strong>{authorStats.following?.length || 0}</strong>
                    <span>Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===========================
                FOLLOWERS LIST
            =========================== */}
            {showFollowersList && (
              <div className="followers-container">
                <h3>Followers ({followersList.length})</h3>
                {followersList.length === 0 ? (
                  <p>No followers yet</p>
                ) : (
                  <div className="followers-list">
                    {followersList.map((follower) => (
                      <div
                        key={follower._id}
                        className="follower-item"
                        onClick={() => {
                          setShowAuthorModal(false);
                          navigate(`/author/${follower._id}`);
                        }}
                      >
                        <img
                          src={
                            follower.avatar
                              ? getImageUrl(follower.avatar)
                              : "https://via.placeholder.com/40"
                          }
                          alt={follower.username}
                        />
                        <span>{follower.username}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  className="back-btn"
                  onClick={() => setShowFollowersList(false)}
                >
                  ← Back
                </button>
              </div>
            )}

            {/* ===========================
                FOLLOWING LIST
            =========================== */}
            {showFollowingList && (
              <div className="following-container">
                <h3>Following ({followingList.length})</h3>
                {followingList.length === 0 ? (
                  <p>Not following anyone yet</p>
                ) : (
                  <div className="following-list">
                    {followingList.map((following) => (
                      <div
                        key={following._id}
                        className="following-item"
                        onClick={() => {
                          setShowAuthorModal(false);
                          navigate(`/author/${following._id}`);
                        }}
                      >
                        <img
                          src={
                            following.avatar
                              ? getImageUrl(following.avatar)
                              : "https://via.placeholder.com/40"
                          }
                          alt={following.username}
                        />
                        <span>{following.username}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  className="back-btn"
                  onClick={() => setShowFollowingList(false)}
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Show stats when no list is active */}
            {!showFollowersList && !showFollowingList && (
              <div className="author-action-buttons">
                <button 
                  className="action-btn"
                  onClick={() => {
                    setShowAuthorModal(false);
                    navigate(`/author/${selectedAuthor._id}`);
                  }}
                >
                  View Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
