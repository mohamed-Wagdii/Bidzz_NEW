import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

const STATUS_BADGE = {
  active:  "badge-success",
  ended:   "badge-neutral",
  pending: "badge-warning",
};

export default function AdminAuctionsPage() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState("");
  const [page, setPage]         = useState(1);
  const [confirm, setConfirm]   = useState(null); // { type: "end"|"delete", auction }

  const load = (p = 1) => {
    setLoading(true);
    adminAPI.getAuctions({ status, page: p, limit: 15 })
      .then(d => { setAuctions(d.auctions); setTotal(d.total); setPage(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [status]); // eslint-disable-line

  const handleEnd = async (id) => {
    await adminAPI.endAuction(id).catch(() => {});
    setConfirm(null);
    load(page);
  };

  const handleDelete = async (id) => {
    await adminAPI.deleteAuction(id).catch(() => {});
    setConfirm(null);
    load(page);
  };

  const pages = Math.ceil(total / 15);

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Auctions Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>{total} total auctions</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)", cursor: "pointer" }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: "20px 22px" }}>
        {loading ? (
          [1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 10 }} />)
        ) : auctions.length === 0 ? (
          <div className="empty-state"><p>No auctions found</p></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Seller</th>
                <th>Current Price</th>
                <th>Bids</th>
                <th>Ends</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map(a => (
                <tr key={a._id} style={{ cursor: "pointer" }} onClick={() => navigate(`/auctions/${a._id}`)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--surface-3)", flexShrink: 0, overflow: "hidden" }}>
                        {a.Product?.image?.[0] && <img src={a.Product.image[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{a.Product?.name ?? "—"}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{a.seller?.fullName ?? "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--gold-dark)", fontFamily: "var(--font-display)" }}>
                    ${(a.currentPrice ?? a.startingPrice)?.toLocaleString()}
                  </td>
                  <td style={{ fontSize: 13 }}>{a.bidCount ?? 0}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{new Date(a.endTime).toLocaleDateString()}</td>
                  <td><span className={`badge ${STATUS_BADGE[a.status] || "badge-neutral"}`}>{a.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {a.status === "active" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setConfirm({ type: "end", auction: a })}>
                          End
                        </button>
                      )}
                      <button
                        className="btn btn-sm"
                        style={{ background: "var(--danger)", color: "#fff", border: "none" }}
                        onClick={() => setConfirm({ type: "delete", auction: a })}
                      >
                        Delete
                      </button>
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

      {/* Confirm Modal */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "28px 32px", maxWidth: 400, width: "90%", boxShadow: "var(--shadow-lg)" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--ink)", fontSize: 16, fontWeight: 700 }}>
              {confirm.type === "delete" ? "Delete Auction" : "End Auction"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-40)", margin: "0 0 20px" }}>
              {confirm.type === "delete"
                ? `Permanently delete "${confirm.auction.Product?.name}"?`
                : `Force end "${confirm.auction.Product?.name}"?`}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className="btn btn-sm"
                style={{ background: confirm.type === "delete" ? "var(--danger)" : "var(--warning)", color: "#fff", border: "none" }}
                onClick={() => confirm.type === "delete" ? handleDelete(confirm.auction._id) : handleEnd(confirm.auction._id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
