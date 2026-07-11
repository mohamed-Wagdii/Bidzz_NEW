export default function BasicInfoSidebar() {
  return (
    <aside style={styles.aside}>
      {/* Why details matter */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoHeading}>Why the details matter?</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.bullet}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#b8962e" strokeWidth="1.8" fill="none"/>
              </svg>
            </span>
            Accurate categorization increases visibility to premium collectors by 45%.
          </li>
          <li style={styles.listItem}>
            <span style={styles.bullet}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#b8962e" strokeWidth="1.8"/>
                <polyline points="14 2 14 8 20 8" stroke="#b8962e" strokeWidth="1.8"/>
              </svg>
            </span>
            Detailed provenance reduces buyer friction and leads to higher final bids.
          </li>
        </ul>
      </div>

      {/* Atmospheric image card */}
      <div style={styles.imageCard}>
        <div style={styles.imageOverlay} />
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
          alt="Luxury setting"
          style={styles.image}
        />
        <p style={styles.quote}>"Every masterpiece has a story. Tell yours with precision."</p>
      </div>
    </aside>
  );
}

const styles = {
  aside: {
    width: "320px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: "'Montserrat', sans-serif",
  },
  infoCard: {
    background: "#0e0e0e",
    borderRadius: "14px",
    padding: "28px 24px",
    border: "1px solid #222",
  },
  infoHeading: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#b8962e",
    marginBottom: "18px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  listItem: {
    display: "flex",
    gap: "12px",
    fontSize: "0.9rem",
    color: "#bbb",
    lineHeight: 1.6,
    alignItems: "flex-start",
  },
  bullet: {
    flexShrink: 0,
    marginTop: "2px",
  },
  imageCard: {
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    height: "240px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
    zIndex: 1,
  },
  quote: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    right: "20px",
    color: "#ddd",
    fontSize: "0.92rem",
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    zIndex: 2,
    lineHeight: 1.5,
    margin: 0,
  },
};