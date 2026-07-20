import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

const PAYMENT_BADGE = { paid: "badge-success", pending: "badge-warning", failed: "badge-danger" };
const ORDER_BADGE   = { pending: "badge-warning", shipped: "badge-info", delivered: "badge-success", cancelled: "badge-danger" };

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState("");
  const [page, setPage]       = useState(1);
  const [editing, setEditing] = useState(null); // order being edited

  const load = (p = 1) => {
    setLoading(true);
    adminAPI.getOrders({ status, page: p, limit: 15 })
      .then(d => { setOrders(d.orders); setTotal(d.total); setPage(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [status]); // eslint-disable-line

  const handleUpdate = async (id, data) => {
    await adminAPI.updateOrder(id, data).catch(() => {});
    setEditing(null);
    load(page);
  };

  const pages = Math.ceil(total / 15);

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Orders Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>{total} total orders</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)", cursor: "pointer" }}
        >
          <option value="">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: "20px 22px" }}>
        {loading ? (
          [1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 10 }} />)
        ) : orders.length === 0 ? (
          <div className="empty-state"><p>No orders found</p></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "var(--r-sm)", background: "var(--surface-3)", flexShrink: 0, overflow: "hidden" }}>
                        {o.auction?.Product?.image?.[0] && <img src={o.auction.Product.image[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{o.auction?.Product?.name ?? "—"}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{o.winner?.fullName ?? "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{o.seller?.fullName ?? "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--gold-dark)", fontFamily: "var(--font-display)" }}>
                    ${o.finalPrice?.toLocaleString()}
                  </td>
                  <td><span className={`badge ${PAYMENT_BADGE[o.paymentStatus] || "badge-neutral"}`}>{o.paymentStatus}</span></td>
                  <td><span className={`badge ${ORDER_BADGE[o.orderStatus] || "badge-neutral"}`}>{o.orderStatus}</span></td>
                  <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/orders/${o._id}`)}>View</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(o)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => load(p)}
                className="btn btn-sm"
                style={{ background: p === page ? "var(--gold)" : "var(--surface-3)", color: p === page ? "#fff" : "var(--ink)", border: "none" }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditOrderModal
          order={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => handleUpdate(editing._id, data)}
        />
      )}
    </DashboardLayout>
  );
}

function EditOrderModal({ order, onClose, onSave }) {
  const [orderStatus,   setOrderStatus]   = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "28px 32px", maxWidth: 420, width: "90%", boxShadow: "var(--shadow-lg)" }}>
        <h3 style={{ margin: "0 0 20px", color: "var(--ink)", fontSize: 16, fontWeight: 700 }}>Edit Order</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-40)", display: "block", marginBottom: 6 }}>ORDER STATUS</label>
          <select
            value={orderStatus}
            onChange={e => setOrderStatus(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)" }}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-40)", display: "block", marginBottom: 6 }}>PAYMENT STATUS</label>
          <select
            value={paymentStatus}
            onChange={e => setPaymentStatus(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)" }}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold btn-sm" onClick={() => onSave({ orderStatus, paymentStatus })}>Save</button>
        </div>
      </div>
    </div>
  );
}
