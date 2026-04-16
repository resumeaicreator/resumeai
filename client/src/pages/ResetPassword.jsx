import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPasswordPage({ token, onDone }) {
  const [password,setPassword]   = useState("");
  const [password2,setPassword2] = useState("");
  const [loading,setLoading]     = useState(false);
  const [done,setDone]           = useState(false);
  const [err,setErr]             = useState("");
  const API = process.env.REACT_APP_API_URL||"";
  const submit = async () => {
    if (password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (password !== password2) { setErr("Passwords do not match."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch(`${API}/api/auth/reset-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password})});
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Something went wrong."); return; }
      setDone(true);
    } catch { setErr("Network error. Please try again."); }
    finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:30,fontWeight:300,marginBottom:8}}>New password</div>
        </div>
        <div className="card" style={{padding:"32px 28px"}}>
          {done ? (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>✓</div>
              <div style={{fontWeight:500,marginBottom:8}}>Password updated</div>
              <div style={{fontSize:13,color:"var(--ash)",marginBottom:20}}>You can now sign in with your new password.</div>
              <button className="gold-btn" style={{width:"100%"}} onClick={onDone}>Sign In →</button>
            </div>
          ) : (
            <>
              <div style={{marginBottom:14}}>
                <label className="field-label">New Password</label>
                <input type="password" placeholder="Min 8 characters" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <div style={{marginBottom:20}}>
                <label className="field-label">Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={password2} onChange={e=>setPassword2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
              </div>
              {err && <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:9,fontSize:13,color:"#f87171"}}>{err}</div>}
              <button className="gold-btn" onClick={submit} disabled={loading} style={{width:"100%"}}>
                {loading ? "Updating…" : "Set New Password →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default function ResetPassword({ token }) {
  const navigate = useNavigate();
  return <ResetPasswordPage token={token} onDone={()=>navigate("/login")} />;
}
