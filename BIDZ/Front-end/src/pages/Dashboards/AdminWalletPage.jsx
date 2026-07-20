import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

const TYPE_BADGE = {
  bid_lock:       "badge-info",
  bid_unlock:     "badge-success",
  escrow_hold:    "badge-gold",
  order_charge:   "badge-gold",
  escrow_release: "badge-success",
};

const TYPE_LABELS = {
  bid_lock:       "Bid Locked",
  bid_unlock:     "Bid Unlocked",
  escrow_hold:    "Escrow Held",
  order_charge:   "Order Charge",
  escrow_release: "Escrow Released",
};

export default function AdminWalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal]               = useState(0);
  const [systemEscrow, setSystemEscrow] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);

  const load = (p = 1) => {
    setLoading(true);
    adminAPI.getFinances({ page: p, limit: 15 })
      .then(d => { 
        setTransactions(d.transactions); 
        setTotal(d.total); 
        setSystemEscrow(d.systemEscrowTotal);
        setTotalPending(d.totalPending);
        setTotalCompleted(d.totalCompleted);
        setPage(d.page); 
        setPages(d.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Platform Finances & Escrow
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>
            {total} total financial transactions
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "linear-gradient(135deg, #111, #222)", padding: 24, borderRadius: 12, color: "#fff" }}>
          <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Total System Escrow</p>
          <h2 style={{ fontSize: 32, margin: 0, fontFamily: "var(--font-display)", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24, color: "#aaa" }}>$</span>
            {systemEscrow.toLocaleString()}
          </h2>
          <p style={{ fontSize: 12, color: "#777", margin: "8px 0 0" }}>Funds currently in admin wallet.</p>
        </div>

        <div style={{ background: "linear-gradient(135deg, #2a1f0f, #3b2b14)", padding: 24, borderRadius: 12, color: "#fff" }}>
          <p style={{ fontSize: 13, color: "#e3bc64", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Total Pending Escrow</p>
          <h2 style={{ fontSize: 32, margin: 0, fontFamily: "var(--font-display)", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24, color: "#e3bc64" }}>$</span>
            {totalPending.toLocaleString()}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "8px 0 0" }}>Funds held securely for pending deliveries.</p>
        </div>

        <div style={{ background: "linear-gradient(135deg, #0f2a1b, #143b25)", padding: 24, borderRadius: 12, color: "#fff" }}>
          <p style={{ fontSize: 13, color: "#64e397", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Total Completed</p>
          <h2 style={{ fontSize: 32, margin: 0, fontFamily: "var(--font-display)", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24, color: "#64e397" }}>$</span>
            {totalCompleted.toLocaleString()}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "8px 0 0" }}>Funds successfully released to sellers.</p>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-40)" }}>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-40)" }}>No financial transactions found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Related Item</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontSize: 13, color: "var(--ink-60)" }}>
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.user?.fullName || "Unknown"}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-40)" }}>{t.user?.email || ""}</div>
                    </td>
                    <td>
                      <span className={`badge ${TYPE_BADGE[t.type] || "badge-info"}`}>
                        {TYPE_LABELS[t.type] || t.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>
                      ${t.amount?.toLocaleString()}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {t.relatedAuction && (
                        <div>
                          <span style={{ color: "var(--ink-40)", fontSize: 11, textTransform: "uppercase", marginRight: 4 }}>Auction:</span>
                          {t.relatedAuction.Product?.name || t.relatedAuction._id.toString().slice(-8)}
                        </div>
                      )}
                      {t.relatedOrder && (
                        <div style={{ marginTop: 4 }}>
                          <span style={{ color: "var(--ink-40)", fontSize: 11, textTransform: "uppercase", marginRight: 4 }}>Order:</span>
                          #{t.relatedOrder._id.toString().slice(-8)}
                          <span style={{ marginLeft: 6, fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#f0f0f0", color: "#666" }}>
                            {t.relatedOrder.orderStatus}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${t.status === "completed" ? "badge-success" : "badge-info"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>
              Page {page} of {pages}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => load(page - 1)} disabled={page === 1}
                style={{ padding: "6px 12px", border: "1px solid var(--border)", background: "#fff", borderRadius: 6, fontSize: 13, cursor: page === 1 ? "not-allowed" : "pointer" }}
              >
                Prev
              </button>
              <button 
                onClick={() => load(page + 1)} disabled={page === pages}
                style={{ padding: "6px 12px", border: "1px solid var(--border)", background: "#fff", borderRadius: 6, fontSize: 13, cursor: page === pages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
