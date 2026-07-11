import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { chatAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";
import { io } from "socket.io-client";

// ── singleton socket ──────────────────────────────────────────────────────────
let _socket = null;
function getSocket() {
  if (!_socket) _socket = io(window.location.origin, { transports: ["websocket"] });
  return _socket;
}

function timeAgo(d) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString();
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

// ── ConversationRow ───────────────────────────────────────────────────────────
function ConversationRow({ conv, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px", cursor: "pointer",
        background: isActive ? "rgba(201,168,76,0.10)" : "transparent",
        borderLeft: isActive ? "3px solid #C9A84C" : "3px solid transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f7f6f3"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
        background: isActive ? "#C9A84C" : "#e8e2d0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 16, color: isActive ? "#fff" : "#888",
        overflow: "hidden",
      }}>
        {conv.auctionImage
          ? <img src={conv.auctionImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : initials(conv.otherUser?.fullName)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: conv.unreadCount > 0 ? 700 : 600, color: "#1A1814", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
            {conv.otherUser?.fullName || "Unknown"}
          </span>
          <span style={{ fontSize: 11, color: "#aaa", flexShrink: 0, marginLeft: 4 }}>
            {timeAgo(conv.lastMessageTime)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 155 }}>
            {conv.lastMessage || "No messages yet"}
          </span>
          {conv.unreadCount > 0 && (
            <span style={{ background: "#e05252", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", marginLeft: 4, flexShrink: 0 }}>
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
        {conv.auctionName && (
          <div style={{ fontSize: 11, color: "#C9A84C", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            🏛 {conv.auctionName}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MessageBubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }) {
  return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div style={{
        maxWidth: "62%", padding: "10px 14px", fontSize: 14, lineHeight: 1.55,
        background: isMine ? "#1A1814" : "#fff",
        color: isMine ? "#fff" : "#1A1814",
        borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        border: isMine ? "none" : "1px solid #ede8df",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        wordBreak: "break-word",
      }}>
        <div>{msg.message}</div>
        <div style={{ fontSize: 10, color: isMine ? "#888" : "#bbb", marginTop: 4, textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
          {timeAgo(msg.createdAt)}
          {isMine && <span style={{ fontSize: 11 }}>{msg.isRead ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
}

// ── ChatPage ──────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const myId = user?._id || user?.id || "";

  const [conversations, setConversations] = useState([]);
  const [convLoading, setConvLoading]     = useState(true);
  const [selected, setSelected]           = useState(null); // full conversation object
  const [messages, setMessages]           = useState([]);
  const [msgLoading, setMsgLoading]       = useState(false);
  const [text, setText]                   = useState("");
  const [sending, setSending]             = useState(false);
  const [typingUsers, setTypingUsers]     = useState({}); // { conversationId: bool }
  const [autoOpening, setAutoOpening]     = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const typingTimer = useRef(null);

  // ── load conversations ──────────────────────────────────────────────────────
  const loadConversations = useCallback(() => {
    if (!myId) return;
    chatAPI.getConversations()
      .then(data => setConversations(Array.isArray(data) ? data : []))
      .catch(() => setConversations([]))
      .finally(() => setConvLoading(false));
  }, [myId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // ── auto-open from URL params (?receiverId=...&auctionId=...) ───────────────
  useEffect(() => {
    const receiverId = searchParams.get("receiverId");
    const auctionId  = searchParams.get("auctionId");
    const convId     = searchParams.get("conversationId");

    if (autoOpening) return;

    // Direct conversationId
    if (convId && conversations.length > 0) {
      const match = conversations.find(c => c._id?.toString() === convId);
      if (match) { openConversation(match); return; }
    }

    // Find or create by receiverId
    if (receiverId && myId) {
      setAutoOpening(true);
      chatAPI.findOrCreateConversation(receiverId, auctionId || undefined)
        .then(({ conversation }) => {
          loadConversations();
          openConversation({
            _id: conversation._id,
            otherUser: conversation.participants?.find(p => p._id?.toString() !== myId),
            auctionId: conversation.auctionId?._id || null,
            auctionName: conversation.auctionId?.Product?.name || null,
            auctionImage: conversation.auctionId?.Product?.image?.[0] || null,
            unreadCount: 0,
          });
        })
        .catch(() => {})
        .finally(() => setAutoOpening(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, myId]);

  // ── open a conversation ─────────────────────────────────────────────────────
  const openConversation = (conv) => {
    setSelected(conv);
    setSearchParams({ conversationId: conv._id });
    setMsgLoading(true);
    setMessages([]);
    chatAPI.getMessages(conv._id)
      .then(data => {
        setMessages(data.messages || []);
        // Reset unread locally
        setConversations(prev =>
          prev.map(c => c._id?.toString() === conv._id?.toString() ? { ...c, unreadCount: 0 } : c)
        );
      })
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false));
  };

  // ── scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── socket.io ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!myId) return;
    const socket = getSocket();
    socket.emit("join", myId);

    // New message
    const onMessage = ({ message: msg, conversationId }) => {
      const sId = msg.senderId?._id?.toString() || msg.senderId?.toString();
      if (sId !== myId && msg.receiverId?.toString() !== myId) return;

      setSelected(cur => {
        if (cur && cur._id?.toString() === conversationId?.toString()) {
          setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
          // Mark as read immediately since window is open
          chatAPI.getMessages(cur._id).catch(() => {});
        } else {
          // Increment unread for other conversation
          setConversations(prev =>
            prev.map(c =>
              c._id?.toString() === conversationId?.toString()
                ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: msg.message, lastMessageTime: msg.createdAt }
                : c
            )
          );
        }
        return cur;
      });
    };

    // Conversation updated (new message from other side)
    const onConvUpdated = ({ conversationId, lastMessage, unreadCount }) => {
      setConversations(prev =>
        prev.map(c =>
          c._id?.toString() === conversationId?.toString()
            ? { ...c, lastMessage, unreadCount }
            : c
        )
      );
    };

    // New conversation started
    const onNewConv = () => { loadConversations(); };

    // Typing
    const onTyping = ({ conversationId, isTyping }) => {
      setTypingUsers(prev => ({ ...prev, [conversationId]: isTyping }));
    };

    // Read receipts
    const onRead = ({ conversationId }) => {
      setMessages(prev =>
        prev.map(m =>
          m.conversationId?.toString() === conversationId?.toString() ? { ...m, isRead: true } : m
        )
      );
    };

    socket.on("receive_message",    onMessage);
    socket.on("conversation_updated", onConvUpdated);
    socket.on("new_conversation",   onNewConv);
    socket.on("typing",             onTyping);
    socket.on("messages_read",      onRead);

    return () => {
      socket.off("receive_message",    onMessage);
      socket.off("conversation_updated", onConvUpdated);
      socket.off("new_conversation",   onNewConv);
      socket.off("typing",             onTyping);
      socket.off("messages_read",      onRead);
    };
  }, [myId, loadConversations]);

  // ── send message ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const content = text.trim();
    if (!content || !selected || sending) return;
    setText("");
    setSending(true);
    try {
      const data = await chatAPI.sendMessage(selected._id, content, selected.otherUser?._id, selected.auctionId);
      setMessages(prev => prev.some(m => m._id === data.message._id) ? prev : [...prev, data.message]);
      setConversations(prev =>
        prev.map(c => c._id?.toString() === selected._id?.toString()
          ? { ...c, lastMessage: content, lastMessageTime: new Date() }
          : c
        )
      );
    } catch {
      setText(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // ── typing indicator ────────────────────────────────────────────────────────
  const handleTyping = (e) => {
    setText(e.target.value);
    if (!selected) return;
    chatAPI.sendTyping(selected._id, true).catch(() => {});
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      chatAPI.sendTyping(selected._id, false).catch(() => {});
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e0ddd5; border-radius: 4px; }
        textarea:focus { outline: none !important; }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>
          Messages
          {totalUnread > 0 && (
            <span style={{ marginLeft: 10, background: "#e05252", color: "#fff", fontSize: 13, fontWeight: 700, borderRadius: 20, padding: "2px 10px" }}>
              {totalUnread}
            </span>
          )}
        </h1>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Your private conversations.</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "300px 1fr",
        height: "calc(100vh - 220px)", minHeight: 480,
        background: "#fff", borderRadius: 14,
        border: "1px solid #ede8df", overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}>

        {/* ── Left: conversation list ── */}
        <div style={{ borderRight: "1px solid #ede8df", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f5f3ef" }}>
            <div style={{ background: "#f7f6f3", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, color: "#aaa" }}>🔍</span>
              <span style={{ fontSize: 13, color: "#bbb" }}>Search conversations…</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {convLoading ? (
              [1, 2, 3].map(i => <div key={i} style={{ height: 72, background: "#f5f3ef", margin: "8px 12px", borderRadius: 10 }} />)
            ) : conversations.length === 0 ? (
              <div style={{ padding: "3rem 16px", textAlign: "center", color: "#aaa" }}>
                <p style={{ fontSize: 36, marginBottom: 8 }}>💬</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#888", marginBottom: 6 }}>No conversations yet</p>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>Place a bid to start chatting with the seller.</p>
                <button onClick={() => navigate("/auctions")} style={{ marginTop: 14, background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Browse Auctions
                </button>
              </div>
            ) : (
              conversations.map(conv => (
                <ConversationRow
                  key={conv._id}
                  conv={conv}
                  isActive={selected?._id?.toString() === conv._id?.toString()}
                  onClick={() => openConversation(conv)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: message thread ── */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {!selected ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
              {autoOpening ? (
                <><div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div><p style={{ fontSize: 14 }}>Opening conversation…</p></>
              ) : (
                <><div style={{ fontSize: 56, marginBottom: 14 }}>💬</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#aaa", margin: "0 0 8px" }}>Select a conversation</h3>
                <p style={{ fontSize: 13 }}>Choose a chat on the left to view messages.</p></>
              )}
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "14px 22px", borderBottom: "1px solid #ede8df", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, background: "#fafaf7" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "#f0e8cc", border: "2px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#C9A84C", fontSize: 13, overflow: "hidden" }}>
                  {selected.auctionImage
                    ? <img src={selected.auctionImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : initials(selected.otherUser?.fullName)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1814" }}>{selected.otherUser?.fullName || "Unknown"}</div>
                  {selected.auctionName && <div style={{ fontSize: 12, color: "#C9A84C" }}>🏛 {selected.auctionName}</div>}
                  {typingUsers[selected._id] && <div style={{ fontSize: 11, color: "#1a9e5a", fontStyle: "italic" }}>typing…</div>}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f7f6f3" }}>
                {msgLoading ? (
                  <div style={{ textAlign: "center", color: "#aaa", paddingTop: "3rem" }}>Loading messages…</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#aaa", paddingTop: "3rem" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                    <p style={{ fontSize: 14 }}>No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const sId = msg.senderId?._id?.toString() || msg.senderId?.toString();
                    return <MessageBubble key={msg._id || i} msg={msg} isMine={sId === myId} />;
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "12px 20px", background: "#fff", borderTop: "1px solid #ede8df", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  style={{ flex: 1, border: "1.5px solid #e8e0d0", borderRadius: 10, padding: "11px 14px", fontSize: 14, resize: "none", background: "#faf8f4", lineHeight: 1.5, maxHeight: 100, overflow: "auto", transition: "border-color 0.15s" }}
                  onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={e => (e.target.style.borderColor = "#e8e0d0")}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  style={{ width: 44, height: 44, borderRadius: 10, border: "none", flexShrink: 0, background: text.trim() && !sending ? "#1A1814" : "#e0ddd5", color: "#fff", fontSize: 18, cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                >
                  {sending ? "⏳" : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
