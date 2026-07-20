export default function SubmissionConfirmation({ onDashboard, onAddAnother }) {
  return (
    <div style={styles.card}>
      {/* Icon */}
      <div style={styles.iconWrap}>
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"
            stroke="#b8962e" strokeWidth="1.8" fill="rgba(184,150,46,0.15)"/>
          <path d="M9 12l2 2 4-4" stroke="#b8962e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 style={styles.heading}>Listing Submitted</h1>

      <div style={styles.badge}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        &nbsp;UNDER REVIEW
      </div>

      <p style={styles.desc}>
        The BIDZONE admin team is currently vetting your asset for authenticity and compliance with our premium standards.
      </p>
      <p style={styles.desc2}>
        You will receive an email and a notification once your auction is approved.<br />
        This process typically takes between <strong>24-48 hours</strong>.
      </p>

      {/* Draft listing card */}
      <div style={styles.draftCard}>
        <div style={styles.draftThumb}>
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=120&q=80"
            alt="Listing"
            style={styles.draftImg}
          />
        </div>
        <div>
          <span style={styles.draftTag}>DRAFT LISTING</span>
          <p style={styles.draftTitle}>Patek Philippe Nautilus</p>
          <p style={styles.draftRef}>Reference 5711/1A-010</p>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.dashBtn} onClick={onDashboard}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          &nbsp;&nbsp;Go to Dashboard
        </button>
        <button style={styles.addBtn} onClick={onAddAnother}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          &nbsp;&nbsp;Add Another Asset
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "52px 48px",
    border: "1.5px solid #e8e2d4",
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
    maxWidth: "640px",
    margin: "0 auto",
  },
  iconWrap: {
    width: "80px", height: "80px",
    borderRadius: "50%",
    background: "#0e0e2a",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 24px",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "2.2rem", fontWeight: 700,
    color: "#0e0e0e", marginBottom: "14px",
  },
  badge: {
    display: "inline-flex", alignItems: "center",
    background: "#f5f4f0", border: "1.5px solid #e0ddd5",
    borderRadius: "20px", padding: "6px 16px",
    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
    color: "#555", marginBottom: "24px",
  },
  desc: { fontSize: "0.85rem", color: "#555", lineHeight: 1.7, marginBottom: "8px" },
  desc2: { fontSize: "0.8rem", color: "#888", lineHeight: 1.7, marginBottom: "28px" },
  draftCard: {
    display: "flex", alignItems: "center", gap: "16px",
    background: "#fafaf7", border: "1.5px solid #e8e2d4",
    borderRadius: "12px", padding: "14px 18px",
    textAlign: "left", marginBottom: "32px",
  },
  draftThumb: { width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 },
  draftImg: { width: "100%", height: "100%", objectFit: "cover" },
  draftTag: { fontSize: "0.58rem", letterSpacing: "0.1em", color: "#b8962e", fontWeight: 700 },
  draftTitle: { fontSize: "1.05rem", fontWeight: 700, color: "#0e0e0e", margin: "4px 0 2px", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  draftRef: { fontSize: "0.75rem", color: "#888", margin: 0 },
  actions: { display: "flex", gap: "16px", justifyContent: "center" },
  dashBtn: {
    display: "flex", alignItems: "center",
    padding: "13px 22px", background: "#fff8e6",
    border: "1.5px solid #e8d98a", borderRadius: "8px",
    color: "#7a5c00", fontSize: "0.8rem", fontWeight: 700,
    cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
  },
  addBtn: {
    display: "flex", alignItems: "center",
    padding: "13px 22px", background: "#0e0e0e",
    border: "none", borderRadius: "8px",
    color: "#fff", fontSize: "0.8rem", fontWeight: 700,
    cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
  },
};