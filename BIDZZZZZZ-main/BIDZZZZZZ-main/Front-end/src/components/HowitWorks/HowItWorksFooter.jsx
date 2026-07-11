// HowItWorksFooter.jsx
const TRUST = [
  { icon:"💰", title:"Guaranteed Payment",  desc:"Secure transactions backed by global financial institutions." },
  { icon:"✅", title:"100% Authenticity",   desc:"Every item is rigorously vetted by industry leading experts." },
  { icon:"🌍", title:"Global Reach",        desc:"Access to an elite network of collectors across 80+ countries." },
  { icon:"🎩", title:"Concierge Service",   desc:"Dedicated account managers for high-value transactions." },
];

const FOOTER_COLS = [
  { title:"COLLECT",  links:["Current Auctions","Buy Now","Past Results"] },
  { title:"CONSIGN",  links:["Selling at Aureum","Private Sales","Valuation Request"] },
];

export default function HowItWorksFooter() {
  return (
    <footer>
      {/* Trust Badges */}
      <div style={{background:"#1a1a1a",padding:"3.5rem 2rem"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",gap:"2rem",textAlign:"center"}}>
          {TRUST.map(t => (
            <div key={t.title}>
              <span style={{fontSize:"2rem",display:"block",marginBottom:"0.75rem"}}>{t.icon}</span>
              <h3 style={{fontSize:"0.9375rem",fontWeight:700,color:"#fff",
                margin:"0 0 0.5rem",fontFamily:"Georgia,serif"}}>{t.title}</h3>
              <p style={{fontSize:"0.8125rem",color:"#999",lineHeight:1.6,margin:0}}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div style={{background:"#f9f8f5",padding:"3rem 2rem 1.5rem",borderTop:"1px solid #ebebeb"}}>
        <div style={{maxWidth:900,margin:"0 auto 2rem",display:"grid",
          gridTemplateColumns:"2fr 1fr 1fr 1.5fr",gap:"2rem"}}>

          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",
              fontWeight:700,color:"#1a1a1a",marginBottom:"0.75rem"}}>AUREUM</div>
            <p style={{fontSize:"0.8125rem",color:"#888",lineHeight:1.6,margin:0}}>
              The premier destination for the acquisition of rare assets and high-value collectibles.
            </p>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.title} style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              <h4 style={{fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.12em",
                color:"#999",margin:"0 0 0.25rem"}}>{col.title}</h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{fontSize:"0.875rem",color:"#555",textDecoration:"none"}}>{l}</a>
              ))}
            </div>
          ))}

          <div>
            <h4 style={{fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.12em",
              color:"#999",margin:"0 0 0.5rem"}}>NEWSLETTER</h4>
            <div style={{display:"flex",border:"1px solid #e5e5e5",borderRadius:8,overflow:"hidden"}}>
              <input type="email" placeholder="Your email address"
                style={{flex:1,padding:"0.6rem 0.75rem",border:"none",outline:"none",
                  fontSize:"0.8125rem",background:"#fff"}} />
              <button style={{padding:"0.6rem 1rem",background:"#1a1a1a",color:"#fff",
                border:"none",fontSize:"0.6875rem",fontWeight:700,
                letterSpacing:"0.1em",cursor:"pointer"}}>JOIN</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",
          alignItems:"center",paddingTop:"1.5rem",borderTop:"1px solid #e5e5e5",
          fontSize:"0.6875rem",color:"#aaa",letterSpacing:"0.05em"}}>
          <span>© 2026 AUREUM AUCTIONS. ALL RIGHTS RESERVED.</span>
          <div style={{display:"flex",gap:"1.5rem"}}>
            {["PRIVACY POLICY","TERMS OF SERVICE","COOKIE SETTINGS"].map(l => (
              <a key={l} href="#" style={{fontSize:"0.6875rem",color:"#aaa",textDecoration:"none"}}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}