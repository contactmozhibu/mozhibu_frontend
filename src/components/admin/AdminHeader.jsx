import { useAuth } from "../../hooks/useAuth";
import "./AdminHeader.css";

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="admin-header-right">
        <div className="admin-user-info">
          <span className="admin-username">{user?.name || "Admin"}</span>
          <span className="admin-role">{user?.role?.toUpperCase()}</span>
        </div>
        
        <button className="admin-logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
