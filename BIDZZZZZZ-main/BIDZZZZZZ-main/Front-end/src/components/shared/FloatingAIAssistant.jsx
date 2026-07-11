import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => { setOpen(true); setMinimized(false); }} style={{ position: "fixed", right: 24, bottom: 24, width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg, #111827, #2563eb)", border: "none", color: "white", boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)", cursor: "pointer", zIndex: 1500, animation: "float 2.8s ease-in-out infinite" }}>
        🤖
      </button>

      {open && (
        <div style={{ position: "fixed", right: 24, bottom: 96, width: 340, maxWidth: "calc(100vw - 24px)", background: "white", borderRadius: 20, boxShadow: "0 18px 50px rgba(0,0,0,0.16)", overflow: "hidden", zIndex: 1600 }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #111827, #1f2937)" }}>
            <div>
              <p style={{ color: "white", fontWeight: 700, margin: 0 }}>BidZone AI</p>
              <p style={{ color: "#cbd5e1", fontSize: 12, margin: 0 }}>Your auction guide</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setMinimized(!minimized)} style={{ border: "none", background: "rgba(255,255,255,0.12)", color: "white", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}>—</button>
              <button onClick={() => setOpen(false)} style={{ border: "none", background: "rgba(255,255,255,0.12)", color: "white", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}>✕</button>
            </div>
          </div>
          {!minimized && (
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Ask about auctions, winning bids, delivery, or wallet balance.</p>
              <button onClick={() => navigate("/ai-chat")} style={{ background: "#111827", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", cursor: "pointer" }}>Open full assistant</button>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
    </>
  );
}
