import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  return (
    <aside className="admin-sidebar">
      <div className="admin-back-btn-container">
        <button 
          className="admin-back-btn" 
          onClick={() => navigate("/")}
          title="Go back to home"
        >
          ← Back to Mozhibu
        </button>
      </div>
      <div className="admin-logo">
        <h2>Mozhibu Admin</h2>
      </div>
      
      <nav className="admin-nav">
        <div className="nav-section">
          <h4 className="nav-title">Dashboard</h4>
          <NavLink to="/admin" className="admin-link" end>
            📊 Dashboard
          </NavLink>
        </div>

        <div className="nav-section">
          <h4 className="nav-title">Management</h4>
          <NavLink to="/admin/users" className="admin-link">
            👥 Users
          </NavLink>
          <NavLink to="/admin/stories" className="admin-link">
            📖 Stories
          </NavLink>
          <NavLink to="/admin/chapters" className="admin-link">
            📄 Chapters
          </NavLink>
          <NavLink to="/admin/languages" className="admin-link">
            🌐 Languages
          </NavLink>
          <NavLink to="/admin/notifications" className="admin-link">
            🔔 Notifications
          </NavLink>
        </div>

        <div className="nav-section">
          <h4 className="nav-title">Moderation</h4>
          <NavLink to="/admin/reviews" className="admin-link">
            💬 Reviews
          </NavLink>
          <NavLink to="/admin/categories" className="admin-link">
            🏷️ Categories
          </NavLink>
        </div>

        <div className="nav-section">
          <h4 className="nav-title">Platform</h4>
          <NavLink to="/admin/analytics" className="admin-link">
            📈 Analytics
          </NavLink>
          <NavLink to="/admin/audit-logs" className="admin-link">
            📋 Audit Logs
          </NavLink>
        </div>

        <div className="nav-section">
          <h4 className="nav-title">Settings</h4>
          <NavLink to="/admin/settings" className="admin-link">
            ⚙️ Admin Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
