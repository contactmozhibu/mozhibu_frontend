import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Profile
    adminName: "",
    adminEmail: "",
    // General
    platformName: "Mozhibu",
    platformLogo: "",
    maintenanceMode: false,
    // Content
    allowNewRegistrations: true,
    allowGuestReading: true,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Get admin user info
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setSettings((prev) => ({
          ...prev,
          adminName: user.name || "",
          adminEmail: user.email || "",
        }));
      }

      // Fetch platform settings from API
      const response = await api.get("/admin/settings");
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data,
        }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      // Use default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneralChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContentChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setError("");
      setSaveSuccess(false);

      // Validate passwords if changing
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        if (newPassword.length < 6) {
          setError("Password must be at least 6 characters!");
          return;
        }
      }

      // Save settings to backend
      const payload = {
        platformName: settings.platformName,
        platformLogo: settings.platformLogo,
        maintenanceMode: settings.maintenanceMode,
        allowNewRegistrations: settings.allowNewRegistrations,
        allowGuestReading: settings.allowGuestReading,
      };

      // Include password if provided
      if (newPassword) {
        payload.newPassword = newPassword;
      }

      const response = await api.put("/admin/settings", payload);

      if (response.data) {
        setSaveSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    }
  };

  if (loading) {
    return <div className="admin-settings"><p>Loading settings...</p></div>;
  }

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Admin Settings</h1>
      </div>

      {saveSuccess && (
        <div className="alert alert-success">✅ Settings saved successfully!</div>
      )}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <div className="settings-container">
        {/* PROFILE SECTION */}
        <div className="settings-section">
          <h2>👤 Profile</h2>
          <div className="settings-content">
            <div className="setting-group">
              <label>Admin Name</label>
              <input
                type="text"
                value={settings.adminName}
                onChange={(e) => handleProfileChange("adminName", e.target.value)}
                placeholder="Enter admin name"
              />
            </div>

            <div className="setting-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                disabled
                placeholder="Admin email (read-only)"
              />
              <small>Email cannot be changed here</small>
            </div>

            <div className="setting-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
              />
            </div>

            <div className="setting-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        {/* GENERAL SECTION */}
        <div className="settings-section">
          <h2>🌐 General</h2>
          <div className="settings-content">
            <div className="setting-group">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleGeneralChange("platformName", e.target.value)}
                placeholder="Enter platform name"
              />
            </div>

            <div className="setting-group">
              <label>Platform Logo URL</label>
              <input
                type="text"
                value={settings.platformLogo}
                onChange={(e) => handleGeneralChange("platformLogo", e.target.value)}
                placeholder="Enter logo URL"
              />
            </div>

            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleGeneralChange("maintenanceMode", e.target.checked)
                  }
                />
                <span>Maintenance Mode</span>
              </label>
              <small>Enable to show maintenance message to users</small>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="settings-section">
          <h2>📝 Content</h2>
          <div className="settings-content">
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.allowNewRegistrations}
                  onChange={(e) =>
                    handleContentChange("allowNewRegistrations", e.target.checked)
                  }
                />
                <span>Allow New Registrations</span>
              </label>
              <small>Toggle to allow/block new user signups</small>
            </div>

            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.allowGuestReading}
                  onChange={(e) =>
                    handleContentChange("allowGuestReading", e.target.checked)
                  }
                />
                <span>Allow Guest Reading</span>
              </label>
              <small>Allow non-logged-in users to read stories</small>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="settings-footer">
          <button className="save-btn" onClick={handleSaveSettings}>
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
