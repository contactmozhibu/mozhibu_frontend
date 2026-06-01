/*import { useState } from "react";
import { verifyOtp, resendOtp } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp });
      alert("OTP verified successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      alert("OTP resent to your email");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="auth-neon-page">
      <div className="auth-neon-card">
        <h2 className="auth-title">Verify OTP</h2>

        <div className="auth-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-group">
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" onClick={handleVerify}>
          Verify OTP
        </button>

        <p className="auth-link" onClick={handleResend} style={{ cursor: "pointer" }}>
          Resend OTP
        </p>
      </div>
    </div>
  );
}
*/
export default function VerifyOtp() {
  return <h1>OTP PAGE WORKS</h1>;
}
