import React from "react";
import { useNavigate } from "react-router-dom";

const RecommendedBadge = ({ badge, styles }) => {
  if (!badge) return null;
  const isLive = badge.toLowerCase().includes("live");
  return (
    <span style={{ ...styles.recBadge, color: isLive ? "#4caf50" : "#e8b94f" }}>
      {badge.toUpperCase()}
    </span>
  );
};

const RecommendedCard = ({ item, onClick, styles }) => (
  <div style={styles.recCard} onClick={onClick}>
    <img src={item.image} alt={item.title} style={styles.recImage} />
    <div style={styles.recBody}>
      <RecommendedBadge badge={item.badge} styles={styles} />
      <h4 style={styles.recTitle}>{item.title}</h4>
      <div style={styles.recPricing}>
        <div>
          <p style={styles.recPriceLabel}>{item.currentBid ? "Current Bid" : "Starting At"}</p>
          <p style={styles.recPrice}>${(item.currentBid || item.startingAt || 0).toLocaleString()}</p>
        </div>
        <button
          style={styles.recBidBtn}
          onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        >
          🔨
        </button>
      </div>
    </div>
  </div>
);

export default function RecommendedPanel({ items = [], loading = false, styles = {} }) {
  const navigate = useNavigate();
  return (
    <aside style={styles.recPanel}>
      <h2 style={styles.sectionTitle}>Recommended</h2>
      {loading
        ? [1, 2].map((i) => <div key={i} style={styles.recSkeleton} />)
        : items.map((item) => (
            <RecommendedCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/auctions/${item.id}`)}
              styles={styles}
            />
          ))
      }
    </aside>
  );
}
