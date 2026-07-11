import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { auctionsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const SORT_OPTIONS = [
  { value: "ending_soon",  label: "Ending Soon" },
  { value: "newest",       label: "Newest First" },
  { value: "price_low",    label: "Lowest Price" },
  { value: "price_high",   label: "Highest Bid" },
];

const STATUS_OPTIONS = ["all", "active", "ended"];

function getTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function mapAuction(a) {
  return {
    id: a._id,
    title: a.Product?.name ?? "Auction Item",
    description: a.Product?.description ?? "",
    currentBid: a.startingPrice,
    endTime: a.endTime,
    status: a.status,
    seller: a.seller?.fullName ?? "Unknown",
    image: a.Product?.image?.[0] ?? null,
    isEndingSoon: new Date(a.endTime) - new Date() < 3600000,
  };
}

function highlight(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "var(--gold-bg)", color: "var(--gold-dark)", borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const PAGE_SIZE = 12;

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("ending_soon");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => {
    auctionsAPI.getAll()
      .then(data => setAllAuctions((data.auctions || []).map(mapAuction)))
      .catch(() => setError("Failed to load auctions."))
      .finally(() => setLoading(false));
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Filter + sort
  const filtered = allAuctions
    .filter(a => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (debouncedSearch && !a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && !a.seller.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (priceMin && a.currentBid < Number(priceMin)) return false;
      if (priceMax && a.currentBid > Number(priceMax)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "ending_soon") return new Date(a.endTime) - new Date(b.endTime);
      if (sortBy === "newest") return new Date(b.endTime) - new Date(a.endTime);
      if (sortBy === "price_low") return a.currentBid - b.currentBid;
      if (sortBy === "price_high") return b.currentBid - a.currentBid;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterReset = () => {
    setSearch(""); setDebouncedSearch(""); setSortBy("ending_soon");
    setStatusFilter("all"); setPriceMin(""); setPriceMax(""); setPage(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--surface-2)", fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar filters */}
        <aside style={{ width: 240, minWidth: 240, background: "var(--surface)", borderRight: "1px solid var(--border)", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <div style={{ fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Filters</div>
            <button onClick={handleFilterReset} style={{ background: "none", border: "none", fontSize: 12, color: "var(--gold-dark)", cursor: "pointer", padding: 0, fontWeight: 500 }}>Reset all</button>
          </div>

          {/* Status */}
          <div>
            <div style={filterLabel}>Status</div>
            {STATUS_OPTIONS.map(s => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13, color: statusFilter === s ? "var(--ink)" : "var(--ink-40)", fontWeight: statusFilter === s ? 600 : 400 }}>
                <input type="radio" name="status" value={s} checked={statusFilter === s} onChange={() => { setStatusFilter(s); setPage(1); }} style={{ accentColor: "var(--gold)" }} />
                {s === "all" ? "All Listings" : s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>

          {/* Price range */}
          <div>
            <div style={filterLabel}>Price Range</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number" placeholder="Min" value={priceMin}
                onChange={e => { setPriceMin(e.target.value); setPage(1); }}
                className="input" style={{ fontSize: 12, padding: "7px 10px" }}
              />
              <input
                type="number" placeholder="Max" value={priceMax}
                onChange={e => { setPriceMax(e.target.value); setPage(1); }}
                className="input" style={{ fontSize: 12, padding: "7px 10px" }}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <div style={filterLabel}>Sort By</div>
            {SORT_OPTIONS.map(o => (
              <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13, color: sortBy === o.value ? "var(--ink)" : "var(--ink-40)", fontWeight: sortBy === o.value ? 600 : 400 }}>
                <input type="radio" name="sort" value={o.value} checked={sortBy === o.value} onChange={() => setSortBy(o.value)} style={{ accentColor: "var(--gold)" }} />
                {o.label}
              </label>
            ))}
          </div>

          {user?.role === "seller" && (
            <button className="btn btn-gold" style={{ marginTop: "auto" }} onClick={() => navigate("/auctions/new")}>
              + New Listing
            </button>
          )}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
          {/* Header + search */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 2px" }}>Live Auctions</h1>
              <p style={{ fontSize: 13, color: "var(--ink-40)", margin: 0 }}>
                {loading ? "Loading..." : `${filtered.length} auction${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <div style={{ position: "relative", width: 280 }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-20)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search auctions, sellers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: 36, fontSize: 13 }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-40)", fontSize: 16, lineHeight: 1 }}>✕</button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: "14px 18px", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: "var(--r-md)", color: "var(--danger)", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: "var(--r-lg)" }} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <p>No auctions match your filters.</p>
              <button className="btn btn-ghost btn-sm" onClick={handleFilterReset}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {paginated.map(a => (
                <AuctionCard key={a.id} auction={a} searchQuery={debouncedSearch} onBid={() => navigate(`/auctions/${a.id}`)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: "var(--r-md)", border: "1px solid var(--border)",
                    background: p === page ? "var(--ink)" : "var(--surface)",
                    color: p === page ? "#fff" : "var(--ink-60)",
                    fontWeight: p === page ? 700 : 400, fontSize: 13, cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function AuctionCard({ auction, searchQuery, onBid }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(auction.endTime));

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(auction.endTime)), 1000);
    return () => clearInterval(t);
  }, [auction.endTime]);

  const isEnded = timeLeft === "Ended";

  return (
    <div
      className="card"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform var(--t-base), box-shadow var(--t-base)", cursor: "pointer" }}
      onClick={onBid}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "var(--surface-3)" }}>
        {auction.image
          ? <img src={auction.image} alt={auction.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-20)", fontSize: 32 }}>🖼️</div>
        }
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span className={`badge ${isEnded ? "badge-neutral" : auction.isEndingSoon ? "badge-danger" : "badge-success"}`}>
            {isEnded ? "Ended" : auction.isEndingSoon ? "⚡ Ending Soon" : "● Live"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, color: "var(--ink-40)", marginBottom: 4 }}>{highlight(auction.seller, searchQuery)}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 12, lineHeight: 1.3 }}>
          {highlight(auction.title, searchQuery)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: 2 }}>Current Bid</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>${auction.currentBid?.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: 2 }}>Time Left</div>
            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: isEnded ? "var(--ink-40)" : auction.isEndingSoon ? "var(--danger)" : "var(--ink)" }}>{timeLeft}</div>
          </div>
        </div>
        <button
          className={`btn ${isEnded ? "btn-ghost" : "btn-primary"}`}
          style={{ width: "100%", marginTop: "auto" }}
          onClick={e => { e.stopPropagation(); onBid(); }}
          disabled={isEnded}
        >
          {isEnded ? "View Details" : "Place Bid"}
        </button>
      </div>
    </div>
  );
}

const filterLabel = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
  textTransform: "uppercase", color: "var(--gold-dark)", marginBottom: 10, display: "block",
};
