import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI, bidsAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ── Helpers ────────────────────────────────────────────────────────────────
function getTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const BID_STATUS = {
  leading: { cls: "badge-info",    label: "Leading" },
  won:     { cls: "badge-success", label: "Won"     },
  outbid:  { cls: "badge-danger",  label: "Outbid"  },
  ended:   { cls: "badge-neutral", label: "Ended"   },
};

function getBidStatus(bid) {
  if (bid.auctionStatus === "ended") return bid.isHighest ? BID_STATUS.won : BID_STATUS.ended;
  return bid.isHighest ? BID_STATUS.leading : BID_STATUS.outbid;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, variant = "default", loading }) {
  const isDark = variant === "dark";
  const isGold = variant === "gold";
  return (
    <div className={`stat-card ${isDark ? "dark" : isGold ? "gold" : ""}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: isDark || isGold ? "rgba(255,255,255,0.6)" : "var(--ink-40)" }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      {loading
        ? <div className="skeleton" style={{ height: 36, width: "60%" }} />
        : <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: isDark || isGold ? "#fff" : "var(--ink)", lineHeight: 1 }}>{value}</div>
      }
      {sub && <div style={{ fontSize: 12, color: isDark || isGold ? "rgba(255,255,255,0.5)" : "var(--ink-40)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function WalletCard({ balance, locked, escrow, loading }) {
  return (
    <div style={{ background: "linear-gradient(135deg, var(--ink) 0%, #1e2a3a 100%)", borderRadius: "var(--r-lg)", padding: "22px 24px", color: "#fff", boxShadow: "var(--shadow-lg)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Wallet Overview</div>
      {loading
        ? <div className="skeleton" style={{ height: 40, width: "50%", marginBottom: 16 }} />
        : <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 700, marginBottom: 16 }}>${balance?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
      }
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Locked", value: locked, color: "var(--warning)" },
          { label: "Escrow", value: escrow, color: "var(--gold)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--r-md)", padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{label}</div>
            {loading
              ? <div className="skeleton" style={{ height: 20, width: "70%" }} />
              : <div style={{ fontSize: 16, fontWeight: 700, color }}>${value?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authAPI.getDashboard(), bidsAPI.getMy()])
      .then(([dashData, bidsData]) => {
        setStats(dashData);
        const uid = user?._id || user?.id || "";
        setBids((bidsData.bids || []).map(b => ({
          id: b._id,
          auctionId: b.auction?._id,
          title: b.auction?.Product?.name ?? "Auction Item",
          lotNumber: b.auction?._id?.slice(-6).toUpperCase() ?? "------",
          closesIn: b.auction?.endTime ? getTimeLeft(b.auction.endTime) : "—",
          amount: b.amount,
          auctionStatus: b.auction?.status,
          isHighest: (b.auction?.highestBider?._id?.toString() || b.auction?.highestBider?.toString()) === uid,
          image: b.auction?.Product?.image?.[0] ?? null,
        })));
      })
      .catch((err) => console.error("Buyer dashboard error:", err?.response?.data || err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Build chart data from bidActivity
  const chartData = (stats.bidActivity || []).map(d => ({
    date: d._id?.slice(5), // MM-DD
    bids: d.count,
  }));

  const statCards = [
    { label: "Active Bids",   value: stats.activeBids ?? 0,   icon: "🎯", variant: "default" },
    { label: "Auctions Won",  value: stats.auctionsWon ?? 0,  icon: "🏆", variant: "dark"    },
    { label: "Total Orders",  value: stats.totalOrders ?? 0,  icon: "📦", variant: "default" },
    { label: "Notifications", value: "—",                     icon: "🔔", variant: "default" },
  ];

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Welcome back, {user?.fullName?.split(" ")[0] ?? "Bidder"} 👋
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>Here's what's happening with your bids today.</p>
        </div>
        <button className="btn btn-gold" onClick={() => navigate("/auctions")}>Browse Auctions</button>
      </div>

      {/* Wallet + Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <WalletCard balance={stats.walletBalance} locked={stats.lockedBalance} escrow={stats.escrowBalance} loading={loading} />
        {statCards.slice(0, 3).map((s, i) => (
          <StatCard key={i} {...s} loading={loading} />
        ))}
      </div>

      {/* Charts + Bids */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Bid Activity Chart */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Bid Activity</div>
            <div className="section-subtitle">Last 7 days</div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 160 }} />
          ) : chartData.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 0" }}>
              <p>No bid activity yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Area type="monotone" dataKey="bids" stroke="var(--gold)" strokeWidth={2} fill="url(#bidGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bid Status Breakdown */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Bid Status</div>
            <div className="section-subtitle">Current breakdown</div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 160 }} />
          ) : (() => {
            const leading = bids.filter(b => b.auctionStatus === "active" && b.isHighest).length;
            const outbid  = bids.filter(b => b.auctionStatus === "active" && !b.isHighest).length;
            const won     = bids.filter(b => b.auctionStatus === "ended" && b.isHighest).length;
            const lost    = bids.filter(b => b.auctionStatus === "ended" && !b.isHighest).length;
            const data = [
              { name: "Leading", value: leading, fill: "var(--info)" },
              { name: "Outbid",  value: outbid,  fill: "var(--danger)" },
              { name: "Won",     value: won,     fill: "var(--success)" },
              { name: "Lost",    value: lost,    fill: "var(--ink-10)" },
            ];
            return (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--info)" />
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>

      {/* Active Bids Table */}
      <div className="card" style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="section-title">Active Bids</div>
            <div className="section-subtitle">{bids.filter(b => b.auctionStatus === "active").length} ongoing</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard/bids")}>View All</button>
        </div>

        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 10 }} />)
        ) : bids.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <p>No bids yet. Start bidding!</p>
            <button className="btn btn-gold btn-sm" onClick={() => navigate("/auctions")}>Browse Auctions</button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Lot #</th>
                <th>Closes</th>
                <th>Your Bid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.slice(0, 8).map(bid => {
                const sc = getBidStatus(bid);
                return (
                  <tr key={bid.id} onClick={() => navigate(`/auctions/${bid.auctionId}`)} style={{ cursor: "pointer" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {bid.image
                          ? <img src={bid.image} alt="" style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", objectFit: "cover", flexShrink: 0 }} />
                          : <div style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--surface-3)", flexShrink: 0 }} />
                        }
                        <span style={{ fontWeight: 500, color: "var(--ink)", fontSize: 13 }}>{bid.title}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>#{bid.lotNumber}</td>
                    <td>{bid.closesIn}</td>
                    <td style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-display)" }}>${bid.amount?.toLocaleString()}</td>
                    <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
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
