import { useState, useEffect } from "react";
import { reportsAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

const STATUS_TABS = ["pending", "resolved", "rejected"];
const ACTIONS = [
  { value: "dismiss",        label: "Dismiss" },
  { value: "warn",           label: "Warn User" },
  { value: "suspend",        label: "Suspend (7d)" },
  { value: "ban",            label: "Ban User" },
  { value: "delete_auction", label: "Delete Auction" },
  { value: "delete_product", label: "Delete Product" },
];

const REASON_LABELS = {
  spam: "Spam", fraud: "Fraud", fake_product: "Fake Product",
  abusive_language: "Abusive Language", scam: "Scam", other: "Other",
};

export default function AdminReportsPage() {
  const [tab, setTab] = useState("pending");
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState("dismiss");
  const [note, setNote] = useState("");
  const [resolving, setResolving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([reportsAPI.getAll({ status: tab }), reportsAPI.getStats()])
      .then(([data, s]) => { setReports(data.reports || []); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [tab]);

  const handleResolve = async () => {
    if (!selected) return;
    setResolving(true);
    try {
      await reportsAPI.resolve(selected._id, { action, adminNote: note, status: action === "dismiss" ? "rejected" : "resolved" });
      setSelected(null);
      setNote("");
      load();
    } catch {
    } finally {
      setResolving(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>Review and act on user-submitted reports.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Pending",  value: stats.pending  ?? 0, color: "var(--warning)" },
            { label: "Resolved", value: stats.resolved ?? 0, color: "var(--success)" },
            { label: "Rejected", value: stats.rejected ?? 0, color: "var(--ink-40)"  },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface-3)", borderRadius: "var(--r-md)", padding: 4, width: "fit-content" }}>
        {STATUS_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 18px", borderRadius: "var(--r-sm)", border: "none",
              background: tab === t ? "var(--surface)" : "transparent",
              color: tab === t ? "var(--ink)" : "var(--ink-40)",
              fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: "pointer",
              boxShadow: tab === t ? "var(--shadow-xs)" : "none",
              transition: "all var(--t-fast)", textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 20 }}>
        {/* Reports list */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 20 }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 10 }} />)}</div>
          ) : reports.length === 0 ? (
            <div className="empty-state"><p>No {tab} reports</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Reporter</th>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  {tab === "pending" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id} style={{ background: selected?._id === r._id ? "var(--gold-bg)" : undefined }}>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--ink)" }}>{r.reporter?.fullName ?? "Unknown"}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{r.reporter?.role}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>{r.targetType}</span>
                    </td>
                    <td>{REASON_LABELS[r.reason] ?? r.reason}</td>
                    <td style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${r.status === "pending" ? "badge-warning" : r.status === "resolved" ? "badge-success" : "badge-neutral"}`}>
                        {r.status}
                      </span>
                    </td>
                    {tab === "pending" && (
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(r)}>Review</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Resolve panel */}
        {selected && (
          <div className="card" style={{ padding: "20px 22px", alignSelf: "flex-start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="section-title">Resolve Report</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 4 }}>REPORTER</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{selected.reporter?.fullName}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 4 }}>TARGET TYPE</div>
              <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>{selected.targetType}</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 4 }}>REASON</div>
              <div style={{ fontSize: 13 }}>{REASON_LABELS[selected.reason]}</div>
            </div>
            {selected.description && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 4 }}>DESCRIPTION</div>
                <div style={{ fontSize: 13, color: "var(--ink-60)", lineHeight: 1.5 }}>{selected.description}</div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 6 }}>ACTION</div>
              <select
                value={action}
                onChange={e => setAction(e.target.value)}
                className="input"
                style={{ fontSize: 13 }}
              >
                {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 6 }}>ADMIN NOTE</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optional note..."
                className="input"
                style={{ resize: "vertical", minHeight: 80, fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleResolve} disabled={resolving}>
                {resolving ? "Saving..." : "Submit"}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
