import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubscribePage({ user, onSubscribed, onLogout, onBack, onRegister }) {
  const [loading,setLoading] = useState(false);
  const [err,setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL||"";

  const checkout = async () => {
    if (!user) {
      try { sessionStorage.setItem("cr_redirect", "/subscribe"); } catch {}
      if (onRegister) onRegister();
      return;
    }
    setLoading(true); setErr("");
    try {
      const res = await fetch(`${API}/api/auth/billing/checkout`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});
      const data = await res.json();
      if (!res.ok){setErr(data.error||"Something went wrong."); return;}
      window.location.href = data.url;
    } catch(e){ setErr("Network error. Please try again."); }
    finally{ setLoading(false); }
  };

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`,{method:"POST",credentials:"include"});
    onLogout();
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:440,textAlign:"center"}}>
        {/* Top bar with back + sign out */}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
          {onBack
            ? <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={onBack}>← Back</button>
            : <div />
          }
          <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px",color:"#f87171",borderColor:"rgba(248,113,113,0.2)"}} onClick={logout}>
            Sign Out
          </button>
        </div>
        <div style={{fontFamily:"var(--font-display)",fontSize:40,fontWeight:300,marginBottom:10}}>
          Unlock <em style={{color:"var(--gold)"}}>Crafted Resume</em>
        </div>
        <p style={{color:"var(--ash)",fontSize:15,marginBottom:36,lineHeight:1.7}}>
          Full access to all tools — Apply Mode, PDF tailoring, LinkedIn optimizer, ATS scoring, and more.
        </p>
        <div className="card" style={{padding:"32px 28px",marginBottom:16}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:52,fontWeight:300,marginBottom:4}}>
            $20<span style={{fontSize:18,color:"var(--ash)"}}>/month</span>
          </div>
          <div style={{fontSize:13,color:"var(--ash)",marginBottom:28}}>Cancel anytime. No contracts.</div>
          {[
            "Unlimited resume generations",
            "Apply Mode — full package from any job URL",
            "PDF tailoring for any role",
            "LinkedIn profile optimizer",
            "ATS scoring + job fit analysis",
            "PDF export + share links",
          ].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,textAlign:"left"}}>
              <span style={{color:"#4ade80",flexShrink:0}}>✓</span>
              <span style={{fontSize:14}}>{f}</span>
            </div>
          ))}
          {err && <div style={{margin:"14px 0",padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:9,fontSize:13,color:"#f87171"}}>{err}</div>}
          <button className="gold-btn pulse" onClick={checkout} disabled={loading} style={{width:"100%",marginTop:20,fontSize:14,padding:"14px"}}>
            {loading ? "Redirecting to Stripe…" : "Subscribe — $20/month →"}
          </button>
          <div style={{marginTop:12,fontSize:11,color:"var(--ash)"}}>
            Secured by Stripe. We never see your card details.
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Subscribe({ user, setUser }) {
  const navigate = useNavigate();
  return (
    <SubscribePage
      user={user}
      onSubscribed={()=>navigate("/dashboard")}
      onBack={()=>navigate(-1)}
      onRegister={()=>navigate("/register")}
      onLogout={()=>{ try{localStorage.removeItem("cr_user");}catch{} setUser(false); navigate("/login"); }}
    />
  );
}
