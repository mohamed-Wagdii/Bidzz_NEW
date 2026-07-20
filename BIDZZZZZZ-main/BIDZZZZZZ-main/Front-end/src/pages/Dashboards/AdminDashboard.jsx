import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsAPI, reportsAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["var(--info)", "var(--gold)", "var(--success)", "var(--danger)"];

function StatCard({ label, value, sub, icon, variant = "default", loading, onClick }) {
  const isDark = variant === "dark";
  const isGold = variant === "gold";
  return (
    <div className={`stat-card ${isDark ? "dark" : isGold ? "gold" : ""}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: isDark || isGold ? "rgba(255,255,255,0.55)" : "var(--ink-40)" }}>{label}</span>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      {loading
        ? <div className="skeleton" style={{ height: 32, width: "55%" }} />
        : <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: isDark || isGold ? "#fff" : "var(--ink)", lineHeight: 1 }}>{value}</div>
      }
      {sub && <div style={{ fontSize: 12, color: isDark || isGold ? "rgba(255,255,255,0.45)" : "var(--ink-40)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [reportStats, setReportStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.get(), reportsAPI.getStats()])
      .then(([analytics, reports]) => {
        setData(analytics);
        setReportStats(reports);
      })
      .catch((err) => console.error("Admin dashboard error:", err?.response?.data || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Pad monthly revenue for the last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthIndex = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();
    const found = (data?.monthlyRevenue || []).find(m => m._id?.month === monthIndex && m._id?.year === year);
    monthlyData.push({
      month: MONTH_NAMES[monthIndex - 1],
      revenue: found?.revenue ?? 0,
      orders: found?.count ?? 0,
    });
  }

  const userPieData = [
    { name: "Buyers",  value: data?.totalBuyers  ?? 0 },
    { name: "Sellers", value: data?.totalSellers ?? 0 },
  ];

  const auctionPieData = [
    { name: "Active",    value: data?.activeAuctions ?? 0 },
    { name: "Completed", value: (data?.totalAuctions ?? 0) - (data?.activeAuctions ?? 0) },
  ];

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>Platform-wide analytics and management.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {reportStats?.pending > 0 && (
            <button className="btn btn-danger btn-sm" onClick={() => navigate("/admin/reports")}>
              {reportStats.pending} Pending Reports
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/analytics")}>Full Analytics</button>
        </div>
      </div>

      {/* Stats row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <StatCard label="Total Revenue"   value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`}    icon="💰" variant="gold"    loading={loading} />
        <StatCard label="Total Users"     value={(data?.totalUsers ?? 0).toLocaleString()}             icon="👥" variant="dark"    loading={loading} />
        <StatCard label="Total Auctions"  value={(data?.totalAuctions ?? 0).toLocaleString()}          icon="🔨" variant="default" loading={loading} />
        <StatCard label="Total Orders"    value={(data?.totalOrders ?? 0).toLocaleString()}            icon="📦" variant="default" loading={loading} />
      </div>

      {/* Stats row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Active Auctions"  value={data?.activeAuctions ?? 0}   icon="🟢" loading={loading} />
        <StatCard label="Buyers"           value={data?.totalBuyers ?? 0}      icon="🛒" loading={loading} />
        <StatCard label="Sellers"          value={data?.totalSellers ?? 0}     icon="🏪" loading={loading} />
        <StatCard label="Pending Reports"  value={reportStats?.pending ?? 0}   icon="🚨" loading={loading} onClick={() => navigate("/admin/reports")} />
      </div>

      {/* Wallet stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: "18px 20px", background: "linear-gradient(135deg, var(--ink) 0%, #1e2a3a 100%)", border: "none" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Platform Wallet</div>
          {loading ? <div className="skeleton" style={{ height: 28, width: "60%" }} /> : <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#fff" }}>${(data?.totalWalletBalance ?? 0).toLocaleString()}</div>}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Total user balances</div>
        </div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: 8 }}>Total Escrow</div>
          {loading ? <div className="skeleton" style={{ height: 28, width: "60%" }} /> : <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--gold-dark)" }}>${(data?.totalEscrow ?? 0).toLocaleString()}</div>}
          <div style={{ fontSize: 12, color: "var(--ink-40)", marginTop: 4 }}>Locked in escrow</div>
        </div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: 8 }}>Completed Orders</div>
          {loading ? <div className="skeleton" style={{ height: 28, width: "60%" }} /> : <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--success)" }}>{data?.completedOrders ?? 0}</div>}
          <div style={{ fontSize: 12, color: "var(--ink-40)", marginTop: 4 }}>Paid & delivered</div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Revenue chart */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Revenue Trend</div>
            <div className="section-subtitle">Last 6 months</div>
          </div>
          {loading ? <div className="skeleton" style={{ height: 180 }} /> :
           monthlyData.length === 0 ? <div className="empty-state" style={{ padding: "40px 0" }}><p>No data</p></div> : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-40)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2.5} fill="url(#adminRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* User distribution */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Users</div>
            <div className="section-subtitle">Buyers vs Sellers</div>
          </div>
          {loading ? <div className="skeleton" style={{ height: 160 }} /> : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={userPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {userPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Auction distribution */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Auctions</div>
            <div className="section-subtitle">Active vs Ended</div>
          </div>
          {loading ? <div className="skeleton" style={{ height: 160 }} /> : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={auctionPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {auctionPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i + 2]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Sellers + Recent Users + Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {/* Top Sellers */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <div className="section-title">Top Sellers</div>
            <div className="section-subtitle">By revenue</div>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />) :
           !data?.topSellers?.length ? <div className="empty-state" style={{ padding: "24px 0" }}><p>No data</p></div> :
           data.topSellers.map((s, i) => (
            <div key={s._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < data.topSellers.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "var(--gold-bg)" : "var(--surface-3)", border: i === 0 ? "1px solid var(--gold)" : "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "var(--gold-dark)" : "var(--ink-40)", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{s.orders} orders</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-dark)" }}>${s.revenue?.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Recent Registrations */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <div className="section-title">Recent Users</div>
            <div className="section-subtitle">Latest registrations</div>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />) :
           !data?.recentUsers?.length ? <div className="empty-state" style={{ padding: "24px 0" }}><p>No users</p></div> :
           data.recentUsers.map((u, i) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < data.recentUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--ink-40)", flexShrink: 0 }}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{u.email}</div>
              </div>
              <span className={`badge ${u.role === "seller" ? "badge-gold" : "badge-info"}`}>{u.role}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <div className="section-title">Recent Orders</div>
            <div className="section-subtitle">Latest completed</div>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />) :
           !data?.recentOrders?.length ? <div className="empty-state" style={{ padding: "24px 0" }}><p>No orders</p></div> :
           data.recentOrders.map((o, i) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < data.recentOrders.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.item}</div>
                <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{o.buyer} · ${o.bid?.toLocaleString()}</div>
              </div>
              <span className={`badge ${o.status === "paid" ? "badge-success" : "badge-warning"}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
