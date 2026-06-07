import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ManageCategories.css";

const ManageCategories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Fetch published stories with author info
      const res = await api.get(`/stories?status=PUBLISHED`);
      const publishedStories = Array.isArray(res.data) ? res.data : res.data.stories || [];
      
      // Populate author names if not already there
      const storiesWithAuthors = publishedStories.map(story => ({
        ...story,
        authorName: story.author?.username || story.author?.name || "Unknown Author"
      }));
      
      setStories(storiesWithAuthors);
      setFilteredStories(storiesWithAuthors);

      // Calculate story count per category
      const stats = {};
      publishedStories.forEach(story => {
        const category = story.category || "Uncategorized";
        stats[category] = (stats[category] || 0) + 1;
      });
      setCategoryStats(stats);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search filtering by category
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchCategory(term);

    const filtered = stories.filter((story) =>
      (story.category || "Uncategorized").toLowerCase().includes(term)
    );
    setFilteredStories(filtered);
  };

  if (loading) {
    return (
      <div className="manage-categories-container">
        <p className="loading-text">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="manage-categories-container">
      <div className="categories-header">
        <h2>📚 Category Management</h2>
        <p className="total-count">Total Published Stories: {stories.length}</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by category..."
            value={searchCategory}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <p className="results-count">
          {filteredStories.length === 0
            ? "No stories found"
            : `Showing ${filteredStories.length} of ${stories.length} stories`}
        </p>
      </div>

      {/* Stories Table */}
      <div className="table-container">
        {filteredStories.length === 0 ? (
          <div className="empty-state">
            <p>No stories match your search.</p>
          </div>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Category Story Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredStories.map((story) => (
                <tr key={story._id} className="category-row">
                  <td className="story-title-cell">
                    {story.title || "Untitled"}
                  </td>
                  <td className="category">
                    <span className="badge category-badge">
                      {story.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="subcategory">
                    {story.subcategories && story.subcategories.length > 0 ? (
                      <div className="subcategories-list">
                        {story.subcategories.map((sub, idx) => (
                          <span key={idx} className="sub-badge">
                            {sub}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-subcategory">—</span>
                    )}
                  </td>
                  <td className="story-count">
                    <span className="count-badge">
                      {categoryStats[story.category || "Uncategorized"]} stories
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
