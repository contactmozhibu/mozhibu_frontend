import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ManageNotifications.css";

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    system: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    message: "",
    type: "SYSTEM",
    isRead: false,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Calculate stats from notifications
    if (notifications.length > 0) {
      const total = notifications.length;
      const read = notifications.filter((n) => n.isRead).length;
      const unread = total - read;
      const system = notifications.filter((n) => n.type === "SYSTEM").length;

      setStats({ total, read, unread, system });
    }
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/notifications");
      setNotifications(res.data.notifications || []);
      setStats(res.data.stats || {});
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.message.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      if (editingId) {
        // Update existing notification
        await api.put(`/admin/notifications/${editingId}`, formData);
        setSuccess("Notification updated successfully");
      } else {
        // Create new notification by sending to all users
        await api.post("/admin/notifications/send", {
          title: formData.type,
          message: formData.message,
          targetUsers: "all"
        });
        setSuccess("Notification created successfully");
      }

      // Reset form and refresh list
      setFormData({
        message: "",
        type: "SYSTEM",
        isRead: false,
      });
      setShowForm(false);
      setEditingId(null);
      fetchNotifications();
    } catch (error) {
      console.error("Error saving notification:", error);
      setError(error.response?.data?.message || "Failed to save notification");
    }
  };

  const handleEdit = (notification) => {
    setFormData({
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
    });
    setEditingId(notification._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        setError("");
        await api.delete(`/admin/notifications/${id}`);
        setSuccess("Notification deleted successfully");
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
        setError("Failed to delete notification");
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/admin/notifications/read-all");
      setSuccess("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Failed to mark all as read");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
    setFormData({
      message: "",
      type: "SYSTEM",
      isRead: false,
    });
  };

  // Filter notifications
  let filtered = notifications;

  if (searchTerm) {
    filtered = filtered.filter((n) =>
      n.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterType === "unread") {
    filtered = filtered.filter((n) => !n.isRead);
  } else if (filterType === "read") {
    filtered = filtered.filter((n) => n.isRead);
  }

  const getTypeEmoji = (type) => {
    switch (type) {
      case "REVIEW":
        return "⭐";
      case "PUBLISHED":
        return "📖";
      case "FOLLOW":
        return "👥";
      case "COMMENT":
        return "💬";
      case "SYSTEM":
        return "⚙️";
      default:
        return "📢";
    }
  };

  if (loading) {
    return <div className="loading-container">Loading notifications...</div>;
  }

  return (
    <div className="manage-notifications">
      {/* Header */}
      <div className="notif-header">
        <div>
          <h2>🔔 Notifications Management</h2>
          <p className="subtitle">Manage and view all system notifications</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Notification
        </button>
      </div>

      {/* Alert Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Stats Cards */}
      <div className="notif-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <p className="stat-label">Read</p>
            <p className="stat-value">{stats.read}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <p className="stat-label">Unread</p>
            <p className="stat-value">{stats.unread}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <p className="stat-label">System</p>
            <p className="stat-value">{stats.system}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="notification-form-container">
          <div className="notification-form">
            <h3>{editingId ? "Edit Notification" : "Create New Notification"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  placeholder="Enter notification message"
                  rows="4"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="SYSTEM">⚙️ System</option>
                  <option value="REVIEW">⭐ Review</option>
                  <option value="PUBLISHED">📖 Published</option>
                  <option value="FOLLOW">👥 Follow</option>
                  <option value="COMMENT">💬 Comment</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="notif-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === "unread" ? "active" : ""}`}
            onClick={() => setFilterType("unread")}
          >
            Unread
          </button>
          <button
            className={`filter-btn ${filterType === "read" ? "active" : ""}`}
            onClick={() => setFilterType("read")}
          >
            Read
          </button>
          {stats.unread > 0 && (
            <button className="btn btn-small btn-info" onClick={handleMarkAllAsRead}>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No notifications found</p>
            {searchTerm && (
              <p className="empty-hint">Try adjusting your search</p>
            )}
          </div>
        ) : (
          filtered.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? "unread" : "read"}`}
            >
              <div className="notif-icon">
                {getTypeEmoji(notification.type)}
              </div>

              <div className="notif-content">
                <div className="notif-header-row">
                  <h4>{notification.type}</h4>
                  {notification.user && (
                    <span className="user-info">
                      📧 {notification.user.email}
                    </span>
                  )}
                </div>
                <p className="notif-message">{notification.message}</p>
                <div className="notif-meta">
                  <span className="notif-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <span className={`notif-status ${notification.isRead ? "read" : "unread"}`}>
                    {notification.isRead ? "👁️ Read" : "📨 Unread"}
                  </span>
                </div>
              </div>

              <div className="notif-actions">
                {!notification.isRead && (
                  <button
                    className="action-btn mark-read"
                    onClick={() => handleMarkAsRead(notification._id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="action-btn edit"
                  onClick={() => handleEdit(notification)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(notification._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Info */}
      {filtered.length > 0 && (
        <div className="pagination-info">
          Showing {filtered.length} of {stats.total} notifications
        </div>
      )}
    </div>
  );
};

export default ManageNotifications;
