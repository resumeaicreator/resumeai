import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Spinner = () => (
  <span style={{ width:16,height:16,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />
);

export default function InterviewPrep({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [role, setRole]           = useState("");
  const [company, setCompany]     = useState("");
  const [background, setBackground] = useState("");
  const [pdf, setPdf]             = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState("");

  const handleFile = file => {
    if (!file || file.type !== "application/pdf") { setErr("Please upload a PDF."); return; }
    if (file.size > 5*1024*1024) { setErr("PDF must be under 5MB."); return; }
    const r = new FileReader();
    r.onload = e => { setPdf({ name:file.name, base64:e.target.result.split(",")[1] }); setErr(""); };
    r.readAsDataURL(file);
  };

  const generate = async () => {
    if (!role.trim()) { setErr("Please enter the job role."); return; }
    setErr("");
    const iv = startLoad(["Researching the role…","Crafting your questions…","Writing guidance…","Finalising…"]);
    setLoading(true);
    try {
      const res = await callAPI("/api/interview-prep", {
        role: role.trim(),
        company: company.trim(),
        background: background.trim(),
        pdfBase64: pdf ? pdf.base64 : "",
      });
      onResult(res);
      navigate("/interview/results");
    } catch(e) {
      setErr(e.message || "Something went wrong.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  const clear = () => { setRole(""); setCompany(""); setBackground(""); setPdf(null); setErr(""); };

  return (
    <div>
      {err && <div className="fade-in" style={{ marginBottom:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>{err}</div>}

      <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(74,222,128,0.06),rgba(74,222,128,0.02))", border:"1px solid rgba(74,222,128,0.2)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:28 }}>🎯</div>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"#4ade80", marginBottom:2 }}>Interview Prep Generator</div>
          <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Upload your resume for personalised questions — or fill in your background manually.</div>
        </div>
      </div>

      <div className="card fade-up d1">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:20 }}>The Interview</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:16 }}>
          <div>
            <label className="field-label">Job Role *</label>
            <input placeholder="e.g. Senior Product Manager" value={role} onChange={e=>setRole(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Company (optional)</label>
            <input placeholder="e.g. Google, a startup..." value={company} onChange={e=>setCompany(e.target.value)} />
          </div>
        </div>

        {/* Resume upload */}
        <div style={{ marginBottom:16 }}>
          <label className="field-label">Your Resume (optional — for personalised questions)</label>
          <div className={`drop-zone${dragOver?" drag-over":""}`}
            onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
            style={{ padding:"20px", minHeight:"unset" }}
          >
            <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
            {pdf ? (
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20, color:"var(--gold)" }}>✓</span>
                <span style={{ fontSize:13, color:"var(--gold)", fontWeight:500 }}>{pdf.name}</span>
                <button onClick={e=>{e.stopPropagation();setPdf(null);}} style={{ background:"none",border:"none",color:"var(--ash)",cursor:"pointer",fontSize:12,fontFamily:"var(--font-body)",marginLeft:"auto" }}>Remove</button>
              </div>
            ) : (
              <div style={{ fontSize:13, color:"var(--ash)" }}>Drop your resume PDF here or click to browse</div>
            )}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label className="field-label">Additional Background (optional)</label>
          <textarea
            placeholder="Any extra context e.g. I have 5 years in PM, led teams of 8, launching a new product..."
            value={background}
            onChange={e=>setBackground(e.target.value)}
            style={{ minHeight:80 }}
          />
        </div>
      </div>

      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button className="ghost-btn" style={{fontSize:12}} onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="ghost-btn" style={{fontSize:12}} onClick={clear}>Start Over</button>
        <button className="gold-btn" onClick={generate} disabled={loading||!role.trim()} style={{ marginLeft:"auto", fontSize:14, padding:"13px 32px" }}>
          {loading ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span> : "🎯 Generate Questions →"}
        </button>
      </div>
    </div>
  );
}
