import { useState } from "react";

export default function AddProductForm({ onDiscard, onPublish }) {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImg(URL.createObjectURL(file));
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Create New Listing</h1>
        <p style={styles.sub}>Provide the essential details for your premium auction item.</p>
      </div>

      {/* Product Image */}
      <div style={styles.section}>
        <label style={styles.label}>PRODUCT IMAGE</label>
        <div
          style={{
            ...styles.dropZone,
            ...(dragOver ? styles.dropZoneActive : {}),
            ...(previewImg ? { padding: 0, border: "none" } : {}),
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          {previewImg ? (
            <img src={previewImg} alt="preview" style={styles.previewImg} />
          ) : (
            <>
              <div style={styles.cameraIcon}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#ccc" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="4" stroke="#ccc" strokeWidth="1.5"/>
                  <path d="M18 8h.01" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={styles.dropText}>Click to upload or drag and drop</p>
              <p style={styles.dropSub}>PNG, JPG or WebP (max. 10MB)</p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Starting Reserve Price */}
      <div style={styles.section}>
        <label style={styles.label}>STARTING RESERVE PRICE</label>
        <div style={styles.priceWrap}>
          <span style={styles.currency}>$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            style={styles.priceInput}
          />
        </div>
      </div>

      {/* Item Description */}
      <div style={styles.section}>
        <label style={styles.label}>ITEM DESCRIPTION</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the heritage, condition, and unique features of your item..."
          rows={7}
          style={styles.textarea}
        />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.discardBtn} onClick={onDiscard}>Discard</button>
        <button style={styles.publishBtn} onClick={onPublish}>Publish Auction</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    flex: 1,
    padding: "48px 80px 60px 60px",
    fontFamily: "'Montserrat', sans-serif",
    maxWidth: "720px",
  },
  header: { marginBottom: "36px" },
  heading: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#0e0e0e",
    margin: "0 0 10px",
  },
  sub: { fontSize: "0.82rem", color: "#888", margin: 0, lineHeight: 1.6 },

  section: { marginBottom: "28px" },
  label: {
    display: "block",
    fontSize: "0.6rem",
    letterSpacing: "0.14em",
    color: "#888",
    fontWeight: 700,
    marginBottom: "10px",
  },

  // Drop zone
  dropZone: {
    border: "1.5px dashed #d4cfc5",
    borderRadius: "12px",
    background: "#fafaf8",
    padding: "60px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    overflow: "hidden",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneActive: {
    borderColor: "#b8962e",
    background: "#fffdf5",
  },
  cameraIcon: { marginBottom: "14px" },
  dropText: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#555",
    margin: "0 0 6px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  dropSub: { fontSize: "0.7rem", color: "#bbb", margin: 0 },
  previewImg: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "10px",
    display: "block",
  },

  // Price
  priceWrap: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e5e0d5",
    borderRadius: "10px",
    background: "#fff",
    overflow: "hidden",
  },
  currency: {
    padding: "0 16px",
    fontSize: "1.1rem",
    color: "#ccc",
    fontWeight: 600,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    borderRight: "1px solid #f0ece3",
  },
  priceInput: {
    flex: 1,
    padding: "16px 18px",
    border: "none",
    background: "transparent",
    fontSize: "1.2rem",
    color: "#bbb",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 600,
    outline: "none",
  },

  // Textarea
  textarea: {
    width: "100%",
    padding: "16px 18px",
    border: "1.5px solid #e5e0d5",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "0.85rem",
    color: "#444",
    fontFamily: "'Montserrat', sans-serif",
    lineHeight: 1.7,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },

  // Actions
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px",
    marginTop: "8px",
  },
  discardBtn: {
    padding: "13px 28px",
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  publishBtn: {
    padding: "13px 32px",
    background: "#0e0e1e",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: "0.02em",
  },
};