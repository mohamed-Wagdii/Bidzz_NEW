import { useState } from "react";
import { reportsAPI } from "../../services/api";

const REASONS = [
  { value: "spam",             label: "Spam" },
  { value: "fraud",            label: "Fraud" },
  { value: "fake_product",     label: "Fake Product" },
  { value: "abusive_language", label: "Abusive Language" },
  { value: "scam",             label: "Scam" },
  { value: "other",            label: "Other" },
];

/**
 * ReportModal
 * @param {string} targetType - "seller"|"buyer"|"auction"|"message"|"order"|"product"
 * @param {string} targetId
 * @param {function} onClose
 */
export default function ReportModal({ targetType, targetId, onClose }) {
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await reportsAPI.submit({ targetType, targetId, reason, description });
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal} className="fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
            Submit Report
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-40)", fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--success)" }}>Report submitted!</div>
            <div style={{ fontSize: 13, color: "var(--ink-40)", marginTop: 4 }}>Our team will review it shortly.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Reporting</label>
              <div style={{ padding: "8px 12px", background: "var(--surface-3)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--ink-60)", textTransform: "capitalize" }}>
                {targetType}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)} className="input" style={{ fontSize: 13 }}>
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description <span style={{ color: "var(--ink-20)" }}>(optional)</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide additional details..."
                maxLength={1000}
                className="input"
                style={{ resize: "vertical", minHeight: 90, fontSize: 13 }}
              />
              <div style={{ fontSize: 11, color: "var(--ink-20)", textAlign: "right", marginTop: 4 }}>{description.length}/1000</div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--danger)", marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-danger" style={{ flex: 1 }} disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 16,
};
const modal = {
  background: "var(--surface)", borderRadius: "var(--r-xl)",
  padding: "24px 28px", width: "100%", maxWidth: 440,
  boxShadow: "var(--shadow-xl)",
};
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600,
  letterSpacing: "0.06em", textTransform: "uppercase",
  color: "var(--ink-40)", marginBottom: 6,
};
