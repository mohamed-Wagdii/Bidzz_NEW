import { useState } from "react";

const MOCK_IMAGES = [
  { id: 1, tag: "FEATURED", src: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=80", type: "image" },
  { id: 2, tag: null, src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80", type: "image" },
  { id: 3, tag: null, src: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=300&q=80", type: "image" },
  { id: 4, tag: "VIDEO TOUR", src: null, type: "video" },
  { id: 5, tag: null, src: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=300&q=80", type: "image" },
];

export default function MediaUploader({ onNext, onBack }) {
  const [images] = useState(MOCK_IMAGES);

  return (
    <div style={styles.wrapper}>
      {/* Drop Zone */}
      <div style={styles.dropZone}>
        <div style={styles.cloudIcon}>
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 16.2A5 5 0 0018 7h-1.26A8 8 0 104 15.25" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={styles.dropText}>Drag and drop assets</p>
        <p style={styles.dropSub}>or click to browse from your device</p>
      </div>

      {/* Media Preview */}
      <div style={styles.previewSection}>
        <div style={styles.previewHeader}>
          <h3 style={styles.previewTitle}>Media Preview</h3>
          <span style={styles.slots}>5 of 20 slots used</span>
        </div>
        <div style={styles.grid}>
          {images.map((img) => (
            <div key={img.id} style={styles.thumb}>
              {img.type === "video" ? (
                <div style={styles.videoThumb}>
                  <div style={styles.videoTag}>VIDEO TOUR</div>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#222"/>
                    <polygon points="10,8 17,12 10,16" fill="#b8962e"/>
                  </svg>
                </div>
              ) : (
                <>
                  <img src={img.src} alt="" style={styles.thumbImg} />
                  {img.tag && img.tag !== "VIDEO TOUR" && (
                    <span style={styles.featuredTag}>{img.tag}</span>
                  )}
                </>
              )}
            </div>
          ))}
          <button style={styles.addMore}>
            <span style={styles.plus}>+</span>
            <span style={styles.addLabel}>ADD MORE</span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Details</button>
        <button style={styles.nextBtn} onClick={onNext}>Save & Continue →</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { flex: 1, fontFamily: "'Montserrat', sans-serif" },
  dropZone: {
    border: "2px dashed #d4c9a8",
    borderRadius: "14px",
    padding: "52px 20px",
    textAlign: "center",
    background: "#fafaf7",
    marginBottom: "32px",
    cursor: "pointer",
  },
  cloudIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#fff8e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    border: "2px solid #e8d98a",
  },
  dropText: { fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px", fontFamily: "'Cormorant Garamond', Georgia, serif" },
  dropSub: { fontSize: "0.75rem", color: "#999", margin: 0 },
  previewSection: { marginBottom: "32px" },
  previewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  previewTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", fontFamily: "'Cormorant Garamond', Georgia, serif", margin: 0 },
  slots: { fontSize: "0.72rem", color: "#999", letterSpacing: "0.04em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  thumb: { borderRadius: "10px", overflow: "hidden", position: "relative", aspectRatio: "4/3", background: "#eee" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  featuredTag: {
    position: "absolute", top: "10px", left: "10px",
    background: "#b8962e", color: "#fff",
    fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
    padding: "3px 8px", borderRadius: "4px",
  },
  videoThumb: {
    background: "#111", width: "100%", height: "100%",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
    position: "relative",
  },
  videoTag: {
    position: "absolute", top: "10px", right: "10px",
    background: "#0e0e0e", color: "#fff", border: "1px solid #333",
    fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em",
    padding: "3px 8px", borderRadius: "4px",
  },
  addMore: {
    border: "2px dashed #d4c9a8", borderRadius: "10px", background: "transparent",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "6px", cursor: "pointer", aspectRatio: "4/3",
  },
  plus: { fontSize: "1.5rem", color: "#b8962e" },
  addLabel: { fontSize: "0.62rem", color: "#999", letterSpacing: "0.1em", fontWeight: 700 },
  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" },
  backBtn: {
    padding: "13px 24px", border: "1.5px solid #ccc", borderRadius: "8px",
    background: "#fff", color: "#555", fontSize: "0.8rem", cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
  },
  nextBtn: {
    padding: "13px 28px", background: "#b8962e", border: "none", borderRadius: "8px",
    color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
};