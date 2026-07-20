const DAILY_RATE = 25;

export default function OrderSummary({ days, onPurchase, purchasing }) {
  const total = days * DAILY_RATE;

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Order Summary</h2>

      <div style={styles.row}>
        <span style={styles.label}>Auction Ticket Type</span>
        <span style={styles.valueBold}>Premium Listing</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.row}>
        <span style={styles.label}>Daily Rate</span>
        <span style={styles.value}>${DAILY_RATE}.00</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Duration</span>
        <span style={styles.value}>{days} Days</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.totalSection}>
        <div>
          <p style={styles.totalLabel}>TOTAL INVESTMENT</p>
          <p style={styles.totalAmount}>${total}</p>
        </div>
        <span style={styles.taxNote}>INCLUDES VAT & TAXES</span>
      </div>

      <button style={{ ...styles.purchaseBtn, opacity: purchasing ? 0.7 : 1 }} onClick={onPurchase} disabled={purchasing}>
        {purchasing ? "Processing..." : "Purchase Ticket →"}
      </button>

      <div style={styles.secureNote}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6, flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#aaa" strokeWidth="1.8"/>
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span>Secure encrypted checkout powered by Stripe</span>
      </div>

      <div style={styles.noteBox}>
        <p style={styles.noteText}>
          Note: Once purchased, tickets are non-refundable but can be used for any listing within 30 days of purchase. Launching the auction activates the ticket.
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#1a1a2e",
    borderRadius: "16px",
    padding: "36px 32px 28px",
    minWidth: "300px",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    fontFamily: "'Montserrat', sans-serif",
    color: "#fff",
  },
  heading: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "28px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: "-0.01em",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  label: {
    fontSize: "0.8rem",
    color: "#9e9eb8",
    letterSpacing: "0.02em",
  },
  value: {
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: 500,
  },
  valueBold: {
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: 700,
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "16px",
  },
  totalSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "28px",
    marginTop: "8px",
  },
  totalLabel: {
    fontSize: "0.6rem",
    color: "#9e9eb8",
    letterSpacing: "0.15em",
    margin: "0 0 4px 0",
    fontWeight: 600,
  },
  totalAmount: {
    fontSize: "3rem",
    fontWeight: 700,
    color: "#b8962e",
    margin: 0,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    lineHeight: 1,
  },
  taxNote: {
    fontSize: "0.6rem",
    color: "#6e6e88",
    letterSpacing: "0.1em",
    textAlign: "right",
    maxWidth: "80px",
  },
  purchaseBtn: {
    width: "100%",
    padding: "17px",
    background: "#b8962e",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.95rem",
    letterSpacing: "0.03em",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    transition: "background 0.2s, transform 0.15s",
    marginBottom: "16px",
  },
  secureNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    color: "#6e6e88",
    marginBottom: "24px",
    gap: "4px",
  },
  noteBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "14px 16px",
  },
  noteText: {
    fontSize: "0.72rem",
    color: "#6e6e88",
    lineHeight: 1.6,
    margin: 0,
    fontStyle: "italic",
  },
};