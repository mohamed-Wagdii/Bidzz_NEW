import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/shared/DashboardLayout";

const LIFECYCLE = [
  { key: "pending",    label: "Order Created" },
  { key: "processing", label: "Payment Confirmed" },
  { key: "shipped",    label: "Shipped" },
  { key: "delivered",  label: "Delivered" },
];

const STATUS_COLORS = {
  pending:    { bg: "#fff8e1", color: "#b8962e" },
  processing: { bg: "#e8f0fe", color: "#1a73e8" },
  shipped:    { bg: "#f3e8ff", color: "#7c3aed" },
  delivered:  { bg: "#e6f9f0", color: "#1a9e5a" },
  cancelled:  { bg: "#fff0f0", color: "#e05252" },
};

const PAYMENT_COLORS = {
  pending:  "#b8962e",
  paid:     "#1a9e5a",
  failed:   "#e05252",
  refunded: "#7c3aed",
};

function LifecycleStepper({ orderStatus }) {
  const currentIdx = LIFECYCLE.findIndex(s => s.key === orderStatus);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {LIFECYCLE.map((step, i) => (
        <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < LIFECYCLE.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i <= currentIdx ? "#C9A84C" : "#e0ddd5",
              color: i <= currentIdx ? "#fff" : "#aaa",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              boxShadow: i === currentIdx ? "0 0 0 4px rgba(201,168,76,0.2)" : "none",
            }}>
              {i < currentIdx ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: i <= currentIdx ? "#C9A84C" : "#aaa", whiteSpace: "nowrap" }}>
              {step.label}
            </span>
          </div>
          {i < LIFECYCLE.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < currentIdx ? "#C9A84C" : "#e0ddd5", margin: "0 6px", marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function TimelineRow({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#C9A84C", letterSpacing: 1, margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, mono, valueStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 14 }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span style={{ fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 12 : 14, color: "#555", ...valueStyle }}>{value}</span>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shippingInput, setShippingInput] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingMsg, setShippingMsg] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    ordersAPI.getById(id)
      .then(data => {
        setOrder(data.order);
        setShippingInput(data.order?.shippingAddress || "");
      })
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  }, [id]);

  const uid = user?._id || user?.id || "";
  const winnerId = order?.winner?._id?.toString() || order?.winner?.toString() || "";
  const sellerId = order?.seller?._id?.toString() || order?.seller?.toString() || "";
  const isWinner = uid === winnerId;
  const isSeller = uid === sellerId;

  const sc = STATUS_COLORS[order?.orderStatus] || STATUS_COLORS.pending;
  const product = order?.auction?.Product;
  const image = product?.image?.[0];

  const handleSaveShipping = async () => {
    if (!shippingInput.trim()) return;
    setShippingLoading(true);
    setShippingMsg("");
    try {
      const data = await ordersAPI.updateShipping(id, shippingInput);
      setOrder(data.order);
      setShippingMsg("✓ Shipping address saved.");
    } catch (err) {
      setShippingMsg(err.response?.data?.message || "Failed to save address.");
    } finally {
      setShippingLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusLoading(true);
    try {
      const data = await ordersAPI.updateStatus(id, newStatus);
      setOrder(data.order);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate("/dashboard/orders")} style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 13, cursor: "pointer", padding: 0, fontWeight: 600 }}>
          ← Back to Orders
        </button>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "8px 0 4px" }}>Order Details</h1>
      </div>

      {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", marginBottom: 20 }}>{error}</div>}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2].map(i => <div key={i} style={{ height: 120, background: "#f0ece4", borderRadius: 12 }} />)}
        </div>
      ) : !order ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#999" }}>Order not found.</div>
      ) : (
        <>
          {/* Lifecycle stepper */}
          {order.orderStatus !== "cancelled" && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "24px 28px", marginBottom: 20 }}>
              <LifecycleStepper orderStatus={order.orderStatus} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Winner banner */}
              {isWinner && (
                <div style={{ background: "linear-gradient(135deg,#C9A84C,#e8c96a)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 32 }}>🏆</span>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
                      Congratulations, {order.winner?.fullName}!
                    </p>
                    <p style={{ fontSize: 13, color: "#5a4a1a", margin: 0 }}>
                      You won the auction for "{product?.name}".
                    </p>
                  </div>
                </div>
              )}

              {/* Product card */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden" }}>
                {image && <img src={image} alt={product?.name} style={{ width: "100%", height: 260, objectFit: "cover" }} />}
                <div style={{ padding: "20px 24px" }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{product?.name}</h2>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0 }}>{product?.description}</p>
                </div>
              </div>

              {/* Shipping address — winner edits if paid and not yet shipped */}
              {isWinner && order.paymentStatus === "paid" && !["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "20px 24px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>Shipping Address</h3>
                  <textarea
                    value={shippingInput}
                    onChange={e => setShippingInput(e.target.value)}
                    placeholder="Enter your full shipping address..."
                    rows={3}
                    style={{ width: "100%", border: "1.5px solid #e0ddd5", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none" }}
                  />
                  {shippingMsg && (
                    <p style={{ fontSize: 12, color: shippingMsg.startsWith("✓") ? "#1a9e5a" : "#e05252", margin: "6px 0 0" }}>{shippingMsg}</p>
                  )}
                  <button
                    onClick={handleSaveShipping}
                    disabled={shippingLoading || !shippingInput.trim()}
                    style={{ marginTop: 10, background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                  >
                    {shippingLoading ? "Saving..." : "Save Address"}
                  </button>
                </div>
              )}

              {/* Shipping address read-only for seller or after shipped */}
              {order.shippingAddress && (isSeller || ["shipped", "delivered"].includes(order.orderStatus)) && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "20px 24px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Shipping Address</h3>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 }}>{order.shippingAddress}</p>
                </div>
              )}

              {/* Order timeline */}
              <div style={{ background: "#0f1923", borderRadius: 12, padding: "20px 24px", color: "#fff" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#C9A84C" }}>Order Timeline</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <TimelineRow label="ORDER PLACED" value={new Date(order.createdAt).toLocaleString()} />
                  {order.paidAt && <TimelineRow label="PAYMENT CONFIRMED" value={new Date(order.paidAt).toLocaleString()} />}
                  {order.shippedAt && <TimelineRow label="SHIPPED" value={new Date(order.shippedAt).toLocaleString()} />}
                  {order.deliveredAt && <TimelineRow label="DELIVERED" value={new Date(order.deliveredAt).toLocaleString()} />}
                  <TimelineRow label="WINNER" value={order.winner?.fullName} />
                  <TimelineRow label="SELLER" value={order.seller?.fullName} />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "24px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Order Summary</h3>

                <SummaryRow label="Order ID" value={`#${order._id?.slice(-8).toUpperCase()}`} mono />
                <SummaryRow
                  label="Payment"
                  value={order.paymentStatus}
                  valueStyle={{ color: PAYMENT_COLORS[order.paymentStatus] || "#888", fontWeight: 700, textTransform: "capitalize" }}
                />
                <SummaryRow label="Order Status" value={
                  <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
                    {order.orderStatus}
                  </span>
                } />

                <div style={{ borderTop: "1px solid #f0ece4", paddingTop: 16, marginBottom: 20, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Final Price</span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#C9A84C" }}>
                      ${order.finalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Winner: pay if pending */}
                {isWinner && order.paymentStatus === "pending" && (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/payment`)}
                    style={{ width: "100%", background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}
                  >
                    Pay with Wallet →
                  </button>
                )}

                {/* Winner: retry if failed */}
                {isWinner && order.paymentStatus === "failed" && (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/payment`)}
                    style={{ width: "100%", background: "#e05252", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}
                  >
                    Retry Payment
                  </button>
                )}

                {/* Seller: view QR for delivery */}
                {isSeller && order.paymentStatus === "paid" && !order.qrVerified && (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/qr`)}
                    style={{ width: "100%", background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}
                  >
                    📷 Scan Delivery QR
                  </button>
                )}

                {/* Seller: mark shipped */}
                {isSeller && order.paymentStatus === "paid" && order.orderStatus === "processing" && (
                  <button
                    onClick={() => handleStatusUpdate("shipped")}
                    disabled={statusLoading}
                    style={{ width: "100%", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}
                  >
                    {statusLoading ? "Updating..." : "Mark as Shipped 🚚"}
                  </button>
                )}

                {/* Seller: mark delivered */}
                {isSeller && order.paymentStatus === "paid" && order.orderStatus === "shipped" && (
                  <button
                    onClick={() => handleStatusUpdate("delivered")}
                    disabled={statusLoading}
                    style={{ width: "100%", background: "#1a9e5a", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}
                  >
                    {statusLoading ? "Updating..." : "Mark as Delivered ✓"}
                  </button>
                )}

                <button
                  onClick={() => navigate("/dashboard/orders")}
                  style={{ width: "100%", background: "#f0ece4", color: "#555", border: "none", borderRadius: 8, padding: "12px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                >
                  Back to Orders
                </button>

                {/* Chat with the other party */}
                {isWinner && sellerId && (
                  <button
                    onClick={() => navigate(`/my-chats?receiverId=${sellerId}`)}
                    style={{ width: "100%", background: "none", border: "1px solid #1A1814", color: "#1A1814", borderRadius: 8, padding: "11px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 8 }}
                  >
                    💬 Chat with Seller
                  </button>
                )}
                {isSeller && winnerId && (
                  <button
                    onClick={() => navigate(`/my-chats?receiverId=${winnerId}`)}
                    style={{ width: "100%", background: "none", border: "1px solid #1A1814", color: "#1A1814", borderRadius: 8, padding: "11px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 8 }}
                  >
                    💬 Chat with Buyer
                  </button>
                )}
              </div>

              <div style={{ background: "#f7f6f3", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>🛡️</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Escrow Secured</p>
                  <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Funds held safely until delivery confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
