import { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./AdminAuditLogs.css";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, action]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({ page, action, limit: 50 });
      setLogs(res.data.logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    "UPDATE_USER",
    "BLOCK_USER",
    "DELETE_USER",
    "UPDATE_STORY",
    "DELETE_STORY",
    "HIDE_STORY",
    "DELETE_COMMENT",
    "CREATE_CATEGORY",
    "DELETE_CATEGORY"
  ];

  const columns = [
    {
      key: "admin",
      label: "Admin",
      render: (row) => row.admin?.email || "Unknown"
    },
    {
      key: "action",
      label: "Action",
      render: (row) => <span className="action-badge">{row.action}</span>
    },
    { key: "description", label: "Description" },
    {
      key: "createdAt",
      label: "Timestamp",
      render: (row) => new Date(row.createdAt).toLocaleString()
    }
  ];

  return (
    <div className="admin-audit-logs">
      <h2>Audit Logs</h2>

      <div className="filters">
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Actions</option>
          {actions.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      <AdminTable columns={columns} data={logs} loading={loading} />

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

export default AdminAuditLogs;
