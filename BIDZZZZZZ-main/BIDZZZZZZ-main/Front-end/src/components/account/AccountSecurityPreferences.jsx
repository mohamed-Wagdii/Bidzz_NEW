// AccountSecurityPreferences.jsx
import { useState } from "react";

const NOTIF_ROWS = [
  { key:"outbid",   title:"Outbid Alerts",        desc:"Get notified instantly when someone bids higher than you." },
  { key:"ending",   title:"Auction Ending Soon",   desc:"Reminder 15 minutes before an auction closes on your watchlist." },
  { key:"insights", title:"Market Insights",       desc:"Weekly curation of high-value items based on your interests." },
];

export default function AccountSecurityPreferences() {
  const [twoFA, setTwoFA] = useState(true);
  const [notifs, setNotifs] = useState({
    outbidEmail:true,  outbidPush:true,
    endingEmail:false, endingPush:true,
    insightsEmail:true,insightsPush:false,
  });
  const toggle = key => setNotifs(p => ({...p,[key]:!p[key]}));

  const card = { background:"#fff", borderRadius:14, border:"1px solid #ebebeb", padding:"1.75rem 2rem" };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>

      {/* Security */}
      <div style={card}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1.5rem"}}>
          <span>🛡</span>
          <h2 style={{fontSize:"1.125rem",fontWeight:700,color:"#1a1a1a",fontFamily:"Georgia,serif",margin:0}}>Security & Authentication</h2>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"1.25rem",borderBottom:"1px solid #f5f5f5",marginBottom:"1.25rem"}}>
          <div>
            <div style={{fontSize:"0.9375rem",fontWeight:600,color:"#1a1a1a"}}>Account Password</div>
            <div style={{fontSize:"0.8125rem",color:"#999",marginTop:2}}>Last updated 3 months ago</div>
          </div>
          <button style={{border:"1px solid #e5e5e5",background:"#fff",padding:"0.5rem 1.25rem",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Change Password</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",background:"#faf8f3",border:"1px solid #f0e8cc",borderRadius:10,padding:"1rem 1.25rem"}}>
          <span style={{fontSize:"1.5rem"}}>🔐</span>
          <div style={{flex:1}}>
            <div style={{fontSize:"0.9375rem",fontWeight:600,color:"#1a1a1a"}}>Two-Factor Authentication</div>
            <div style={{fontSize:"0.8125rem",color:"#888"}}>Recommended for high-value asset protection.</div>
          </div>
          <span style={{fontSize:"0.75rem",fontWeight:700,color:"#c9a84c",letterSpacing:"0.06em"}}>{twoFA ? "ENABLED" : "DISABLED"}</span>
          <button onClick={() => setTwoFA(!twoFA)} style={{position:"relative",width:44,height:24,borderRadius:12,background:twoFA?"#c9a84c":"#ddd",border:"none",cursor:"pointer",padding:0}}>
            <span style={{position:"absolute",top:3,left:twoFA?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.3s",display:"block"}}/>
          </button>
        </div>
      </div>

      {/* Communication */}
      <div style={card}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1.5rem"}}>
          <span>🔔</span>
          <h2 style={{fontSize:"1.125rem",fontWeight:700,color:"#1a1a1a",fontFamily:"Georgia,serif",margin:0}}>Communication Preferences</h2>
        </div>
        {NOTIF_ROWS.map((row, i) => (
          <div key={row.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.875rem 0",borderBottom:i < NOTIF_ROWS.length-1 ? "1px solid #f5f5f5" : "none"}}>
            <div>
              <div style={{fontSize:"0.9375rem",fontWeight:600,color:"#1a1a1a"}}>{row.title}</div>
              <div style={{fontSize:"0.8125rem",color:"#999",marginTop:2,maxWidth:340}}>{row.desc}</div>
            </div>
            <div style={{display:"flex",gap:"1rem"}}>
              {[["EMAIL",`${row.key}Email`],["PUSH",`${row.key}Push`]].map(([lbl,k]) => (
                <div key={k} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer"}} onClick={() => toggle(k)}>
                  <div style={{width:16,height:16,borderRadius:4,background:notifs[k]?"#c9a84c":"#fff",border:`2px solid ${notifs[k]?"#c9a84c":"#ddd"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {notifs[k] && <span style={{fontSize:"0.5rem",color:"#fff",fontWeight:700}}>✓</span>}
                  </div>
                  <span style={{fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.06em",color:"#888"}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{...card, border:"1px solid #fce8e8"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"0.9375rem",fontWeight:700,color:"#e53e3e"}}>Deactivate Account</div>
            <div style={{fontSize:"0.8125rem",color:"#e53e3e",opacity:0.8,marginTop:2}}>Permanently remove your profile and bidding history.</div>
          </div>
          <button style={{background:"#e53e3e",color:"#fff",border:"none",padding:"0.6rem 1.25rem",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Request Deletion</button>
        </div>
      </div>
    </div>
  );
}