import { useState, useEffect } from "react";
import { login } from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if coming from signup with admin flag
  useEffect(() => {
    if (window.sessionStorage.getItem("adminLogin") === "true") {
      setLoginType("admin");
      window.sessionStorage.removeItem("adminLogin");
    }
  }, []);

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
      
      // Check if user is admin for admin login
      if (loginType === "admin") {
        if (res.data.user.role !== "admin") {
          setLoading(false);
          setError("❌ This account is not an admin account. Please use user login.");
          return;
        }
      }
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Navigate to admin dashboard if admin login, else user home
      if (loginType === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
            {loading ? "Logging in..." : `Login as ${loginType === "admin" ? "Admin" : "User"}`}
          </button>
        </form>

        {loginType === "user" && (
          <p className="auth-link">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        )}

        {loginType === "user" && (
          <p className="auth-link" style={{ textAlign: "center", marginTop: "16px" }}>
            <Link to="#" onClick={(e) => { e.preventDefault(); setLoginType("admin"); }} style={{ color: "#17a2b8", textDecoration: "none", fontWeight: "500" }}>
              Admin Login?
            </Link>
          </p>
        )}

        {loginType === "admin" && (
          <p className="auth-link" style={{ textAlign: "center", marginTop: "16px" }}>
            <Link to="#" onClick={(e) => { e.preventDefault(); setLoginType("user"); }} style={{ color: "#17a2b8", textDecoration: "none", fontWeight: "500" }}>
              Back to User Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
