const STEPS = [
  { num: 1, label: "BASIC INFO" },
  { num: 2, label: "MEDIA" },
  { num: 3, label: "PRICING" },
  { num: 4, label: "REVIEW" },
];

export default function StepProgress({ currentStep }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.track}>
        {STEPS.map((step, i) => {
          const isDone = step.num < currentStep;
          const isActive = step.num === currentStep;
          return (
            <div key={step.num} style={styles.stepGroup}>
              <div style={styles.stepItem}>
                <div
                  style={{
                    ...styles.circle,
                    ...(isDone ? styles.circleDone : {}),
                    ...(isActive ? styles.circleActive : {}),
                  }}
                >
                  {isDone ? (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="#0e0e0e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{step.num}</span>
                  )}
                </div>
                <span
                  style={{
                    ...styles.label,
                    ...(isActive ? styles.labelActive : {}),
                    ...(isDone ? styles.labelDone : {}),
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ ...styles.line, ...(isDone ? styles.lineDone : {}) }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "28px 0 8px",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Montserrat', sans-serif",
  },
  track: {
    display: "flex",
    alignItems: "center",
    gap: "0",
  },
  stepGroup: {
    display: "flex",
    alignItems: "center",
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  circle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "2px solid #333",
    background: "#1a1a1a",
    color: "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
  },
  circleDone: {
    background: "#b8962e",
    border: "2px solid #b8962e",
    color: "#0e0e0e",
  },
  circleActive: {
    background: "#0e0e0e",
    border: "2px solid #b8962e",
    color: "#b8962e",
  },
  label: {
    fontSize: "0.6rem",
    letterSpacing: "0.1em",
    color: "#444",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  labelActive: {
    color: "#b8962e",
  },
  labelDone: {
    color: "#7a6520",
  },
  line: {
    width: "80px",
    height: "2px",
    background: "#222",
    margin: "0 8px",
    marginBottom: "22px",
    transition: "background 0.3s",
  },
  lineDone: {
    background: "#b8962e",
  },
};