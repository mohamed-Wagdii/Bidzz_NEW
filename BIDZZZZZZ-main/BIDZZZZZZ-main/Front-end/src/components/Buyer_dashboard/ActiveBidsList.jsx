import React from "react";
import { useNavigate } from "react-router-dom";

const BidStatusBadge = ({ status }) => {
  const map = {
    winning: { label: "● WINNING", bg: "#1a3a2e", color: "#4caf50" },
    outbid:  { label: "OUTBID",    bg: "#3a1a1a", color: "#e63946" },
    pending: { label: "PENDING",   bg: "#2a2a2a", color: "#aaa" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: 0.5 }}>
      {s.label}
    </span>
  );
};

const BidRow = ({ bid, onClick, styles }) => (
  <div style={styles.bidRow} onClick={onClick}>
    <img src={bid.image} alt={bid.title} style={styles.bidThumb} />
    <div style={styles.bidInfo}>
      <p style={styles.bidTitle}>{bid.title}</p>
      <p style={styles.bidMeta}>Lot #{bid.lotNumber} • Closes in {bid.closesIn}</p>
    </div>
    <div style={styles.bidRight}>
      <span style={styles.bidAmount}>${bid.currentBid?.toLocaleString()}</span>
      <BidStatusBadge status={bid.status} />
    </div>
  </div>
);

export default function ActiveBidsList({ bids = [], loading = false, onViewAll, styles = {} }) {
  const navigate = useNavigate();
  return (
    <section style={styles.bidsSection}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Current Active Bids</h2>
        <button style={styles.viewAllBtn} onClick={onViewAll}>VIEW ALL</button>
      </div>

      {loading
        ? [1, 2, 3].map((i) => <div key={i} style={styles.bidRowSkeleton} />)
        : bids.map((bid) => (
            <BidRow
              key={bid.id}
              bid={bid}
              onClick={() => navigate(`/auctions/${bid.auctionId}`)}
              styles={styles}
            />
          ))
      }
    </section>
  );
}
