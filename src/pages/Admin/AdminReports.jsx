import { useEffect, useState } from "react";
import { getReports, updateReportStatus } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./AdminReports.css";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    fetchReports();
  }, [page, status]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getReports({ page, status, limit: 20 });
      setReports(res.data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReport = async (report) => {
    try {
      await updateReportStatus(report._id, { status: "approved", action: "removed" });
      fetchReports();
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  const handleRejectReport = async (report) => {
    try {
      await updateReportStatus(report._id, { status: "rejected", action: "no_action" });
      fetchReports();
    } catch (error) {
      console.error("Error rejecting report:", error);
    }
  };

  const columns = [
    { key: "contentType", label: "Type" },
    {
      key: "reason",
      label: "Reason",
      render: (row) => <span className="reason-badge">{row.reason}</span>
    },
    {
      key: "reportedBy",
      label: "Reported By",
      render: (row) => row.reportedBy?.email || "Unknown"
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <span className={`status-badge status-${row.status}`}>{row.status}</span>
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  const actions = [
    { type: "edit", label: "✅", handler: handleApproveReport },
    { type: "delete", label: "❌", handler: handleRejectReport }
  ];

  return (
    <div className="admin-reports">
      <h2>Content Reports</h2>

      <div className="filters">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <AdminTable columns={columns} data={reports} actions={actions} loading={loading} />

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

export default AdminReports;
