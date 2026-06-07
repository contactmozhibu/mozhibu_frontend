import { useEffect, useState } from "react";
import { getDashboardStats, getRecentActivity } from "../../services/adminApi";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-container">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Platform Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <AdminStatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="primary"
        />
        <AdminStatsCard
          title="Total Stories"
          value={stats?.totalStories || 0}
          icon="📖"
          color="success"
        />
        <AdminStatsCard
          title="Total Chapters"
          value={stats?.totalChapters || 0}
          icon="📄"
          color="warning"
        />
        <AdminStatsCard
          title="Total Comments"
          value={stats?.totalComments || 0}
          icon="💬"
          color="primary"
        />
        <AdminStatsCard
          title="Active Users (24h)"
          value={stats?.activeUsers || 0}
          icon="🟢"
          color="success"
        />
        <AdminStatsCard
          title="New Users (7d)"
          value={stats?.newUsers || 0}
          icon="🆕"
          color="warning"
        />
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="activity-card">
          <h3>📝 Recent Registrations</h3>
          <div className="activity-list">
            {activity?.recentUsers && activity.recentUsers.length > 0 ? (
              activity.recentUsers.map((user, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-info">
                    <p className="activity-title">{user.name}</p>
                    <p className="activity-meta">{user.email}</p>
                  </div>
                  <span className="activity-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-state">No recent registrations</p>
            )}
          </div>
        </div>

        <div className="activity-card">
          <h3>📖 Recent Stories</h3>
          <div className="activity-list">
            {activity?.recentStories && activity.recentStories.length > 0 ? (
              activity.recentStories.map((story, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-info">
                    <p className="activity-title">{story.title}</p>
                    <p className="activity-meta">by {story.author?.name}</p>
                  </div>
                  <span className="activity-date">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-state">No recent stories</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
