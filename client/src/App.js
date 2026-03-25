import { useState, useRef } from "react";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0d0d0f;
      --ink2: #1a1a1f;
      --ink3: #252530;
      --gold: #c9a84c;
      --gold2: #e8c96d;
      --gold-dim: rgba(201,168,76,0.15);
      --gold-border: rgba(201,168,76,0.3);
      --ash: #8a8a96;
      --mist: rgba(255,255,255,0.06);
      --mist2: rgba(255,255,255,0.03);
      --cream: #f5f0e8;
      --font-display: 'Cormorant Garamond', Georgia, serif;
      --font-body: 'Outfit', 'Segoe UI', sans-serif;
    }

    body { background: var(--ink); font-family: var(--font-body); color: #e8e8ee; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      70%  { box-shadow: 0 0 0 10px rgba(201,168,76,0); }
      100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes grain {
      0%, 100% { transform: translate(0,0); }
      10% { transform: translate(-2%,-3%); }
      30% { transform: translate(3%,-1%); }
      50% { transform: translate(-1%,2%); }
      70% { transform: translate(2%,3%); }
      90% { transform: translate(-3%,1%); }
    }

    .fade-up { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.12s; }
    .fade-up-3 { animation-delay: 0.19s; }
    .fade-up-4 { animation-delay: 0.26s; }

    input, textarea, select {
      background: var(--mist);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: #e8e8ee;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 300;
      padding: 11px 14px;
      width: 100%;
      outline: none;
      transition: border-color 0.25s, background 0.25s;
    }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
    input:focus, textarea:focus {
      border-color: var(--gold-border);
      background: rgba(201,168,76,0.04);
    }
    textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

    .gold-btn {
      background: linear-gradient(135deg, #c9a84c 0%, #e8c96d 50%, #c9a84c 100%);
      background-size: 200% auto;
      border: none;
      border-radius: 8px;
      color: #0d0d0f;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 12px 28px;
      text-transform: uppercase;
      transition: background-position 0.5s, transform 0.2s, box-shadow 0.2s;
    }
    .gold-btn:hover {
      background-position: right center;
      transform: translateY(-1px);
      box-shadow: 0 8px 30px rgba(201,168,76,0.25);
    }
    .gold-btn:active { transform: translateY(0); }
    .gold-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

    .ghost-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: var(--ash);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 400;
      padding: 11px 22px;
      transition: border-color 0.2s, color 0.2s;
    }
    .ghost-btn:hover { border-color: rgba(255,255,255,0.25); color: #e8e8ee; }

    .card {
      background: var(--ink2);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 32px 36px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(201,168,76,0.03) 0%, transparent 60%);
      pointer-events: none;
    }

    label.field-label {
      display: block;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ash);
      margin-bottom: 7px;
    }

    .step-dot {
      transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    }

    .template-card {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 18px;
      cursor: pointer;
      transition: all 0.25s;
      background: var(--mist2);
    }
    .template-card:hover { border-color: var(--gold-border); background: var(--gold-dim); }
    .template-card.active { border-color: var(--gold); background: var(--gold-dim); }

    /* noise overlay */
    .noise::after {
      content: '';
      position: fixed;
      inset: -50%;
      width: 200%;
      height: 200%;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      animation: grain 8s steps(1) infinite;
    }
  `}</style>
);

const STEPS = ["Personal", "Experience", "Skills", "Generate"];
const ATS_WORDS = ["led","managed","developed","increased","reduced","achieved","collaborated","implemented","delivered","optimized","launched","spearheaded","drove","built","designed","scaled","streamlined","negotiated","mentored","generated"];

const blank = () => ({ background:"", role:"", startDate:"", endDate:"", current:false, bullets:"" });
const blankEdu = () => ({ school:"", degree:"", field:"", year:"" });

const init = {
  name:"", email:"", phone:"", location:"", linkedin:"",
  targetRole:"", targetIndustry:"",
  experiences:[blank()],
  education:[blankEdu()],
  skills:"", certifications:"", template:"executive",
};

/* ── ATS Meter ── */
function ATSMeter({ text }) {
  const lower = (text||"").toLowerCase();
  const hits = ATS_WORDS.filter(w => lower.includes(w));
  const score = Math.min(98, 28 + Math.round((hits.length / ATS_WORDS.length) * 70));
  const color = score >= 70 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ marginTop:20, padding:"18px 20px", background:"rgba(0,0,0,0.3)", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
        <span style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--ash)" }}>ATS Compatibility</span>
        <span style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:300, color }}>{score}<span style={{ fontSize:14, color:"var(--ash)" }}>/100</span></span>
      </div>
      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:999, height:4, overflow:"hidden" }}>
        <div style={{ width:`${score}%`, height:"100%", background:`linear-gradient(90deg, ${color}88, ${color})`, borderRadius:999, transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      {hits.length > 0 && <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>Detected: {hits.slice(0,5).join(" · ")}</p>}
    </div>
  );
}

/* ── Resume Preview (light, print-ready) ── */
function Preview({ data, template }) {
  if (!data) return null;
  const cfg = {
    executive: { accent:"#1a1a2e", sub:"#8a8a96", font:"'Cormorant Garamond', Georgia, serif", bodyFont:"'Outfit', sans-serif" },
    modern:    { accent:"#0f4c81", sub:"#555", font:"'Outfit', sans-serif", bodyFont:"'Outfit', sans-serif" },
    minimal:   { accent:"#2c2c2c", sub:"#777", font:"Georgia, serif", bodyFont:"Georgia, serif" },
  };
  const c = cfg[template] || cfg.executive;
  return (
    <div id="resume-output" style={{ background:"#fff", color:"#1a1a2e", fontFamily:c.bodyFont, padding:"52px 60px", lineHeight:1.65, fontSize:13.5 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:c.font, fontSize:36, fontWeight:300, letterSpacing:"-0.5px", color:c.accent, marginBottom:4 }}>{data.name}</h1>
        <div style={{ fontFamily:c.font, fontSize:16, fontStyle:"italic", color:c.sub, marginBottom:10 }}>{data.targetRole}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:12, color:"#666", borderTop:`1.5px solid ${c.accent}`, paddingTop:10 }}>
          {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).map((v,i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      {data.summary && <Section title="Profile" accent={c.accent}><p style={{ color:"#333", fontStyle:"italic" }}>{data.summary}</p></Section>}
      {data.experience && <Section title="Experience" accent={c.accent}><div dangerouslySetInnerHTML={{ __html: data.experience.replace(/\n/g,"<br/>").replace(/•/g,"<span style='color:"+c.accent+"'>•</span>") }} style={{ color:"#333" }} /></Section>}
      {data.education && <Section title="Education" accent={c.accent}><div dangerouslySetInnerHTML={{ __html: data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Section>}
      {data.skills && <Section title="Skills" accent={c.accent}><div style={{ color:"#333" }}>{data.skills}</div></Section>}
      {data.certifications && <Section title="Certifications" accent={c.accent}><div style={{ color:"#333" }}>{data.certifications}</div></Section>}
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontSize:10, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:accent, borderBottom:`1px solid ${accent}22`, paddingBottom:6, marginBottom:12 }}>{title}</h2>
      {children}
    </div>
  );
}

/* ── Step Indicator ── */
function Steps({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:36 }}>
      {STEPS.map((s,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div className="step-dot" style={{
              width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:500, margin:"0 auto 6px",
              background: i < current ? "var(--gold)" : i === current ? "transparent" : "transparent",
              border: i >= current ? `1px solid ${i === current ? "var(--gold)" : "rgba(255,255,255,0.12)"}` : "none",
              color: i < current ? "#0d0d0f" : i === current ? "var(--gold)" : "var(--ash)",
              animation: i === current ? "pulse-ring 2s ease-out infinite" : "none",
            }}>{i < current ? "✓" : i+1}</div>
            <div style={{ fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color: i === current ? "var(--gold)" : "var(--ash)", fontWeight: i === current ? 500 : 400 }}>{s}</div>
          </div>
          {i < STEPS.length-1 && <div style={{ width:40, height:1, background: i < current ? "var(--gold-border)" : "rgba(255,255,255,0.08)", margin:"0 8px", marginBottom:18 }} />}
        </div>
      ))}
    </div>
  );
}

/* ── Field ── */
function F({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

/* ── Gold divider ── */
function GoldLine() {
  return <div style={{ height:1, background:"linear-gradient(90deg, transparent, var(--gold-border), transparent)", margin:"20px 0" }} />;
}

/* ══════════════════════ MAIN APP ══════════════════════ */
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(init);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const containerRef = useRef(null);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const setExp = (i,k,v) => { const a=[...form.experiences]; a[i]={...a[i],[k]:v}; set("experiences",a); };
  const setEdu = (i,k,v) => { const a=[...form.education]; a[i]={...a[i],[k]:v}; set("education",a); };
  const addExp = () => set("experiences",[...form.experiences,blank()]);
  const rmExp  = i  => set("experiences",form.experiences.filter((_,j)=>j!==i));
  const addEdu = () => set("education",[...form.education,blankEdu()]);

  const scrollTop = () => containerRef.current?.scrollTo({top:0,behavior:"smooth"});
  const go = n => { setStep(n); setTimeout(scrollTop, 50); };

  /* ── GENERATE ── */
  const generate = async () => {
    setLoading(true); setErr(""); setResult(null);
    const msgs = ["Analysing your career story…","Crafting compelling bullets…","Optimising for ATS…","Applying finishing polish…"];
    let mi = 0; setLoadMsg(msgs[0]);
    const iv = setInterval(() => { mi=(mi+1)%msgs.length; setLoadMsg(msgs[mi]); }, 2000);

    try {
      // Sends structured form data to YOUR backend — API key never touches the browser
      const API = process.env.REACT_APP_API_URL || "";
      const res = await fetch(`${API}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:           form.name,
          email:          form.email,
          phone:          form.phone,
          location:       form.location,
          linkedin:       form.linkedin,
          targetRole:     form.targetRole,
          targetIndustry: form.targetIndustry,
          experiences:    form.experiences,
          education:      form.education,
          skills:         form.skills,
          certifications: form.certifications,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Server error");
      }

      const resume = await res.json();
      setResult(resume);
      go(3);
    } catch(e) {
      setErr(e.message || "Generation failed — please try again.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  const downloadTxt = () => {
    if (!result) return;
    const t = `${result.name}\n${result.email} | ${result.phone} | ${result.location}\n${result.linkedin}\n\n${"═".repeat(60)}\n${result.targetRole.toUpperCase()}\n${"═".repeat(60)}\n\nPROFILE\n${result.summary}\n\nEXPERIENCE\n${result.experience}\n\nEDUCATION\n${result.education}\n\nSKILLS\n${result.skills}`;
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([t],{type:"text/plain"})), download:`${result.name?.replace(/\s/g,"_")}_resume.txt` });
    a.click();
  };

  const g2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 };

  return (
    <>
      <FontLink />
      <div className="noise" style={{ minHeight:"100vh", background:"var(--ink)", position:"relative" }}>

        {/* ── Ambient glow ── */}
        <div style={{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:600, height:400, background:"radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        {/* ── Header ── */}
        <header style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(13,13,15,0.85)", backdropFilter:"blur(20px)", padding:"0 40px" }}>
          <div style={{ maxWidth:860, margin:"0 auto", display:"flex", alignItems:"center", height:64 }}>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, letterSpacing:"0.05em", color:"var(--gold)" }}>Résumé<span style={{ color:"rgba(255,255,255,0.4)" }}> · </span>AI</div>
              <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--ash)", marginTop:-2 }}>Powered by Claude</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
              {["AI Writing","ATS Engine","PDF Export"].map(f=>(
                <span key={f} style={{ fontSize:10, letterSpacing:"0.06em", textTransform:"uppercase", padding:"5px 10px", borderRadius:6, border:"1px solid rgba(255,255,255,0.07)", color:"var(--ash)" }}>{f}</span>
              ))}
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <div ref={containerRef} style={{ maxWidth:860, margin:"0 auto", padding:"40px 40px 80px", position:"relative", zIndex:1 }}>

          {step < 3 && (
            <div className="fade-up" style={{ textAlign:"center", marginBottom:48 }}>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:48, fontWeight:300, letterSpacing:"-1px", lineHeight:1.1, marginBottom:12 }}>
                Your career,<br /><em style={{ color:"var(--gold)" }}>perfectly told.</em>
              </h1>
              <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>AI-crafted resumes that pass ATS filters and impress human readers.</p>
            </div>
          )}

          <Steps current={step} />

          {/* ══ STEP 0 ══ */}
          {step===0 && (
            <div className="fade-up fade-up-1">
              <div className="card">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Personal Information</h2>
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:28, fontWeight:300 }}>Tell us about yourself and your target role.</p>
                <div style={g2}><F label="Full Name"><input placeholder="Alexandra Chen" value={form.name} onChange={e=>set("name",e.target.value)} /></F><F label="Target Role"><input placeholder="Chief Product Officer" value={form.targetRole} onChange={e=>set("targetRole",e.target.value)} /></F></div>
                <div style={g2}><F label="Email"><input placeholder="alex@example.com" value={form.email} onChange={e=>set("email",e.target.value)} /></F><F label="Phone"><input placeholder="+1 555 000 1234" value={form.phone} onChange={e=>set("phone",e.target.value)} /></F></div>
                <div style={g2}><F label="Location"><input placeholder="San Francisco, CA" value={form.location} onChange={e=>set("location",e.target.value)} /></F><F label="Target Industry"><input placeholder="Technology / FinTech / Healthcare" value={form.targetIndustry} onChange={e=>set("targetIndustry",e.target.value)} /></F></div>
                <F label="LinkedIn URL"><input placeholder="linkedin.com/in/alexandrachen" value={form.linkedin} onChange={e=>set("linkedin",e.target.value)} /></F>
              </div>
              <div style={{ textAlign:"right" }}><button className="gold-btn" onClick={()=>go(1)}>Continue →</button></div>
            </div>
          )}

          {/* ══ STEP 1 ══ */}
          {step===1 && (
            <div className="fade-up fade-up-1">
              {form.experiences.map((exp,i)=>(
                <div key={i} className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                    <div>
                      <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:4 }}>Position {i+1}</div>
                      <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:300 }}>{exp.role||"New Role"}{exp.company&&<span style={{ color:"var(--ash)" }}> · {exp.company}</span>}</h3>
                    </div>
                    {i>0&&<button className="ghost-btn" style={{ fontSize:12, padding:"6px 14px" }} onClick={()=>rmExp(i)}>Remove</button>}
                  </div>
                  <div style={g2}><F label="Company"><input placeholder="Acme Corporation" value={exp.company} onChange={e=>setExp(i,"company",e.target.value)} /></F><F label="Role / Title"><input placeholder="VP of Engineering" value={exp.role} onChange={e=>setExp(i,"role",e.target.value)} /></F></div>
                  <div style={g2}>
                    <F label="Start Date"><input placeholder="March 2020" value={exp.startDate} onChange={e=>setExp(i,"startDate",e.target.value)} /></F>
                    <F label="End Date">
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <input placeholder="December 2023" value={exp.endDate} onChange={e=>setExp(i,"endDate",e.target.value)} disabled={exp.current} style={{ opacity:exp.current?0.35:1 }} />
                        <label style={{ display:"flex", gap:8, alignItems:"center", whiteSpace:"nowrap", fontSize:13, color:"var(--ash)", cursor:"pointer", userSelect:"none" }}>
                          <input type="checkbox" checked={exp.current} onChange={e=>setExp(i,"current",e.target.checked)} style={{ width:16, height:16, accentColor:"var(--gold)" }} /> Present
                        </label>
                      </div>
                    </F>
                  </div>
                  <F label="Responsibilities & Achievements">
                    <textarea placeholder={"Led cross-functional team of 12 to redesign checkout flow.\nReduced cart abandonment by 18%.\nBuilt ML-powered recommendation engine."} value={exp.bullets} onChange={e=>setExp(i,"bullets",e.target.value)} style={{ minHeight:110 }} />
                  </F>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", marginTop:-8 }}>Claude will refine these into polished, metric-driven bullets.</p>
                </div>
              ))}
              <button className="ghost-btn" onClick={addExp} style={{ width:"100%", padding:"14px", marginBottom:20, textAlign:"center", borderStyle:"dashed" }}>+ Add Another Position</button>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <button className="ghost-btn" onClick={()=>go(0)}>← Back</button>
                <button className="gold-btn" onClick={()=>go(2)}>Continue →</button>
              </div>
            </div>
          )}

          {/* ══ STEP 2 ══ */}
          {step===2 && (
            <div className="fade-up fade-up-1">
              <div className="card">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:24 }}>Education</h2>
                {form.education.map((edu,i)=>(
                  <div key={i} style={{ marginBottom:16 }}>
                    <div style={g2}><F label="Institution"><input placeholder="Harvard Business School" value={edu.school} onChange={e=>setEdu(i,"school",e.target.value)} /></F><F label="Degree"><input placeholder="Master of Business Administration" value={edu.degree} onChange={e=>setEdu(i,"degree",e.target.value)} /></F></div>
                    <div style={g2}><F label="Field of Study"><input placeholder="Finance & Strategy" value={edu.field} onChange={e=>setEdu(i,"field",e.target.value)} /></F><F label="Year"><input placeholder="2018" value={edu.year} onChange={e=>setEdu(i,"year",e.target.value)} /></F></div>
                    {i < form.education.length-1 && <GoldLine />}
                  </div>
                ))}
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={addEdu}>+ Add Education</button>
              </div>

              <div className="card">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:24 }}>Skills & Certifications</h2>
                <F label="Key Skills">
                  <textarea placeholder="Leadership & Team Building, Product Strategy, SQL & Python, Figma, Stakeholder Management, Go-to-Market, OKR Frameworks..." value={form.skills} onChange={e=>set("skills",e.target.value)} />
                </F>
                <F label="Certifications">
                  <input placeholder="PMP, AWS Solutions Architect, CFA Level II, Google Analytics..." value={form.certifications} onChange={e=>set("certifications",e.target.value)} />
                </F>
              </div>

              <div className="card">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:20 }}>Resume Style</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  {[
                    { id:"executive", title:"Executive", desc:"Cormorant serif, commanding presence" },
                    { id:"modern",    title:"Modern",    desc:"Clean sans-serif, contemporary" },
                    { id:"minimal",   title:"Minimal",   desc:"Understated, let content lead" },
                  ].map(t=>(
                    <div key={t.id} className={`template-card${form.template===t.id?" active":""}`} onClick={()=>set("template",t.id)}>
                      <div style={{ fontWeight:500, fontSize:14, marginBottom:5, color: form.template===t.id ? "var(--gold)" : "#e8e8ee" }}>{t.title}</div>
                      <div style={{ fontSize:12, color:"var(--ash)", fontWeight:300 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <button className="ghost-btn" onClick={()=>go(1)}>← Back</button>
                <button className="gold-btn" onClick={generate} disabled={loading} style={{ minWidth:200, position:"relative" }}>
                  {loading
                    ? <span style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
                        <span style={{ width:14, height:14, border:"2px solid rgba(0,0,0,0.3)", borderTopColor:"#0d0d0f", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
                        {loadMsg}
                      </span>
                    : "✦ Generate Resume"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3 — Result ══ */}
          {step===3 && result && (
            <div className="fade-up">
              <div className="card" style={{ borderColor:"rgba(74,222,128,0.2)", background:"rgba(74,222,128,0.04)", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, color:"#4ade80", marginBottom:4 }}>✓ Resume Complete</div>
                    <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Your AI-crafted resume is ready. Review, then download or print to PDF.</div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{setResult(null);go(0);}}>Start Over</button>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={downloadTxt}>Download .txt</button>
                    <button className="gold-btn" style={{ fontSize:12, padding:"10px 20px" }} onClick={()=>window.print()}>Print / Save PDF</button>
                  </div>
                </div>
                <ATSMeter text={`${result.summary} ${result.experience} ${result.skills}`} />
              </div>

              <div style={{ borderRadius:16, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>
                <Preview data={result} template={form.template} />
              </div>
            </div>
          )}

          {err && (
            <div style={{ marginTop:16, padding:"14px 18px", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, color:"#f87171", fontSize:13 }}>
              {err}
            </div>
          )}
        </div>
      </div>
    </>
  );
}