const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
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
    id: "auctions",
    label: "My Auctions",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export default function AddProductSidebar({ activeItem = "auctions" }) {
  return (
    <aside style={styles.sidebar}>
      {/* User profile */}
      <div style={styles.profile}>
        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="avatar"
          style={styles.avatar}
        />
        <div>
          <p style={styles.profileName}>Premium Member</p>
          <p style={styles.profileRole}>Verified Bidder</p>
        </div>
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
              <span style={{ color: isActive ? "#b8962e" : "#aaa" }}>
                {item.icon}
              </span>
              <span
                style={{
                  ...styles.navLabel,
                  color: isActive ? "#0e0e0e" : "#666",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </span>
              {isActive && <div style={styles.activeBar} />}
            </button>
          );
        })}
      </nav>

      {/* New Listing CTA */}
      <div style={styles.ctaWrap}>
        <button style={styles.newListingBtn}>New Listing</button>
      </div>

      {/* Bottom links */}
      <div style={styles.bottomLinks}>
        <button style={styles.bottomLink}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span>HELP CENTER</span>
        </button>
        <button style={styles.bottomLink}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round"/>
            <polyline points="16 17 21 12 16 7" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span>LOGOUT</span>
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
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 16px",
    borderBottom: "1px solid #f0ece3",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e0ddd5",
    flexShrink: 0,
  },
  profileName: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#0e0e0e",
    margin: "0 0 2px",
  },
  profileRole: {
    fontSize: "0.65rem",
    color: "#aaa",
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
    width: "100%",
    transition: "background 0.15s",
    borderRadius: "0",
  },
  navItemActive: {
    background: "#fdf9f0",
  },
  navLabel: {
    fontSize: "0.82rem",
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
  ctaWrap: {
    padding: "16px",
  },
  newListingBtn: {
    width: "100%",
    padding: "11px",
    background: "#b8962e",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  bottomLinks: {
    padding: "12px 16px 20px",
    borderTop: "1px solid #f0ece3",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bottomLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    fontSize: "0.65rem",
    color: "#aaa",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
  },
};