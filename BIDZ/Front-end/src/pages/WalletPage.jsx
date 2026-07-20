import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/shared/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { walletAPI } from "../services/api";

const TX_LABELS = {
  deposit:        { label: "Deposit",         color: "var(--success)", sign: "+" },
  withdraw:       { label: "Withdrawal",       color: "var(--danger)",  sign: "-" },
  bid_lock:       { label: "Bid Locked",       color: "var(--warning)", sign: "-" },
  bid_unlock:     { label: "Bid Unlocked",     color: "var(--success)", sign: "+" },
  order_charge:   { label: "Order Payment",    color: "var(--danger)",  sign: "-" },
  escrow_hold:    { label: "Escrow Hold",      color: "var(--warning)", sign: "-" },
  escrow_release: { label: "Escrow Released",  color: "var(--success)", sign: "+" },
  adjustment:     { label: "Adjustment",       color: "var(--info)",    sign: "+" },
};

export default function WalletPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [wallet, setWallet]           = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmt, setDepositAmt]   = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const load = useCallback(async () => {
    try {
      const [walletData, txData] = await Promise.all([
        walletAPI.get(),
        walletAPI.getTransactions(),
      ]);
      setWallet(walletData.wallet);
      setTransactions(txData.transactions || []);
    } catch {
      setWallet({ balance: 0, lockedBalance: 0, escrowBalance: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const notify = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3500);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = Number(depositAmt);
    if (!amt || amt <= 0) return notify("Enter a valid amount.", true);
    setActionLoading(true);
    try {
      await walletAPI.deposit(amt);
      setDepositAmt("");
      notify(`$${amt.toFixed(2)} added to your wallet.`);
      await load();
    } catch (err) {
      notify(err.response?.data?.message || "Deposit failed.", true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmt);
    if (!amt || amt <= 0) return notify("Enter a valid amount.", true);
    setActionLoading(true);
    try {
      await walletAPI.withdraw(amt);
      setWithdrawAmt("");
      notify(`$${amt.toFixed(2)} withdrawn successfully.`);
      await load();
    } catch (err) {
      notify(err.response?.data?.message || "Withdrawal failed.", true);
    } finally {
      setActionLoading(false);
    }
  };

  const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
            Wallet
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>
            Manage your balance, locked bids, and escrow funds.
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard/orders")}>
          View Orders
        </button>
      </div>

      {/* Alerts */}
      {error   && <div style={{ padding: "11px 16px", background: "var(--danger-bg)",  border: "1px solid var(--danger)",  borderRadius: "var(--r-md)", fontSize: 13, color: "var(--danger)",  marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "11px 16px", background: "var(--success-bg)", border: "1px solid var(--success)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--success)", marginBottom: 16 }}>{success}</div>}

      {/* Balance cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Available Balance", value: fmt(wallet?.balance),        icon: "💳", variant: "gold"    },
          { label: "Locked (Bids)",     value: fmt(wallet?.lockedBalance),  icon: "🔒", variant: "dark"    },
          { label: "Escrow",            value: fmt(wallet?.escrowBalance),  icon: "🏦", variant: "default" },
        ].map(({ label, value, icon, variant }) => {
          const isDark = variant === "dark";
          const isGold = variant === "gold";
          return (
            <div key={label} className={`stat-card ${isDark ? "dark" : isGold ? "gold" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: isDark || isGold ? "rgba(255,255,255,0.55)" : "var(--ink-40)" }}>
                  {label}
                </span>
                <span style={{ fontSize: 20 }}>{icon}</span>
              </div>
              {loading
                ? <div className="skeleton" style={{ height: 32, width: "60%" }} />
                : <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: isDark || isGold ? "#fff" : "var(--ink)" }}>{value}</div>
              }
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Deposit */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div className="section-title" style={{ marginBottom: 4 }}>Deposit Funds</div>
          <div className="section-subtitle" style={{ marginBottom: 16 }}>Add money to your wallet</div>
          <form onSubmit={handleDeposit}>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-40)", fontWeight: 600 }}>$</span>
              <input
                type="number" min="1" step="0.01"
                placeholder="0.00"
                value={depositAmt}
                onChange={e => setDepositAmt(e.target.value)}
                className="input"
                style={{ paddingLeft: 28 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[10, 50, 100, 500].map(v => (
                <button key={v} type="button" className="btn btn-ghost btn-sm" onClick={() => setDepositAmt(String(v))}>
                  ${v}
                </button>
              ))}
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: "100%" }} disabled={actionLoading || !depositAmt}>
              {actionLoading ? "Processing..." : "Add Balance"}
            </button>
          </form>
        </div>

        {/* Withdraw */}
        <div className="card" style={{ padding: "20px 22px" }}>
          <div className="section-title" style={{ marginBottom: 4 }}>Withdraw Funds</div>
          <div className="section-subtitle" style={{ marginBottom: 16 }}>
            Available: {loading ? "..." : fmt(wallet?.balance)}
          </div>
          <form onSubmit={handleWithdraw}>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-40)", fontWeight: 600 }}>$</span>
              <input
                type="number" min="1" step="0.01"
                placeholder="0.00"
                value={withdrawAmt}
                onChange={e => setWithdrawAmt(e.target.value)}
                className="input"
                style={{ paddingLeft: 28 }}
              />
            </div>
            <button
              type="button" className="btn btn-ghost btn-sm"
              style={{ marginBottom: 12 }}
              onClick={() => setWithdrawAmt(String(wallet?.balance || 0))}
            >
              Withdraw All
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={actionLoading || !withdrawAmt}>
              {actionLoading ? "Processing..." : "Withdraw"}
            </button>
          </form>
        </div>
      </div>

      {/* Transactions */}
      <div className="card" style={{ padding: "20px 22px" }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">Transaction History</div>
          <div className="section-subtitle">{transactions.length} transactions</div>
        </div>

        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => {
                const meta = TX_LABELS[tx.type] || { label: tx.type, color: "var(--ink-40)", sign: "" };
                return (
                  <tr key={tx._id}>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--ink-60)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tx.description}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--ink-40)" }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: meta.color, fontFamily: "var(--font-display)" }}>
                      {meta.sign}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
