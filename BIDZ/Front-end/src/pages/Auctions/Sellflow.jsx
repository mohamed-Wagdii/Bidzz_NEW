import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { productsAPI, ticketsAPI, auctionsAPI } from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AuctionDurationSelector from "../../components/Tickets/AuctionDurationSelector";
import OrderSummary from "../../components/Tickets/OrderSummary";
import Step4SubmittedPage from "./Step4SubmittedPage";

// ─── Step 0: Ticket Gate ───────────────────────────────────────────────────
function TicketGate({ onConfirmed }) {
  const [selectedDays, setSelectedDays] = useState(7);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    ticketsAPI.getMy()
      .then(data => {
        const now = new Date();
        const valid = (data.tickets || []).find(t => !t.used && new Date(t.expiresAt) > now);
        if (valid) onConfirmed(valid._id);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError("");
    try {
      const data = await ticketsAPI.buy();
      onConfirmed(data.ticket._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase ticket.");
    } finally {
      setPurchasing(false);
    }
  };

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f0" }}>
      <p style={{ color: "#888", fontFamily: "'Montserrat',sans-serif" }}>Checking ticket status...</p>
    </div>
  );

  return (
    <div style={{ background: "#f7f6f2", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Montserrat',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>
        <StepBar current={0} />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2.4rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>
            Purchase Auction Ticket
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
            A ticket is required for each new listing. Valid for 7 days.
          </p>
        </div>
        {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", fontSize: "0.82rem", marginBottom: 20, maxWidth: 700, margin: "0 auto 20px" }}>{error}</div>}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <AuctionDurationSelector selectedDays={selectedDays} onDaysChange={setSelectedDays} />
          <div style={{ minWidth: 300, maxWidth: 380 }}>
            <OrderSummary days={selectedDays} onPurchase={handlePurchase} purchasing={purchasing} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Step 1: Pick Product ──────────────────────────────────────────────────
function PickProduct({ onNext, onBack }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    productsAPI.getMy()
      .then(data => setProducts(data.products || []))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    if (!selected) return setError("Please select a product.");
    onNext(selected);
  };

  return (
    <div style={{ background: "#f7f6f2", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Montserrat',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>
        <StepBar current={1} />
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2rem", fontWeight: 700, color: "#0e0e0e", marginBottom: 8 }}>
          Select Product
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 28, lineHeight: 1.6 }}>
          Choose which product you want to auction. Don't have one yet?{" "}
          <span style={{ color: "#b8962e", cursor: "pointer", fontWeight: 700 }} onClick={() => navigate("/add-product")}>
            Add a product first →
          </span>
        </p>

        {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", fontSize: "0.82rem", marginBottom: 20 }}>{error}</div>}

        {loading ? (
          [1, 2, 3].map(i => <div key={i} style={{ height: 80, background: "#eee", borderRadius: 10, marginBottom: 12 }} />)
        ) : products.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "3rem", textAlign: "center", border: "1.5px dashed #e0ddd5" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#555", marginBottom: 8 }}>No products yet</p>
            <p style={{ fontSize: "0.82rem", color: "#aaa", marginBottom: 20 }}>You need to add a product before creating an auction.</p>
            <button
              onClick={() => navigate("/add-product")}
              style={{ background: "#b8962e", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {products.map(p => (
              <div
                key={p._id}
                onClick={() => { setSelected(p._id); setError(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#fff", borderRadius: 12, padding: "16px 20px",
                  border: selected === p._id ? "2px solid #b8962e" : "1.5px solid #e8e2d4",
                  cursor: "pointer", transition: "all 0.15s",
                  background: selected === p._id ? "#fffdf5" : "#fff",
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 8, background: "#f0ede6", flexShrink: 0, overflow: "hidden" }}>
                  {p.image?.[0] && <img src={p.image[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0e0e0e", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "#888" }}>${p.price?.toLocaleString()} starting price</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: selected === p._id ? "none" : "2px solid #ddd",
                  background: selected === p._id ? "#b8962e" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {selected === p._id && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "1.5px solid #ccc", borderRadius: 8, padding: "13px 24px", color: "#555", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
            ← Back
          </button>
          {products.length > 0 && (
            <button onClick={handleNext} style={{ background: "#b8962e", border: "none", color: "#fff", padding: "13px 28px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Montserrat',sans-serif" }}>
              Continue →
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Step 2: Auction Settings ──────────────────────────────────────────────
function AuctionSettings({ productId, ticketId, onDone, onBack }) {
  const [startBid, setStartBid] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // default endTime = 7 days from now
  useEffect(() => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setEndTime(d.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async () => {
    if (!startBid || parseFloat(startBid) <= 0) return setError("Enter a valid starting bid.");
    if (!endTime) return setError("Select an end time.");
    if (new Date(endTime) <= new Date()) return setError("End time must be in the future.");

    setSubmitting(true);
    setError("");
    try {
      await auctionsAPI.create({
        productId,
        startingPrice: parseFloat(startBid),
        endTime: new Date(endTime).toISOString(),
        ticketId,
      });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#f7f6f2", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Montserrat',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>
        <StepBar current={2} />
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2rem", fontWeight: 700, color: "#0e0e0e", marginBottom: 8 }}>
          Auction Settings
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 32, lineHeight: 1.6 }}>
          Set the starting bid and duration for your auction.
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1.5px solid #e8e2d4", marginBottom: 20 }}>
          {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", fontSize: "0.82rem", marginBottom: 20 }}>{error}</div>}

          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>STARTING BID ($)</label>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e5e0d5", borderRadius: 8, background: "#fafaf7", overflow: "hidden" }}>
              <span style={{ padding: "0 14px", color: "#aaa", fontSize: "1.1rem", fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", borderRight: "1px solid #eee" }}>$</span>
              <input
                type="number"
                value={startBid}
                onChange={e => setStartBid(e.target.value)}
                placeholder="0.00"
                style={{ flex: 1, padding: "13px 14px", border: "none", background: "transparent", fontSize: "1rem", color: "#1a1a1a", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, outline: "none" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>AUCTION END DATE & TIME</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              style={{ width: "100%", padding: "13px 14px", border: "1.5px solid #e5e0d5", borderRadius: 8, background: "#fafaf7", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "'Montserrat',sans-serif" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "1.5px solid #ccc", borderRadius: 8, padding: "13px 24px", color: "#555", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ background: submitting ? "#ccc" : "#b8962e", border: "none", color: "#fff", padding: "13px 28px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'Montserrat',sans-serif" }}
          >
            {submitting ? "Creating..." : "Launch Auction →"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Step Bar ──────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = ["Ticket", "Product", "Settings", "Done"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: i <= current ? "#b8962e" : "#e0ddd5",
            color: i <= current ? "#fff" : "#aaa",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>{i + 1}</div>
          <span style={{ fontSize: 11, color: i <= current ? "#b8962e" : "#aaa", fontWeight: i === current ? 700 : 400, fontFamily: "'Montserrat',sans-serif" }}>{s}</span>
          {i < steps.length - 1 && <span style={{ color: "#ddd", fontSize: 14 }}>›</span>}
        </div>
      ))}
    </div>
  );
}

const lbl = { display: "block", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#888", fontWeight: 700, marginBottom: 10, fontFamily: "'Montserrat',sans-serif" };

// ─── Main SellFlow ─────────────────────────────────────────────────────────
export default function SellFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  // If coming from MyProductsPage with a pre-selected product
  const preselectedProductId = location.state?.productId || null;

  const [step, setStep] = useState(0);
  const [ticketId, setTicketId] = useState(null);
  const [productId, setProductId] = useState(preselectedProductId);

  // If product already selected, skip step 1
  const startStep = preselectedProductId ? 0 : 0;

  if (step === 0) return <TicketGate onConfirmed={id => { setTicketId(id); setStep(preselectedProductId ? 2 : 1); }} />;
  if (step === 1) return <PickProduct onNext={id => { setProductId(id); setStep(2); }} onBack={() => setStep(0)} />;
  if (step === 2) return <AuctionSettings productId={productId} ticketId={ticketId} onDone={() => setStep(3)} onBack={() => setStep(preselectedProductId ? 0 : 1)} />;
  if (step === 3) return <Step4SubmittedPage onDashboard={() => navigate("/seller-dashboard")} onAddAnother={() => { setStep(0); setTicketId(null); setProductId(null); }} />;
}
