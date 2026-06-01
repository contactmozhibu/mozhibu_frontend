import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  deactivateUser,
  deleteUser,
} from "../../services/admin.service";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await fetchAllUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>

      {users.map((user) => (
        <div key={user._id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
          <p><b>{user.username}</b> ({user.email})</p>
          <p>Status: {user.isActive ? "Active" : "Inactive"}</p>

          <button onClick={() => deactivateUser(user._id)}>
            Deactivate
          </button>

          <button
            style={{ marginLeft: "10px", color: "red" }}
            onClick={() => deleteUser(user._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageUsers;
