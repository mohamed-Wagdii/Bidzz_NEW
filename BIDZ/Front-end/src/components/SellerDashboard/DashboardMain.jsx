// DashboardMain.jsx
const BIDS = [
  { name:"Patek Philippe Nautilus 5711", lot:"8821", closes:"2h 45m", price:"$85,400",  status:"WINNING", statusColor:"#1a9e5a", statusBg:"#e6f9f0" },
  { name:"1967 Porsche 911 S Targa",     lot:"4402", closes:"45m",    price:"$210,000", status:"OUTBID",  statusColor:"#e53e3e", statusBg:"#fff0ee" },
  { name:'"Midnight Echo" - Original Oil',lot:"1109",closes:"5h 12m", price:"$12,500",  status:"WINNING", statusColor:"#1a9e5a", statusBg:"#e6f9f0" },
];
const RECS = [
  { name:"Geometric Marble Study IV",  cat:"FINE ARTS • LIVE",          price:"$4,200", label:"Current Bid" },
  { name:"Limited Edition Prototype Z",cat:"COLLECTIBLES • ENDING SOON", price:"$8,500", label:"Starting At" },
];

export default function DashboardMain() {
  return (
    <main style={{flex:1,background:"#f7f6f3",padding:"2rem",overflowY:"auto"}}>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:"1.875rem",fontWeight:700,color:"#1a1a1a",marginBottom:"0.25rem"}}>Dashboard Overview</h1>
      <p style={{color:"#777",marginBottom:"1.75rem"}}>Welcome back, your active auctions are performing well.</p>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
        {[{l:"ACTIVE BIDS",v:"12",dark:false},{l:"WALLET BALANCE",v:"$42,850.00",dark:true},{l:"AUCTIONS WON",v:"28",dark:false}].map((s,i)=>(
          <div key={i} style={{background:s.dark?"#1a1a1a":"#fff",borderRadius:12,padding:"1.25rem 1.5rem",border:"1px solid #ebebeb"}}>
            <div style={{fontSize:"0.6875rem",fontWeight:600,letterSpacing:"0.08em",color:s.dark?"#aaa":"#999",marginBottom:"0.75rem"}}>{s.l}</div>
            <span style={{fontSize:"1.625rem",fontWeight:700,color:s.dark?"#fff":"#1a1a1a"}}>{s.v}</span>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:"1.25rem",alignItems:"start"}}>
        {/* Active Bids */}
        <div style={{background:"#fff",borderRadius:12,border:"1px solid #ebebeb",padding:"1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
            <h2 style={{fontSize:"1rem",fontWeight:700,color:"#1a1a1a",margin:0}}>Current Active Bids</h2>
            <a href="#" style={{fontSize:"0.75rem",fontWeight:700,color:"#c9a84c",textDecoration:"none"}}>VIEW ALL</a>
          </div>
          {BIDS.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.875rem 0",borderBottom:i<BIDS.length-1?"1px solid #f5f5f5":"none"}}>
              <div style={{width:52,height:52,borderRadius:8,background:"#f0ede6",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:"0.875rem",fontWeight:600,color:"#1a1a1a"}}>{b.name}</div>
                <div style={{fontSize:"0.75rem",color:"#999",marginTop:2}}>Lot #{b.lot} • Closes in {b.closes}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{fontSize:"0.9375rem",fontWeight:700,color:"#1a1a1a"}}>{b.price}</span>
                <span style={{fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:20,background:b.statusBg,color:b.statusColor}}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended */}
        <div style={{background:"#fff",borderRadius:12,border:"1px solid #ebebeb",padding:"1.5rem"}}>
          <h2 style={{fontSize:"1rem",fontWeight:700,color:"#1a1a1a",marginBottom:"1.25rem",margin:"0 0 1.25rem"}}>Recommended</h2>
          {RECS.map((r,i)=>(
            <div key={i} style={{border:"1px solid #ebebeb",borderRadius:10,overflow:"hidden",marginBottom:i<RECS.length-1?"1rem":0}}>
              <div style={{height:120,background:"#f0ede6"}}/>
              <div style={{padding:"0.875rem"}}>
                <div style={{fontSize:"0.625rem",fontWeight:700,letterSpacing:"0.1em",color:"#c9a84c",marginBottom:4}}>{r.cat}</div>
                <div style={{fontSize:"0.875rem",fontWeight:700,color:"#1a1a1a",marginBottom:"0.75rem"}}>{r.name}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <div>
                    <div style={{fontSize:"0.6875rem",color:"#999"}}>{r.label}</div>
                    <div style={{fontSize:"1rem",fontWeight:700,color:"#1a1a1a"}}>{r.price}</div>
                  </div>
                  <button style={{width:36,height:36,background:"#1a1a1a",border:"none",borderRadius:8,cursor:"pointer",color:"#fff"}}>🔨</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}