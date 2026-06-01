import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside style={{ width: "220px", background: "#111", color: "#fff" }}>
      <h3 style={{ padding: "15px" }}>Mozhibu Admin</h3>

      <nav>
        <NavLink to="/admin" className="admin-link">Dashboard</NavLink>
        <NavLink to="/admin/users" className="admin-link">Users</NavLink>
        <NavLink to="/admin/stories" className="admin-link">Stories</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
