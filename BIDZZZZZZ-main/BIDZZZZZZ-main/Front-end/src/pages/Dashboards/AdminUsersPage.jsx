import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import DashboardLayout from "../../components/shared/DashboardLayout";

const ROLE_BADGE = {
  buyer:  "badge-info",
  seller: "badge-gold",
  admin:  "badge-success",
};

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [role, setRole]       = useState("");
  const [page, setPage]       = useState(1);
  const [confirm, setConfirm] = useState(null); // { type: "delete"|"lock", user }

  const load = (p = 1) => {
    setLoading(true);
    adminAPI.getUsers({ search, role, page: p, limit: 15 })
      .then(d => { setUsers(d.users); setTotal(d.total); setPage(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [search, role]); // eslint-disable-line

  const handleDelete = async (id) => {
    await adminAPI.deleteUser(id).catch(() => {});
    setConfirm(null);
    load(page);
  };

  const handleLock = async (user) => {
    const isLocked = user.lockUntil && new Date(user.lockUntil) > new Date();
    await adminAPI.updateUser(user._id, { lockUntil: isLocked ? null : new Date("2099-01-01") }).catch(() => {});
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
            Users Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "9px 14px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)", outline: "none" }}
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", color: "var(--ink)", cursor: "pointer" }}
        >
          <option value="">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: "20px 22px" }}>
        {loading ? (
          [1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 10 }} />)
        ) : users.length === 0 ? (
          <div className="empty-state"><p>No users found</p></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isLocked = u.lockUntil && new Date(u.lockUntil) > new Date();
                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gold-bg)", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--gold-dark)", flexShrink: 0 }}>
                          {u.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{u.fullName}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-40)" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${ROLE_BADGE[u.role] || "badge-neutral"}`}>{u.role}</span></td>
                    <td style={{ fontSize: 12, color: "var(--ink-40)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${isLocked ? "badge-danger" : "badge-success"}`}>
                        {isLocked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setConfirm({ type: "lock", user: u })}
                        >
                          {isLocked ? "Unlock" : "Lock"}
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: "var(--danger)", color: "#fff", border: "none" }}
                          onClick={() => setConfirm({ type: "delete", user: u })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
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
              {confirm.type === "delete" ? "Delete User" : confirm.user.lockUntil && new Date(confirm.user.lockUntil) > new Date() ? "Unlock User" : "Lock User"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-40)", margin: "0 0 20px" }}>
              {confirm.type === "delete"
                ? `Are you sure you want to permanently delete "${confirm.user.fullName}"?`
                : `Are you sure you want to ${confirm.user.lockUntil && new Date(confirm.user.lockUntil) > new Date() ? "unlock" : "lock"} "${confirm.user.fullName}"?`}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className="btn btn-sm"
                style={{ background: confirm.type === "delete" ? "var(--danger)" : "var(--warning)", color: "#fff", border: "none" }}
                onClick={() => confirm.type === "delete" ? handleDelete(confirm.user._id) : handleLock(confirm.user)}
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
