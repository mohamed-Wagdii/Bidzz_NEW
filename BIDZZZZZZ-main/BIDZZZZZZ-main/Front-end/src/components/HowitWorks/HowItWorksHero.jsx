// HowItWorksHero.jsx
import { useState } from "react";

export default function HowItWorksHero() {
  const [tab, setTab] = useState("buyers");

  return (
    <section style={{position:"relative",textAlign:"center",padding:"5rem 2rem 4rem",overflow:"hidden",background:"#f9f8f5"}}>
      <div aria-hidden style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        fontSize:"8rem",fontFamily:"Georgia,serif",fontWeight:900,
        color:"rgba(0,0,0,0.04)",letterSpacing:"0.1em",
        pointerEvents:"none",whiteSpace:"nowrap"}}>AUREUM</div>

      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto"}}>
        <p style={{fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.2em",color:"#c9a84c",margin:"0 0 0.75rem"}}>
          THE ART OF THE BID
        </p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"3rem",fontWeight:700,color:"#1a1a1a",margin:"0 0 1rem"}}>
          How It Works
        </h1>
        <p style={{fontSize:"1rem",color:"#666",lineHeight:1.7,margin:"0 0 2rem"}}>
          Experience the world's most exclusive digital auction house. Whether you are
          acquiring a masterpiece or consigning a legacy, our process is defined by
          security, speed, and sophistication.
        </p>
        <div style={{display:"inline-flex",background:"#f0ede6",borderRadius:8,padding:4,gap:4}}>
          {["buyers","sellers"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"0.5rem 1.5rem", borderRadius:6, border:"none", cursor:"pointer",
              background: tab === t ? "#1a1a1a" : "transparent",
              color:      tab === t ? "#fff"    : "#888",
              fontWeight: tab === t ? 600       : 400,
              fontSize:"0.9375rem", transition:"all 0.2s",
            }}>
              For {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}