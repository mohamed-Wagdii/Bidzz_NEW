import { useNavigate } from "react-router-dom";

export default function DashboardHeader({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 60, background: "#fff", borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <span
          onClick={() => navigate("/")}
          style={{ fontFamily: "Georgia,serif", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.05em", color: "#1a1a1a", cursor: "pointer" }}
        >
          BID<span style={{ color: "#c9a84c" }}>ZONE</span>
        </span>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {["Auctions", "How it Works", "Analytics"].map(l => (
            <span
              key={l}
              onClick={() => navigate(`/${l.toLowerCase().replace(/ /g, "-")}`)}
              style={{ fontSize: "0.875rem", color: "#555", textDecoration: "none", cursor: "pointer" }}
            >
              {l}
            </span>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button onClick={() => navigate("/notifications")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e5e5e5", background: "#fff", cursor: "pointer" }}>🔔</button>
        <span style={{ fontSize: "0.875rem", color: "#555" }}>{user?.fullName?.split(" ")[0]}</span>
        <button
          onClick={() => navigate("/auctions/new")}
          style={{ background: "#c9a84c", color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
        >
          Place Bid
        </button>
      </div>
    </header>
  );
}
