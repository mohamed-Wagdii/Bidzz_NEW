import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/shared/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function QRDeliveryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}/delivery`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setOrder(data.order);
        setQrCode(data.qrCode);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Delivery QR</h1>
          <p style={{ color: "#6b7280" }}>Show this QR to confirm delivery and release escrow.</p>
        </div>
        {loading ? <div style={{ padding: 24, background: "white", borderRadius: 20 }}>Loading…</div> : !order ? <div style={{ padding: 24, background: "white", borderRadius: 20 }}>Unable to load delivery data.</div> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <img src={qrCode} alt="Order QR" style={{ width: 280, height: 280, margin: "0 auto 16px", borderRadius: 16, border: "1px solid #e5e7eb", padding: 8 }} />
              <p style={{ color: "#6b7280", marginBottom: 8 }}>Order #{order._id?.slice(-8).toUpperCase()}</p>
              <button onClick={() => navigator.clipboard.writeText(order._id)} style={{ background: "#111827", color: "white", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}>Copy Order ID</button>
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", display: "grid", gap: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Order Summary</h3>
              <div style={{ color: "#6b7280" }}>Item: {order?.auction?.Product?.name || "Auction Item"}</div>
              <div style={{ color: "#6b7280" }}>Buyer: {order?.winner?.fullName || "Buyer"}</div>
              <div style={{ color: "#6b7280" }}>Amount: ${order?.finalPrice}</div>
              <div style={{ color: "#6b7280" }}>Status: {order?.orderStatus}</div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
