const CARDS = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"
          stroke="#b8962e" strokeWidth="1.8" fill="none"/>
        <path d="M9 12l2 2 4-4" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Authenticity Rules",
    desc: "Learn more about our rigorous multi-point inspection process and why we vet every asset.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#b8962e" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Need Assistance?",
    desc: "Our concierge team is available 24/7 for our sellers to answer any questions about the listing.",
  },
];

export default function SubmissionFooterCards() {
  return (
    <div style={styles.grid}>
      {CARDS.map((card) => (
        <div key={card.title} style={styles.card}>
          <div style={styles.icon}>{card.icon}</div>
          <div>
            <h4 style={styles.title}>{card.title}</h4>
            <p style={styles.desc}>{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    maxWidth: "640px",
    margin: "24px auto 0",
    fontFamily: "'Montserrat', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    border: "1.5px solid #e8e2d4",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  icon: { flexShrink: 0, marginTop: "2px" },
  title: { fontSize: "0.9rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  desc: { fontSize: "0.74rem", color: "#888", lineHeight: 1.6, margin: 0 },
};