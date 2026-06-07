import { useEffect, useState } from "react";
import { getStories } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./ManageLanguages.css";

const ManageLanguages = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStories();
  }, [page, search, language]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getStories({ page, search, language, limit: 20 });
      setStories(res.data.stories);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "author",
      label: "Author",
      render: (row) => {
        const age = row.author?.ageCategory ? ` (${row.author.ageCategory})` : "";
        return `${row.author?.username || "Unknown"}${age}`;
      }
    },
    {
      key: "language",
      label: "Language",
      render: (row) => row.language || "English"
    },
    { key: "category", label: "Category" },
    {
      key: "readCount",
      label: "Views",
      render: (row) => (row.readCount || 0).toLocaleString()
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  if (loading && stories.length === 0) {
    return <div className="loading-container">Loading stories...</div>;
  }

  return (
    <div className="manage-languages">
      <h2>Language Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search stories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="filter-input"
        />
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
        </select>
      </div>

      <div className="table-container">
        {stories.length > 0 ? (
          <>
            <AdminTable columns={columns} data={stories} />
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>📭 No stories found</p>
            <p className="empty-state-subtitle">
              Stories will appear here once they are published in this language.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLanguages;
