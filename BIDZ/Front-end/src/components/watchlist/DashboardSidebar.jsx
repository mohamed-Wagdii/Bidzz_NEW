const NAV_ITEMS = [
  {
    id: "bids",
    label: "My Bids",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: "financials",
    label: "Financials",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="18" y="3" width="3" height="18" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="10.5" y="8" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="13" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export default function DashboardSidebar({ activeItem = "watchlist" }) {
  return (
    <aside style={styles.sidebar}>
      {/* Brand + role */}
      <div style={styles.brand}>
        <p style={styles.brandTitle}>SOVEREIGN DASHBOARD</p>
        <p style={styles.brandSub}>Verified Member</p>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <span style={{ color: isActive ? "#b8962e" : "#888" }}>
                {item.icon}
              </span>
              <span style={{ ...styles.navLabel, color: isActive ? "#b8962e" : "#444" }}>
                {item.label}
              </span>
              {isActive && <div style={styles.activeBar} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={styles.bottom}>
        <button style={styles.vipBtn}>Upgrade to VIP</button>
        <button style={styles.logoutBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
            <polyline points="16 17 21 12 16 7" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    flexShrink: 0,
    background: "#fff",
    borderRight: "1.5px solid #ece8df",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
  },
  brand: {
    padding: "28px 20px 20px",
    borderBottom: "1px solid #f0ece3",
  },
  brandTitle: {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#b8962e",
    margin: "0 0 4px",
  },
  brandSub: {
    fontSize: "0.82rem",
    color: "#aaa",
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: "16px 0",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
    width: "100%",
    borderRadius: "0",
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "#fdf9f0",
  },
  navLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  activeBar: {
    position: "absolute",
    right: 0,
    top: "20%",
    bottom: "20%",
    width: "3px",
    background: "#b8962e",
    borderRadius: "3px 0 0 3px",
  },
  bottom: {
    padding: "20px",
    borderTop: "1px solid #f0ece3",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  vipBtn: {
    width: "100%",
    padding: "11px",
    background: "#b8962e",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: "0.02em",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 0",
    fontSize: "0.92rem",
    color: "#888",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
  },
};