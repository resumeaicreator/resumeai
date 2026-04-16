import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage({ switchMode }) {
  const [email,setEmail]     = useState("");
  const [loading,setLoading] = useState(false);
  const [done,setDone]       = useState(false);
  const [err,setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL||"";
  const submit = async () => {
    if (!email) { setErr("Email required."); return; }
    setLoading(true); setErr("");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Something went wrong. Please try again.");
      }
    } catch(e) {
      if (e.name === "AbortError") {
        setErr("Request timed out — the server may be waking up. Please try again in 30 seconds.");
      } else {
        setErr("Network error. Please try again.");
      }
    }
    finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{position:"fixed",top:20,left:24}}>
        <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>switchMode("login")}>← Back</button>
      </div>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:30,fontWeight:300,marginBottom:8}}>Reset your password</div>
          <div style={{fontSize:13,color:"var(--ash)"}}>Enter your email and we'll send a reset link.</div>
        </div>
        <div className="card" style={{padding:"32px 28px"}}>
          {done ? (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>📬</div>
              <div style={{fontWeight:500,marginBottom:8}}>Check your email</div>
              <div style={{fontSize:13,color:"var(--ash)",marginBottom:20}}>If that address is registered, a reset link is on its way.</div>

            </div>
          ) : (
            <>
              <div style={{marginBottom:16}}>
                <label className="field-label">Email</label>
                <input type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
              </div>
              {err && <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:9,fontSize:13,color:"#f87171"}}>{err}</div>}
              <button className="gold-btn" onClick={submit} disabled={loading} style={{width:"100%",marginBottom:14}}>
                {loading ? "Sending…" : "Send Reset Link →"}
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default function ForgotPassword() {
  const navigate = useNavigate();
  return <ForgotPasswordPage switchMode={m=>navigate("/"+m)} />;
}
