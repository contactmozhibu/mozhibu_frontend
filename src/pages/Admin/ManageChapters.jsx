import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChapters, deleteChapter } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./ManageChapters.css";

const ManageChapters = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchChapters();
  }, [page, search, language]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await getChapters({ page, search, language, limit: 20 });
      setChapters(res.data.chapters);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapter) => {
    if (
      window.confirm(
        `Delete chapter "${chapter.title}" from "${chapter.story.title}"? This cannot be undone.`
      )
    ) {
      try {
        await deleteChapter(chapter._id);
        fetchChapters();
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  const columns = [
    {
      key: "story.title",
      label: "Story Title",
      render: (row) => row.story?.title
    },
    {
      key: "title",
      label: "Chapter Title",
      render: (row) => row.title || "Untitled"
    },
    {
      key: "story.author",
      label: "Author",
      render: (row) => row.story?.author?.username
    },
    {
      key: "story.language",
      label: "Language",
      render: (row) => row.story?.language
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  const actions = [
    {
      type: "view",
      label: "👁️",
      handler: (row) => {
        console.log("View chapter:", row);
        navigate(`/story/${row.story._id}`);
      }
    },
    {
      type: "delete",
      label: "🗑️",
      handler: handleDeleteChapter
    }
  ];

  if (loading && chapters.length === 0) {
    return <div className="loading-container">Loading chapters...</div>;
  }

  return (
    <div className="manage-chapters">
      <h2>Chapter Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search chapters..."
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
        {chapters.length > 0 ? (
          <>
            <AdminTable columns={columns} data={chapters} actions={actions} />
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
            <p>📭 No chapters found</p>
            <p className="empty-state-subtitle">
              Chapters will appear here once they are created by authors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageChapters;
