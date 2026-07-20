export default function BasicInfoForm({ formData, onUpdate, onNext }) {
  const { title = "", description = "" } = formData || {};

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Basic Information</h2>
      <p style={styles.sub}>Provide the essential details that will define your auction listing's prestige.</p>

      <label style={styles.label}>LISTING TITLE</label>
      <input
        value={title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="e.g. 1963 Rolex Daytona Cosmograph 'Paul Newman'"
        style={styles.input}
      />

      <label style={styles.label}>DETAILED DESCRIPTION</label>
      <textarea
        value={description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Describe the provenance, condition, and unique features of this asset..."
        style={styles.textarea}
        rows={6}
      />

      <div style={styles.actions}>
        <button style={styles.draftBtn}>SAVE AS DRAFT</button>
        <button style={styles.nextBtn} onClick={onNext}>
          NEXT: UPLOAD MEDIA &nbsp;→
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1.5px solid #e8e2d4",
    borderRadius: "16px",
    padding: "40px 36px",
    fontFamily: "'Montserrat', sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0e0e0e",
    marginBottom: "8px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  sub: { fontSize: "0.8rem", color: "#888", marginBottom: "32px", lineHeight: 1.6 },
  label: {
    display: "block",
    fontSize: "0.62rem",
    letterSpacing: "0.12em",
    color: "#888",
    fontWeight: 700,
    marginBottom: "10px",
    marginTop: "24px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #e5e0d5",
    borderRadius: "8px",
    background: "#fafaf7",
    fontSize: "0.88rem",
    color: "#222",
    fontFamily: "'Montserrat', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #e5e0d5",
    borderRadius: "8px",
    background: "#fafaf7",
    fontSize: "0.85rem",
    color: "#222",
    fontFamily: "'Montserrat', sans-serif",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "32px",
  },
  draftBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  nextBtn: {
    background: "#b8962e",
    border: "none",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
};
