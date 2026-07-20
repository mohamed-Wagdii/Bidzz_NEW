import { useState, useEffect } from "react";

export default function AccountProfileForm({ user }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  // Populate form with real user data when user is available
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const inputStyle = {
    border: "1px solid #e5e5e5", borderRadius: 8,
    padding: "0.6rem 0.875rem", fontSize: "0.9375rem",
    color: "#1a1a1a", outline: "none", width: "100%",
    boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif",
    background: "#fafaf8",
  };

  const handleSave = () => {
    // Visual feedback only — full profile update API can be wired here later
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = form.fullName
    ? form.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ebebeb", padding: "1.75rem 2rem", marginBottom: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1a1a1a", fontFamily: "Georgia,serif", margin: 0 }}>
          Profile Details
        </h2>
      </div>

      {/* Avatar + name row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.75rem", padding: "1rem 1.25rem", background: "#faf8f3", borderRadius: 10, border: "1px solid #f0e8cc" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#1A1814", color: "#C9A84C",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 18, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>{form.fullName || "—"}</div>
          <div style={{ fontSize: "0.8125rem", color: "#888", marginTop: 2, textTransform: "capitalize" }}>
            {user?.role ?? "member"}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", color: "#999", marginBottom: "0.4rem" }}>FULL NAME</div>
          <input
            style={inputStyle}
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            placeholder="Your full name"
          />
        </div>
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", color: "#999", marginBottom: "0.4rem" }}>PHONE NUMBER</div>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", color: "#999", marginBottom: "0.4rem" }}>EMAIL ADDRESS</div>
        <input
          style={{ ...inputStyle, background: "#f5f5f5", color: "#aaa", cursor: "not-allowed" }}
          value={form.email}
          readOnly
          title="Email cannot be changed"
        />
        <p style={{ fontSize: 11, color: "#bbb", margin: "4px 0 0" }}>Email address cannot be changed.</p>
      </div>

      {saved && (
        <div style={{ background: "#e6f9f0", border: "1px solid #b2dfdb", borderRadius: 8, padding: "10px 14px", color: "#1a9e5a", fontSize: 13, marginBottom: 16 }}>
          Profile updated successfully.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "0.65rem 1.75rem", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
