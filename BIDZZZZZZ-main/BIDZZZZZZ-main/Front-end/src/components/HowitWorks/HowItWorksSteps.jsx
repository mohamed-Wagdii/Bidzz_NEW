// HowItWorksSteps.jsx
const STEPS = [
  {
    num:"01", flip:false, eyebrow:"ENTRY",
    title:"Identity Verification",
    desc:"To maintain the exclusivity of our community, all participants must undergo a one-time secure identity verification. We use bank-grade encryption to ensure your privacy.",
    badges:[{ icon:"🛡", label:"Secure KYC Protocol" }],
  },
  {
    num:"02", flip:true, eyebrow:"ENGAGEMENT",
    title:"Discovery & Bidding",
    desc:"Browse curated collections of digital and physical assets. Place your bids in real-time or set an automated maximum to ensure you never miss out on a prize.",
    badges:[
      { icon:"⚡", label:"Real-Time Bidding",    sub:"Instant updates with zero latency architecture." },
      { icon:"👁", label:"Watchlist Integration", sub:"Track your favorite items across different sales." },
    ],
  },
  {
    num:"03", flip:false, eyebrow:"SETTLEMENT",
    title:"Secure Transfer",
    desc:"Once the hammer falls, our automated settlement system initiates. Your payment is held in escrow until the asset's authenticity and delivery are confirmed.",
    badges:[
      { icon:"🔒", label:"Escrow Protection" },
      { icon:"🚚", label:"White-Glove Delivery" },
    ],
  },
];

export default function HowItWorksSteps() {
  return (
    <section style={{background:"#f9f8f5",padding:"3rem 0 5rem"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 2rem",
        display:"flex",flexDirection:"column",gap:"5rem"}}>
        {STEPS.map((s) => {
          const imgBlock = (
            <div style={{position:"relative"}}>
              <span style={{
                position:"absolute",
                [s.flip ? "bottom":"top"]:-16,
                [s.flip ? "right":"left"]:-16,
                fontSize:"2rem",fontWeight:900,fontFamily:"Georgia,serif",
                color:"#1a1a1a",background:"#f9f8f5",
                padding:"4px 8px",borderRadius:6,zIndex:1,
              }}>{s.num}</span>
              {/* Replace this div with <img> when connecting backend */}
              <div style={{width:"100%",aspectRatio:"4/3",background:"#e8e4dc",
                borderRadius:12,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:"4rem"}}>🖼</div>
            </div>
          );
          const txtBlock = (
            <div>
              <p style={{fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.15em",
                color:"#c9a84c",margin:"0 0 0.5rem"}}>{s.eyebrow}</p>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:"2rem",fontWeight:700,
                color:"#1a1a1a",margin:"0 0 1rem",lineHeight:1.2}}>{s.title}</h2>
              <p style={{fontSize:"0.9375rem",color:"#666",lineHeight:1.75,
                margin:"0 0 1.5rem"}}>{s.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                {s.badges.map((b) => (
                  <div key={b.label} style={{display:"flex",alignItems:"flex-start",
                    gap:"0.75rem",background:"#fff",border:"1px solid #ebebeb",
                    borderRadius:10,padding:"0.75rem 1rem"}}>
                    <span style={{fontSize:"1.25rem"}}>{b.icon}</span>
                    <div>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:"#1a1a1a"}}>{b.label}</div>
                      {b.sub && <div style={{fontSize:"0.8125rem",color:"#999",marginTop:2}}>{b.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          return (
            <div key={s.num} style={{display:"grid",gridTemplateColumns:"1fr 1fr",
              gap:"4rem",alignItems:"center"}}>
              {s.flip ? <>{txtBlock}{imgBlock}</> : <>{imgBlock}{txtBlock}</>}
            </div>
          );
        })}
      </div>
    </section>
  );
}