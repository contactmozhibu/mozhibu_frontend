import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, blockUser, deleteUser, promoteUserToAdmin } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./ManageUsers.css";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search, role, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers({ page, search, role, status, limit: 20 });
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (user) => {
    if (window.confirm(`Block user ${user.name}?`)) {
      try {
        await blockUser(user._id);
        fetchUsers();
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Delete user ${user.name}? This action cannot be undone.`)) {
      try {
        await deleteUser(user._id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handlePromoteAdmin = async (user) => {
    if (window.confirm(`Promote ${user.name} to admin?`)) {
      try {
        await promoteUserToAdmin(user._id);
        fetchUsers();
      } catch (error) {
        console.error("Error promoting user:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => <span className={`role-badge role-${row.role}`}>{row.role}</span>
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <span className={`status-badge status-${row.status}`}>{row.status}</span>
    },
    {
      key: "storyCount",
      label: "Stories",
      render: (row) => row.storyCount || 0
    },
    {
      key: "ageCategory",
      label: "Age",
      render: (row) => row.ageCategory || "-"
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  const actions = [
    { 
      type: "view", 
      label: "👁️", 
      handler: (row) => {
        console.log("View user:", row);
        navigate(`/author/${row._id}`);
      }
    },
    { type: "block", label: "🚫", handler: handleBlockUser },
    { type: "edit", label: "✏️", handler: (row) => handlePromoteAdmin(row) },
    { type: "delete", label: "🗑️", handler: handleDeleteUser }
  ];

  return (
    <div className="manage-users">
      <h2>User Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="filter-input"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <AdminTable columns={columns} data={users} actions={actions} loading={loading} />

      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          ← Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default ManageUsers;
