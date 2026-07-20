import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { notificationsAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";
import { io } from "socket.io-client";

let _socket = null;
function getSocket() {
  if (!_socket) _socket = io(window.location.origin, { transports: ["websocket"] });
  return _socket;
}

const TYPE_MAP = {
  bid:               { badge: "New Bid",         color: "#1a73e8", bg: "#e8f0fe",  icon: "🔨" },
  outbid:            { badge: "Outbid",           color: "#e05252", bg: "#fff0f0",  icon: "⚡" },
  auction_won:       { badge: "🏆 Won",           color: "#b8962e", bg: "#fff8e1",  icon: "🏆" },
  auction_lost:      { badge: "Auction Ended",    color: "#e05252", bg: "#fff0f0",  icon: "🔔" },
  auction_end:       { badge: "Auction Ended",    color: "#888",    bg: "#f5f5f5",  icon: "🔔" },
  message:           { badge: "Message",          color: "#1a9e5a", bg: "#e6f9f0",  icon: "💬" },
  new_order:         { badge: "New Order",        color: "#7c3aed", bg: "#f3e8ff",  icon: "📦" },
  qr_generated:      { badge: "QR Ready",         color: "#C9A84C", bg: "#fff8e1",  icon: "📷" },
  qr_verified:       { badge: "QR Verified",      color: "#1a9e5a", bg: "#e6f9f0",  icon: "✅" },
  payment_completed: { badge: "Payment Done",     color: "#1a9e5a", bg: "#e6f9f0",  icon: "💳" },
  money_released:    { badge: "Money Released",   color: "#1a9e5a", bg: "#e6f9f0",  icon: "💰" },
  follow:            { badge: "Follow",           color: "#7c3aed", bg: "#f3e8ff",  icon: "👤" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all",               label: "All" },
    { id: "auction_won",       label: "Won" },
    { id: "bid",               label: "Bids" },
    { id: "outbid",            label: "Outbid" },
    { id: "message",           label: "Messages" },
    { id: "payment_completed", label: "Payments" },
    { id: "money_released",    label: "Earnings" },
  ];

  const load = useCallback(() => {
    notificationsAPI.getMy()
      .then(data => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user) return;
    const myId = user._id || user.id;
    const socket = getSocket();
    socket.emit("join", myId);
    const handler = (notif) => setNotifications(prev => [notif, ...prev]);
    socket.on("new_notification", handler);
    return () => socket.off("new_notification", handler);
  }, [user]);

  const handleMarkRead = async (id) => {
    await notificationsAPI.markAsRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllAsRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleAction = (notif) => {
    handleMarkRead(notif._id);
    const id = notif.relatedId;
    switch (notif.type) {
      case "bid":
      case "outbid":
      case "auction_won":
      case "auction_lost":
        if (id) navigate(`/auctions/${id}`);
        break;
      case "new_order":
      case "qr_generated":
      case "qr_verified":
      case "payment_completed":
      case "money_released":
        if (id) navigate(`/orders/${id}`);
        break;
      case "message":
        navigate("/my-chats");
        break;
      default:
        break;
    }
  };

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
            Activity Center
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, background: "#C9A84C", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "2px 10px" }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Stay updated with your live auctions and account activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{ background: "none", border: "1px solid #C9A84C", color: "#C9A84C", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
              background: activeFilter === f.id ? "#1A1814" : "#f0ece4",
              color: activeFilter === f.id ? "#fff" : "#666",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          [1, 2, 3].map(i => <div key={i} style={{ height: 80, background: "#f0ece4", borderRadius: 12 }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔔</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#888" }}>No notifications yet</p>
          </div>
        ) : (
          filtered.map(notif => {
            const style = TYPE_MAP[notif.type] || TYPE_MAP.message;
            return (
              <div
                key={notif._id}
                onClick={() => handleAction(notif)}
                style={{
                  background: notif.isRead ? "#fff" : "#fffdf5",
                  borderRadius: 12, padding: "16px 20px",
                  border: `1px solid ${notif.isRead ? "#ede8df" : "#e8d88a"}`,
                  borderLeft: `4px solid ${style.color}`,
                  display: "flex", alignItems: "center", gap: 16,
                  cursor: "pointer", transition: "box-shadow 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{style.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: style.bg, color: style.color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                      {style.badge}
                    </span>
                    {!notif.isRead && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: notif.isRead ? 400 : 600, color: "#1A1814", margin: "0 0 2px" }}>
                    {notif.title || notif.message}
                  </p>
                  {notif.title && (
                    <p style={{ fontSize: 13, color: "#888", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {notif.message}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#bbb", flexShrink: 0 }}>{timeAgo(notif.createdAt)}</span>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
