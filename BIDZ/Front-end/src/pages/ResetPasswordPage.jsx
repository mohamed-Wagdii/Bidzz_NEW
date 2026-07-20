import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!params.get("token")) setMessage("Missing reset token"); }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { token: params.get("token"), password });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8fafc, #fef3c7)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 20, padding: 24, boxShadow: "0 20px 45px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Reset Password</h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="New password" style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }} />
          <button disabled={loading} style={{ background: "#111827", color: "white", border: "none", padding: 12, borderRadius: 12, cursor: "pointer" }}>{loading ? "Updating..." : "Reset Password"}</button>
        </form>
        {message && <p style={{ marginTop: 12, color: "#2563eb" }}>{message}</p>}
      </div>
    </div>
  );
}
