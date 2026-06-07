import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews, deleteReview } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";
import "./ManageReviews.css";

const ManageReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [page, search, language]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getReviews({ page, search, language, limit: 20 });
      setReviews(res.data.reviews);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (review) => {
    if (
      window.confirm(
        `Delete review for "${review.story.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteReview(review._id);
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
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
      key: "story.author",
      label: "Author",
      render: (row) => row.story?.author?.username
    },
    {
      key: "user.username",
      label: "Reviewer",
      render: (row) => row.user?.username
    },
    {
      key: "story.language",
      label: "Language",
      render: (row) => row.story?.language
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="rating-display">
          {"⭐".repeat(row.rating)}
          <span className="rating-value">({row.rating}/5)</span>
        </div>
      )
    },
    {
      key: "comment",
      label: "Comment",
      render: (row) => (
        <div className="comment-preview">
          {row.comment || "No comment"}
        </div>
      )
    }
  ];

  const actions = [
    {
      type: "view",
      label: "👁️",
      handler: (row) => {
        console.log("View review:", row);
        navigate(`/story/${row.story._id}`);
      }
    },
    {
      type: "delete",
      label: "🗑️",
      handler: handleDeleteReview
    }
  ];

  if (loading && reviews.length === 0) {
    return <div className="loading-container">Loading reviews...</div>;
  }

  return (
    <div className="manage-reviews">
      <h2>Review & Comment Management</h2>

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
        {reviews.length > 0 ? (
          <>
            <AdminTable columns={columns} data={reviews} actions={actions} />
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
            <p>📭 No reviews found</p>
            <p className="empty-state-subtitle">
              Reviews will appear here once users rate or comment on stories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
