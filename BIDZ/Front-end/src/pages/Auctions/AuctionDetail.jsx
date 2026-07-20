import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auctionsAPI, bidsAPI, chatAPI, ordersAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function getTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportErrorMsg, setReportErrorMsg] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const expiredRef = useRef(false);

  const loadAuction = async () => {
    const [aData, bData] = await Promise.all([
      auctionsAPI.getById(id),
      bidsAPI.getForAuction(id),
    ]);
    setAuction(aData.auction);
    setBids(bData.bids || []);
    setTimeLeft(getTimeLeft(aData.auction?.endTime));
    return aData.auction;
  };

  useEffect(() => {
    loadAuction()
      .then(a => { if (user) checkChatAccess(); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Countdown timer — when it hits zero, re-fetch from backend to get updated status
  useEffect(() => {
    if (!auction?.endTime) return;
    const t = setInterval(async () => {
      const tl = getTimeLeft(auction.endTime);
      setTimeLeft(tl);
      // When timer just expired, re-fetch so DB status is synced
      if (tl === "Ended" && !expiredRef.current) {
        expiredRef.current = true;
        try {
          const aData = await auctionsAPI.getById(id);
          setAuction(aData.auction);
        } catch {}
      }
    }, 1000);
    return () => clearInterval(t);
  }, [auction?.endTime, id]);

  const checkChatAccess = async () => {
    try {
      const res = await chatAPI.canChat(id);
      setCanChat(res.canChat);
    } catch {
      setCanChat(false);
    }
  };

  const handleBid = async () => {
    if (!user) return navigate("/login");
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return setBidError("Enter a valid bid amount.");
    setBidLoading(true);
    setBidError("");
    setBidSuccess("");
    try {
      await bidsAPI.place(id, amount);
      setBidSuccess("Bid placed successfully!");
      setBidAmount("");
      const [bData, aData] = await Promise.all([
        bidsAPI.getForAuction(id),
        auctionsAPI.getById(id),
      ]);
      setBids(bData.bids || []);
      setAuction(aData.auction);
      await checkChatAccess();
    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setBidLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setOrderLoading(true);
    setOrderError("");
    try {
      const data = await ordersAPI.create(id, "");
      if (data.alreadyPaid) {
        navigate("/dashboard/orders");
        return;
      }
      navigate(`/orders/${data.orderId}/payment`);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to create order.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return (
    <div style={page}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#999" }}>Loading auction...</p>
      </div>
      <Footer />
    </div>
  );

  if (!auction) return (
    <div style={page}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#e05252" }}>Auction not found.</p>
      </div>
      <Footer />
    </div>
  );

  const currentBid = bids[0]?.amount ?? auction.startingPrice;
  const uid = user?._id || user?.id || "";
  const sellerId = auction.seller?._id?.toString() || auction.seller?.toString() || "";
  const isSeller = uid && sellerId && uid === sellerId;

  // Source of truth: DB status. Timer "Ended" is only a visual hint until re-fetch confirms.
  const isEnded = auction.status === "ended" || timeLeft === "Ended";

  // Winner check — compare strings
  const handleReport = () => {
    if (!reportReason) {
      setReportErrorMsg("Please select a reason.");
      return;
    }
    setReportLoading(true);
    setReportErrorMsg("");
    setReportSuccess(false);
    
    reportsAPI.submit({ targetType: "auction", targetId: id, reason: reportReason, description: reportDesc })
      .then(() => { 
        setReportSuccess(true);
        setReportReason("");
        setReportDesc("");
        setTimeout(() => { setShowReport(false); setReportSuccess(false); }, 3000);
      })
      .catch(e => setReportErrorMsg(e.response?.data?.message || "Failed to submit report."))
      .finally(() => setReportLoading(false));
  };

  const highestBiderId = auction.highestBider?._id?.toString() || auction.highestBider?.toString() || "";
  const isWinner = isEnded && uid && highestBiderId && uid === highestBiderId;

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "40px 32px", width: "100%" }}>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
          <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => navigate("/auctions")}>Auctions</span>
          {" › "}
          {auction.Product?.name ?? "Auction"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 24, background: "#fff", border: "1px solid #ede8df" }}>
              <img
                src={auction.Product?.image?.[0] ?? "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80"}
                alt={auction.Product?.name}
                style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", border: "1px solid #ede8df", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>About This Item</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>{auction.Product?.description ?? "No description available."}</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", border: "1px solid #ede8df" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Bid History ({bids.length})</h2>
              {bids.length === 0 ? (
                <p style={{ color: "#999", fontSize: 14 }}>No bids yet. Be the first!</p>
              ) : (
                bids.map((b, i) => (
                  <div key={b._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < bids.length - 1 ? "1px solid #f5f3ef" : "none" }}>
                    <span style={{ fontSize: 14, color: "#555" }}>
                      {b.buyer?.fullName ?? "Anonymous"}
                      {isEnded && b.buyer?._id?.toString() === highestBiderId && (
                        <span style={{ marginLeft: 6, fontSize: 11, background: "#fff8e1", color: "#b8962e", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>WINNER</span>
                      )}
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700 }}>${b.amount?.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Bid Panel */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "28px", border: "1px solid #ede8df", marginBottom: 16 }}>
              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  background: isEnded ? "#f5f5f5" : "#E05252",
                  color: isEnded ? "#999" : "#fff",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: 1,
                }}>
                  {isEnded ? "ENDED" : "● LIVE"}
                </span>
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
                {auction.Product?.name ?? "Auction Item"}
              </h1>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
                  Seller: {auction.seller?.fullName ?? "Unknown"}
                </p>
                {user && !isSeller && (
                  <button onClick={() => setShowReport(!showReport)} style={{ background: "none", border: "none", color: "#e05252", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                    Report
                  </button>
                )}
              </div>

              {showReport && user && !isSeller && (
                <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#e05252" }}>Report this Auction</p>
                  
                  {reportSuccess && <p style={{ color: "#1a9e5a", fontSize: 13, marginBottom: 12, background: "#e6f9f0", padding: "8px 12px", borderRadius: 6 }}>Report submitted successfully! Thank you.</p>}
                  {reportErrorMsg && <p style={{ color: "#e05252", fontSize: 13, marginBottom: 12, background: "rgba(255,255,255,0.6)", borderRadius: 4, padding: "4px 8px" }}>{reportErrorMsg}</p>}
                  
                  {!reportSuccess && (
                    <>
                      <select value={reportReason} onChange={e => setReportReason(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 4, border: "1px solid #fca5a5", outline: "none" }}>
                        <option value="">Select Reason</option>
                        <option value="fraud">Fraud</option>
                        <option value="fake_product">Fake Product</option>
                        <option value="spam">Spam</option>
                        <option value="scam">Scam</option>
                        <option value="other">Other</option>
                      </select>
                      <textarea placeholder="Description (optional)" value={reportDesc} onChange={e => setReportDesc(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 4, border: "1px solid #fca5a5", minHeight: 60, outline: "none" }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleReport} disabled={reportLoading} style={{ background: "#e05252", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, cursor: reportLoading ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600 }}>{reportLoading ? "Submitting..." : "Submit"}</button>
                        <button onClick={() => { setShowReport(false); setReportErrorMsg(""); setReportSuccess(false); }} style={{ background: "transparent", color: "#555", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 4 }}>
                    {isEnded ? "FINAL PRICE" : "CURRENT BID"}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700 }}>${currentBid?.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 4 }}>TIME LEFT</p>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: isEnded ? "#999" : "#E05252" }}>{timeLeft}</p>
                </div>
              </div>

              {/* Active bidding */}
              {!isEnded && !isSeller && (
                <>
                  {bidError && <p style={{ color: "#e05252", fontSize: 13, marginBottom: 12, background: "#fff0f0", padding: "8px 12px", borderRadius: 6 }}>{bidError}</p>}
                  {bidSuccess && <p style={{ color: "#1a9e5a", fontSize: 13, marginBottom: 12, background: "#e6f9f0", padding: "8px 12px", borderRadius: 6 }}>{bidSuccess}</p>}
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "0 12px", background: "#fafafa" }}>
                      <span style={{ color: "#aaa", marginRight: 6 }}>$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min: $${(currentBid + 1).toLocaleString()}`}
                        style={{ flex: 1, border: "none", background: "transparent", padding: "12px 0", fontSize: 15, outline: "none" }}
                      />
                    </div>
                    <button
                      onClick={handleBid}
                      disabled={bidLoading}
                      style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "0 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {bidLoading ? "..." : "Place Bid"}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "#aaa" }}>Enter an amount greater than ${currentBid?.toLocaleString()}</p>
                </>
              )}

              {/* Seller view */}
              {isSeller && !isEnded && (
                <div style={{ background: "#faf8f4", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#888" }}>
                  This is your auction listing.
                </div>
              )}

              {/* Ended states */}
              {isEnded && (
                <div>
                  {isWinner ? (
                    <div style={{ background: "linear-gradient(135deg,#C9A84C,#e8c96a)", borderRadius: 8, padding: "16px", textAlign: "center" }}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "#1A1814", margin: "0 0 4px" }}>🏆 You won this auction!</p>
                      <p style={{ fontSize: 12, color: "#5a4a1a", margin: "0 0 12px" }}>Complete your purchase to claim this item.</p>
                      {orderError && <p style={{ color: "#e05252", fontSize: 12, marginBottom: 8, background: "rgba(255,255,255,0.6)", borderRadius: 4, padding: "4px 8px" }}>{orderError}</p>}
                      <button
                        onClick={handleCreateOrder}
                        disabled={orderLoading}
                        style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: orderLoading ? "not-allowed" : "pointer", width: "100%", opacity: orderLoading ? 0.7 : 1 }}
                      >
                        {orderLoading ? "Processing..." : "Proceed to Payment →"}
                      </button>
                    </div>
                  ) : isSeller ? (
                    <div style={{ background: "#f0f9f4", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#1a9e5a", fontWeight: 600 }}>
                      ✓ Auction ended — {bids.length > 0 ? `Winner: ${auction.highestBider?.fullName || "Selected"}` : "No bids received"}
                    </div>
                  ) : (
                    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#888" }}>
                      This auction has ended.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat button */}
            {user && !isSeller && canChat && (
              <button
                onClick={() => navigate(`/my-chats?receiverId=${sellerId}&auctionId=${id}`)}
                style={{ width: "100%", background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8 }}
              >
                Chat with Seller
              </button>
            )}

            {user && !isSeller && !canChat && !isEnded && (
              <button
                disabled
                style={{ width: "100%", background: "#ddd", color: "#999", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "not-allowed", marginBottom: 8 }}
                title="Place a bid to chat with the seller"
              >
                🔒 Chat (Bid Required)
              </button>
            )}

            {!user && (
              <button
                onClick={() => navigate("/login")}
                style={{ width: "100%", background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Sign In to Bid
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const page = {
  minHeight: "100vh", display: "flex", flexDirection: "column",
  fontFamily: "'DM Sans',sans-serif", background: "#F4F5F7",
};
