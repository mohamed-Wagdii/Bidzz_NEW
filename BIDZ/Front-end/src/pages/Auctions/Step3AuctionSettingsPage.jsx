import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AuctionSettingsForm from "../../components/Create_Auctions/AuctionSettingsForm";

export default function Step3AuctionSettingsPage({ formData, onUpdate, onNext, onBack }) {
  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <div style={styles.container}>
        {/* Step progress bar (linear style like the design) */}
        <div style={styles.progressBar}>
          <div style={styles.stepMeta}>
            <span style={styles.stepLabel}>STEP 3 OF 4</span>
            <span style={styles.stepName}>Auction Configuration</span>
          </div>
          <div style={styles.bars}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ ...styles.bar, ...(s <= 3 ? styles.barFilled : {}) }} />
            ))}
          </div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.heading}>Auction Settings</h1>
          <p style={styles.sub}>Define the financial parameters and duration of your listing.<br />Precision here ensures a successful transaction.</p>
        </div>

        <AuctionSettingsForm formData={formData} onUpdate={onUpdate} onNext={onNext} onBack={onBack} />
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { background: "#f5f4f0", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" },
  container: { maxWidth: "760px", margin: "0 auto", padding: "0 24px 80px" },
  progressBar: { padding: "28px 0 20px" },
  stepMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  stepLabel: { fontSize: "0.65rem", letterSpacing: "0.12em", color: "#888", fontWeight: 700 },
  stepName: { fontSize: "0.65rem", letterSpacing: "0.1em", color: "#b8962e", fontWeight: 700 },
  bars: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" },
  bar: { height: "3px", borderRadius: "2px", background: "#e0ddd5" },
  barFilled: { background: "#b8962e" },
  header: { marginBottom: "28px" },
  heading: { fontSize: "2rem", fontWeight: 700, color: "#0e0e0e", fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: "8px" },
  sub: { fontSize: "0.8rem", color: "#888", lineHeight: 1.7, margin: 0 },
};