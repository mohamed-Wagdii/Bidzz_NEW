export default function AuctionSettingsForm({ formData, onUpdate, onNext, onBack, submitting, submitError }) {
  const startBid = formData?.startBid ?? "";
  const reservePrice = formData?.reservePrice ?? "";
  const endTime = formData?.endTime ?? "";

  const baseFee = 5.0;
  const insurance = 2.5;
  const reserveFee = reservePrice ? parseFloat(reservePrice) * 0.01 : 0;
  const total = baseFee + insurance + reserveFee;

  return (
    <div style={styles.wrapper}>
      {/* Pricing Strategy */}
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#1a1a1a" strokeWidth="1.8"/>
            <path d="M2 10h20" stroke="#1a1a1a" strokeWidth="1.8"/>
          </svg>
          Pricing Strategy
        </h3>
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>STARTING BID (KWD)</label>
            <div style={styles.inputWrap}>
              <span style={styles.currency}>$</span>
              <input
                type="number"
                value={startBid}
                onChange={(e) => onUpdate({ startBid: e.target.value })}
                placeholder="0.000"
                style={styles.input}
              />
            </div>
            <p style={styles.hint}>The minimum price to open the auction.</p>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>RESERVE PRICE (OPTIONAL)</label>
            <div style={styles.inputWrap}>
              <span style={styles.currency}>$</span>
              <input
                type="number"
                value={reservePrice}
                onChange={(e) => onUpdate({ reservePrice: e.target.value })}
                placeholder="Optional"
                style={{ ...styles.input, color: reservePrice ? "#1a1a1a" : "#ccc" }}
              />
            </div>
            <p style={styles.hint}>Auction won't close unless this price is met.</p>
          </div>
        </div>
      </div>

      {/* Selected Ticket Duration */}
      <div style={styles.darkCard}>
        <div style={styles.darkCardHeader}>
          <div style={styles.darkCardLeft}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#b8962e" strokeWidth="1.8"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#b8962e" strokeWidth="1.8"/>
              <line x1="12" y1="12" x2="12" y2="16" stroke="#b8962e" strokeWidth="1.8"/>
              <line x1="10" y1="14" x2="14" y2="14" stroke="#b8962e" strokeWidth="1.8"/>
            </svg>
            <h3 style={styles.darkCardTitle}>Selected Ticket Duration</h3>
          </div>
          <span style={styles.durationBadge}>⏱ 48 HOURS</span>
        </div>
        <p style={styles.darkCardDesc}>Your listing will be live for the duration specified by your active ticket.</p>
        <div style={styles.upgradeNote}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#b8962e" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span>You can upgrade to a 'Platinum Ticket' for 7-day visibility and premium front-page placement.</span>
        </div>
      </div>

      {/* Listing Summary */}
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>Listing Summary & Fees</h3>
        <div style={styles.feeRow}>
          <span style={styles.feeName}>Base Listing Fee (48h)</span>
          <span style={styles.feeValue}>{baseFee.toFixed(3)} KWD</span>
        </div>
        <div style={styles.feeRow}>
          <span style={styles.feeName}>Insurance Surcharge</span>
          <span style={styles.feeValue}>{insurance.toFixed(3)} KWD</span>
        </div>
        <div style={styles.feeRow}>
          <span style={styles.feeName}>Reserve Price Fee</span>
          <span style={styles.feeValue}>{reserveFee.toFixed(3)} KWD</span>
        </div>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Payable</span>
          <span style={styles.totalValue}>{total.toFixed(3)} KWD</span>
        </div>
      </div>

      {/* End Time */}
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>Auction End Time</h3>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>END DATE & TIME</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            style={{ ...styles.input, padding: "13px 14px", border: "1.5px solid #e5e0d5", borderRadius: "8px", background: "#fafaf7", fontSize: "0.9rem", width: "100%" }}
          />
        </div>
      </div>

      {submitError && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", fontSize: "0.82rem" }}>
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.backBtn} onClick={onBack} disabled={submitting}>← Previous Step</button>
        <button style={{ ...styles.nextBtn, opacity: submitting ? 0.7 : 1 }} onClick={onNext} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Listing →"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { flex: 1, display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'Montserrat', sans-serif" },
  card: { background: "#fff", borderRadius: "14px", padding: "28px 28px", border: "1.5px solid #e8e2d4" },
  cardHeading: {
    fontSize: "1rem", fontWeight: 700, color: "#1a1a1a",
    marginBottom: "22px", display: "flex", alignItems: "center",
    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.15rem",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.6rem", letterSpacing: "0.12em", color: "#888", fontWeight: 700 },
  inputWrap: {
    display: "flex", alignItems: "center",
    border: "1.5px solid #e5e0d5", borderRadius: "8px",
    background: "#fafaf7", overflow: "hidden",
  },
  currency: { padding: "0 12px", color: "#aaa", fontSize: "0.9rem", fontWeight: 600, borderRight: "1px solid #eee" },
  input: {
    flex: 1, padding: "13px 14px", border: "none", background: "transparent",
    fontSize: "1rem", color: "#1a1a1a", fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 600, outline: "none",
  },
  hint: { fontSize: "0.7rem", color: "#aaa", margin: 0 },
  darkCard: {
    background: "#0e0e14", borderRadius: "14px", padding: "28px",
    border: "1px solid #2a2a3a",
  },
  darkCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  darkCardLeft: { display: "flex", alignItems: "center", gap: "10px" },
  darkCardTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" },
  durationBadge: {
    background: "#fff8e1", color: "#5a3e00", padding: "6px 14px",
    borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
  },
  darkCardDesc: { fontSize: "0.78rem", color: "#7a7a9a", marginBottom: "16px", lineHeight: 1.6 },
  upgradeNote: {
    display: "flex", alignItems: "flex-start", gap: "10px",
    background: "rgba(184,150,46,0.08)", border: "1px solid rgba(184,150,46,0.2)",
    borderRadius: "8px", padding: "12px 16px",
    fontSize: "0.75rem", color: "#bbb", lineHeight: 1.6,
  },
  feeRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f0e8" },
  feeName: { fontSize: "0.82rem", color: "#666" },
  feeValue: { fontSize: "0.82rem", color: "#333", fontWeight: 500 },
  totalRow: { display: "flex", justifyContent: "space-between", paddingTop: "16px", marginTop: "4px" },
  totalLabel: { fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  totalValue: { fontSize: "1.4rem", fontWeight: 700, color: "#1a1a1a", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" },
  backBtn: {
    padding: "13px 24px", border: "1.5px solid #ccc", borderRadius: "8px",
    background: "#fff", color: "#555", fontSize: "0.8rem", cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
  },
  nextBtn: {
    padding: "13px 28px", background: "#b8962e", border: "none", borderRadius: "8px",
    color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
};