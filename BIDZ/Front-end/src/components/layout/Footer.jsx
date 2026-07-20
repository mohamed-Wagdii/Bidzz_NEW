import { useNavigate } from "react-router-dom";

const LINKS = ["Terms of Service", "Privacy Policy", "Auction Rules", "Contact"];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{
      borderTop: "1px solid #e8e0d0", padding: "24px 40px",
      background: "#fff", display: "flex", justifyContent: "space-between",
      alignItems: "center", fontFamily: "'DM Sans',sans-serif",
    }}>
      <div>
        <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, letterSpacing: 2, color: "#1A1814" }}>BID</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300, letterSpacing: 2, color: "#C9A84C" }}>ZONE</span>
        </div>
        <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>© 2024 BIDZONE GLOBAL AUCTION HOUSE. ALL RIGHTS RESERVED.</p>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {LINKS.map(l => (
          <span
            key={l}
            onClick={() => navigate(`/${l.toLowerCase().replace(/ /g, "-")}`)}
            style={{ fontSize: 11, color: "#999", cursor: "pointer", letterSpacing: 0.5, transition: "color 0.2s" }}
          >
            {l.toUpperCase()}
          </span>
        ))}
      </div>
    </footer>
  );
}
