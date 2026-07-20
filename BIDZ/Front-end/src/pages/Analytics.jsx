import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, bidsAPI, ordersAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";

const STATUS_COLORS = {
  paid:       { bg: "#e6f9f0", color: "#1a9e5a" },
  pending:    { bg: "#fff8e1", color: "#b8962e" },
  processing: { bg: "#e8f0fe", color: "#1a73e8" },
  failed:     { bg: "#fff0f0", color: "#e05252" },
};

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [bids, setBids] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([authAPI.getDashboard(), bidsAPI.getMy(), ordersAPI.getMy()])
      .then(([dashData, bidsData, ordersData]) => {
        setStats(dashData);
        setBids(bidsData.bids || []);
        setOrders(ordersData.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute buyer-specific metrics from the fetched data
  const totalSpent = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.finalPrice ?? 0), 0);

  const auctionsJoined = new Set(bids.map(b => b.auction?._id).filter(Boolean)).size;

  const activeBids = bids.filter(b => b.auction?.status === "active").length;

  const kpis = [
    { label: "AUCTIONS JOINED",  value: loading ? "—" : auctionsJoined,                                   sub: "Unique auctions you bid on",      dark: false },
    { label: "TOTAL SPENT",      value: loading ? "—" : `$${totalSpent.toLocaleString()}`,                 sub: "From completed purchases",        dark: true  },
    { label: "ACTIVE BIDS",      value: loading ? "—" : activeBids,                                       sub: "Auctions still running",          dark: false },
    { label: "AUCTIONS WON",     value: loading ? "—" : (stats?.auctionsWon ?? 0),                        sub: "Paid & completed orders",         dark: false },
  ];

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
            My Activity
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            Your personal auction history and spending since joining.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map(card => (
          <div key={card.label} style={{
            background: card.dark ? "#1A1814" : "#fff",
            borderRadius: 12, padding: "20px 22px",
            border: card.dark ? "none" : "1px solid #ede8df",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: card.dark ? "#aaa" : "#999", margin: "0 0 10px" }}>
              {card.label}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: card.dark ? "#fff" : "#1A1814", margin: "0 0 6px" }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: card.dark ? "#888" : "#aaa", margin: 0 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Bids */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #f5f3ef" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Recent Bids</h3>
          <span style={{ fontSize: 13, color: "#C9A84C", cursor: "pointer" }} onClick={() => navigate("/dashboard/bids")}>
            View All →
          </span>
        </div>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>Loading...</div>
        ) : bids.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>No bids placed yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf8f4" }}>
                {["ITEM", "BID AMOUNT", "STATUS", "DATE"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bids.slice(0, 5).map((b, i) => {
                const uid = user?._id || user?.id || "";
                const isHighest =
                  b.auction?.highestBider?._id?.toString() === uid ||
                  b.auction?.highestBider?.toString() === uid;
                let statusLabel, statusBg, statusColor;
                if (b.auction?.status === "ended") {
                  statusLabel = isHighest ? "Won" : "Ended";
                  statusBg = isHighest ? "#e6f9f0" : "#f5f5f5";
                  statusColor = isHighest ? "#1a9e5a" : "#888";
                } else {
                  statusLabel = isHighest ? "Pending" : "Outbid";
                  statusBg = isHighest ? "#e8f0fe" : "#fff0f0";
                  statusColor = isHighest ? "#1a73e8" : "#e05252";
                }
                return (
                  <tr
                    key={b._id || i}
                    style={{ borderTop: "1px solid #f5f3ef", cursor: "pointer" }}
                    onClick={() => navigate(`/auctions/${b.auction?._id}`)}
                  >
                    <td style={{ padding: "13px 24px", fontSize: 14, fontWeight: 600, color: "#111" }}>
                      {b.auction?.Product?.name ?? "Auction Item"}
                    </td>
                    <td style={{ padding: "13px 24px", fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700 }}>
                      ${b.amount?.toLocaleString()}
                    </td>
                    <td style={{ padding: "13px 24px" }}>
                      <span style={{ background: statusBg, color: statusColor, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
                        {statusLabel}
                      </span>
                    </td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "#888" }}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Orders */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #f5f3ef" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>My Orders</h3>
          <span style={{ fontSize: 13, color: "#C9A84C", cursor: "pointer" }} onClick={() => navigate("/dashboard/orders")}>
            View All →
          </span>
        </div>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>No orders yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf8f4" }}>
                {["ITEM", "AMOUNT", "ORDER STATUS", "PAYMENT"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o, i) => {
                const sc = STATUS_COLORS[o.paymentStatus] || STATUS_COLORS.pending;
                return (
                  <tr
                    key={o._id || i}
                    style={{ borderTop: "1px solid #f5f3ef", cursor: "pointer" }}
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    <td style={{ padding: "13px 24px", fontSize: 14, fontWeight: 600, color: "#111" }}>
                      {o.auction?.Product?.name ?? "Auction Item"}
                    </td>
                    <td style={{ padding: "13px 24px", fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700 }}>
                      ${(o.finalPrice ?? 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "#555", textTransform: "capitalize" }}>
                      {o.orderStatus ?? "pending"}
                    </td>
                    <td style={{ padding: "13px 24px" }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
                        {o.paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
