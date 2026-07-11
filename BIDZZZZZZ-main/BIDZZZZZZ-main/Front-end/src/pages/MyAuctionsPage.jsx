import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auctionsAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";

function getTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const STATUS = {
  active:  { bg: "#e6f9f0", color: "#1a9e5a", label: "Active" },
  pending: { bg: "#fff8e1", color: "#b8962e", label: "Pending" },
  ended:   { bg: "#f0f0f0", color: "#777",    label: "Ended"  },
};

export default function MyAuctionsPage() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [ending, setEnding] = useState(null);

  useEffect(() => {
    auctionsAPI.getMy()
      .then(data => setAuctions(data.auctions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnd = async (e, auctionId) => {
    e.stopPropagation();
    if (!window.confirm("End this auction now? This will notify the winner.")) return;
    setEnding(auctionId);
    try {
      await auctionsAPI.end(auctionId);
      setAuctions(prev => prev.map(a => a._id === auctionId ? { ...a, status: "ended" } : a));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to end auction.");
    } finally {
      setEnding(null);
    }
  };

  const filtered = filter === "all"
    ? auctions
    : auctions.filter(a => a.status === filter);

  return (
    <DashboardLayout role="seller">
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
            My Auctions
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            {auctions.length} auction{auctions.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button onClick={() => navigate("/auctions/new")} style={createBtn}>
          + Create Auction
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["all", "active", "pending", "ended"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 18px", borderRadius: 20, border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === f ? "#1A1814" : "#fff",
              color: filter === f ? "#fff" : "#666",
              border: filter === f ? "none" : "1px solid #e0e0e0",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? `All (${auctions.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${auctions.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Auctions list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 96, background: "#eee", borderRadius: 12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede8df", padding: "4rem", textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔨</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#555", marginBottom: 8 }}>No auctions yet</p>
          <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Create your first auction to start receiving bids.</p>
          <button onClick={() => navigate("/auctions/new")} style={createBtn}>
            + Create Auction
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(a => {
            const sc = STATUS[a.status] || STATUS.ended;
            const timeLeft = getTimeLeft(a.endTime);
            const isEnded = a.status === "ended";

            return (
              <div
                key={a._id}
                onClick={() => navigate(`/auctions/${a._id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 20,
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #ede8df",
                  padding: "18px 24px",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Thumbnail */}
                <div style={{ width: 64, height: 64, borderRadius: 10, background: "#f0ede6", flexShrink: 0, overflow: "hidden" }}>
                  {a.Product?.image?.[0]
                    ? <img src={a.Product.image[0]} alt={a.Product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, opacity: 0.3 }}>🖼</div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1814", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {a.Product?.name ?? "Unnamed Product"}
                  </p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                    Ends {new Date(a.endTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    {!isEnded && ` · ${timeLeft} left`}
                  </p>
                </div>

                {/* Current/Final price */}
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 90 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", margin: "0 0 4px" }}>
                    {isEnded ? "FINAL PRICE" : "CURRENT BID"}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#1A1814", margin: 0 }}>
                    ${(a.currentPrice ?? a.startingPrice)?.toLocaleString()}
                  </p>
                </div>

                {/* Participants */}
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 80 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", margin: "0 0 4px" }}>PARTICIPANTS</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#1A1814", margin: 0 }}>
                    {a.bidCount ?? 0}
                  </p>
                </div>

                {/* Status + End button */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    padding: "5px 14px", borderRadius: 20,
                    background: sc.bg, color: sc.color,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {sc.label}
                  </span>
                  {a.status === "active" && (
                    <button
                      onClick={(e) => handleEnd(e, a._id)}
                      disabled={ending === a._id}
                      style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6, border: "1px solid #e05252", background: "none", color: "#e05252", cursor: "pointer" }}
                    >
                      {ending === a._id ? "Ending..." : "End Now"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

const createBtn = {
  background: "#C9A84C", color: "#fff",
  border: "none", borderRadius: 10,
  padding: "11px 24px", fontSize: 13,
  fontWeight: 700, cursor: "pointer",
  letterSpacing: 0.3,
};
