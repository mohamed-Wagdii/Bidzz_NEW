import React from "react";

const AuctionBadge = ({ label, type, styles }) => {
  const colors = {
    live:    { background: "rgba(0,0,0,0.75)", color: "#fff" },
    ending:  { background: "#e63946", color: "#fff" },
    default: { background: "#444", color: "#fff" },
  };
  return (
    <span style={{ ...styles.badge, ...(colors[type] ?? colors.default) }}>
      {type === "live" && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50", display: "inline-block", marginRight: 5 }} />
      )}
      {label}
    </span>
  );
};

const WatchlistButton = ({ isWatchlisted, onToggle, styles }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }}
    style={{ ...styles.watchlistBtn, color: isWatchlisted ? "#e8b94f" : "#ccc" }}
  >
    ♥
  </button>
);

const AuctionCardPricing = ({ currentBid, startingBid, timeLeft, endsIn, isWinning, isEndingSoon, styles }) => (
  <div style={styles.pricingRow}>
    <div>
      <p style={styles.priceLabel}>
        {isWinning ? "YOU ARE WINNING" : startingBid ? "STARTING BID" : "CURRENT BID"}
      </p>
      <p style={{ ...styles.priceValue, color: "#e8b94f" }}>
        ${(currentBid || startingBid || 0).toLocaleString()}
      </p>
    </div>
    {(timeLeft || endsIn) && (
      <div style={{ textAlign: "right" }}>
        <p style={styles.priceLabel}>{timeLeft ? "TIME LEFT" : "ENDS IN"}</p>
        <p style={{ ...styles.timeValue, color: isEndingSoon ? "#e63946" : "#111" }}>
          {timeLeft || endsIn}
        </p>
      </div>
    )}
  </div>
);

const AuctionCard = ({ auction, onBid, onWatchlist, styles }) => {
  if (!auction) return null;
  const {
    id, title, category, image,
    badgeLabel, badgeType, bidsCount,
    isWatchlisted, isEndingSoon, ctaLabel,
    currentBid, startingBid, timeLeft, endsIn, isWinning,
  } = auction;

  return (
    <div style={{ ...styles.card, ...(isEndingSoon ? { border: "1px solid #e63946" } : {}) }}>
      <div style={styles.cardImageWrapper}>
        <img src={image} alt={title} style={styles.cardImage} />
        {badgeLabel && <AuctionBadge label={badgeLabel} type={badgeType} styles={styles} />}
        {bidsCount !== undefined && (
          <span style={styles.bidsCount}>{bidsCount} BIDS</span>
        )}
        <WatchlistButton isWatchlisted={isWatchlisted} onToggle={() => onWatchlist(id)} styles={styles} />
      </div>

      <div style={styles.cardBody}>
        <span style={styles.cardCategory}>{category?.toUpperCase()}</span>
        <h3 style={styles.cardTitle}>{title}</h3>

        <AuctionCardPricing
          currentBid={currentBid} startingBid={startingBid}
          timeLeft={timeLeft} endsIn={endsIn}
          isWinning={isWinning} isEndingSoon={isEndingSoon} styles={styles}
        />

        <button
          style={{ ...styles.bidBtn, ...(isEndingSoon ? { background: "#1a1a2e" } : {}) }}
          onClick={() => onBid(auction)}
        >
          {ctaLabel || "Bid Now"}
        </button>
      </div>
    </div>
  );
};

const EmptySlot = ({ styles }) => (
  <div style={{ ...styles.card, border: "2px dashed #ddd", background: "#fafafa", minHeight: 340, justifyContent: "center", alignItems: "center" }}>
    <div style={{ textAlign: "center", padding: 32 }}>
      <span style={{ fontSize: 32, display: "block", marginBottom: 12, opacity: 0.3 }}>🔨</span>
      <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6 }}>
        New auctions being vetted daily.<br />Check back soon.
      </p>
    </div>
  </div>
);

const SkeletonCard = ({ styles }) => (
  <div style={{ ...styles.card, minHeight: 340 }}>
    <div style={{ height: 200, background: "#eee" }} />
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ height: 14, background: "#eee", borderRadius: 4, width: "80%" }} />
      <div style={{ height: 14, background: "#eee", borderRadius: 4, width: "60%" }} />
      <div style={{ height: 14, background: "#eee", borderRadius: 4, width: "40%", marginTop: 8 }} />
    </div>
  </div>
);

const SortControl = ({ value, onChange, styles }) => (
  <div style={styles.sortWrapper}>
    <span style={{ fontSize: 13, color: "#888" }}>⚙</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.sortSelect}
    >
      {["Ending Soon", "Newest", "Price: Low to High", "Price: High to Low", "Most Bids"].map((o) => (
        <option key={o} value={o}>Sort by: {o}</option>
      ))}
    </select>
  </div>
);

export default function AuctionGrid({ auctions = [], loading = false, sortBy, onSortChange, onBid, onWatchlist, styles = {} }) {
  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h1 style={styles.pageTitle}>Live Auctions</h1>
          <p style={styles.pageSubtitle}>Curated selection of world-class assets currently taking bids.</p>
        </div>
        <SortControl value={sortBy} onChange={onSortChange} styles={styles} />
      </div>

      <div style={styles.grid}>
        {loading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} styles={styles} />)
          : auctions.map((a) => (
              <AuctionCard key={a.id} auction={a} onBid={onBid} onWatchlist={onWatchlist} styles={styles} />
            ))
        }
        {!loading && auctions.length % 2 !== 0 && <EmptySlot styles={styles} />}
      </div>
    </main>
  );
}
