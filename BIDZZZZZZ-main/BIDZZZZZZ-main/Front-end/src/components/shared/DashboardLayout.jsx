import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Navbar from "../layout/Navbar";
import FloatingAIAssistant from "./FloatingAIAssistant";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  overview:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  bids:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  watchlist:   "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  chat:        "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  ai:          "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  orders:      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  wallet:      "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22",
  analytics:   "M18 20V10M12 20V4M6 20v-6",
  settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  products:    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  auctions:    "M3 3h18v18H3zM9 9h6M9 12h6M9 15h4",
  logout:      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu:        "M3 12h18M3 6h18M3 18h18",
  close:       "M18 6L6 18M6 6l12 12",
};

const BUYER_NAV = [
  { en: "Overview",     ar: "نظرة عامة",       path: "/buyer-dashboard",    icon: "overview" },
  { en: "My Bids",      ar: "عروضي",           path: "/dashboard/bids",     icon: "bids" },
  { en: "Watchlist",    ar: "قائمة المتابعة",  path: "/dashboard/watchlist",icon: "watchlist" },
  { en: "Orders",       ar: "الطلبات",         path: "/dashboard/orders",   icon: "orders" },
  { en: "Wallet",       ar: "المحفظة",         path: "/wallet",             icon: "wallet" },
  { en: "My Chats",     ar: "محادثاتي",        path: "/my-chats",           icon: "chat" },
  { en: "AI Assistant", ar: "مساعد الذكاء",    path: "/ai-chat",            icon: "ai" },
  { en: "Analytics",    ar: "التحليلات",       path: "/analytics",          icon: "analytics" },
  { en: "Settings",     ar: "الإعدادات",       path: "/dashboard/settings", icon: "settings" },
];

const SELLER_NAV = [
  { en: "Overview",     ar: "نظرة عامة",       path: "/seller-dashboard",   icon: "overview" },
  { en: "My Products",  ar: "منتجاتي",         path: "/my-products",        icon: "products" },
  { en: "My Auctions",  ar: "مزاداتي",         path: "/my-auctions",        icon: "auctions" },
  { en: "Orders",       ar: "الطلبات",         path: "/dashboard/orders",   icon: "orders" },
  { en: "Wallet",       ar: "المحفظة",         path: "/wallet",             icon: "wallet" },
  { en: "My Chats",     ar: "محادثاتي",        path: "/my-chats",           icon: "chat" },
  { en: "AI Assistant", ar: "مساعد الذكاء",    path: "/ai-chat",            icon: "ai" },
  { en: "Analytics",    ar: "التحليلات",       path: "/analytics",          icon: "analytics" },
  { en: "Settings",     ar: "الإعدادات",       path: "/dashboard/settings", icon: "settings" },
];

const ADMIN_NAV = [
  { en: "Overview",     ar: "نظرة عامة",       path: "/admin",              icon: "overview" },
  { en: "Users",        ar: "المستخدمون",      path: "/admin/users",        icon: "watchlist" },
  { en: "Auctions",     ar: "المزادات",        path: "/admin/auctions",     icon: "auctions" },
  { en: "Orders",       ar: "الطلبات",         path: "/admin/orders",       icon: "orders" },
  { en: "Reports",      ar: "التقارير",        path: "/admin/reports",      icon: "analytics" },
  { en: "Wallet",       ar: "المحفظة",         path: "/admin/wallet",       icon: "wallet" },
  { en: "Analytics",    ar: "التحليلات",       path: "/analytics",          icon: "analytics" },
  { en: "Settings",     ar: "الإعدادات",       path: "/dashboard/settings", icon: "settings" },
];

function Sidebar({ navItems, actions, collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lang } = useTheme();

  const name = user?.fullName || "User";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const handleLogout = () => { logout(); navigate("/login"); };

  const label = (item) => lang === "ar" ? item.ar : item.en;

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minWidth: collapsed ? 64 : 240,
      background: "var(--sidebar-bg)",
      display: "flex", flexDirection: "column",
      minHeight: "calc(100vh - 64px)",
      transition: "width 0.2s ease, min-width 0.2s ease",
      borderRight: "1px solid var(--sidebar-border)",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Brand block */}
      <div 
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer", padding: "20px 18px 16px", borderBottom: "1px solid var(--sidebar-border)", background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--gold)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: 1, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
            BZ
          </div>
          {!collapsed && (
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>BIDZONE</div>
              <div style={{ fontSize: 12, color: "var(--sidebar-text)", marginTop: 2 }}>Premium Auctions</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{ background: "none", border: "none", color: "var(--sidebar-text)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-end", cursor: "pointer" }}
      >
        <Icon d={collapsed ? ICONS.menu : ICONS.close} size={15} />
      </button>

      {/* User block */}
      {!collapsed && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px 14px", borderBottom: "1px solid var(--sidebar-border)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gold-bg)", border: "1.5px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            <div style={{ fontSize: 13, color: "var(--sidebar-text)", textTransform: "capitalize" }}>{user?.role ?? "member"}</div>
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", borderBottom: "1px solid var(--sidebar-border)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-bg)", border: "1.5px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold)" }}>
            {initials}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? label(item) : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "14px 0" : "14px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                fontSize: 16, fontWeight: active ? 600 : 500,
                color: active ? "#fff" : "var(--sidebar-text)",
                background: active ? "var(--sidebar-active-bg)" : "transparent",
                borderLeft: active ? "4px solid var(--gold)" : "4px solid transparent",
                borderRadius: active ? "0 8px 8px 0" : "0",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--sidebar-text)"; }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>
                <Icon d={ICONS[item.icon] || ICONS.overview} size={15} />
              </span>
              {!collapsed && label(item)}
            </div>
          );
        })}
      </nav>

      {/* Actions */}
      {!collapsed && actions && (
        <div style={{ padding: "10px 12px", borderTop: "1px solid var(--sidebar-border)" }}>
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              style={{
                width: "100%", marginBottom: 6,
                background: a.primary ? "var(--gold)" : "rgba(255,255,255,0.06)",
                color: "#fff", border: "none",
                borderRadius: "var(--r-md)", padding: "9px 0",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {lang === "ar" ? a.labelAr : a.label}
            </button>
          ))}
        </div>
      )}

      {/* Logout */}
      <div
        onClick={handleLogout}
        title={collapsed ? (lang === "ar" ? "خروج" : "Sign Out") : undefined}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "12px 0" : "12px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderTop: "1px solid var(--sidebar-border)",
          color: "var(--sidebar-text)", fontSize: 15, cursor: "pointer",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--sidebar-text)"}
      >
        <Icon d={ICONS.logout} size={15} />
        {!collapsed && (lang === "ar" ? "تسجيل الخروج" : "Sign Out")}
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children, role }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const effectiveRole = role || user?.role || "buyer";

  const navItems = effectiveRole === "admin" ? ADMIN_NAV
    : effectiveRole === "seller" ? SELLER_NAV
    : BUYER_NAV;

  const actions = effectiveRole === "seller"
    ? [
        { label: "Add Product",    labelAr: "إضافة منتج",   path: "/add-product",   primary: false },
        { label: "Create Auction", labelAr: "إنشاء مزاد",   path: "/auctions/new",  primary: true  },
      ]
    : effectiveRole === "buyer"
    ? [{ label: "Browse Auctions", labelAr: "تصفح المزادات", path: "/auctions", primary: true }]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "var(--surface-2)", fontFamily: "var(--font-sans)" }}>
      <Sidebar navItems={navItems} actions={actions} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <Navbar />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }} className="fade-in">
          {children}
        </main>
      </div>
      <FloatingAIAssistant />
    </div>
  );
}
