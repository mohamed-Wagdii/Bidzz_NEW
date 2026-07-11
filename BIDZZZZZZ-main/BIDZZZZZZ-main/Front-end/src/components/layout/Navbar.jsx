import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { notificationsAPI } from "../../services/api";
import { io } from "socket.io-client";

let _socket = null;
function getSocket() {
  if (!_socket) _socket = io(window.location.origin, { transports: ["websocket"] });
  return _socket;
}

const TYPE_ICON = {
  bid: "🔨", outbid: "⚡", auction_won: "🏆", auction_lost: "🔔",
  message: "💬", new_order: "📦", qr_generated: "📷", qr_verified: "✅",
  payment_completed: "💳", money_released: "💰", follow: "👤", auction_end: "🔔",
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString();
}

const NAV_LINKS = [
  { en: "Auctions",     ar: "المزادات",   path: "/auctions" },
  { en: "How it Works", ar: "كيف يعمل",   path: "/how-it-works" },
  { en: "About",        ar: "عن المنصة",  path: "/about" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { dark, toggleDark, lang, toggleLang } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications
  useEffect(() => {
    if (!user) return;
    notificationsAPI.getMy()
      .then(d => setNotifications((d.notifications || []).slice(0, 20)))
      .catch(() => {});
  }, [user]);

  // Real-time socket
  useEffect(() => {
    if (!user) return;
    const myId = user._id || user.id;
    const socket = getSocket();
    socket.emit("join", myId);
    const handler = (notif) => setNotifications(prev => [notif, ...prev].slice(0, 20));
    socket.on("new_notification", handler);
    return () => socket.off("new_notification", handler);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (notif, e) => {
    e.stopPropagation();
    await notificationsAPI.markAsRead(notif._id).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await notificationsAPI.markAsRead(notif._id).catch(() => {});
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
    }
    setShowDrop(false);
    const id = notif.relatedId;
    switch (notif.type) {
      case "bid": case "outbid": case "auction_won": case "auction_lost":
        if (id) navigate(`/auctions/${id}`); break;
      case "new_order": case "qr_generated": case "qr_verified":
      case "payment_completed": case "money_released":
        if (id) navigate(`/orders/${id}`); break;
      case "message": navigate("/my-chats"); break;
      default: navigate("/notifications");
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await notificationsAPI.markAllAsRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const firstName = user?.fullName?.split(" ")[0] || null;
  const initials  = user?.fullName
    ? user.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : null;
  const dashPath  = user?.role === "seller" ? "/seller-dashboard"
    : user?.role === "admin" ? "/admin"
    : "/buyer-dashboard";

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 64,
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "var(--shadow-xs)",
      fontFamily: "var(--font-sans)",
      transition: "background var(--t-slow)",
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate(user ? dashPath : "/")}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}
      >
        <span style={{ color: "var(--ink)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>BID</span>
        <span style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>ZONE</span>
      </div>

      {/* Center nav links */}
      <div style={{ display: "flex", gap: 28 }}>
        {NAV_LINKS.map((link) => {
          const active = location.pathname === link.path;
          return (
            <span
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? "var(--ink)" : "var(--ink-40)",
                cursor: "pointer", padding: "4px 0",
                borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent",
                transition: "color var(--t-base)",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--ink-40)"; }}
            >
              {lang === "ar" ? link.ar : link.en}
            </span>
          );
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* 🌙 Dark mode toggle */}
        <button onClick={toggleDark} title={dark ? "Light Mode" : "Dark Mode"} style={iconBtn}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🌐 Language toggle */}
        <button
          onClick={toggleLang}
          title={lang === "en" ? "العربية" : "English"}
          style={{ ...iconBtn, fontSize: 11, fontWeight: 700, border: "1px solid var(--border)", borderRadius: "var(--r-full)", padding: "5px 11px", color: "var(--ink-60)" }}
        >
          {lang === "en" ? "عربي" : "EN"}
        </button>

        {user ? (
          <>
            {/* Bell with dropdown */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <button
                style={{ ...iconBtn, position: "relative" }}
                onClick={() => setShowDrop(v => !v)}
              >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 2, right: 2,
                    background: "var(--danger)", color: "#fff",
                    fontSize: 9, fontWeight: 700, borderRadius: "50%",
                    minWidth: 15, height: 15,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 2px",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showDrop && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: 340, background: "#fff", borderRadius: 12,
                  border: "1px solid #ede8df", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  zIndex: 300, overflow: "hidden",
                }}>
                  {/* Header */}
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f5f3ef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1814" }}>
                      Notifications {unreadCount > 0 && <span style={{ background: "#C9A84C", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px", marginLeft: 4 }}>{unreadCount}</span>}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} style={{ fontSize: 11, color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => { setShowDrop(false); navigate("/notifications"); }} style={{ fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer" }}>
                        See all
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#aaa", fontSize: 13 }}>No notifications yet</div>
                    ) : (
                      notifications.slice(0, 10).map(notif => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotifClick(notif)}
                          style={{
                            padding: "12px 16px", cursor: "pointer",
                            background: notif.isRead ? "#fff" : "#fffdf5",
                            borderBottom: "1px solid #f5f3ef",
                            display: "flex", gap: 10, alignItems: "flex-start",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f7f6f3"}
                          onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? "#fff" : "#fffdf5"}
                        >
                          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{TYPE_ICON[notif.type] || "🔔"}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: notif.isRead ? 400 : 600, color: "#1A1814", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {notif.title || notif.message}
                            </p>
                            {notif.title && (
                              <p style={{ fontSize: 12, color: "#888", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {notif.message}
                              </p>
                            )}
                            <span style={{ fontSize: 11, color: "#bbb" }}>{timeAgo(notif.createdAt)}</span>
                          </div>
                          {!notif.isRead && (
                            <button
                              onClick={(e) => handleMarkRead(notif, e)}
                              style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#C9A84C", fontSize: 11, fontWeight: 600, padding: "2px 4px" }}
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={() => navigate(dashPath)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "none", border: "1px solid var(--border)",
                borderRadius: "var(--r-full)", padding: "4px 10px 4px 4px",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--ink)", color: "var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
              }}>
                {initials}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{firstName}</span>
            </button>

            {/* CTA */}
            <button
              className="btn btn-primary"
              onClick={() => navigate(user.role === "seller" ? "/auctions/new" : "/auctions")}
            >
              {lang === "ar"
                ? (user.role === "seller" ? "مزاد جديد" : "قدم عرضاً")
                : (user.role === "seller" ? "New Listing" : "Place Bid")
              }
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
              {lang === "ar" ? "دخول" : "Sign In"}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/register")}>
              {lang === "ar" ? "إنشاء حساب" : "Get Started"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const iconBtn = {
  background: "none", border: "none",
  cursor: "pointer", padding: "6px 8px",
  color: "var(--ink-40)", fontSize: 16,
  display: "flex", alignItems: "center",
  borderRadius: "var(--r-md)",
  transition: "background var(--t-fast)",
};
