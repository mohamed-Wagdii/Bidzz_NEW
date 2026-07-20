const UNLOCKS = [
  {
    tag: "PREMIUM",
    tagColor: "#b8962e",
    title: "Featured Placement",
    desc: 'Your item will appear on the homepage and in the "Hot Listings" section for the entire duration.',
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
  },
  {
    tag: "MARKET",
    tagColor: "#2e6eb8",
    title: "Advanced Analytics",
    desc: "Track real-time bidder engagement, geographic data, and auction velocity metrics.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
];

export default function TicketUnlocks() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>What Your Ticket Unlocks</h2>
      <div style={styles.grid}>
        {UNLOCKS.map((item) => (
          <div key={item.title} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.image} />
            <div style={styles.overlay}>
              <span style={{ ...styles.tag, background: item.tagColor }}>{item.tag}</span>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "60px 0 20px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "40px",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
    height: "320px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "28px 24px",
    background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
    color: "#fff",
  },
  tag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: "10px",
    color: "#fff",
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: "0 0 8px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  cardDesc: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.6,
    margin: 0,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 400,
  },
};