import { useState } from "react";

const ITEMS = [
  {
    id: 1,
    status: "LIVE",
    badge: "WINNING",
    badgeColor: "#fff",
    badgeBg: "#2a2a2a",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    title: "Legacy Series: Crimson Runner",
    ref: "#882193-A",
    tag: "Collector Item",
    timeLabel: "ENDS IN",
    time: "04:12:09",
    bidLabel: "CURRENT BID",
    bid: "$12,450.00",
    countLabel: "TOTAL BIDS",
    count: 28,
    actions: ["Details", "Quick Bid"],
    primaryAction: "Quick Bid",
  },
  {
    id: 2,
    status: "LIVE",
    badge: "OUTBID",
    badgeColor: "#fff",
    badgeBg: "#c0392b",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    title: "Zenith Minimalist Watch v4",
    ref: "#W-ZEN-44",
    tag: "1 of 50",
    timeLabel: "ENDS IN",
    time: "18:44:21",
    bidLabel: "CURRENT BID",
    bid: "$3,800.00",
    countLabel: "TOTAL BIDS",
    count: 14,
    actions: ["Details", "Increase Bid"],
    primaryAction: "Increase Bid",
    primaryDark: true,
  },
  {
    id: 3,
    status: "SCHEDULED",
    statusDot: false,
    badge: null,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    title: "Acoustic Pro Studio Headphones",
    ref: "#H-PR-909",
    tag: "Studio Grade",
    timeLabel: "STARTS IN",
    time: "1d 04h",
    bidLabel: "STARTING BID",
    bid: "$850.00",
    countLabel: "STATUS",
    count: "Ready",
    actions: ["Notify Me at Launch"],
    primaryAction: null,
    notifyOnly: true,
  },
  {
    id: 4,
    status: "LIVE",
    badge: "WINNING",
    badgeColor: "#fff",
    badgeBg: "#2a2a2a",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    title: "Heritage Biker Jacket (M)",
    ref: "#CL-HRT-22",
    tag: "Genuine Calfskin",
    timeLabel: "ENDS IN",
    time: "00:58:12",
    bidLabel: "CURRENT BID",
    bid: "$2,150.00",
    countLabel: "TOTAL BIDS",
    count: 19,
    actions: ["Details", "Quick Bid"],
    primaryAction: "Quick Bid",
  },
];

function CountdownTimer({ time }) {
  return <span style={styles.timerVal}>{time}</span>;
}

