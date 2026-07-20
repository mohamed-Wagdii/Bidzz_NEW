// AccountSidebar.jsx
const NAV_ITEMS = [
  { id:"bids",      label:"My Bids",        emoji:"📊" },
  { id:"watchlist", label:"Watchlist",       emoji:"👁" },
  { id:"financials",label:"Financials",      emoji:"💳" },
  { id:"settings",  label:"Settings",        emoji:"⚙"  },
  { id:"analytics", label:"Analytics",       emoji:"📈" },
  { id:"platform",  label:"Platform Config", emoji:"🛠" },
];

const QUICK_LINKS = ["Personal Information","Security & Privacy","Notification Rules"];

export default function AccountSidebar({ active = "settings" }) {
  return (
    <aside style={{width:195,background:"#fff",borderRight:"1px solid #f0f0f0",
      display:"flex",flexDirection:"column",padding:"1.5rem 0",
      gap:"1.25rem",minHeight:"calc(100vh - 60px)"}}>

      {/* Profile Card */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        padding:"0 1rem 1.25rem",borderBottom:"1px solid #f0f0f0"}}>
        <div style={{position:"relative",marginBottom:"0.75rem"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#f0e8cc",
            border:"3px solid #c9a84c",display:"flex",alignItems:"center",
            justifyContent:"center",fontWeight:700,color:"#c9a84c",fontSize:"1.25rem"}}>AT</div>
          <button style={{position:"absolute",bottom:2,right:2,width:22,height:22,
            borderRadius:"50%",background:"#c9a84c",border:"2px solid #fff",
            color:"#fff",fontSize:"0.7rem",cursor:"pointer"}}>✎</button>
        </div>
        <div style={{fontSize:"0.9375rem",fontWeight:700,color:"#1a1a1a",marginBottom:"0.25rem"}}>Alexander Thorne</div>
        <span style={{background:"#fff7e0",color:"#c9a84c",fontSize:"0.6875rem",
          fontWeight:700,padding:"2px 10px",borderRadius:20,marginBottom:"0.75rem"}}>Elite Bidder</span>
        <div style={{display:"flex",gap:"1.5rem"}}>
          {[["14","ACTIVE BIDS"],["82","WON ITEMS"]].map(([n,l]) => (
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"1.125rem",fontWeight:700,color:"#1a1a1a"}}>{n}</div>
              <div style={{fontSize:"0.5625rem",color:"#999",letterSpacing:"0.06em"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{padding:"0 0.75rem",display:"flex",flexDirection:"column",gap:4}}>
        {QUICK_LINKS.map(l => (
          <a key={l} href="#" style={{display:"flex",justifyContent:"space-between",
            alignItems:"center",padding:"0.6rem 0.75rem",borderRadius:7,
            fontSize:"0.8125rem",color:"#555",textDecoration:"none",border:"1px solid #f0f0f0"}}>
            <span>{l}</span><span>›</span>
          </a>
        ))}
      </div>

      {/* Nav */}
      <nav style={{padding:"0 0.75rem",display:"flex",flexDirection:"column",gap:2}}>
        {NAV_ITEMS.map(item => (
          <a key={item.id} href="#" style={{
            display:"flex",alignItems:"center",gap:"0.6rem",
            padding:"0.5rem 0.75rem",borderRadius:7,textDecoration:"none",
            fontSize:"0.8125rem",
            color:      active === item.id ? "#1a1a1a" : "#666",
            fontWeight: active === item.id ? 600       : 400,
            background: active === item.id ? "#faf8f3" : "transparent",
            borderLeft: active === item.id ? "3px solid #c9a84c" : "3px solid transparent",
          }}>
            <span>{item.emoji}</span><span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* VIP */}
      <div style={{padding:"0 0.75rem"}}>
        <button style={{width:"100%",background:"#c9a84c",color:"#fff",border:"none",
          padding:"0.5rem",borderRadius:7,fontSize:"0.6875rem",
          fontWeight:800,letterSpacing:"0.1em",cursor:"pointer"}}>UPGRADE TO VIP</button>
      </div>

      {/* Logout */}
      <a href="#" style={{display:"flex",alignItems:"center",gap:"0.5rem",
        padding:"0.5rem 1.5rem",fontSize:"0.8125rem",color:"#999",
        textDecoration:"none",marginTop:"auto"}}>⬅ Logout</a>
    </aside>
  );
}