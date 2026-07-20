import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Auctions", "Categories", "How it Works", "About"];

const CATEGORIES = [
  { label: "Luxury Watches", sub: "Rare timepieces from Patek Philippe & Rolex", span: "col-span-2 row-span-2", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80" },
  { label: "Exotic Cars", span: "col-span-2", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80" },
  { label: "Fine Art", span: "", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80" },
  { label: "Real Estate", span: "", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
];

const AUCTIONS = [
  { title: "1967 Porsche 911 S", price: "$285,000", time: "02:45:11", badge: "Winning", badgeColor: "#E8A838", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80", live: true },
  { title: "Polished Steel Sculpture", price: "$15,200", time: "18:12:00", badge: null, img: "https://images.unsplash.com/photo-1576158113928-4c240eaaf360?w=400&q=80", live: true },
  { title: "Royal Sapphire Pendant", price: "$89,000", time: "00:52:19", badge: "Outbid", badgeColor: "#E05252", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", live: true },
];

const HOW_STEPS = [
  { n: "1", title: "Verified Enrollment", body: "Complete our identity verification process to ensure a secure, elite bidding environment for all participants." },
  { n: "2", title: "Curated Exploration", body: "Browse rare assets inspected and authenticated by our global board of experts across four continents." },
  { n: "3", title: "Secure Acquisition", body: "Place your bid with confidence. Our escrow system and logistics partners handle the rest once you win." },
];

const FEATURES = [
  { icon: "🔒", title: "Encrypted Bidding", body: "Your bid data and personal information are protected by military-grade encryption." },
  { icon: "✅", title: "Auth Guaranteed", body: "Every item carries a tamper-proof certificate of authenticity." },
  { icon: "🚚", title: "Global Shipping", body: "White-glove door-to-door delivery for national and international assets." },
  { icon: "💎", title: "24/7 Concierge", body: "Dedicated account managers for our premium members, around the clock." },
];

function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function HeroTimer() {
  const t = useCountdown(4 * 3600 + 12 * 60 + 9);
  return <span style={{ color: "#E05252", fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, letterSpacing: 2 }}>{t}</span>;
}

function AuctionTimer({ init }) {
  const t = useCountdown(init);
  const urgent = init < 3600;
  return <span style={{ color: urgent ? "#E05252" : "#C9A84C", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>{t}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#F8F5F0", color: "#1A1814", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bz-btn-primary {
          background: #1A1814;
          color: #F8F5F0;
          border: none;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          border-radius: 2px;
        }
        .bz-btn-primary:hover { background: #2D2921; transform: translateY(-1px); }

        .bz-btn-outline {
          background: transparent;
          color: #1A1814;
          border: 1px solid #1A1814;
          padding: 11px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .bz-btn-outline:hover { background: #1A1814; color: #F8F5F0; }

        .bz-btn-gold {
          background: #C9A84C;
          color: #fff;
          border: none;
          padding: 12px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          width: 100%;
          border-radius: 2px;
          transition: background 0.2s;
        }
        .bz-btn-gold:hover { background: #b8943e; }

        .auction-card {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .auction-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }

        .cat-card {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          cursor: pointer;
        }
        .cat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%);
          transition: opacity 0.3s;
        }
        .cat-card:hover::after { opacity: 0.85; }
        .cat-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .cat-card:hover img { transform: scale(1.04); }
        .cat-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 18px 20px;
        }

        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1A1814;
          color: #C9A84C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 500;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feat-card {
          background: #fff;
          padding: 24px;
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .feat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1A1814;
          text-decoration: none;
          letter-spacing: 0.3px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 1; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid #C9A84C40;
          padding: 6px 14px;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .gold-dot { width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; }

        .live-pill {
          background: #E05252;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .divider {
          width: 48px;
          height: 1px;
          background: #C9A84C;
          margin: 16px 0 24px;
        }

        .testimonial-stars { color: #C9A84C; font-size: 20px; letter-spacing: 4px; }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
          .auction-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .cta-btns { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(248,245,240,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s",
        padding: "0 40px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>BID</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: "#C9A84C", letterSpacing: 1 }}>ZONE</span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <a key={l} className="nav-link" onClick={() => navigate(`/${l.toLowerCase().replace(/ /g, "-")}`)} style={{ cursor: "pointer" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} onClick={() => navigate("/login")}>Sign In</button>
          <button className="bz-btn-primary" style={{ padding: "9px 20px", fontSize: 13 }} onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 40px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div>
            <div className="hero-badge">
              <span className="gold-dot" />
              The World's Elite Auction House
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: -1, marginBottom: 20, color: "#1A1814" }}>
              Experience<br />the Thrill of<br />the Auction
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B6560", lineHeight: 1.7, maxWidth: 420, marginBottom: 36 }}>
              Discover and bid on ultra-rare assets from private collections worldwide. From fine art to exotic vehicles, find your next masterpiece.
            </p>
            <div style={{ display: "flex", gap: 14, marginBottom: 48 }}>
              <button className="bz-btn-primary" onClick={() => navigate("/auctions")}>Explore Live Auctions</button>
              <button className="bz-btn-outline" onClick={() => navigate("/register")}>Sell Your Asset</button>
            </div>
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#1A1814" }}>$2.4B+</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9A9490", textTransform: "uppercase", letterSpacing: 1 }}>Total Value</div>
              </div>
              <div style={{ width: 1, background: "#E0DBD4" }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#1A1814" }}>15k+</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9A9490", textTransform: "uppercase", letterSpacing: 1 }}>Winning Bidders</div>
              </div>
            </div>
          </div>

          {/* Right – Featured Watch Card */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              position: "relative",
            }}>
              <img
                src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&q=85"
                alt="Luxury Watch"
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9A9490", marginBottom: 2 }}>CURRENT BID</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700 }}>$428,000</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9A9490", marginBottom: 2 }}>TIME LEFT</div>
                  <HeroTimer />
                </div>
              </div>
            </div>
            {/* Gold accent dot */}
            <div style={{ position: "absolute", top: -16, right: -16, width: 48, height: 48, borderRadius: "50%", background: "#C9A84C", opacity: 0.15 }} />
            <div style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "#C9A84C" }} />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600 }}>Elite Categories</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#9A9490", marginTop: 4 }}>Browse our curated selections of high-value assets.</p>
          </div>
          <a onClick={() => navigate('/categories')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C9A84C", textDecoration: "none", borderBottom: "1px solid #C9A84C", paddingBottom: 2, cursor: 'pointer' }}>View All Categories →</a>
        </div>
        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "220px 180px", gap: 12 }}>
          <div className="cat-card" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <img src={CATEGORIES[0].img} alt={CATEGORIES[0].label} />
            <div className="cat-label">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#fff" }}>{CATEGORIES[0].label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{CATEGORIES[0].sub}</div>
            </div>
          </div>
          {CATEGORIES.slice(1).map(c => (
            <div key={c.label} className="cat-card" style={{ gridColumn: c.label === "Exotic Cars" ? "3 / 5" : "" }}>
              <img src={c.img} alt={c.label} />
              <div className="cat-label">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#fff" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED AUCTIONS ── */}
      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600 }}>Featured Live Auctions</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E0DBD4", background: "transparent", cursor: "pointer", fontSize: 16 }}>‹</button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #1A1814", background: "#1A1814", color: "#fff", cursor: "pointer", fontSize: 16 }}>›</button>
            </div>
          </div>
          <div className="auction-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {AUCTIONS.map((a, i) => (
              <div key={i} className="auction-card">
                <div style={{ position: "relative" }}>
                  <img src={a.img} alt={a.title} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                  {a.live && <span className="live-pill" style={{ position: "absolute", top: 12, left: 12 }}>● Live</span>}
                  {a.badge && (
                    <span style={{
                      position: "absolute", bottom: 12, right: 12,
                      background: a.badgeColor, color: "#fff",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                      padding: "4px 10px", borderRadius: 2, letterSpacing: 0.5
                    }}>{a.badge}</span>
                  )}
                </div>
                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{a.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700 }}>{a.price}</span>
                    <AuctionTimer init={
                      a.time === "02:45:11" ? 9911 :
                      a.time === "18:12:00" ? 65520 :
                      3139
                    } />
                  </div>
                  <button className={i === 2 ? "bz-btn-gold" : "bz-btn-primary"} style={{ width: "100%", padding: "11px 0" }}>
                    {i === 2 ? "Counter Bid" : "Quick Bid"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, marginBottom: 8 }}>The Art of the Bid</h2>
            <div className="divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {HOW_STEPS.map(s => (
                <div key={s.n} style={{ display: "flex", gap: 18 }}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feat-card">
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: "80px 40px", background: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="testimonial-stars">★★★★★</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 400, fontStyle: "italic", color: "#1A1814", lineHeight: 1.5, margin: "24px 0 32px" }}>
            "BidZone has completely transformed how I manage my private collection. The transparency and level of service are simply unmatched in the digital auction world."
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <img src="https://i.pravatar.cc/48?img=12" alt="Marcus Sterling" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>Marcus Sterling</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9A9490" }}>Private Collector, London</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 40px", background: "#1A1814" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: "#F8F5F0", marginBottom: 16 }}>
            Ready to Own the Extraordinary?
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(248,245,240,0.6)", marginBottom: 40 }}>
            Join our network of elite bidders today and gain access to upcoming private auctions before they go public.
          </p>
          <div className="cta-btns" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button style={{
              background: "#C9A84C", color: "#fff", border: "none",
              padding: "14px 32px", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              fontWeight: 500, cursor: "pointer", borderRadius: 2, letterSpacing: 0.5,
              transition: "background 0.2s"
            }} onClick={() => navigate("/register")}>Create Professional Account</button>
            <button style={{
              background: "transparent", color: "#F8F5F0",
              border: "1px solid rgba(248,245,240,0.3)",
              padding: "14px 32px", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              fontWeight: 500, cursor: "pointer", borderRadius: 2, letterSpacing: 0.5,
              transition: "all 0.2s"
            }} onClick={() => navigate("/login")}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111009", padding: "40px 40px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "#F8F5F0", letterSpacing: 1 }}>BID</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: "#C9A84C", letterSpacing: 1 }}>ZONE</span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(248,245,240,0.4)", lineHeight: 1.6 }}>
                Global reach. Boutique service. Secure<br />acquisitions for the discerning collector.
              </p>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {["Terms of Service", "Privacy Policy", "Auction Rules", "Security", "Contact"].map(l => (
                <a key={l} onClick={() => {}} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(248,245,240,0.4)", textDecoration: "none", transition: "color 0.2s", cursor: 'pointer' }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(248,245,240,0.08)", paddingTop: 20 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(248,245,240,0.25)", textAlign: "center" }}>
              © 2024 BidZone Global Auction House. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
