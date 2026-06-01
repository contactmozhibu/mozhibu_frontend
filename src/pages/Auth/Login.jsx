import { useState } from "react";
import { login } from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await login(form);
    
    console.log("LOGIN RESPONSE:", res.data);
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    navigate("/");
  } catch (err) {
    setLoading(false);
    
    const errorMsg = err.response?.data?.message || "Login failed";
    setError("❌ " + errorMsg);
  }
};

  return (
    <div className="auth-neon-page">
      <div className="auth-neon-card">
        <h2 className="auth-title">Login</h2>

        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "20px",
            backgroundColor: error.includes("⚠️") ? "#fff3cd" : "#f8d7da",
            border: error.includes("⚠️") ? "1px solid #ffc107" : "1px solid #f5c6cb",
            borderRadius: "6px",
            color: error.includes("⚠️") ? "#856404" : "#721c24",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}
