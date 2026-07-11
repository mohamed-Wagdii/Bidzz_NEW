import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { bidsAPI, ordersAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

function getTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function DashboardBids() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = user?._id || user?.id || "";
    Promise.all([bidsAPI.getMy(), ordersAPI.getMy()])
      .then(([bidsData, ordersData]) => {
        const myOrders = ordersData.orders || [];
        setOrders(myOrders);
        const mapped = (bidsData.bids || []).map(b => {
          const auctionStatus = b.auction?.status;
          const highestBiderId = b.auction?.highestBider?._id?.toString() || b.auction?.highestBider?.toString() || "";
          const isHighest = highestBiderId === uid;
          const existingOrder = myOrders.find(o => {
            const oa = o.auction?._id?.toString() || o.auction?.toString();
            return oa === b.auction?._id?.toString();
          });
          return {
            id: b._id,
            auctionId: b.auction?._id,
            title: b.auction?.Product?.name ?? "Auction Item",
            lotNumber: b.auction?._id?.slice(-6).toUpperCase() ?? "------",
            closesIn: b.auction?.endTime ? getTimeLeft(b.auction.endTime) : "—",
            amount: b.amount,
            isHighest,
            image: b.auction?.Product?.image?.[0] ?? null,
            auctionStatus,
            orderId: existingOrder?._id,
            orderStatus: existingOrder?.orderStatus,
            paymentStatus: existingOrder?.paymentStatus,
          };
        });
        setBids(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <DashboardLayout role="buyer">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>My Bids</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>All your active and past bids in one place.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "20px 24px" }}>
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} style={{ height: 70, background: "#f0ece4", borderRadius: 8, marginBottom: 12 }} />)
        ) : bids.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#bbb" }}>
            <p style={{ fontSize: 16, marginBottom: 16 }}>You haven't placed any bids yet.</p>
            <button onClick={() => navigate("/auctions")} style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontWeight: 600 }}>
              Browse Auctions
            </button>
          </div>
        ) : (
          bids.map((bid, i) => {
            let sc;
            if (bid.auctionStatus === "ended") {
              if (bid.isHighest) {
                sc = bid.paymentStatus === "paid"
                  ? { bg: "#e6f9f0", color: "#1a9e5a", label: "Won ✓" }
                  : { bg: "#fff8e1", color: "#b8962e", label: "Won — Pay Now" };
              } else {
                sc = { bg: "#f5f5f5", color: "#888", label: "Ended" };
              }
            } else {
              sc = bid.isHighest
                ? { bg: "#e8f0fe", color: "#1a73e8", label: "Leading" }
                : { bg: "#fff0f0", color: "#e05252", label: "Outbid" };
            }

            return (
              <div
                key={bid.id}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < bids.length - 1 ? "1px solid #f5f3ef" : "none" }}
              >
                {bid.image
                  ? <img src={bid.image} alt={bid.title} style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  : <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f0ece4", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bid.title}</p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Lot #{bid.lotNumber} · {bid.closesIn}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#111", margin: 0 }}>${bid.amount?.toLocaleString()}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  {bid.isHighest && bid.auctionStatus === "ended" && bid.paymentStatus !== "paid" && (
                    <button
                      onClick={() => bid.orderId ? navigate(`/orders/${bid.orderId}/payment`) : navigate(`/auctions/${bid.auctionId}`)}
                      style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, border: "none", background: "#C9A84C", color: "#fff", cursor: "pointer" }}
                    >
                      Pay Now
                    </button>
                  )}
                  {!bid.isHighest || bid.auctionStatus !== "ended" ? (
                    <button
                      onClick={() => navigate(`/auctions/${bid.auctionId}`)}
                      style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, border: "1px solid #e0ddd5", background: "none", color: "#888", cursor: "pointer" }}
                    >
                      View
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
