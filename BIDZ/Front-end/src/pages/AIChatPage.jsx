import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { aiAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";

const SUGGESTIONS = [
  "What auctions are currently active?",
  "How does the bidding process work?",
  "What items are available for auction?",
  "How do I win an auction?",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 16px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#C9A84C",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, alignItems: "flex-end", gap: 8 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#e8c96a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          🤖
        </div>
      )}
      <div style={{
        maxWidth: "70%", padding: "12px 16px", fontSize: 14, lineHeight: 1.6,
        background: isUser ? "#1A1814" : "#fff",
        color: isUser ? "#fff" : "#1A1814",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        border: isUser ? "none" : "1px solid #ede8df",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        {msg.content}
        <div style={{ fontSize: 10, color: isUser ? "rgba(255,255,255,0.5)" : "#bbb", marginTop: 4, textAlign: "right" }}>
          {msg.time}
        </div>
      </div>
      {isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A1814", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#C9A84C", flexShrink: 0 }}>
          {msg.initials}
        </div>
      )}
    </div>
  );
}

export default function AIChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! I'm BidZone AI, your auction assistant. I can help you find auctions, answer questions about items, and guide you through the bidding process. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const initials = user?.fullName?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "U";
  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;
    setInput("");

    const userMsg = { role: "user", content: question, time: now(), initials };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await aiAPI.ask(question);
      setMessages(prev => [...prev, {
        role: "ai",
        content: data.answer,
        time: now(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Sorry, I couldn't process your request right now. Please try again.",
        time: now(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e0ddd5; border-radius: 4px; }
        textarea:focus { outline: none !important; }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
          AI Auction Assistant
        </h1>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
          Ask me anything about auctions, items, or how BidZone works.
        </p>
      </div>

      <div style={{
        display: "flex", flexDirection: "column",
        height: "calc(100vh - 220px)", minHeight: 500,
        background: "#fff", borderRadius: 14,
        border: "1px solid #ede8df",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0ece4", background: "#fafaf7", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#e8c96a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            🤖
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1814", margin: 0 }}>BidZone AI</p>
            <p style={{ fontSize: 12, color: "#1a9e5a", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a9e5a", display: "inline-block" }} />
              Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: "#f7f6f3" }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#e8c96a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", border: "1px solid #ede8df", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (shown when only the welcome message exists) */}
        {messages.length === 1 && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid #f0ece4", background: "#fafaf7", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                style={{
                  background: "#f0ece4", border: "1px solid #e0ddd5", borderRadius: 20,
                  padding: "6px 14px", fontSize: 12, color: "#555", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f0ece4"; e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#e0ddd5"; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "12px 20px", background: "#fff", borderTop: "1px solid #ede8df", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about auctions, items, bidding… (Enter to send)"
            rows={1}
            style={{
              flex: 1, border: "1.5px solid #e8e0d0", borderRadius: 10,
              padding: "11px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              resize: "none", background: "#faf8f4", lineHeight: 1.5,
              maxHeight: 100, overflow: "auto", transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "#C9A84C")}
            onBlur={e => (e.target.style.borderColor = "#e8e0d0")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 10, border: "none", flexShrink: 0,
              background: input.trim() && !loading ? "#C9A84C" : "#e0ddd5",
              color: "#fff", fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
