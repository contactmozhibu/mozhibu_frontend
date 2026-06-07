import { useEffect, useState } from "react";
import { getAgeCategories, createAgeCategory, updateAgeCategory, deleteAgeCategory } from "../../services/adminApi";
import "./ManageAgeCategories.css";

const ManageAgeCategories = () => {
  const [ageCategories, setAgeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    minAge: 0,
    maxAge: null,
    description: "",
    requiresEroticType: false,
    isActive: true
  });

  useEffect(() => {
    fetchAgeCategories();
  }, []);

  const fetchAgeCategories = async () => {
    try {
      setLoading(true);
      const res = await getAgeCategories();
      setAgeCategories(res.data);
    } catch (error) {
      console.error("Error fetching age categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAgeCategory(editingId, formData);
      } else {
        await createAgeCategory(formData);
      }
      fetchAgeCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving age category:", error);
      alert("Failed to save age category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this age category?")) {
      try {
        await deleteAgeCategory(id);
        fetchAgeCategories();
      } catch (error) {
        console.error("Error deleting age category:", error);
        alert("Failed to delete age category");
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      minAge: category.minAge,
      maxAge: category.maxAge || "",
      description: category.description || "",
      requiresEroticType: category.requiresEroticType || false,
      isActive: category.isActive !== false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      minAge: 0,
      maxAge: null,
      description: "",
      requiresEroticType: false,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="age-categories-container"><p>Loading...</p></div>;
  }

  return (
    <div className="age-categories-container">
      <div className="header">
        <h2>📅 Age Categories Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add New Age Category"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Age Category" : "Create New Age Category"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Teens (13-17)"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Min Age *</label>
                <input
                  type="number"
                  value={formData.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Age (leave blank for no limit)</label>
                <input
                  type="number"
                  value={formData.maxAge || ""}
                  onChange={(e) => setFormData({ ...formData, maxAge: e.target.value ? parseInt(e.target.value) : null })}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows="3"
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.requiresEroticType}
                  onChange={(e) => setFormData({ ...formData, requiresEroticType: e.target.checked })}
                />
                Requires Erotic Type Selection (18+)
              </label>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-success">
                {editingId ? "Update" : "Create"}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-list">
        {ageCategories.length === 0 ? (
          <p className="empty-state">No age categories found</p>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age Range</th>
                <th>Description</th>
                <th>Erotic Type?</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ageCategories.map((cat) => (
                <tr key={cat._id}>
                  <td className="name">{cat.name}</td>
                  <td className="age-range">
                    {cat.minAge} - {cat.maxAge ? cat.maxAge : "∞"}
                  </td>
                  <td className="description">{cat.description || "-"}</td>
                  <td className="center">
                    {cat.requiresEroticType ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="center">
                    <span className={`status-badge ${cat.isActive ? "active" : "inactive"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      title="Edit"
                      onClick={() => handleEdit(cat)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      title="Delete"
                      onClick={() => handleDelete(cat._id)}
                    >
                      🗑️
                    </button>
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

export default ManageAgeCategories;
