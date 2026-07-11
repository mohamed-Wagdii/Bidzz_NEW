import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ordersAPI, walletAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/shared/DashboardLayout";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    Promise.all([
      ordersAPI.getById(id),
      walletAPI.get(),
    ])
      .then(([orderData, walletData]) => {
        setOrder(orderData.order);
        setWallet(walletData.wallet);
        if (orderData.order?.paymentStatus === "paid" && orderData.order?.qrCode) {
          setQrCode(orderData.order.qrCode);
        }
      })
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayNow = async () => {
    setPaying(true);
    setError("");
    try {
      const data = await ordersAPI.payWithWallet(id);
      setQrCode(data.qrCode);
      setOrder(prev => ({ ...prev, paymentStatus: "paid", orderStatus: "processing" }));
      setWallet(prev => prev ? { ...prev, balance: prev.balance - order.finalPrice } : prev);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  const product = order?.auction?.Product;
  const image = product?.image?.[0];
  const uid = user?._id || user?.id || "";
  const winnerId = order?.winner?._id?.toString() || order?.winner?.toString() || "";
  const isWinner = uid === winnerId;
  const hasEnoughBalance = wallet && order ? wallet.balance >= order.finalPrice : false;

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate(`/orders/${id}`)} style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 13, cursor: "pointer", padding: 0, fontWeight: 600 }}>
          ← Back to Order
        </button>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "8px 0 4px" }}>Complete Payment</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Pay securely from your BidZone wallet.</p>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", marginBottom: 20 }}>{error}</div>
      )}

      {loading ? (
        <div style={{ height: 200, background: "#f0ece4", borderRadius: 12 }} />
      ) : !order ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#999" }}>Order not found.</div>
      ) : !isWinner ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#e05252" }}>You are not authorized to pay for this order.</div>
      ) : qrCode ? (
        /* ── QR Code shown after payment ── */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede8df", padding: "32px", textAlign: "center", maxWidth: 420, width: "100%" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#1a9e5a", margin: "0 0 8px" }}>Payment Successful!</h2>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 24px" }}>Show this QR code to the seller to confirm delivery and release funds.</p>
            <img src={qrCode} alt="Delivery QR" style={{ width: 240, height: 240, borderRadius: 12, border: "1px solid #e5e7eb", padding: 8, marginBottom: 16 }} />
            <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 20px" }}>Order #{order._id?.slice(-8).toUpperCase()}</p>
            <button
              onClick={() => navigate(`/orders/${id}`)}
              style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              View Order Details
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Left: Order info */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden" }}>
            {image && <img src={image} alt={product?.name} style={{ width: "100%", height: 240, objectFit: "cover" }} />}
            <div style={{ padding: "24px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{product?.name}</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: "0 0 20px" }}>{product?.description}</p>
              <div style={{ display: "flex", gap: 32 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#aaa", letterSpacing: 1, margin: "0 0 4px" }}>SELLER</p>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{order.seller?.fullName}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#aaa", letterSpacing: 1, margin: "0 0 4px" }}>ORDER ID</p>
                  <p style={{ fontSize: 13, fontFamily: "monospace", margin: 0 }}>#{order._id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Wallet balance */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "20px 24px" }}>
              <p style={{ fontSize: 11, color: "#aaa", letterSpacing: 1, margin: "0 0 6px" }}>YOUR WALLET BALANCE</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: hasEnoughBalance ? "#1a9e5a" : "#e05252", margin: 0 }}>
                ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "0.00"}
              </p>
              {!hasEnoughBalance && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: "#e05252", margin: "0 0 8px" }}>Insufficient balance. Please top up your wallet.</p>
                  <button
                    onClick={() => navigate("/wallet")}
                    style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    Top Up Wallet →
                  </button>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "24px" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Payment Summary</h3>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: "#888" }}>Winning Bid</span>
                <span style={{ fontWeight: 600 }}>${order.finalPrice?.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 14 }}>
                <span style={{ color: "#888" }}>Payment Method</span>
                <span style={{ fontWeight: 600 }}>🏦 Wallet</span>
              </div>

              <div style={{ borderTop: "1px solid #f0ece4", paddingTop: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>Total Due</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#C9A84C" }}>
                    ${order.finalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={paying || !hasEnoughBalance}
                style={{
                  width: "100%", background: paying || !hasEnoughBalance ? "#aaa" : "#1A1814", color: "#fff",
                  border: "none", borderRadius: 8, padding: "14px", fontWeight: 700,
                  fontSize: 15, cursor: paying || !hasEnoughBalance ? "not-allowed" : "pointer", marginBottom: 10,
                }}
              >
                {paying ? "Processing..." : "Pay with Wallet"}
              </button>

              <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 4 }}>
                Funds are held in escrow until delivery is confirmed.
              </p>
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
      )}
    </DashboardLayout>
  );
}
