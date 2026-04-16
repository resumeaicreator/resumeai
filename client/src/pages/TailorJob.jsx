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

export default function TailorJob({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [pdf, setPdf]               = useState(null);
  const [jobDescription, setJob]    = useState("");
  const [template, setTemplate]     = useState("executive");
  const [dragOver, setDragOver]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState("");

  const handleFile = file => {
    if (!file || file.type !== "application/pdf") { setErr("Please upload a PDF file."); return; }
    if (file.size > 5*1024*1024) { setErr("PDF must be under 5MB."); return; }
    const r = new FileReader();
    r.onload = e => { setPdf({ name:file.name, base64:e.target.result.split(",")[1] }); setErr(""); };
    r.readAsDataURL(file);
  };

  const generate = async () => {
    if (!pdf) { setErr("Please upload your resume PDF first."); return; }
    if (!jobDescription.trim()) { setErr("Please describe the job you are targeting."); return; }
    setErr("");
    const iv = startLoad(["Reading your resume…","Matching it to the role…","Rewriting your experience…","Polishing the result…"]);
    setLoading(true);
    try {
      const res = await callAPI("/api/tailor", { pdfBase64:pdf.base64, jobDescription, template });
      onResult(res, template);
      navigate("/tailor/results");
    } catch(e) {
      if (e.message==="premium_required") navigate("/subscribe");
      else if (e.message==="login_required") navigate("/login");
      else setErr(e.message || "Tailoring failed — please try again.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <div>
      {err && (
        <div className="fade-in" style={{ marginBottom:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>
          {err}
        </div>
      )}

      <div className="card fade-up d1">
        <h2 style={{ fontFamily:"var(--font-display)",fontSize:24,fontWeight:300,marginBottom:4 }}>Upload Your Existing Resume</h2>
        <p style={{ color:"var(--ash)",fontSize:13,marginBottom:24,fontWeight:300 }}>Your PDF is read and rewritten to match the job you want — even if the roles are completely different.</p>

        {/* Drop zone */}
        <div
          className={`drop-zone${dragOver?" drag-over":""}`}
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
          style={{ marginBottom:24 }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          {pdf ? (
            <div>
              <div style={{ fontSize:28,color:"var(--gold)",marginBottom:8 }}>✓</div>
              <div style={{ fontWeight:500,color:"var(--gold)",marginBottom:4,fontSize:14 }}>{pdf.name}</div>
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
              <div style={{ fontWeight:500,marginBottom:4,fontSize:14 }}>Drop your PDF resume here</div>
              <div style={{ fontSize:12,color:"var(--ash)" }}>or click to browse · PDF only · Max 5MB</div>
            </div>
          )}
        </div>

        <F label="Target Job — Describe the role you are applying for">
          <textarea
            placeholder={"Example: I am applying for a Cashier position at a local cafe. The job involves handling cash, serving customers, and keeping the counter tidy. I want my cybersecurity background reframed to highlight transferable skills: attention to detail, following procedures precisely, reliability, and working under pressure."}
            value={jobDescription}
            onChange={e=>setJob(e.target.value)}
            style={{ minHeight:150 }}
          />
        </F>
        <p style={{ fontSize:11,color:"rgba(255,255,255,0.18)",marginTop:-8,marginBottom:20 }}>The more context you give, the better the tailoring.</p>

        <F label="Resume Style"><TemplateSelector value={template} onChange={setTemplate} /></F>
      </div>

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap" }}>
        <button className="ghost-btn" onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="ghost-btn" style={{fontSize:12}} onClick={()=>{ setPdf(null); setJob(""); setErr(""); }}>Start Over</button>
        <button className="gold-btn" onClick={generate} disabled={loading} style={{ minWidth:220 }}>
          {loading
            ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>
            : "⟳ Tailor My Resume"}
        </button>
      </div>
    </div>
  );
}
