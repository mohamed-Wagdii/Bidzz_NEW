import { useState } from "react";

const DURATIONS = [
  { days: 3, label: "STANDARD" },
  { days: 7, label: "RECOMMENDED" },
  { days: 14, label: "EXTENDED" },
];

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#b8962e" strokeWidth="1.8" fill="none"/>
        <path d="M9 12l2 2 4-4" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Verified Bidders",
    desc: "Access only to authenticated high-value bidders.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#b8962e" strokeWidth="1.8" fill="none"/>
        <circle cx="12" cy="12" r="2" stroke="#b8962e" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Escrow Protection",
    desc: "Secure transaction management for both parties.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 7 22 7 22 13" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Asset Valuation",
    desc: "Professional listing review and pricing guidance.",
  },
];

export default function AuctionDurationSelector({ selectedDays, onDaysChange }) {
  const [sliderValue, setSliderValue] = useState(selectedDays || 7);

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    onDaysChange(val);
  };

  const handlePreset = (days) => {
    setSliderValue(days);
    onDaysChange(days);
  };

  const activeDays = selectedDays || sliderValue;

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Select Auction Duration</h2>

      {/* Preset Buttons */}
      <div style={styles.presetRow}>
        {DURATIONS.map(({ days, label }) => (
          <button
            key={days}
            onClick={() => handlePreset(days)}
            style={{
              ...styles.presetBtn,
              ...(activeDays === days ? styles.presetBtnActive : {}),
            }}
          >
            <span style={styles.presetDays}>{days} Days</span>
            <span style={styles.presetLabel}>{label}</span>
          </button>
        ))}
      </div>

      {/* Custom Slider */}
      <div style={styles.sliderSection}>
        <div style={styles.sliderHeader}>
          <span style={styles.sliderTitle}>Custom Duration</span>
          <span style={styles.sliderValue}>{activeDays} Days</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={activeDays}
          onChange={handleSlider}
          style={styles.slider}
        />
        <div style={styles.sliderLimits}>
          <span>1 DAY</span>
          <span>30 DAYS MAX</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={styles.featuresRow}>
        {FEATURES.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <p style={styles.featureTitle}>{f.title}</p>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        input[type='range'] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(
            to right,
            #b8962e 0%,
            #b8962e ${((activeDays - 1) / 29) * 100}%,
            #e0ddd5 ${((activeDays - 1) / 29) * 100}%,
            #e0ddd5 100%
          );
          outline: none;
          cursor: pointer;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #b8962e;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #b8962e;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #b8962e;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #b8962e;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "36px 32px 28px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
    flex: 1,
    minWidth: 0,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "28px",
    letterSpacing: "-0.01em",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  presetRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "28px",
  },
  presetBtn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "18px 10px",
    borderRadius: "10px",
    border: "1.5px solid #e0ddd5",
    background: "#fafaf8",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  presetBtnActive: {
    border: "2px solid #b8962e",
    background: "#fffdf5",
  },
  presetDays: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#1a1a2e",
    display: "block",
    marginBottom: "4px",
  },
  presetLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "#888",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
  },
  sliderSection: {
    marginBottom: "32px",
  },
  sliderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  sliderTitle: {
    fontSize: "0.95rem",
    color: "#555",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
  },
  sliderValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#b8962e",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  slider: {
    width: "100%",
    marginBottom: "8px",
  },
  sliderLimits: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.65rem",
    color: "#aaa",
    letterSpacing: "0.08em",
    fontFamily: "'Montserrat', sans-serif",
    marginTop: "6px",
  },
  featuresRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  featureCard: {
    flex: 1,
    background: "#fafaf8",
    borderRadius: "10px",
    padding: "18px 12px",
    textAlign: "center",
    border: "1px solid #f0ede6",
  },
  featureIcon: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "6px",
    fontFamily: "'Montserrat', sans-serif",
  },
  featureDesc: {
    fontSize: "0.72rem",
    color: "#888",
    lineHeight: 1.5,
    fontFamily: "'Montserrat', sans-serif",
    margin: 0,
  },
};