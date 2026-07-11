const REQUIREMENTS = [
  "Minimum 1920×1080px",
  "Video tours (max 60s)",
  "PNG, JPG or MP4 formats",
];

export default function MediaSidebar() {
  return (
    <aside style={styles.aside}>
      {/* Visual Assets info */}
      <div style={styles.card}>
        <h3 style={styles.heading}>Visual Assets</h3>
        <p style={styles.desc}>
          High-quality imagery increases final bid values by up to 40%. Upload at least 5 photos showing all angles and serial numbers.
        </p>
        <ul style={styles.list}>
          {REQUIREMENTS.map((req) => (
            <li key={req} style={styles.item}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#b8962e" strokeWidth="1.5"/>
                <path d="M8 12l3 3 5-5" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pro Tip */}
      <div style={styles.proCard}>
        <div style={styles.proHeader}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#b8962e" strokeWidth="1.8" fill="none"/>
            <path d="M9 12l2 2 4-4" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={styles.proLabel}>Pro Tip</span>
        </div>
        <p style={styles.proText}>
          Use natural lighting for the hero image. Authentic, unedited photos build more trust with high-value collectors.
        </p>
      </div>
    </aside>
  );
}

const styles = {
  aside: {
    width: "280px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "'Montserrat', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    border: "1.5px solid #e8e2d4",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "0.9rem",
    color: "#777",
    lineHeight: 1.7,
    marginBottom: "16px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#555",
    fontWeight: 500,
  },
  proCard: {
    background: "#0e0e0e",
    borderRadius: "14px",
    padding: "24px",
    border: "1px solid #222",
  },
  proHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  proLabel: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  proText: {
    fontSize: "0.9rem",
    color: "#aaa",
    lineHeight: 1.7,
    margin: 0,
  },
};