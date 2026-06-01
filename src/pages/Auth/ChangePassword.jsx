/*export default function ChangePassword() {
  return (
    <div style={{ padding: "40px", maxWidth: "500px" }}>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Enter old Password"
        style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Enter new Password"
        style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Confirm new Password"
        style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
      />

      <button style={{ padding: "10px 20px" }}>
        Confirm New Password
      </button>
    </div>
  );
}
*/

import { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // ✅ basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Change password API not implemented in backend");
  }

      if (!res.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setSuccess("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px" }}>
      <h2>Change Password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="password"
        placeholder="Enter old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Enter new Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Confirm new Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
      />

      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px" }}
      >
        Confirm New Password
      </button>
    </div>
  );
}
