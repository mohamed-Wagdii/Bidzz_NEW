import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/shared/DashboardLayout";

const ORDER_STATUS_COLORS = {
  pending:    { bg: "#fff8e1", color: "#b8962e" },
  processing: { bg: "#e8f0fe", color: "#1a73e8" },
  shipped:    { bg: "#f3e8ff", color: "#7c3aed" },
  delivered:  { bg: "#e6f9f0", color: "#1a9e5a" },
  cancelled:  { bg: "#fff0f0", color: "#e05252" },
};

const PAYMENT_STATUS_COLORS = {
  pending:  { bg: "#fff8e1", color: "#b8962e" },
  paid:     { bg: "#e6f9f0", color: "#1a9e5a" },
  failed:   { bg: "#fff0f0", color: "#e05252" },
  refunded: { bg: "#f3e8ff", color: "#7c3aed" },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uid = user?._id || user?.id || "";

  useEffect(() => {
    ordersAPI.getMy()
      .then(data => setOrders(data.orders || []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>My Orders</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Track your auction purchases and delivery status.</p>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", marginBottom: 20 }}>{error}</div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 72, background: "#f0ece4", borderRadius: 8, marginBottom: 12 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#555" }}>No orders yet</p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Win an auction to see your orders here.</p>
            <button onClick={() => navigate("/auctions")} style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              Browse Auctions
            </button>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #f5f3ef", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa" }}>
              <span style={{ flex: 2 }}>ITEM</span>
              <span style={{ flex: 1 }}>ORDER ID</span>
              <span style={{ flex: 1 }}>DATE</span>
              <span style={{ flex: 1 }}>AMOUNT</span>
              <span style={{ flex: 1 }}>PAYMENT</span>
              <span style={{ flex: 1 }}>STATUS</span>
              <span style={{ flex: 1 }}>ACTION</span>
            </div>

            {orders.map((order, i) => {
              const osc = ORDER_STATUS_COLORS[order.orderStatus] || ORDER_STATUS_COLORS.pending;
              const psc = PAYMENT_STATUS_COLORS[order.paymentStatus] || PAYMENT_STATUS_COLORS.pending;
              const image = order.auction?.Product?.image?.[0];
              const title = order.auction?.Product?.name ?? "Auction Item";
              const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—";
              const isOrderWinner = (order.winner?._id?.toString() || order.winner?.toString()) === uid;
              const isOrderSeller = (order.seller?._id?.toString() || order.seller?.toString()) === uid;

              // Determine the primary action button
              let actionBtn = null;
              if (isOrderWinner && order.paymentStatus === "pending") {
                actionBtn = (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/payment`)}
                    style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    Pay Now
                  </button>
                );
              } else if (isOrderWinner && order.paymentStatus === "failed") {
                actionBtn = (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/payment`)}
                    style={{ background: "#e05252", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    Retry
                  </button>
                );
              } else {
                actionBtn = (
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    style={{ background: "none", border: "1px solid #C9A84C", color: "#C9A84C", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    View
                  </button>
                );
              }

              return (
                <div key={order._id} style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: i < orders.length - 1 ? "1px solid #f5f3ef" : "none" }}>
                  {/* Item */}
                  <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f0ede6", flexShrink: 0, overflow: "hidden" }}>
                      {image && <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{title}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                        {isOrderWinner ? "You won" : isOrderSeller ? "You sold" : ""}
                      </div>
                    </div>
                  </div>

                  <span style={{ flex: 1, fontSize: 12, color: "#888", fontFamily: "monospace" }}>#{order._id?.slice(-8).toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 13, color: "#666" }}>{date}</span>
                  <span style={{ flex: 1, fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#1A1814" }}>${(order.finalPrice ?? 0).toLocaleString()}</span>

                  {/* Payment status */}
                  <div style={{ flex: 1 }}>
                    <span style={{ background: psc.bg, color: psc.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase" }}>
                      {order.paymentStatus ?? "pending"}
                    </span>
                  </div>

                  {/* Order status */}
                  <div style={{ flex: 1 }}>
                    <span style={{ background: osc.bg, color: osc.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase" }}>
                      {order.orderStatus ?? "pending"}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>{actionBtn}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
