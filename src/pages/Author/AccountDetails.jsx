import { useEffect, useState } from "react";
import api from "../../services/api";
import { getImageUrl } from "../../config/apiConfig";
import toast from "react-hot-toast";
import "./accountDetails.css";

export default function AccountDetails() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [showDanger, setShowDanger] = useState(false);
  const [dangerType, setDangerType] = useState("deactivate"); // ✅ FIX
  const [agree, setAgree] = useState(false);

  const token = localStorage.getItem("token");

  /* ======================
     FETCH PROFILE
  ====================== */
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get("/authors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.author);
      setForm(res.data.author);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  fetchProfile();

  // 👇 REFRESH WHEN TAB COMES BACK
  window.addEventListener("focus", fetchProfile);

  return () => window.removeEventListener("focus", fetchProfile);
}, [token]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setForm({ ...form, avatar: file });
  };

  /* ======================
     SAVE PROFILE
  ====================== */
  const saveProfile = async () => {
  try {
    const formData = new FormData();

    const username = `${form.firstName || ""} ${form.lastName || ""}`.trim();

    formData.append("username", username);
    formData.append("mobile", form.phone || "");
    formData.append("bio", form.summary || "");

    if (form.avatar instanceof File) {
      formData.append("avatar", form.avatar);
    }

    await api.put("/authors/me", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Profile updated successfully 🎉");
    setEdit(false);

    const res = await api.get("/authors/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data.author);
    setForm(res.data.author);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  }
};

  /* ======================
     DELETE / DEACTIVATE
  ====================== */
  const handleDangerAction = async () => {
  if (!agree) return toast.error("Please accept the terms");

  try {
    if (dangerType === "delete") {
      // 🔴 DELETE ACCOUNT - Permanent removal
      await api.delete("/authors/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Account permanently deleted");
      toast("All your data has been erased");

      // Clear storage and redirect
      localStorage.clear();
      
      // Wait 1.5 seconds before redirect so user sees toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      // 🟡 DEACTIVATE ACCOUNT - Temporary hide profile
      await api.patch(
        "/authors/deactivate",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Account deactivated successfully");
      toast("Your profile is now hidden from others. You can still login and use the app.");
      
      // Just close modal and stay on page
      setShowDanger(false);
      setAgree(false);
    }
  } catch (err) {
    console.error(err);
    const errorMsg = err.response?.data?.message || "Action failed";
    toast.error("❌ " + errorMsg);
  }
};



if (!user) return <p>Loading...</p>;


  return (
    <div className="account-container">
      {!showDanger ? (
        <div className="account-card">
          {/* AVATAR */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
  src={
    avatarPreview ||
    (user.avatar
      ? getImageUrl(user.avatar)
      : "https://via.placeholder.com/300x400?text=No+Image")
  }
  alt="Profile"
/>

              {edit && (
                <label className="avatar-overlay">
                  Change photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="account-stats">
  <div>
    <b>{user.followers?.length || 0}</b>
    <span>Followers</span>
  </div>
  <div>
    <b>{user.following?.length || 0}</b>
    <span>Following</span>
  </div>
</div>


          {/* FORM */}
          <div className="form-grid">
            <input
              name="firstName"
              value={form.firstName || ""}
              onChange={handleChange}
              disabled={!edit}
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={form.lastName || ""}
              onChange={handleChange}
              disabled={!edit}
              placeholder="Last Name"
            />

            <input value={user.email} disabled />

            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              disabled={!edit}
              placeholder="Mobile"
            />

            <textarea
              name="summary"
              value={form.summary || ""}
              onChange={handleChange}
              disabled={!edit}
              placeholder="Tell something about yourself..."
            />
          </div>

          {/* ACTIONS */}
          <div className="action-row">
            {!edit ? (
              <button className="edit-btn" onClick={() => setEdit(true)}>
                ✏ Edit user account
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={saveProfile}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setEdit(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="danger-card" onClick={() => setShowDanger(true)}>
            🗑 Delete / Deactivate Account →
          </div>
        </div>
      ) : (
        <div className="danger-page">
          <h2>Account Action</h2>

          <div
            className={`danger-option ${
              dangerType === "deactivate" ? "active" : ""
            }`}
            onClick={() => setDangerType("deactivate")}
          >
            <h4>Deactivate Account</h4>
            <p>Your profile will be hidden</p>
          </div>

          <div
            className={`danger-option ${
              dangerType === "delete" ? "active" : ""
            }`}
            onClick={() => setDangerType("delete")}
          >
            <h4>Delete Account</h4>
            <p>All data will be erased permanently</p>
          </div>

          <label>
            <input type="checkbox" onChange={(e) => setAgree(e.target.checked)} />
            I agree to the terms
          </label>

          <button
            className="danger-btn"
            disabled={!agree}
            onClick={handleDangerAction}
          >
            Confirm
          </button>

          <button className="back-btn" onClick={() => setShowDanger(false)}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

