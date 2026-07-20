import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../contexts/AuthContext";

const TEAM = [
  { name: "Marcus Sterling", role: "Founder & CEO", img: "https://i.pravatar.cc/80?img=11" },
  { name: "Sarah Chen", role: "Head of Auctions", img: "https://i.pravatar.cc/80?img=5" },
  { name: "Julian Donato", role: "Lead Engineer", img: "https://i.pravatar.cc/80?img=8" },
];

const STATS = [
  { value: "$2.4B+", label: "Total Value Transacted" },
  { value: "15k+",   label: "Winning Bidders" },
  { value: "98%",    label: "Satisfaction Rate" },
  { value: "40+",    label: "Countries Served" },
];

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navStyles = {
    navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 64, borderBottom: "1px solid #e8e0d0", background: "#fff", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" },
    navLeft: { display: "flex", alignItems: "center", gap: 32 },
    logo: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, letterSpacing: 2, cursor: "pointer", color: "#1A1814" },
    navLinks: { display: "flex", gap: 28 },
    navLink: { fontSize: 14, cursor: "pointer", color: "#777" },
    navLinkActive: { color: "#111", fontWeight: 600 },
    navActions: { display: "flex", alignItems: "center", gap: 12 },
    iconBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: "4px 8px", color: "#555" },
    btnPrimary: { background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
    footer: { borderTop: "1px solid #e8e0d0", padding: "24px 40px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" },
    footerLinks: { display: "flex", gap: 24 },
    footerLink: { fontSize: 11, color: "#999", cursor: "pointer" },
    footerLogo: { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16, letterSpacing: 2 },
    footerCopy: { fontSize: 11, color: "#bbb" },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", background: "#F8F5F0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <Navbar />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1A1814,#2d2921)", padding: "80px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#C9A84C", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 16 }}>ABOUT BIDZONE</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
          The World's Elite<br />Auction House
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Since 2018, BidZone has connected serious collectors with extraordinary assets — from rare timepieces to fine art and exotic vehicles.
        </p>
        <button
          onClick={() => navigate("/auctions")}
          style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "14px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 0.5 }}
        >
          Explore Live Auctions
        </button>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", padding: "60px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, color: "#1A1814", marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#888", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: "#C9A84C", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>OUR MISSION</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#1A1814", margin: "0 0 20px", lineHeight: 1.2 }}>
              Transparency, Trust & Excellence
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 16 }}>
              We believe every transaction should be backed by verified authenticity, secure escrow, and white-glove service. Our platform is built for collectors who demand the best.
            </p>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8 }}>
              Every item listed on BidZone undergoes rigorous authentication by our global board of experts before it reaches our marketplace.
            </p>
          </div>
          <div style={{ background: "linear-gradient(135deg,#f0e8cc,#fff8e6)", borderRadius: 16, padding: "48px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏛</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#1A1814", marginBottom: 12 }}>
              Founded in 2018
            </h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>
              Started as a boutique auction house in London, now serving collectors across 40+ countries with a fully digital-first platform.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#fff", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: "#C9A84C", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12, textAlign: "center" }}>THE TEAM</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#1A1814", textAlign: "center", marginBottom: 48 }}>
            Meet the People Behind BidZone
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {TEAM.map(m => (
              <div key={m.name} style={{ textAlign: "center", padding: "32px 24px", border: "1px solid #ede8df", borderRadius: 16 }}>
                <img src={m.img} alt={m.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 16, border: "3px solid #C9A84C" }} />
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#1A1814", marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1A1814", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
          Ready to Join?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>
          Create your account and start bidding on extraordinary assets today.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => navigate("/register")} style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "14px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Get Started
          </button>
          <button onClick={() => navigate("/how-it-works")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "14px 32px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            How It Works
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
