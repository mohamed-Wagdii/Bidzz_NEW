import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",    emoji: "⊞", path: "/seller-dashboard" },
  { id: "products",  label: "Add Product", emoji: "📦", path: "/add-product" },
  { id: "ticket",    label: "Buy Ticket",  emoji: "🎫", path: "/tickets/purchase" },
  { id: "auctions",  label: "New Auction", emoji: "🔨", path: "/auctions/new" },
  { id: "chats",     label: "My Chats",    emoji: "💬", path: "/my-chats" },
  { id: "orders",    label: "Orders",      emoji: "📋", path: "/dashboard/orders" },
  { id: "analytics", label: "Analytics",   emoji: "📊", path: "/analytics" },
  { id: "settings",  label: "Settings",    emoji: "⚙",  path: "/dashboard/settings" },
];

export default function DashboardSidebar({ active = "overview", onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const name = user?.fullName || "Seller";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    else navigate("/login");
  };

  return (
    <aside style={{ width: 210, background: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", padding: "1.5rem 0", minHeight: "calc(100vh - 60px)" }}>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0", marginBottom: "1rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #c9a84c", background: "#f0e8cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#c9a84c", fontSize: "0.8rem", flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a1a1a" }}>{name}</div>
          <div style={{ fontSize: "0.8rem", color: "#888", textTransform: "capitalize" }}>{user?.role ?? "Seller"}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.75rem" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id || location.pathname === item.path;
          return (
            <Link key={item.id} to={item.path} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.6rem 0.75rem", borderRadius: 7, textDecoration: "none",
              fontSize: "1rem", marginBottom: 2,
              color: isActive ? "#1a1a1a" : "#666",
              fontWeight: isActive ? 600 : 400,
              background: isActive ? "#faf8f3" : "transparent",
              borderLeft: isActive ? "3px solid #c9a84c" : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <span>{item.emoji}</span><span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1.25rem 1rem 0", borderTop: "1px solid #f0f0f0" }}>
        <button
          onClick={handleLogout}
          style={{ display: "block", padding: "0.4rem 0.5rem", fontSize: "0.95rem", color: "#e63946", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}
