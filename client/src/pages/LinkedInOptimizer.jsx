import { useState } from "react";
import { useNavigate } from "react-router-dom";

function F({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

const Spinner = () => (
  <span style={{ width:14,height:14,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />
);

function LinkedInImport({ onImport }) {
  const [text,setText]        = useState("");
  const [url,setUrl]          = useState("");
  const [loading,setLoading]  = useState(false);
  const [msg,setMsg]          = useState("");
  const [expanded,setExpanded]= useState(false);
  const doImport = async () => {
    if (!text.trim()) { setMsg("Please paste your LinkedIn profile text first."); return; }
    setLoading(true); setMsg("");
    try {
      const API = process.env.REACT_APP_API_URL||"";
      const res = await fetch(`${API}/api/linkedin-import`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:text.trim(),url:url.trim()})});
      const data = await res.json();
      if (!res.ok){setMsg(data.error||"Import failed."); return;}
      onImport(data);
      setMsg("✓ Imported successfully — review and edit the fields below.");
      setText(""); setUrl("");
    } catch(e){setMsg("Couldn't reach the server.");}
    finally{setLoading(false);}
  };
  return (
    <div style={{marginBottom:24,padding:"16px 18px",background:"rgba(10,102,194,0.06)",border:"1px solid rgba(10,102,194,0.2)",borderRadius:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:expanded?12:0}}>
        <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#60a5fa"}}>Import from LinkedIn</div>
        <button onClick={()=>setExpanded(e=>!e)} style={{background:"none",border:"none",color:"#60a5fa",cursor:"pointer",fontSize:12,fontFamily:"var(--font-body)"}}>
          {expanded ? "▲ Hide" : "▼ Show"}
        </button>
      </div>
      {expanded && (
        <div className="fade-in">
          <div style={{fontSize:12,color:"var(--ash)",marginBottom:12,lineHeight:1.6}}>
            LinkedIn blocks direct access, so paste your profile text below.<br/>
            <strong style={{color:"#60a5fa"}}>How:</strong> Open your LinkedIn profile → select all text (Ctrl+A) → copy (Ctrl+C) → paste here.
          </div>
          <textarea
            placeholder="Paste your LinkedIn profile text here..."
            value={text}
            onChange={e=>setText(e.target.value)}
            rows={5}
            style={{width:"100%",marginBottom:8,resize:"vertical",minHeight:100}}
          />
          <input
            placeholder="LinkedIn URL (optional, e.g. linkedin.com/in/yourname)"
            value={url}
            onChange={e=>setUrl(e.target.value)}
            style={{width:"100%",marginBottom:8}}
          />
          <button onClick={doImport} disabled={loading||!text.trim()} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:"#0a66c2",color:"#fff",fontFamily:"var(--font-body)",fontSize:13,fontWeight:500,cursor:loading||!text.trim()?"not-allowed":"pointer",opacity:loading||!text.trim()?0.5:1}}>
            {loading ? "Importing…" : "Import Profile →"}
          </button>
          {msg && <div style={{marginTop:8,fontSize:12,color:msg.startsWith("✓")?"#4ade80":"#f87171"}}>{msg}</div>}
        </div>
      )}
    </div>
  );
}

const EMPTY = {name:"",targetRole:"",headline:"",about:"",experience:"",skills:""};

export default function LinkedInOptimizer({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate = useNavigate();
  const [liData, setLiData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const g2 = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 };
  const upd = k => e => setLiData(d => ({...d, [k]:e.target.value}));

  const generate = async () => {
    if (!liData.name.trim()) { setErr("Please enter your name at minimum."); return; }
    setErr("");
    const iv = startLoad(["Reading your profile…","Spotting what to improve…","Writing your suggestions…","Putting it all together…"]);
    setLoading(true);
    try {
      const res = await callAPI("/api/linkedin", liData);
      onResult(res);
      navigate("/linkedin/results");
    } catch(e) {
      if (e.message==="premium_required") navigate("/subscribe");
      else if (e.message==="login_required") navigate("/login");
      else setErr(e.message || "LinkedIn analysis failed.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <div>
      {err && <div className="fade-in" style={{ marginBottom:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>{err}</div>}
      <div className="card fade-up d1">
        <h2 style={{ fontFamily:"var(--font-display)",fontSize:24,fontWeight:300,marginBottom:4 }}>Your LinkedIn Profile</h2>
        <p style={{ color:"var(--ash)",fontSize:13,marginBottom:20,fontWeight:300 }}>Fill in your details below or import from LinkedIn.</p>
        <LinkedInImport onImport={data=>setLiData(d=>({...d,...Object.fromEntries(Object.entries(data).filter(([,v])=>v))}))} />
        <div style={g2}>
          <F label="Your Name"><input placeholder="Alexandra Chen" value={liData.name} onChange={upd("name")} /></F>
          <F label="Target Role / Industry"><input placeholder="Cybersecurity Engineer · Tech" value={liData.targetRole} onChange={upd("targetRole")} /></F>
        </div>
        <F label="Current Headline"><input placeholder="Security Analyst at XYZ Corp | Protecting digital assets" value={liData.headline} onChange={upd("headline")} /></F>
        <F label="About / Summary Section"><textarea placeholder="Paste your current About section here..." value={liData.about} onChange={upd("about")} style={{ minHeight:120 }} /></F>
        <F label="Experience"><textarea placeholder="Senior Security Analyst at ABC Corp (2021–present)" value={liData.experience} onChange={upd("experience")} style={{ minHeight:140 }} /></F>
        <F label="Skills (comma separated)"><input placeholder="Penetration Testing, SIEM, Python, Network Security..." value={liData.skills} onChange={upd("skills")} /></F>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap" }}>
        <button className="ghost-btn" onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="ghost-btn" style={{fontSize:12}} onClick={()=>setLiData(EMPTY)}>Start Over</button>
        <button className="gold-btn" onClick={generate} disabled={loading} style={{ minWidth:220 }}>
          {loading ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span> : "Analyse My Profile"}
        </button>
      </div>
    </div>
  );
}
