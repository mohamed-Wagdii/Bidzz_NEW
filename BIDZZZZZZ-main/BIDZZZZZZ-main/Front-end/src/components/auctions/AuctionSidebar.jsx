import React from "react";

const FilterCheckbox = ({ label, checked, onChange, styles }) => (
  <label style={styles.checkboxLabel}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ accentColor: "#e8b94f", width: 15, height: 15 }}
    />
    <span style={{ fontSize: 14, color: "#333" }}>{label}</span>
  </label>
);

const PriceRangeSlider = ({ min, max, value, onChange, styles }) => (
  <div style={{ width: "100%" }}>
    <input
      type="range" min={min} max={max} step={10000} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "#e8b94f" }}
    />
    <div style={styles.sliderLabels}>
      <span>${(min / 1000).toFixed(0)}k</span>
      <span>${(max / 1000000).toFixed(0)}M+</span>
    </div>
  </div>
);

const EndingSoonTabs = ({ active, onChange, styles }) => {
  const ENDING_TABS = ["All Listings", "Ends Today", "Ends in 24h", "Recently Added"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {ENDING_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{ ...styles.tabBtn, ...(active === tab ? styles.tabBtnActive : {}) }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const SidebarUserProfile = ({ user, styles }) => {
  if (!user) return null;
  return (
    <div style={styles.sidebarUser}>
      <img src={user.avatar} alt={user.name} style={styles.sidebarAvatar} />
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "#111" }}>{user.name}</p>
        <p style={{ fontSize: 10, letterSpacing: 1.5, color: "#999", margin: 0 }}>{user.role?.toUpperCase()}</p>
      </div>
    </div>
  );
};

export default function AuctionSidebar({ categories = [], filters = {}, onFilterChange = () => {}, user, onNewListing, styles = {} }) {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.filtersTitle}>Filters</h2>

      <div style={styles.filterGroup}>
        <span style={styles.filterLabel}>CATEGORY</span>
        {categories.map((cat) => (
          <FilterCheckbox
            key={cat.id}
            label={cat.label}
            checked={filters.categories?.includes(cat.id) ?? false}
            onChange={(checked) => onFilterChange("categories", cat.id, checked)}
            styles={styles}
          />
        ))}
      </div>

      <div style={styles.filterGroup}>
        <span style={styles.filterLabel}>PRICE RANGE</span>
        <PriceRangeSlider
          min={10000} max={5000000}
          value={filters.priceMax ?? 5000000}
          onChange={(val) => onFilterChange("priceMax", val)}
          styles={styles}
        />
      </div>

      <div style={styles.filterGroup}>
        <span style={styles.filterLabel}>ENDING SOON</span>
        <EndingSoonTabs
          active={filters.endingSoon ?? "All Listings"}
          onChange={(val) => onFilterChange("endingSoon", val)}
          styles={styles}
        />
      </div>

      <div style={{ marginTop: "auto", paddingTop: 32 }}>
        <SidebarUserProfile user={user} styles={styles} />
        <button style={styles.newListingBtn} onClick={onNewListing}>+ New Listing</button>
      </div>
    </aside>
  );
}