function WatchlistCard({ item }) {
  return (
    <div style={styles.card}>
      {/* Image */}
      <div style={styles.imgWrap}>
        <img src={item.image} alt={item.title} style={styles.img} />
        {/* Status dot */}
        <div style={styles.statusBadge}>
          {item.status === "LIVE" && <span style={styles.dot} />}
          <span style={styles.statusText}>{item.status}</span>
        </div>
        {/* Badge */}
        {item.badge && (
          <span style={{ ...styles.badge, background: item.badgeBg, color: item.badgeColor }}>
            {item.badge}
          </span>
        )}
        {/* Hide icon */}
        <button style={styles.hideBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.topRow}>
          <div>
            <h3 style={styles.title}>{item.title}</h3>
            <p style={styles.ref}>Ref: {item.ref} | {item.tag}</p>
          </div>
          <div style={styles.timeBlock}>
            <span style={styles.timeLabel}>{item.timeLabel}</span>
            <CountdownTimer time={item.time} />
          </div>
        </div>

        <div style={styles.statsRow}>
          <div>
            <span style={styles.statLabel}>{item.bidLabel}</span>
            <span style={styles.bidVal}>{item.bid}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={styles.statLabel}>{item.countLabel}</span>
            <span style={styles.countVal}>{item.count}</span>
          </div>
        </div>

        <div style={styles.btnRow}>
          {item.notifyOnly ? (
            <button style={styles.notifyBtn}>Notify Me at Launch</button>
          ) : (
            <>
              <button style={styles.detailsBtn}>Details</button>
              <button
                style={item.primaryDark ? styles.darkPrimaryBtn : styles.primaryBtn}
              >
                {item.primaryAction}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WatchlistGrid() {
  const [filter, setFilter] = useState("All Items");

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Your Watchlist</h1>
          <p style={styles.sub}>Track your high-value interests and upcoming opportunities.</p>
        </div>
        <div style={styles.filterWrap}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option>All Items</option>
            <option>Live</option>
            <option>Scheduled</option>
            <option>Winning</option>
            <option>Outbid</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {ITEMS.map((item) => (
          <WatchlistCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.paginationInfo}>Showing 4 of 12 tracked items</span>
        <div style={styles.pages}>
          <button style={styles.pageArrow}>‹</button>
          {[1, 2, 3].map((p) => (
            <button key={p} style={{ ...styles.pageBtn, ...(p === 1 ? styles.pageBtnActive : {}) }}>
              {p}
            </button>
          ))}
          <button style={styles.pageArrow}>›</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { flex: 1, padding: "36px 40px", fontFamily: "'Montserrat', sans-serif", minWidth: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  heading: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2.2rem", fontWeight: 700, color: "#0e0e0e", margin: "0 0 6px" },
  sub: { fontSize: "0.8rem", color: "#888", margin: 0 },
  filterWrap: {},
  select: {
    padding: "10px 36px 10px 16px", border: "1.5px solid #e0ddd5",
    borderRadius: "10px", background: "#fff", fontSize: "0.82rem",
    color: "#333", fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
    cursor: "pointer", outline: "none", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" },

  // Card
  card: { background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1.5px solid #ece8df", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  imgWrap: { position: "relative", height: "220px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  statusBadge: {
    position: "absolute", top: "12px", left: "12px",
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
    borderRadius: "20px", padding: "4px 10px",
  },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#27ae60", display: "inline-block" },
  statusText: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" },
  badge: {
    position: "absolute", top: "12px", right: "44px",
    padding: "4px 10px", borderRadius: "6px",
    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
  },
  hideBtn: {
    position: "absolute", bottom: "12px", right: "12px",
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(0,0,0,0.45)", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  body: { padding: "18px 20px 20px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
  title: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#0e0e0e", margin: "0 0 4px" },
  ref: { fontSize: "0.7rem", color: "#aaa", margin: 0 },
  timeBlock: { textAlign: "right", flexShrink: 0 },
  timeLabel: { display: "block", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#aaa", fontWeight: 600, marginBottom: "2px" },
  timerVal: { fontSize: "1rem", fontWeight: 700, color: "#0e0e0e", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  statsRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid #f5f0e8" },
  statLabel: { display: "block", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#aaa", fontWeight: 600, marginBottom: "3px" },
  bidVal: { display: "block", fontSize: "1.25rem", fontWeight: 700, color: "#b8962e", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  countVal: { display: "block", fontSize: "1.1rem", fontWeight: 700, color: "#0e0e0e", fontFamily: "'Cormorant Garamond', Georgia, serif", textAlign: "right" },
  btnRow: { display: "flex", gap: "10px" },
  detailsBtn: {
    flex: 1, padding: "11px", border: "1.5px solid #e0ddd5", borderRadius: "8px",
    background: "#fff", color: "#555", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  primaryBtn: {
    flex: 1, padding: "11px", border: "none", borderRadius: "8px",
    background: "#b8962e", color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  darkPrimaryBtn: {
    flex: 1, padding: "11px", border: "none", borderRadius: "8px",
    background: "#0e0e1e", color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  notifyBtn: {
    width: "100%", padding: "11px", border: "1.5px solid #e0ddd5", borderRadius: "8px",
    background: "#fff", color: "#555", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },

  // Pagination
  pagination: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  paginationInfo: { fontSize: "0.75rem", color: "#aaa" },
  pages: { display: "flex", gap: "6px", alignItems: "center" },
  pageBtn: {
    width: "34px", height: "34px", border: "1.5px solid #e0ddd5", borderRadius: "8px",
    background: "#fff", color: "#555", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif", display: "flex", alignItems: "center", justifyContent: "center",
  },
  pageBtnActive: { background: "#0e0e1e", color: "#fff", border: "1.5px solid #0e0e1e" },
  pageArrow: {
    width: "34px", height: "34px", border: "1.5px solid #e0ddd5", borderRadius: "8px",
    background: "#fff", color: "#888", fontSize: "1rem", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};