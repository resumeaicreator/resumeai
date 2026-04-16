import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "./TemplateSelector";




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

export default function ApplyMode({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [inputMode, setInputMode] = useState("url");
  const [jobUrl, setJobUrl]       = useState("");
  const [jobText, setJobText]     = useState("");
  const [resume, setResume]       = useState(null);
  const [template, setTemplate]   = useState("executive");
  const [dragOver, setDragOver]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState("");

  const handleFile = file => {
    if (!file || file.type !== "application/pdf") { setErr("Please upload a PDF."); return; }
    if (file.size > 5*1024*1024) { setErr("PDF must be under 5MB."); return; }
    const r = new FileReader();
    r.onload = e => { setResume({ name:file.name, base64:e.target.result.split(",")[1] }); setErr(""); };
    r.readAsDataURL(file);
  };

  const generate = async () => {
    const hasUrl  = inputMode==="url"  && jobUrl.trim();
    const hasText = inputMode==="text" && jobText.trim();
    const hasBoth = inputMode==="both" && (jobUrl.trim() || jobText.trim());
    if (!hasUrl && !hasText && !hasBoth) { setErr("Please provide a job URL or paste the job description."); return; }
    if (!resume) { setErr("Please upload your resume PDF."); return; }
    setErr("");
    const iv = startLoad(["Reading the job posting…","Matching your background…","Rewriting your resume…","Writing your cover letter…","Preparing interview questions…","Putting it all together…"]);
    setLoading(true);
    try {
      const res = await callAPI("/api/apply", {
        jobUrl:    jobUrl.trim(),
        jobText:   jobText.trim(),
        pdfBase64: resume.base64,
        template,
      });
      onResult(res, template);
      navigate("/apply/results");
    } catch(e) {
      if (e.message==="premium_required") navigate("/subscribe");
      else if (e.message==="login_required") navigate("/login");
      else setErr(e.message || "Apply Mode failed — please try again.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  const clear = () => { setJobUrl(""); setJobText(""); setResume(null); setInputMode("url"); setErr(""); };

  return (
    <div>
      {err && <div className="fade-in" style={{ marginBottom:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>{err}</div>}

      {/* Banner */}
      <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04))", border:"1px solid var(--gold-border)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:28 }}>⚡</div>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"var(--gold)", marginBottom:2 }}>Apply Mode — Full Pre-Interview Package</div>
          <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Paste a job URL or description + upload your resume → get a tailored resume, cover letter, and interview prep in one shot.</div>
        </div>
      </div>

      {/* The Job */}
      <div className="card fade-up d1">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>The Job</h2>
        <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Provide the job you want to apply for.</p>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[{id:"url",label:"Job URL"},{id:"text",label:"Paste Description"},{id:"both",label:"Both"}].map(t=>(
            <button key={t.id} onClick={()=>setInputMode(t.id)}
              style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${inputMode===t.id?"var(--gold)":"rgba(255,255,255,0.1)"}`, background:inputMode===t.id?"var(--gold-dim)":"transparent", color:inputMode===t.id?"var(--gold)":"var(--ash)", cursor:"pointer", fontSize:12, fontFamily:"var(--font-body)", fontWeight:500, transition:"all 0.2s" }}
            >{t.label}</button>
          ))}
        </div>
        {(inputMode==="url"||inputMode==="both") && (
          <F label="Job Posting URL">
            <input placeholder="https://www.linkedin.com/jobs/view/..." value={jobUrl} onChange={e=>setJobUrl(e.target.value)} />
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:5 }}>The full job posting is fetched and read automatically.</p>
          </F>
        )}
        {(inputMode==="text"||inputMode==="both") && (
          <F label="Job Description">
            <textarea placeholder="Paste the full job description here..." value={jobText} onChange={e=>setJobText(e.target.value)} style={{ minHeight:180 }} />
          </F>
        )}
      </div>

      {/* Resume upload */}
      <div className="card fade-up d2">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Your Resume</h2>
        <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Upload your current resume PDF — it will be tailored specifically to this job.</p>
        <div className={`drop-zone${dragOver?" drag-over":""}`}
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          {resume ? (
            <div>
              <div style={{ fontSize:28,color:"var(--gold)",marginBottom:8 }}>✓</div>
              <div style={{ fontWeight:500,color:"var(--gold)",fontSize:14,marginBottom:4 }}>{resume.name}</div>
              <div style={{ fontSize:12,color:"var(--ash)" }}>Click to replace</div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom:12,color:"var(--ash)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div style={{ fontWeight:500,marginBottom:4,fontSize:14 }}>Drop your resume PDF here</div>
              <div style={{ fontSize:12,color:"var(--ash)" }}>or click to browse · Max 5MB</div>
            </div>
          )}
        </div>
        <div style={{ marginTop:20 }}>
          <F label="Resume Style"><TemplateSelector value={template} onChange={setTemplate} /></F>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <button className="ghost-btn" onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="ghost-btn" style={{fontSize:12}} onClick={clear}>Start Over</button>
        <button className="gold-btn" onClick={generate} disabled={loading} style={{ minWidth:240 }}>
          {loading
            ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>
            : "⚡ Generate Full Package"}
        </button>
      </div>
    </div>
  );
}
