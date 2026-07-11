import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Overview",   icon: "⊞", path: "/buyer-dashboard" },
  { label: "My Bids",    icon: "🔨", path: "/dashboard/bids" },
  { label: "My Chats",   icon: "💬", path: "/my-chats" },
  { label: "Watchlist",  icon: "👁",  path: "/dashboard/watchlist" },
  { label: "Orders",     icon: "📦", path: "/dashboard/orders" },
  { label: "Analytics",  icon: "📊", path: "/analytics" },
  { label: "Settings",   icon: "⚙",  path: "/dashboard/settings" },
];

const SidebarProfile = ({ user, styles }) => {
  const name = user?.fullName || user?.name || "Guest";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={styles.profileBlock}>
      <div style={{ ...styles.profileAvatar, background: "#C9A84C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>
        {user?.avatar
          ? <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          : initials}
      </div>
      <div style={{ overflow: "hidden" }}>
        <p style={styles.profileName}>{name}</p>
        <p style={styles.profileRole}>{user?.role ?? "Member"}</p>
      </div>
    </div>
  );
};

export default function DashboardSidebar({ user, onNewListing, onLogout, styles = {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside style={styles.sidebar}>
      <SidebarProfile user={user} styles={styles} />

      <nav style={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="dash-nav-item"
              style={{ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) }}
            >
              <span style={styles.navItemIcon}>{item.icon}</span>
              {item.label}
              {isActive && <span style={styles.navItemIndicator} />}
            </Link>
          );
        })}
      </nav>

      <div style={styles.sidebarBottom}>
        <button className="dash-sidebar-btn" style={styles.newListingBtn} onClick={onNewListing}>
          Browse Auctions
        </button>
        <button style={{ ...styles.sidebarLink, color: "#e63946" }} onClick={onLogout}>↪ Logout</button>
      </div>
    </aside>
  );
}
