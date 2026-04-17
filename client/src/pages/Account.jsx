import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountPage({ user, onLogout, onBack }) {
  const [loading,setLoading] = useState(false);
  const API = process.env.REACT_APP_API_URL||"";

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/billing/portal`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});
      const data = await res.json();
      if (res.ok) window.location.href = data.url;
    } catch(e){}
    finally { setLoading(false); }
  };

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`,{method:"POST",credentials:"include"});
    onLogout();
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={onBack}>← Back</button>
          <div style={{fontFamily:"var(--font-display)",fontSize:32,fontWeight:300}}>Account</div>
          <div style={{width:80}} />
        </div>
        <div className="card" style={{padding:"28px 24px"}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)",marginBottom:4}}>Signed in as</div>
            <div style={{fontSize:15,fontWeight:500}}>{user?.name}</div>
            <div style={{fontSize:13,color:"var(--ash)"}}>{user?.email}</div>
          </div>
          <div style={{height:1,background:"var(--border-subtle)",margin:"16px 0"}} />
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)",marginBottom:6}}>Subscription</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:user?.subscriptionStatus==="active"?"#4ade80":"#f87171",display:"inline-block"}} />
              <span style={{fontSize:14,fontWeight:500,color:user?.subscriptionStatus==="active"?"#4ade80":"#f87171"}}>
                {user?.subscriptionStatus==="active" ? "Active — $15/month" : user?.subscriptionStatus==="past_due" ? "⚠ Payment failed — update billing" : "No active subscription"}
              </span>
            </div>
          </div>
          <button className="ghost-btn" onClick={openPortal} disabled={loading} style={{width:"100%",marginBottom:10}}>
            {loading ? "Opening…" : "Manage Billing / Cancel →"}
          </button>
          <button className="ghost-btn" onClick={logout} style={{width:"100%",color:"#f87171",borderColor:"rgba(248,113,113,0.2)"}}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}


export default function Account({ user, setUser }) {
  const navigate = useNavigate();
  return (
    <AccountPage
      user={user}
      onBack={()=>navigate(-1)}
      onLogout={()=>{ try{localStorage.removeItem("cr_user");}catch{} setUser(false); navigate("/login"); }}
    />
  );
}
