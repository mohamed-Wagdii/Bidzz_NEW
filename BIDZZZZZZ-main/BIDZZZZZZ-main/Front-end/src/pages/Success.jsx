import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/shared/DashboardLayout";

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // After PayPal redirect, the backend /api/orders/success already captured payment.
    // We just fetch the updated order to show confirmation.
    ordersAPI.getById(id)
      .then(data => setOrder(data.order))
      .catch(() => setError("Failed to load order confirmation."))
      .finally(() => setLoading(false));
  }, [id]);

  const product = order?.auction?.Product;
  const image = product?.image?.[0];

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {loading ? (
        <div style={{ height: 300, background: "#f0ece4", borderRadius: 12 }} />
      ) : error ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#e05252" }}>{error}</div>
      ) : (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Success header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#e8c96a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
              ✓
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#1A1814", margin: "0 0 8px" }}>
              Payment Successful
            </h1>
            <p style={{ fontSize: 14, color: "#888", maxWidth: 400, margin: "0 auto" }}>
              Your acquisition is complete. We are preparing your shipment with the highest level of security.
            </p>
          </div>

          {/* Order card */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede8df", overflow: "hidden", marginBottom: 20 }}>
            {image && <img src={image} alt={product?.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={{ background: "#f7f6f3", borderRadius: 10, padding: "16px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1, margin: "0 0 6px" }}>ORDER ID</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1814", margin: 0 }}>#{order._id?.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1, margin: "14px 0 6px" }}>ESTIMATED ARRIVAL</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1814", margin: 0 }}>5 – 10 business days</p>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>🛡️</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C" }}>FULLY INSURED DELIVERY</span>
                  </div>
                </div>
                <div style={{ border: "1px solid #ede8df", borderRadius: 10, padding: "16px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", margin: "0 0 6px" }}>ITEM</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1814", margin: "0 0 4px", lineHeight: 1.3 }}>{product?.name}</p>
                  {image && <img src={image} alt="" style={{ width: "100%", height: 60, objectFit: "cover", borderRadius: 6, margin: "8px 0" }} />}
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#1A1814", margin: 0 }}>
                    ${order.finalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  onClick={() => navigate("/dashboard/orders")}
                  style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  View Order Dashboard →
                </button>
                <button
                  onClick={() => navigate("/auctions")}
                  style={{ background: "#f0ece4", color: "#555", border: "none", borderRadius: 8, padding: "14px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  Back to Auctions
                </button>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#aaa" }}>
            Need help? <span style={{ color: "#C9A84C", cursor: "pointer", fontWeight: 600 }}>Contact Support</span>
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
