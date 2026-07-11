import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setMessage("If the account exists, a reset link has been sent.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8fafc, #fef3c7)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 20, padding: 24, boxShadow: "0 20px 45px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Forgot Password</h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>Enter your email and we’ll send you a secure reset link.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }} />
          <button disabled={loading} style={{ background: "#111827", color: "white", border: "none", padding: 12, borderRadius: 12, cursor: "pointer" }}>{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
        {message && <p style={{ marginTop: 12, color: "#2563eb" }}>{message}</p>}
        <Link to="/login" style={{ display: "inline-block", marginTop: 14, color: "#2563eb" }}>Back to Login</Link>
      </div>
    </div>
  );
}
