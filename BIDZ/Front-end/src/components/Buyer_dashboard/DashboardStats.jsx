import React from "react";

const StatCard = ({ label, value, icon, highlight, styles }) => (
  <div style={{ ...styles.statCard, ...(highlight ? styles.statCardHighlight : {}) }}>
    <div>
      <p style={{ ...styles.statLabel, ...(highlight ? { color: "#aac4ff" } : {}) }}>{label}</p>
      <p style={{ ...styles.statValue, ...(highlight ? { color: "#fff" } : {}) }}>{value ?? "–"}</p>
    </div>
    <span style={styles.statIcon}>{icon}</span>
  </div>
);

export default function DashboardStats({ stats, loading, styles = {} }) {
  if (loading) return (
    <div style={styles.statsRow}>
      {[1, 2, 3].map((i) => <div key={i} style={styles.statSkeleton} />)}
    </div>
  );

  return (
    <div style={styles.statsRow}>
      <StatCard label="ACTIVE BIDS"    value={stats?.activeBids}                                                     icon="🔨" styles={styles} />
      <StatCard label="WALLET BALANCE" value={`$${(stats?.walletBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon="💳" highlight styles={styles} />
      <StatCard label="AUCTIONS WON"   value={stats?.auctionsWon}                                                    icon="🏆" styles={styles} />
    </div>
  );
}
