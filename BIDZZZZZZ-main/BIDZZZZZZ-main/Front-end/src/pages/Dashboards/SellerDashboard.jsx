import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auctionsAPI, authAPI, productsAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATUS_BADGE = {
  active:  "badge-success",
  pending: "badge-warning",
  ended:   "badge-neutral",
};

function StatCard({ label, value, sub, icon, variant = "default", loading, onClick }) {
  const isDark = variant === "dark";
  const isGold = variant === "gold";
  return (
    <div
      className={`stat-card ${isDark ? "dark" : isGold ? "gold" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: isDark || isGold ? "rgba(255,255,255,0.55)" : "var(--ink-40)" }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      {loading
        ? <div className="skeleton" style={{ height: 34, width: "55%" }} />
        : <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: isDark || isGold ? "#fff" : "var(--ink)", lineHeight: 1 }}>{value}</div>
      }
      {sub && <div style={{ fontSize: 12, color: isDark || isGold ? "rgba(255,255,255,0.45)" : "var(--ink-40)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authAPI.getDashboard(), auctionsAPI.getMy(), productsAPI.getMy()])
      .then(([dashData, auctionData, productData]) => {
        setStats(dashData);
        setAuctions(auctionData.auctions || []);
        setProducts(productData.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthlyData = (stats?.monthlyRevenue || []).map(d => ({
    month: MONTH_NAMES[(d._id?.month ?? 1) - 1],
    revenue: d.revenue,
    orders: d.count,
  }));

  const avgPrice = stats?.totalRevenue && stats?.deliveredOrders
    ? (stats.totalRevenue / stats.deliveredOrders).toFixed(0)
    : 0;

  return (
    <DashboardLayout role="seller">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Welcome back, {user?.fullName?.split(" ")[0] ?? "Seller"} 👋
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>Here's your store performance overview.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/add-product")}>Add Product</button>
          <button className="btn btn-gold" onClick={() => navigate("/auctions/new")}>Create Auction</button>
        </div>
      </div>

      {/* Stats row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <StatCard label="Total Revenue"    value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon="💰" variant="gold"    loading={loading} />
        <StatCard label="Wallet Balance"   value={`$${(stats?.walletBalance ?? 0).toLocaleString()}`} icon="💳" variant="dark"    loading={loading} />
        <StatCard label="Escrow Balance"   value={`$${(stats?.escrowBalance ?? 0).toLocaleString()}`} icon="🔒" variant="default" loading={loading} sub="Pending release" />
        <StatCard label="Avg. Sale Price"  value={`$${Number(avgPrice).toLocaleString()}`}            icon="📊" variant="default" loading={loading} />
      </div>

      {/* Stats row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Auctions"    value={stats?.totalAuctions ?? 0}    icon="🔨" loading={loading} onClick={() => navigate("/my-auctions")} />
        <StatCard label="Active Auctions"   value={stats?.activeAuctions ?? 0}   icon="🟢" loading={loading} />
        <StatCard label="Pending Orders"    value={stats?.pendingOrders ?? 0}    icon="⏳" loading={loading} onClick={() => navigate("/dashboard/orders")} />
        <StatCard label="Delivered Orders"  value={stats?.deliveredOrders ?? 0}  icon="✅" loading={loading} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Monthly Revenue */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Monthly Revenue</div>
            <div className="section-subtitle">Last 6 months</div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 180 }} />
          ) : monthlyData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}><p>No revenue data yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders per month */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Orders / Month</div>
            <div className="section-subtitle">Last 6 months</div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 180 }} />
          ) : monthlyData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}><p>No data yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Bar dataKey="orders" fill="var(--ink)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Products + Auctions + Recent Buyers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {/* My Products */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="section-title">My Products</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/my-products")}>View All</button>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />) :
           products.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <p>No products yet</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-product")}>Add Product</button>
            </div>
          ) : products.slice(0, 4).map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "var(--r-sm)", background: "var(--surface-3)", flexShrink: 0, overflow: "hidden" }}>
                {p.image?.[0] && <img src={p.image[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>${p.price?.toLocaleString()}</div>
              </div>
              <span className={`badge ${p.status === "approved" ? "badge-success" : p.status === "pending" ? "badge-warning" : "badge-danger"}`}>{p.status}</span>
            </div>
          ))}
        </div>

        {/* Recent Auctions */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="section-title">Recent Auctions</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/my-auctions")}>View All</button>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />) :
           auctions.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <p>No auctions yet</p>
              <button className="btn btn-gold btn-sm" onClick={() => navigate("/auctions/new")}>Create Auction</button>
            </div>
          ) : auctions.slice(0, 4).map((a, i) => (
            <div key={a._id} onClick={() => navigate(`/auctions/${a._id}`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: "var(--r-sm)", background: "var(--surface-3)", flexShrink: 0, overflow: "hidden" }}>
                {a.Product?.image?.[0] && <img src={a.Product.image[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.Product?.name ?? "Unnamed"}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{a.bidCount ?? 0} bids · ${a.currentPrice?.toLocaleString()}</div>
              </div>
              <span className={`badge ${STATUS_BADGE[a.status] || "badge-neutral"}`}>{a.status}</span>
            </div>
          ))}
        </div>

        {/* Recent Buyers */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <div className="section-title">Recent Buyers</div>
            <div className="section-subtitle">Latest completed orders</div>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />) :
           !stats?.recentBuyers?.length ? (
            <div className="empty-state" style={{ padding: "24px 0" }}><p>No orders yet</p></div>
          ) : stats.recentBuyers.map((o, i) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < stats.recentBuyers.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gold-bg)", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold-dark)", flexShrink: 0 }}>
                {o.buyer?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.buyer ?? "Unknown"}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>${o.amount?.toLocaleString()}</div>
              </div>
              <span className={`badge ${o.status === "delivered" ? "badge-success" : "badge-warning"}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
