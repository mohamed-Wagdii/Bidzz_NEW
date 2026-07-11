import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AuctionDurationSelector from "../components/Tickets/AuctionDurationSelector";

const DAILY_RATE = 25;

export default function PurchaseTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDays, setSelectedDays] = useState(7);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const total = selectedDays * DAILY_RATE;

  useEffect(() => {
    ticketsAPI.getMy()
      .then(data => setMyTickets(data.tickets || []))
      .catch(() => {})
      .finally(() => setLoadingTickets(false));
  }, [success]);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError("");
    setSuccess("");
    try {
      await ticketsAPI.buy();
      setSuccess("Ticket purchased successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase ticket.");
    } finally {
      setPurchasing(false);
    }
  };

  const now = new Date();
  const validTickets = myTickets.filter(t => !t.used && new Date(t.expiresAt) > now);
  const usedTickets = myTickets.filter(t => t.used || new Date(t.expiresAt) <= now);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f7f6f2", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>
        {/* Breadcrumb */}
        <p style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>
          <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => navigate("/seller-dashboard")}>Dashboard</span>
          {" › "} Tickets
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
          Auction Tickets
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.8, marginBottom: 40 }}>
          A ticket is required for each new auction listing. Tickets are valid for 7 days from purchase.
        </p>

        {/* Owned Tickets */}
        {!loadingTickets && myTickets.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede8df", padding: "24px 28px", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>My Tickets</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myTickets.map(t => {
                const expired = new Date(t.expiresAt) <= now;
                const status = t.used ? "Used" : expired ? "Expired" : "Valid";
                const sc = t.used || expired
                  ? { bg: "#f5f5f5", color: "#888" }
                  : { bg: "#e6f9f0", color: "#1a9e5a" };
                return (
                  <div key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fafaf8", borderRadius: 10, border: "1px solid #f0ece3" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Ticket #{t._id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                        Expires: {new Date(t.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "uppercase" }}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
            {validTickets.length > 0 && (
              <button
                onClick={() => navigate("/auctions/new")}
                style={{ marginTop: 16, background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                Use Ticket → Create Auction
              </button>
            )}
          </div>
        )}

        {/* Purchase */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <AuctionDurationSelector selectedDays={selectedDays} onDaysChange={setSelectedDays} />

          {/* Order Summary */}
          <div style={{ minWidth: 300, maxWidth: 380, background: "#1a1a2e", borderRadius: 16, padding: "32px 28px", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>Order Summary</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "0.8rem", color: "#9e9eb8" }}>Ticket Type</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Premium Listing</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "0.8rem", color: "#9e9eb8" }}>Daily Rate</span>
              <span style={{ fontSize: "0.9rem" }}>${DAILY_RATE}.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "0.8rem", color: "#9e9eb8" }}>Duration</span>
              <span style={{ fontSize: "0.9rem" }}>{selectedDays} Days</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
              <span style={{ fontSize: "0.6rem", color: "#9e9eb8", letterSpacing: "0.15em" }}>TOTAL</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.8rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>${total}</span>
            </div>

            {error && <div style={{ background: "rgba(224,82,82,0.15)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff8080", fontSize: "0.78rem", marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ background: "rgba(26,158,90,0.15)", border: "1px solid rgba(26,158,90,0.3)", borderRadius: 8, padding: "10px 14px", color: "#4caf50", fontSize: "0.78rem", marginBottom: 16 }}>{success}</div>}

            <button
              onClick={handlePurchase}
              disabled={purchasing}
              style={{ width: "100%", padding: "16px", background: purchasing ? "#555" : "#C9A84C", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: purchasing ? "not-allowed" : "pointer", marginBottom: 12 }}
            >
              {purchasing ? "Processing..." : "Purchase Ticket →"}
            </button>
            <p style={{ fontSize: "0.7rem", color: "#6e6e88", textAlign: "center" }}>
              Tickets are non-refundable. Valid for 7 days from purchase.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
