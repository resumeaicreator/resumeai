import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LinkedInWriterForm({ onResult, setErr, loading, setLoading, loadMsg, startLoad }) {
  const [name, setName]         = useState("");
  const [role, setRole]         = useState("");
  const [experience, setExperience] = useState("");
  const [tone, setTone]         = useState("professional");
  const API = process.env.REACT_APP_API_URL||"";

  const generate = async () => {
    if (!role.trim()) { setErr("Please enter your current or target role."); return; }
    setErr("");
    const iv = startLoad(["Writing your headline…","Crafting your About section…","Polishing the copy…"]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/linkedin-quick`, {
        method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include",
        body: JSON.stringify({ name: name.trim(), role: role.trim(), experience: experience.trim(), tone }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Something went wrong."); return; }
      onResult(data);
    } catch(e) { setErr(e.message||"Network error."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:20 }}>Your LinkedIn profile</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:16 }}>
        <div>
          <label className="field-label">Your Name</label>
          <input placeholder="e.g. Alex Chen" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Current / Target Role *</label>
          <input placeholder="e.g. Product Manager" value={role} onChange={e=>setRole(e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom:16 }}>
        <label className="field-label">Your Experience & Achievements</label>
        <textarea
          placeholder="e.g. 6 years in SaaS product management, led launch of 3 products, grew user base from 10k to 500k, team of 8..."
          value={experience}
          onChange={e=>setExperience(e.target.value)}
          style={{ minHeight:120 }}
        />
      </div>
      <div style={{ marginBottom:20 }}>
        <label className="field-label">Tone</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[
            { id:"professional", label:"Professional" },
            { id:"conversational", label:"Conversational" },
            { id:"bold", label:"Bold & Direct" },
            { id:"creative", label:"Creative" },
          ].map(t => (
            <button key={t.id} onClick={()=>setTone(t.id)} style={{
              padding:"8px 16px", borderRadius:20, border:`1px solid ${tone===t.id?"var(--gold)":"rgba(255,255,255,0.1)"}`,
              background: tone===t.id ? "var(--gold-dim)" : "transparent",
              color: tone===t.id ? "var(--gold)" : "var(--ash)",
              cursor:"pointer", fontSize:12, fontFamily:"var(--font-body)", transition:"all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <button className="gold-btn" onClick={generate} disabled={loading||!role.trim()} style={{ width:"100%", fontSize:14, padding:"14px" }}>
        {loading ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><span style={{ width:16,height:16,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />{loadMsg}</span> : "✍️ Write My LinkedIn Copy →"}
      </button>
    </div>
  );
}

export default function LinkedInWriter({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate  = useNavigate();
  const [cleared, setCleared] = useState(0);

  return (
    <div>
      <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(10,102,194,0.08),rgba(10,102,194,0.02))", border:"1px solid rgba(10,102,194,0.2)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:28 }}>✍️</div>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"#60a5fa", marginBottom:2 }}>LinkedIn Headline & Summary Writer</div>
          <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Get a punchy LinkedIn headline and compelling About section written by AI in seconds.</div>
        </div>
      </div>
      <div className="card fade-up d1">
        <LinkedInWriterForm
          key={cleared}
          onResult={r => { onResult(r); navigate("/linkedin-writer/results"); }}
          setErr={()=>{}}
          loading={false}
          setLoading={()=>{}}
          loadMsg={loadMsg}
          startLoad={startLoad}
        />
      </div>
      <div style={{ display:"flex", gap:8, marginTop:16 }}>
        <button className="ghost-btn" style={{fontSize:12}} onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="ghost-btn" style={{fontSize:12}} onClick={()=>setCleared(n=>n+1)}>Start Over</button>
      </div>
    </div>
  );
}
