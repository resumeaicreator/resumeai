import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage({ mode, onSuccess, switchMode, onBack }) {
  const [email,setEmail]     = useState("");
  const [password,setPassword] = useState("");
  const [name,setName]       = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL||"";

  const submit = async () => {
    if (!email||!password) { setErr("Email and password required."); return; }
    setLoading(true); setErr("");
    try {
      const endpoint = mode==="register" ? "/api/auth/register" : "/api/auth/login";
      const body = mode==="register" ? {email,password,name} : {email,password};
      const res = await fetch(`${API}${endpoint}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(body)});
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Something went wrong."); return; }
      onSuccess(data.user);
    } catch(e) { setErr("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const googleLogin = () => { window.location.href = `${API}/api/auth/google`; };

  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      {onBack && (
        <button className="ghost-btn" style={{position:"absolute",top:24,left:24,fontSize:12,padding:"7px 14px",zIndex:10}} onClick={onBack}>← Back</button>
      )}
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:32,fontWeight:300,marginBottom:8}}>
            {mode==="register" ? "Create account" : "Welcome back"}
          </div>
          <div style={{fontSize:13,color:"var(--ash)"}}>
            {mode==="register" ? "$15/month. Cancel anytime." : "Sign in to your Crafted Resume account."}
          </div>
        </div>

        <div className="card" style={{padding:"32px 28px"}}>
          {/* Google OAuth */}
          <button onClick={googleLogin} style={{width:"100%",padding:"11px 16px",borderRadius:9,border:"1px solid var(--ghost-border)",background:"var(--mode-card-bg)",color:"var(--text-primary)",fontFamily:"var(--font-body)",fontSize:14,fontWeight:400,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20,transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold-border)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--ghost-border)"}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.32-8.16 2.32-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{flex:1,height:1,background:"var(--border-subtle)"}} />
            <span style={{fontSize:11,color:"var(--ash)",letterSpacing:"0.08em"}}>OR</span>
            <div style={{flex:1,height:1,background:"var(--border-subtle)"}} />
          </div>

          {mode==="register" && (
            <div style={{marginBottom:14}}>
              <label className="field-label">Full Name</label>
              <input placeholder="Alex Rivera" value={name} onChange={e=>setName(e.target.value)} />
            </div>
          )}
          <div style={{marginBottom:14}}>
            <label className="field-label">Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>
          <div style={{marginBottom:20}}>
            <label className="field-label">Password {mode==="register"&&<span style={{fontWeight:300,textTransform:"none",letterSpacing:0}}>(min 8 characters)</span>}</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>

          {err && <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:9,fontSize:13,color:"#f87171"}}>{err}</div>}

          <button className="gold-btn" onClick={submit} disabled={loading} style={{width:"100%"}}>
            {loading ? "Please wait…" : mode==="register" ? "Create Account →" : "Sign In →"}
          </button>

          <div style={{textAlign:"center",marginTop:18,fontSize:13,color:"var(--ash)"}}>
            {mode==="register"
              ? <>Already have an account? <button onClick={()=>switchMode("login")} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:13,fontFamily:"var(--font-body)"}}>Sign in</button></>
              : <>Need an account? <button onClick={()=>switchMode("register")} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:13,fontFamily:"var(--font-body)"}}>Register</button></>
            }
          </div>
          {mode==="login" && (
            <div style={{textAlign:"center",marginTop:10}}>
              <button onClick={()=>switchMode("forgot")} style={{background:"none",border:"none",color:"var(--ash)",cursor:"pointer",fontSize:12,fontFamily:"var(--font-body)"}}>Forgot password?</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function Register() {
  const navigate = useNavigate();
  return (
    <AuthPage
      mode="register"
      onBack={()=>navigate("/")}
      onSuccess={()=>navigate("/dashboard")}
      switchMode={m=>navigate("/"+m)}
    />
  );
}
