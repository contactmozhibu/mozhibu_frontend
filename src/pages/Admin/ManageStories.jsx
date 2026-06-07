import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStories, deleteStory, hideStory, featureStory } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./ManageStories.css";

const ManageStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    fetchStories();
  }, [page, search, status, language]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getStories({ page, search, status, language, limit: 20 });
      setStories(res.data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (story) => {
    if (window.confirm(`Delete story "${story.title}"? This cannot be undone.`)) {
      try {
        await deleteStory(story._id);
        fetchStories();
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
  };

  const handleHideStory = async (story) => {
    try {
      await hideStory(story._id);
      fetchStories();
    } catch (error) {
      console.error("Error hiding story:", error);
    }
  };

  const handleFeatureStory = async (story) => {
    try {
      await featureStory(story._id);
      fetchStories();
    } catch (error) {
      console.error("Error featuring story:", error);
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

  const actions = [
    { 
      type: "view", 
      label: "👁️", 
      handler: (row) => {
        console.log("View story:", row);
        navigate(`/story/${row._id}`);
      }
    },
    { 
      type: "edit", 
      label: "✏️", 
      handler: (row) => {
        console.log("Edit story:", row);
        // Navigate to edit story page (if it exists) or show edit modal
        alert(`Edit story: ${row.title}`);
      }
    },
    { type: "block", label: "🚫", handler: handleHideStory },
    { type: "delete", label: "🗑️", handler: handleDeleteStory }
  ];

  return (
    <div className="manage-stories">
      <h2>Story Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search stories..."
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
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <AdminTable columns={columns} data={stories} actions={actions} loading={loading} />

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

export default ManageStories;
