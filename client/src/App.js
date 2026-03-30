import { useState, useRef, useEffect } from "react";

/* ─── Fonts + Global Styles ─── */
const FontLink = () => {
  useEffect(() => {
    if (!document.getElementById("html2pdf-script")) {
      const s = document.createElement("script");
      s.id = "html2pdf-script";
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      document.head.appendChild(s);
    }
  }, []);
  return (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Dark theme (default) ── */
    :root {
      --ink:  #0d0d0f; --ink2: #1a1a1f; --ink3: #252530;
      --gold: #c9a84c; --gold2: #e8c96d; --gold3: #f0d98a;
      --gold-dim: rgba(201,168,76,0.12); --gold-border: rgba(201,168,76,0.28);
      --ash:  #7a7a88; --ash2: #5a5a68;
      --mist: rgba(255,255,255,0.055); --mist2: rgba(255,255,255,0.025);
      --text-primary: #e2e2ea; --text-secondary: #7a7a88;
      --border-subtle: rgba(255,255,255,0.065);
      --input-bg: rgba(255,255,255,0.055); --input-border: rgba(255,255,255,0.07);
      --input-placeholder: rgba(255,255,255,0.18);
      --card-bg: #1a1a1f; --card-hover-shadow: 0 12px 48px rgba(0,0,0,0.35);
      --header-bg: rgba(13,13,15,0.82);
      --ghost-border: rgba(255,255,255,0.1); --ghost-hover-border: rgba(255,255,255,0.22);
      --ghost-hover-bg: rgba(255,255,255,0.055);
      --mode-card-bg: rgba(255,255,255,0.025);
      --font-display: 'Cormorant Garamond', Georgia, serif;
      --font-body: 'Outfit', 'Segoe UI', sans-serif;
    }

    /* ── Light theme ── */
    :root.light {
      --ink:  #f5f3ef; --ink2: #ffffff; --ink3: #ede9e0;
      --gold: #a8781e; --gold2: #c49030; --gold3: #d4a840;
      --gold-dim: rgba(168,120,30,0.08); --gold-border: rgba(168,120,30,0.3);
      --ash:  #6b6560; --ash2: #9c9690;
      --mist: rgba(0,0,0,0.04); --mist2: rgba(0,0,0,0.02);
      --text-primary: #1c1a17; --text-secondary: #6b6560;
      --border-subtle: rgba(0,0,0,0.08);
      --input-bg: #ffffff; --input-border: rgba(0,0,0,0.12);
      --input-placeholder: rgba(0,0,0,0.25);
      --card-bg: #ffffff; --card-hover-shadow: 0 12px 48px rgba(0,0,0,0.1);
      --header-bg: rgba(245,243,239,0.88);
      --ghost-border: rgba(0,0,0,0.12); --ghost-hover-border: rgba(0,0,0,0.25);
      --ghost-hover-bg: rgba(0,0,0,0.04);
      --mode-card-bg: rgba(0,0,0,0.02);
    }

    html { scroll-behavior: smooth; }
    body { background: var(--ink); font-family: var(--font-body); color: var(--text-primary); overflow-x: hidden; transition: background 0.3s, color 0.3s; }

    /* ── Keyframes ── */
    @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes scaleIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
    @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes breathe   { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0)} 50%{box-shadow:0 0 28px 4px rgba(201,168,76,0.18)} }
    @keyframes drawLine  { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
    @keyframes logoFade  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes particleDrift {
      0%   { transform:translateY(0px) translateX(0px); opacity:0; }
      10%  { opacity:1; } 90% { opacity:0.6; }
      100% { transform:translateY(-120px) translateX(var(--dx,20px)); opacity:0; }
    }
    @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes pulseGold { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.5)} 50%{box-shadow:0 0 0 8px rgba(201,168,76,0)} }
    @keyframes stepComplete { 0%{transform:scale(1)} 40%{transform:scale(1.25)} 100%{transform:scale(1)} }

    /* ── Utility ── */
    .fade-up  { animation: fadeUp  0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in  { animation: fadeIn  0.5s ease both; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .d1{animation-delay:0.06s} .d2{animation-delay:0.13s} .d3{animation-delay:0.20s} .d4{animation-delay:0.27s} .d5{animation-delay:0.34s}

    /* ── Inputs ── */
    input, textarea {
      background: var(--input-bg); border: 1px solid var(--input-border);
      border-radius: 9px; color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; font-weight: 300; padding: 11px 14px; width: 100%;
      outline: none; transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
    }
    input::placeholder, textarea::placeholder { color: var(--input-placeholder); }
    input:focus, textarea:focus {
      border-color: var(--gold-border);
      background: var(--gold-dim);
      box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
    }
    textarea { resize: vertical; min-height: 90px; line-height: 1.65; }

    /* ── Gold button ── */
    .gold-btn {
      background: linear-gradient(135deg,#b8922e 0%,#e8c96d 40%,#c9a84c 70%,#b8922e 100%);
      background-size: 250% auto; border: none; border-radius: 9px; color: #0d0d0f;
      cursor: pointer; font-family: var(--font-body); font-size: 13px; font-weight: 600;
      letter-spacing: 0.09em; padding: 13px 30px; text-transform: uppercase;
      transition: background-position 0.6s, transform 0.2s, box-shadow 0.3s;
      position: relative; overflow: hidden;
    }
    .gold-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform:translateX(-100%); transition:transform 0.5s; }
    .gold-btn:hover { background-position:right center; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,168,76,0.3); }
    .gold-btn:hover::after { transform:translateX(100%); }
    .gold-btn:active { transform:translateY(0); box-shadow:none; }
    .gold-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
    .gold-btn.pulse { animation:pulseGold 2s ease-out infinite; }

    /* ── Ghost button ── */
    .ghost-btn {
      background: transparent; border: 1px solid var(--ghost-border); border-radius: 9px;
      color: var(--ash); cursor: pointer; font-family: var(--font-body); font-size: 13px;
      font-weight: 400; padding: 11px 22px;
      transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.2s;
    }
    .ghost-btn:hover { border-color: var(--ghost-hover-border); color: var(--text-primary); background: var(--ghost-hover-bg); transform: translateY(-1px); }

    /* ── Cards ── */
    .card {
      background: var(--card-bg); border: 1px solid var(--border-subtle);
      border-radius: 18px; padding: 32px 36px; margin-bottom: 20px;
      position: relative; overflow: hidden;
      transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
    }
    .card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(201,168,76,0.025) 0%,transparent 55%); pointer-events:none; }
    .card:hover { border-color:rgba(201,168,76,0.15); box-shadow:var(--card-hover-shadow),0 0 0 1px rgba(201,168,76,0.06); transform:translateY(-2px); }

    /* ── Field label ── */
    label.field-label { display:block; font-size:10px; font-weight:500; letter-spacing:0.13em; text-transform:uppercase; color:var(--ash); margin-bottom:7px; }

    /* ── Mode / Template cards ── */
    .mode-card {
      border: 1px solid var(--border-subtle); border-radius: 14px; padding: 24px;
      cursor: pointer; background: var(--mode-card-bg);
      transition: border-color 0.28s, background 0.28s, transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s cubic-bezier(0.22,1,0.36,1);
      will-change: transform;
    }
    .mode-card:hover {
      border-color: var(--gold-border); background: var(--gold-dim);
      transform: translateY(-10px) scale(1.03);
      box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.12), 0 20px 40px rgba(0,0,0,0.16), 0 0 0 1px rgba(201,168,76,0.15), 0 28px 32px -12px rgba(201,168,76,0.18);
    }
    .mode-card.active { border-color:var(--gold); background:var(--gold-dim); box-shadow:0 0 0 1px var(--gold-border),0 8px 30px rgba(201,168,76,0.12); }

    /* ── Drop zone ── */
    .drop-zone { border:1.5px dashed var(--gold-border); border-radius:14px; padding:40px; text-align:center; cursor:pointer; transition:border-color 0.3s,background 0.3s,transform 0.3s; }
    .drop-zone:hover,.drop-zone.drag-over { border-color:var(--gold); background:var(--gold-dim); transform:scale(1.01); }

    /* ── Step dots ── */
    .step-dot { transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1); }

    /* ── LinkedIn cards ── */
    .li-card { background:rgba(10,102,194,0.07); border:1px solid rgba(10,102,194,0.22); border-radius:12px; padding:16px 20px; margin-bottom:12px; transition:border-color 0.25s,background 0.25s; }
    .li-card:hover { border-color:rgba(10,102,194,0.4); background:rgba(10,102,194,0.12); }
    .li-tag { display:inline-block; font-size:10px; padding:3px 10px; border-radius:20px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; }
    .tag-high { background:rgba(248,113,113,0.15); color:#f87171; }
    .tag-med  { background:rgba(251,191,36,0.15);  color:#fbbf24; }
    .tag-low  { background:rgba(74,222,128,0.15);  color:#4ade80; }

    /* ── Theme toggle button ── */
    .theme-toggle {
      width:36px; height:36px; border-radius:10px; border:1px solid var(--ghost-border);
      background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center;
      font-size:16px; transition:all 0.25s; flex-shrink:0;
    }
    .theme-toggle:hover { border-color:var(--gold-border); background:var(--gold-dim); }

    /* ── Print ── */
    @media print {
      @page { margin:0; size:A4; }
      body * { visibility:hidden !important; }
      #resume-output, #resume-output * { visibility:visible !important; }
      #resume-output { position:fixed !important; top:0 !important; left:0 !important; width:100% !important; margin:0 !important; padding:40px 60px !important; box-shadow:none !important; font-size:13px !important; }
    }

    /* ── Mobile ── */
    @media (max-width:640px) {
      .card { padding:20px 18px !important; border-radius:14px !important; }
      .mode-card { padding:16px 14px !important; }
      .gold-btn { padding:12px 16px !important; font-size:12px !important; width:100% !important; }
      .ghost-btn { padding:11px 14px !important; font-size:12px !important; }
      .drop-zone { padding:28px 16px !important; }
      .hero-h1 { font-size:38px !important; letter-spacing:-1px !important; }
      .main-pad { padding:0 16px 80px !important; }
      .header-pills { display:none !important; }
    }
  `}</style>
  );
};

/* ─── Floating Particles ─── */
function Particles() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {Array.from({length:18}).map((_,i) => {
        const size   = 1.5 + Math.random() * 2.5;
        const left   = Math.random() * 100;
        const delay  = Math.random() * 12;
        const dur    = 10 + Math.random() * 16;
        const dx     = (Math.random() - 0.5) * 60;
        const bottom = Math.random() * 60;
        return (
          <div key={i} style={{
            position:"absolute", bottom:`${bottom}%`, left:`${left}%`,
            width:size, height:size, borderRadius:"50%",
            background:`rgba(201,168,76,${0.15 + Math.random()*0.25})`,
            "--dx": `${dx}px`,
            animation:`particleDrift ${dur}s ${delay}s ease-in-out infinite`,
            animationFillMode:"both",
          }} />
        );
      })}
    </div>
  );
}

/* ─── Animated SVG Logo Mark ─── */
function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="url(#logoGrad)" />
      {/* R shape */}
      <path d="M9 9h7a5 5 0 0 1 0 10h-7V9z M16 19l5 8" stroke="#0d0d0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray:300, strokeDashoffset:300, animation:"drawLine 1s 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }} />
      {/* AI text */}
      <text x="20" y="16" fontSize="7" fontWeight="700" fill="#0d0d0f" fontFamily="Outfit,sans-serif"
        style={{ animation:"logoFade 0.6s 0.8s both" }}>AI</text>
      {/* Gold accent line */}
      <line x1="9" y1="30" x2="27" y2="30" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8c96d" />
          <stop offset="100%" stopColor="#b8922e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── ATS Meter ─── */
const ATS_WORDS = ["led","managed","developed","increased","reduced","achieved","collaborated","implemented","delivered","optimized","launched","spearheaded","drove","built","designed","scaled","streamlined","negotiated","mentored","generated"];
function ATSMeter({ text }) {
  const lower = (text||"").toLowerCase();
  const hits  = ATS_WORDS.filter(w => lower.includes(w));
  const score = Math.min(98, 28 + Math.round((hits.length/ATS_WORDS.length)*70));
  const color = score>=70?"#4ade80":score>=50?"#fbbf24":"#f87171";
  return (
    <div style={{ marginTop:20, padding:"18px 20px", background:"rgba(0,0,0,0.28)", borderRadius:12, border:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)" }}>ATS Compatibility</span>
        <span style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color }}>{score}<span style={{ fontSize:13, color:"var(--ash)" }}>/100</span></span>
      </div>
      <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:999, height:4, overflow:"hidden" }}>
        <div style={{ width:`${score}%`, height:"100%", background:`linear-gradient(90deg,${color}66,${color})`, borderRadius:999, transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      {hits.length>0 && <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:8 }}>Detected: {hits.slice(0,5).join(" · ")}</p>}
    </div>
  );
}

/* ─── Resume Preview (print-ready) ─── */
function Sec({ title, accent, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontSize:10, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:accent, borderBottom:`1px solid ${accent}22`, paddingBottom:6, marginBottom:12 }}>{title}</h2>
      {children}
    </div>
  );
}
function Preview({ data, template }) {
  if (!data) return null;
  const cfg = {
    executive:{ accent:"#1a1a2e", sub:"#8a8a96", font:"'Cormorant Garamond',Georgia,serif", body:"'Outfit',sans-serif" },
    modern:   { accent:"#0f4c81", sub:"#555",    font:"'Outfit',sans-serif",                body:"'Outfit',sans-serif" },
    minimal:  { accent:"#2c2c2c", sub:"#777",    font:"Georgia,serif",                      body:"Georgia,serif" },
  };
  const c = cfg[template]||cfg.executive;
  return (
    <div id="resume-output" style={{ background:"#fff", color:"#1a1a2e", fontFamily:c.body, padding:"52px 60px", lineHeight:1.65, fontSize:13.5 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:c.font, fontSize:36, fontWeight:300, letterSpacing:"-0.5px", color:c.accent, marginBottom:4 }}>{data.name}</h1>
        <div style={{ fontFamily:c.font, fontSize:16, fontStyle:"italic", color:c.sub, marginBottom:10 }}>{data.targetRole}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:12, color:"#666", borderTop:`1.5px solid ${c.accent}`, paddingTop:10 }}>
          {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
        </div>
      </div>
      {data.summary        && <Sec title="Profile"        accent={c.accent}><p style={{ color:"#333", fontStyle:"italic" }}>{data.summary}</p></Sec>}
      {data.experience     && <Sec title="Experience"     accent={c.accent}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${c.accent}'>•</span>`) }} style={{ color:"#333" }} /></Sec>}
      {data.education      && <Sec title="Education"      accent={c.accent}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
      {data.skills         && <Sec title="Skills"         accent={c.accent}><div style={{ color:"#333" }}>{data.skills}</div></Sec>}
      {data.certifications && <Sec title="Certifications" accent={c.accent}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
    </div>
  );
}

/* ─── LinkedIn Results ─── */
function LinkedInResults({ data }) {
  if (!data) return null;
  const pri = { high:"tag-high", medium:"tag-med", low:"tag-low" };
  return (
    <div className="card scale-in" style={{ borderColor:"rgba(10,102,194,0.28)", background:"rgba(10,102,194,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:"linear-gradient(135deg,#0a66c2,#1d86e0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff", flexShrink:0 }}>in</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, color:"#60a5fa" }}>LinkedIn Optimization Report</div>
          <div style={{ fontSize:13, color:"var(--ash)" }}>Prioritised suggestions to strengthen your profile</div>
        </div>
        <div style={{ textAlign:"center", padding:"8px 16px", borderRadius:12, background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:38, fontWeight:300, color:data.overallScore>=70?"#4ade80":data.overallScore>=50?"#fbbf24":"#f87171", lineHeight:1 }}>{data.overallScore}</div>
          <div style={{ fontSize:9, color:"var(--ash)", letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>Score</div>
        </div>
      </div>
      <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:999, height:5, overflow:"hidden", marginBottom:26 }}>
        <div style={{ width:`${data.overallScore}%`, height:"100%", background:"linear-gradient(90deg,#1d6fb8,#3b82f6,#60a5fa)", borderRadius:999, transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      {(data.suggestions||[]).map((s,i)=>(
        <div key={i} className="li-card fade-up" style={{ animationDelay:`${i*0.07}s` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8 }}>
            <div style={{ fontWeight:500, fontSize:14 }}>{s.section}</div>
            <span className={`li-tag ${pri[s.priority]||"tag-med"}`}>{s.priority}</span>
          </div>
          <div style={{ fontSize:13, color:"var(--ash)", marginBottom:10, lineHeight:1.65 }}>{s.issue}</div>
          <div style={{ fontSize:13, color:"#e2e2ea", background:"rgba(255,255,255,0.035)", borderRadius:9, padding:"11px 15px", borderLeft:"2.5px solid var(--gold)", lineHeight:1.65 }}>
            <span style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", display:"block", marginBottom:4 }}>Suggestion</span>
            {s.suggestion}
          </div>
        </div>
      ))}
      {data.headline && (
        <div style={{ marginTop:18, padding:"16px 20px", background:"rgba(201,168,76,0.055)", border:"1px solid var(--gold-border)", borderRadius:11 }}>
          <div style={{ fontSize:9, letterSpacing:"0.13em", textTransform:"uppercase", color:"var(--gold)", marginBottom:7 }}>Suggested Headline</div>
          <div style={{ fontSize:16, fontFamily:"var(--font-display)", fontWeight:300, lineHeight:1.4 }}>{data.headline}</div>
        </div>
      )}
      {data.summary && (
        <div style={{ marginTop:12, padding:"16px 20px", background:"rgba(201,168,76,0.055)", border:"1px solid var(--gold-border)", borderRadius:11 }}>
          <div style={{ fontSize:9, letterSpacing:"0.13em", textTransform:"uppercase", color:"var(--gold)", marginBottom:7 }}>Suggested About Section</div>
          <div style={{ fontSize:13, color:"#ccc", lineHeight:1.75 }}>{data.summary}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Step Indicator ─── */
const STEPS = ["Mode","Details","Results"];
function Steps({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:40 }}>
      {STEPS.map((s,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div className="step-dot" style={{
              width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:500, margin:"0 auto 7px",
              background: i<current ? "linear-gradient(135deg,#e8c96d,#c9a84c)" : "transparent",
              border: i>=current ? `1.5px solid ${i===current?"var(--gold)":"rgba(255,255,255,0.1)"}` : "none",
              color: i<current?"#0d0d0f":i===current?"var(--gold)":"var(--ash2)",
              boxShadow: i===current ? "0 0 20px rgba(201,168,76,0.25)" : "none",
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>{i<current?"✓":i+1}</div>
            <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:i===current?"var(--gold)":"var(--ash2)", fontWeight:i===current?500:400, transition:"color 0.3s" }}>{s}</div>
          </div>
          {i<STEPS.length-1 && (
            <div style={{ width:48, height:1.5, margin:"0 10px", marginBottom:20, borderRadius:999, overflow:"hidden", background:"rgba(255,255,255,0.06)" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#c9a84c,#e8c96d)", borderRadius:999, transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)", width:i<current?"100%":"0%" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Field wrapper ─── */
function F({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
function GoldLine() {
  return <div style={{ height:1, background:"linear-gradient(90deg,transparent,var(--gold-border),transparent)", margin:"20px 0" }} />;
}
const Spinner = () => (
  <span style={{ width:14,height:14,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />
);

/* ─── Hero animated background ─── */
function HeroGlow() {
  return (
    <>
      <div style={{ position:"fixed", top:"-20%", left:"20%", width:"60%", height:600, background:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", right:"-5%", width:400, height:400, background:"radial-gradient(ellipse, rgba(201,168,76,0.03) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

/* ─── Job Recommendations ─── */
const JOB_BOARDS = [
  { name:"LinkedIn Jobs",  color:"#0a66c2", icon:"in", url:(r,l)=>`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(l||"")}` },
  { name:"Indeed",         color:"#003a9b", icon:"in", url:(r,l)=>`https://www.indeed.com/jobs?q=${encodeURIComponent(r)}&l=${encodeURIComponent(l||"")}` },
  { name:"Glassdoor",      color:"#0caa41", icon:"gd", url:(r,l)=>`https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(r)}&locT=C&locId=1` },
  { name:"Google Jobs",    color:"#4285f4", icon:"g",  url:(r,l)=>`https://www.google.com/search?q=${encodeURIComponent(r+" jobs "+(l||""))}` },
  { name:"Remotive",       color:"#7c3aed", icon:"re", url:(r)  =>`https://remotive.com/remote-jobs?search=${encodeURIComponent(r)}` },
  { name:"We Work Remotely",color:"#1a9e6e",icon:"ww", url:(r)  =>`https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(r)}` },
];

const SEARCH_TIPS = [
  r => `${r} remote`,
  r => `${r} entry level`,
  r => `${r} senior`,
  r => `junior ${r}`,
  r => `${r} contract`,
];

function JobRecommendations({ role, skills, location }) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs]       = useState(null);
  const [expanded, setExpanded] = useState(false);

  const roleClean = (role||"").trim();
  const skillList = (skills||"").split(/[,|]/).map(s=>s.trim()).filter(Boolean).slice(0,5);

  const fetchJobs = async () => {
    setLoading(true);
    const API = process.env.REACT_APP_API_URL || "";
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role: roleClean, skills: skillList, location }),
      });
      if (res.ok) setJobs(await res.json());
    } catch(e) {}
    finally { setLoading(false); setExpanded(true); }
  };

  if (!roleClean) return null;

  return (
    <div className="card fade-up" style={{ borderColor:"rgba(201,168,76,0.15)", marginTop:8 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom: expanded ? 24 : 0 }}>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:3 }}>
            Find Jobs for <em style={{ color:"var(--gold)" }}>{roleClean}</em>
          </div>
          <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Search live job boards or get AI-curated suggestions based on your resume.</div>
        </div>
        {!expanded && (
          <button className="gold-btn" style={{ fontSize:12, padding:"10px 20px", flexShrink:0 }} onClick={fetchJobs} disabled={loading}>
            {loading ? <span style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ width:12,height:12,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />Finding jobs…</span> : "✦ Find Jobs"}
          </button>
        )}
      </div>

      {expanded && (
        <div className="fade-in">
          {/* Quick search links */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)", marginBottom:12 }}>Search on job boards</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:10 }}>
              {JOB_BOARDS.map(b => (
                <a key={b.name} href={b.url(roleClean, location)} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"var(--mist2)", textDecoration:"none", transition:"all 0.25s", color:"#e2e2ea" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=b.color+"66";e.currentTarget.style.background=b.color+"12";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.background="var(--mist2)";}}
                >
                  <div style={{ width:28, height:28, borderRadius:6, background:b.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{b.icon.toUpperCase().slice(0,2)}</div>
                  <span style={{ fontSize:13, fontWeight:400 }}>{b.name}</span>
                  <span style={{ marginLeft:"auto", fontSize:14, color:"var(--ash)" }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Refined search suggestions */}
          <div style={{ marginBottom: jobs ? 24 : 0 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)", marginBottom:12 }}>Try these searches</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {SEARCH_TIPS.map((tip,i) => {
                const q = tip(roleClean);
                return (
                  <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(q+" jobs "+(location||""))}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:12, padding:"6px 14px", borderRadius:20, border:"1px solid var(--gold-border)", color:"var(--gold)", textDecoration:"none", background:"var(--gold-dim)", transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.22)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--gold-dim)";}}
                  >{q} ↗</a>
                );
              })}
              {skillList.slice(0,3).map((skill,i) => (
                <a key={"s"+i} href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}&location=${encodeURIComponent(location||"")}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:12, padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", color:"var(--ash)", textDecoration:"none", background:"var(--mist2)", transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";e.currentTarget.style.color="#e2e2ea";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="var(--ash)";}}
                >{skill} jobs ↗</a>
              ))}
            </div>
          </div>

          {/* AI-curated job suggestions */}
          {jobs && jobs.suggestions && (
            <div className="fade-in">
              <div style={{ height:1, background:"linear-gradient(90deg,transparent,var(--gold-border),transparent)", margin:"20px 0" }} />
              <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)", marginBottom:14 }}>AI-curated roles to consider</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:12 }}>
                {jobs.suggestions.map((job,i) => (
                  <div key={i} className="li-card fade-up" style={{ animationDelay:`${i*0.07}s`, borderColor:"rgba(201,168,76,0.15)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ fontWeight:500, fontSize:14, color:"#e2e2ea" }}>{job.title}</div>
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:"var(--gold-dim)", color:"var(--gold)", whiteSpace:"nowrap", marginLeft:8 }}>{job.match}% match</span>
                    </div>
                    <div style={{ fontSize:12, color:"var(--ash)", marginBottom:10, lineHeight:1.5 }}>{job.reason}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                      {(job.skills||[]).map((s,j)=>(
                        <span key={j} style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:"var(--mist)", border:"1px solid rgba(255,255,255,0.08)", color:"var(--ash)" }}>{s}</span>
                      ))}
                    </div>
                    <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(location||"")}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:11, color:"var(--gold)", textDecoration:"none", letterSpacing:"0.06em", textTransform:"uppercase", display:"inline-flex", alignItems:"center", gap:5 }}
                    >Search on LinkedIn ↗</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop:18, textAlign:"center" }}>
            <button className="ghost-btn" style={{ fontSize:11 }} onClick={()=>setExpanded(false)}>Collapse ↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LinkedIn URL Import ─── */
function LinkedInImport({ onImport }) {
  const [url,setUrl]         = useState("");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg]         = useState("");
  const doImport = async () => {
    if (!url.trim()) return;
    setLoading(true); setMsg("");
    try {
      const API = process.env.REACT_APP_API_URL||"";
      const res = await fetch(`${API}/api/linkedin-import`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:url.trim()})});
      const data = await res.json();
      if (!res.ok){setMsg(data.error||"Import failed."); return;}
      onImport(data);
      setMsg("✓ Imported — review and edit the fields below.");
    } catch(e){setMsg("Couldn't reach the server.");}
    finally{setLoading(false);}
  };
  return (
    <div style={{marginBottom:24,padding:"16px 18px",background:"rgba(10,102,194,0.06)",border:"1px solid rgba(10,102,194,0.2)",borderRadius:12}}>
      <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#60a5fa",marginBottom:10}}>Auto-import from LinkedIn URL</div>
      <div style={{display:"flex",gap:8}}>
        <input placeholder="https://linkedin.com/in/yourname" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doImport()} style={{flex:1}} />
        <button onClick={doImport} disabled={loading||!url.trim()} style={{padding:"10px 18px",borderRadius:9,border:"none",background:"#0a66c2",color:"#fff",fontFamily:"var(--font-body)",fontSize:13,fontWeight:500,cursor:loading||!url.trim()?"not-allowed":"pointer",opacity:loading||!url.trim()?0.5:1,whiteSpace:"nowrap",flexShrink:0}}>
          {loading?"Importing…":"Import →"}
        </button>
      </div>
      {msg && <div style={{marginTop:8,fontSize:12,color:msg.startsWith("✓")?"#4ade80":"#f87171"}}>{msg}</div>}
      <div style={{marginTop:6,fontSize:11,color:"var(--ash)"}}>Only public profiles can be imported. If blocked, fill the fields below manually.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   EXAMPLE DATA
══════════════════════════════════════════════ */
const EXAMPLE_FORM = {
  name:"Alex Rivera", email:"alex.rivera@email.com", phone:"+1 415 555 0192",
  location:"San Francisco, CA", linkedin:"linkedin.com/in/alexrivera",
  targetRole:"Senior Product Manager", targetIndustry:"Technology / SaaS",
  template:"executive",
  experiences:[
    {company:"Acme Tech",role:"Product Manager",startDate:"Jan 2021",endDate:"",current:true,
     bullets:"Led cross-functional team of 12 to ship payments redesign, increasing conversion by 24%.\nOwned roadmap for core checkout flow serving 2M monthly users.\nDrove 0→1 launch of subscription product generating $1.8M ARR in first year."},
    {company:"StartupCo",role:"Associate PM",startDate:"Jun 2019",endDate:"Dec 2020",current:false,
     bullets:"Defined MVP requirements for mobile app, shipped in 10 weeks.\nManaged backlog of 200+ tickets across 3 engineering squads.\nIncreased DAU by 18% through A/B tested onboarding redesign."},
  ],
  education:[{school:"UC Berkeley",degree:"BSc",field:"Computer Science",year:"2019"}],
  skills:"Product Strategy, Roadmapping, A/B Testing, SQL, Figma, Agile / Scrum, Stakeholder Management",
  certifications:"Pragmatic Marketing Certified",
};

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
const blank    = () => ({ company:"",role:"",startDate:"",endDate:"",current:false,bullets:"" });
const blankEdu = () => ({ school:"",degree:"",field:"",year:"" });
const init = { name:"",email:"",phone:"",location:"",linkedin:"",targetRole:"",targetIndustry:"",experiences:[blank()],education:[blankEdu()],skills:"",certifications:"",template:"executive" };

export default function App() {
  const [step,setStep]         = useState(0);
  const [mode,setMode]         = useState("");
  const [form,setForm]         = useState(init);
  const [loading,setLoading]   = useState(false);
  const [loadMsg,setLoadMsg]   = useState("");
  const [result,setResult]     = useState(null);
  const [liResult,setLiResult] = useState(null);
  const [err,setErr]           = useState("");
  const [uploadedPdf,setUploadedPdf]       = useState(null);
  const [jobDescription,setJobDescription] = useState("");
  const [dragOver,setDragOver]             = useState(false);
  const [liData,setLiData]     = useState({name:"",targetRole:"",headline:"",about:"",experience:"",skills:""});
  const [darkMode,setDarkMode] = useState(true);
  const [shareMsg,setShareMsg] = useState("");

  // Apply Mode state
  const [applyInput,setApplyInput]   = useState({ jobUrl:"", jobText:"", inputMode:"url" });
  const [applyResume,setApplyResume] = useState(null);
  const [applyResult,setApplyResult] = useState(null);
  const [applyTab,setApplyTab]       = useState("resume");
  const applyFileRef = useRef(null);

  const fileRef      = useRef(null);
  const containerRef = useRef(null);

  /* ── Theme ── */
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  /* ── localStorage auto-save form ── */
  const LS_KEY = "resumeai_form_v2";
  useEffect(() => {
    try { const s=localStorage.getItem(LS_KEY); if(s) setForm(f=>({...f,...JSON.parse(s)})); } catch(e){}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(form)); } catch(e){}
  }, [form]);

  /* ── Share link: encode result into URL ── */
  const makeShareLink = (data) => {
    try {
      const enc = btoa(encodeURIComponent(JSON.stringify(data)));
      const url = `${window.location.origin}${window.location.pathname}?resume=${enc}`;
      navigator.clipboard.writeText(url).then(()=>{setShareMsg("Link copied!");setTimeout(()=>setShareMsg(""),2500);});
    } catch(e){setShareMsg("Couldn't copy");}
  };

  /* ── Restore shared resume from URL ── */
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const enc = p.get("resume");
      if (enc) {
        const data = JSON.parse(decodeURIComponent(atob(enc)));
        setResult(data); setStep(3);
        window.history.replaceState({},"",window.location.pathname);
      }
    } catch(e){}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── PDF export via html2pdf ── */
  const exportPDF = (name="resume") => {
    const el = document.getElementById("resume-output");
    if (!el || !window.html2pdf) { window.print(); return; }
    window.html2pdf().set({
      margin:[10,10,10,10], filename:`${(name||"resume").replace(/\s+/g,"_")}_resume.pdf`,
      image:{type:"jpeg",quality:0.98},
      html2canvas:{scale:2,useCORS:true},
      jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},
    }).from(el).save();
  };

  const set    = (k,v) => setForm(f=>({...f,[k]:v}));
  const setExp = (i,k,v) => { const a=[...form.experiences]; a[i]={...a[i],[k]:v}; set("experiences",a); };
  const setEdu = (i,k,v) => { const a=[...form.education];   a[i]={...a[i],[k]:v}; set("education",a);   };
  const addExp = () => set("experiences",[...form.experiences,blank()]);
  const rmExp  = i  => set("experiences",form.experiences.filter((_,j)=>j!==i));
  const addEdu = () => set("education",[...form.education,blankEdu()]);
  const go     = n  => { setStep(n); setTimeout(()=>containerRef.current?.scrollTo({top:0,behavior:"smooth"}),50); };
  const resetAll = () => { setResult(null);setLiResult(null);setApplyResult(null);setUploadedPdf(null);setApplyResume(null);setJobDescription("");setMode("");setApplyInput({jobUrl:"",jobText:"",inputMode:"url"});go(0); };

  const handleFile = file => {
    if (!file||file.type!=="application/pdf"){ setErr("Please upload a PDF file."); return; }
    if (file.size>5*1024*1024){ setErr("PDF must be under 5MB."); return; }
    const r=new FileReader();
    r.onload=e=>{ setUploadedPdf({name:file.name,base64:e.target.result.split(",")[1]}); setErr(""); };
    r.readAsDataURL(file);
  };

  const startLoad = msgs => {
    let mi=0; setLoadMsg(msgs[0]); setLoading(true); setErr("");
    return setInterval(()=>{ mi=(mi+1)%msgs.length; setLoadMsg(msgs[mi]); },2200);
  };

  const callAPI = async (endpoint, body, onSuccess) => {
    const API = process.env.REACT_APP_API_URL||"";
    const res = await fetch(`${API}${endpoint}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if (!res.ok){ const d=await res.json().catch(()=>({})); throw new Error(d.error||"Server error"); }
    return res.json();
  };

  const generateBuild = async () => {
    const iv=startLoad(["Analysing your career story…","Crafting compelling bullets…","Optimising for ATS…","Applying finishing polish…"]);
    setResult(null);
    try { setResult(await callAPI("/api/generate",{name:form.name,email:form.email,phone:form.phone,location:form.location,linkedin:form.linkedin,targetRole:form.targetRole,targetIndustry:form.targetIndustry,experiences:form.experiences,education:form.education,skills:form.skills,certifications:form.certifications})); go(3); }
    catch(e){ setErr(e.message||"Generation failed."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const generateTailor = async () => {
    if (!uploadedPdf){ setErr("Please upload your resume PDF first."); return; }
    if (!jobDescription.trim()){ setErr("Please describe the job you're targeting."); return; }
    const iv=startLoad(["Reading your resume…","Understanding the role…","Tailoring your experience…","Polishing the result…"]);
    setResult(null);
    try { setResult(await callAPI("/api/tailor",{pdfBase64:uploadedPdf.base64,jobDescription,template:form.template})); go(3); }
    catch(e){ setErr(e.message||"Tailoring failed."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const generateLinkedIn = async () => {
    if (!liData.name.trim()){ setErr("Please enter your name at minimum."); return; }
    const iv=startLoad(["Reviewing your profile…","Identifying gaps…","Crafting suggestions…","Finalising report…"]);
    setLiResult(null);
    try { setLiResult(await callAPI("/api/linkedin",liData)); go(3); }
    catch(e){ setErr(e.message||"LinkedIn analysis failed."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const generateApply = async () => {
    const hasUrl  = applyInput.inputMode==="url"  && applyInput.jobUrl.trim();
    const hasText = applyInput.inputMode==="text" && applyInput.jobText.trim();
    const hasBoth = applyInput.inputMode==="both" && (applyInput.jobUrl.trim()||applyInput.jobText.trim());
    if (!hasUrl && !hasText && !hasBoth){ setErr("Please provide a job URL or paste the job description."); return; }
    if (!applyResume){ setErr("Please upload your resume PDF."); return; }

    const iv=startLoad([
      "Reading the job posting…",
      "Analysing requirements…",
      "Tailoring your resume…",
      "Writing your cover letter…",
      "Preparing interview questions…",
      "Putting it all together…",
    ]);
    setApplyResult(null);
    try {
      const res = await callAPI("/api/apply", {
        jobUrl:      applyInput.jobUrl.trim(),
        jobText:     applyInput.jobText.trim(),
        pdfBase64:   applyResume.base64,
        template:    form.template,
      });
      setApplyResult(res);
      setApplyTab("resume");
      go(3);
    } catch(e){ setErr(e.message||"Apply Mode failed — please try again."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const downloadTxt = () => {
    if (!result) return;
    const t=`${result.name}\n${result.email} | ${result.phone} | ${result.location}\n${result.linkedin}\n\n${"═".repeat(60)}\n${(result.targetRole||"").toUpperCase()}\n${"═".repeat(60)}\n\nPROFILE\n${result.summary}\n\nEXPERIENCE\n${result.experience}\n\nEDUCATION\n${result.education}\n\nSKILLS\n${result.skills}`;
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([t],{type:"text/plain"})),download:`${(result.name||"resume").replace(/\s/g,"_")}_resume.txt`}).click();
  };

  const g2 = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 };

  const TemplateSelector = () => (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
      {[{id:"executive",title:"Executive",desc:"Serif, commanding"},{id:"modern",title:"Modern",desc:"Clean sans-serif"},{id:"minimal",title:"Minimal",desc:"Let content lead"}].map(t=>(
        <div key={t.id} className={`mode-card${form.template===t.id?" active":""}`} onClick={()=>set("template",t.id)} style={{ padding:16 }}>
          <div style={{ fontWeight:500,fontSize:13,marginBottom:3,color:form.template===t.id?"var(--gold)":"#e2e2ea" }}>{t.title}</div>
          <div style={{ fontSize:11,color:"var(--ash)" }}>{t.desc}</div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <FontLink />
      <div style={{ minHeight:"100vh", background:"var(--ink)", position:"relative", overflowX:"hidden" }}>
        <HeroGlow />
        <Particles />

        {/* ── Animated grain overlay ── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:0.022,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* ══ HEADER ══ */}
        <header style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid var(--border-subtle)", background:"var(--header-bg)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", padding:"0 40px" }}>
          <div style={{ maxWidth:880, margin:"0 auto", display:"flex", alignItems:"center", height:66 }}>
            <div onClick={resetAll} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <LogoMark size={36} />
              <div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:300, letterSpacing:"0.06em", color:"var(--text-primary)", lineHeight:1 }}>
                  Résumé<span style={{ color:"var(--gold)", fontWeight:400 }}>AI</span>
                </div>
                <div style={{ fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--ash)", marginTop:1 }}>Powered by Claude</div>
              </div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              {step===2 && mode==="build" && (
                <div style={{ fontSize:10, color:"var(--ash)", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
                  Saved
                </div>
              )}
              <div className="header-pills" style={{ display:"flex", gap:6 }}>
                {["Build","Tailor","LinkedIn","Apply"].map((f,i)=>(
                  <span key={f} style={{ fontSize:10, letterSpacing:"0.07em", textTransform:"uppercase", padding:"5px 11px", borderRadius:7, border:"1px solid var(--ghost-border)", color:"var(--ash)", transition:"all 0.25s", cursor:"default" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.color="var(--ash)";}}
                  >{f}</span>
                ))}
              </div>
              <button className="theme-toggle" onClick={()=>setDarkMode(d=>!d)} title="Toggle light/dark mode">
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        {/* ══ MAIN ══ */}
        <div ref={containerRef} className="main-pad" style={{ maxWidth:960, margin:"0 auto", padding:"0 40px 90px", position:"relative", zIndex:2 }}>

          {/* ══ LANDING (step 0) — hero only ══ */}
          {step===0 && (
            <div style={{ textAlign:"center", padding:"120px 0 100px", maxWidth:620, margin:"0 auto" }}>
              <div className="fade-in" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", border:"1px solid var(--gold-border)", borderRadius:20, padding:"6px 18px", marginBottom:28 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }} />
                Powered by Claude AI
              </div>
              <h1 className="hero-h1 fade-up" style={{ fontFamily:"var(--font-display)", fontSize:68, fontWeight:300, letterSpacing:"-2.5px", lineHeight:1.0, marginBottom:22, animationDelay:"0.1s" }}>
                From resume to<br />
                <em style={{ background:"linear-gradient(135deg,#c9a84c,#f0d98a,#c9a84c)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"gradientShift 4s ease infinite" }}>
                  interview-ready.
                </em>
              </h1>
              <p className="fade-up" style={{ color:"var(--ash)", fontSize:18, fontWeight:300, lineHeight:1.75, marginBottom:44, animationDelay:"0.18s" }}>
                AI-powered resume tools. Tailored cover letters. Interview prep.<br />All from a single job posting.
              </p>
              <div className="fade-up" style={{ animationDelay:"0.28s" }}>
                <button className="gold-btn pulse" onClick={()=>go(1)} style={{ fontSize:15, padding:"16px 48px", letterSpacing:"0.07em" }}>
                  Get Started →
                </button>
              </div>
              <div className="fade-in" style={{ marginTop:44, display:"flex", alignItems:"center", justifyContent:"center", gap:28, flexWrap:"wrap", animationDelay:"0.42s" }}>
                {["No account required","No paywall","No watermarks"].map((t,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--ash)" }}>
                    <span style={{ color:"#4ade80" }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ TOOL PICKER (step 1) ══ */}
          {step===1 && !mode && (
            <div className="scale-in">
              <div style={{ textAlign:"center", padding:"52px 0 36px" }}>
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:300, letterSpacing:"-1px", marginBottom:10 }}>
                  What do you need?
                </h2>
                <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>Pick a tool to get started.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, marginBottom:20 }}>
                {[
                  { id:"apply",    hot:true,
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                    title:"Apply Mode",
                    desc:"Paste a job URL. Get a tailored resume, cover letter, and interview prep in one shot." },
                  { id:"build",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                    title:"Build Resume",
                    desc:"Start from scratch. Fill in your details and Claude writes your resume." },
                  { id:"tailor",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
                    title:"Tailor to a Job",
                    desc:"Upload your existing resume PDF and rewrite it for any role." },
                  { id:"linkedin",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
                    title:"LinkedIn Optimizer",
                    desc:"AI audit of your LinkedIn profile with prioritised, actionable fixes." },
                ].map((m,i)=>(
                  <div key={m.id} className={`mode-card fade-up d${i+1}`}
                    onClick={()=>{ setMode(m.id); go(2); }}
                    style={{ position:"relative", padding:"28px 24px" }}>
                    {m.hot && (
                      <div style={{ position:"absolute", top:14, right:14, fontSize:8, padding:"2px 8px", borderRadius:8, background:"linear-gradient(135deg,#c9a84c,#e8c96d)", color:"#0d0d0f", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>New</div>
                    )}
                    <div style={{ color:"var(--ash)", marginBottom:16, transition:"color 0.3s" }}>{m.icon}</div>
                    <div style={{ fontWeight:500, fontSize:16, marginBottom:8, color:"#e2e2ea" }}>{m.title}</div>
                    <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300, lineHeight:1.6 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center", paddingTop:8 }}>
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>go(0)}>← Back</button>
              </div>
            </div>
          )}

          {/* Steps indicator — only show on form + results */}
          {step > 1 && <Steps current={step-1} />}

          {/* ══ STEP 1 — BUILD ══ */}
          {step===2 && mode==="build" && (
            <div>
              <div className="card fade-up d1">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
                  <div>
                    <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Personal Information</h2>
                    <p style={{ color:"var(--ash)", fontSize:13, fontWeight:300 }}>Your basic details and target role.</p>
                  </div>
                  <button className="ghost-btn" style={{ fontSize:11, padding:"7px 14px" }} onClick={()=>setForm({...EXAMPLE_FORM})}>
                    ✦ Fill Example
                  </button>
                </div>
                <div style={g2}><F label="Full Name"><input placeholder="Alexandra Chen" value={form.name} onChange={e=>set("name",e.target.value)} /></F><F label="Target Role"><input placeholder="Chief Product Officer" value={form.targetRole} onChange={e=>set("targetRole",e.target.value)} /></F></div>
                <div style={g2}><F label="Email"><input placeholder="alex@example.com" value={form.email} onChange={e=>set("email",e.target.value)} /></F><F label="Phone"><input placeholder="+1 555 000 1234" value={form.phone} onChange={e=>set("phone",e.target.value)} /></F></div>
                <div style={g2}><F label="Location"><input placeholder="San Francisco, CA" value={form.location} onChange={e=>set("location",e.target.value)} /></F><F label="Target Industry"><input placeholder="Technology / FinTech" value={form.targetIndustry} onChange={e=>set("targetIndustry",e.target.value)} /></F></div>
                <F label="LinkedIn URL"><input placeholder="linkedin.com/in/alexandrachen" value={form.linkedin} onChange={e=>set("linkedin",e.target.value)} /></F>
              </div>
              {form.experiences.map((exp,i)=>(
                <div key={i} className="card fade-up" style={{ animationDelay:`${0.1+i*0.08}s` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--gold)", marginBottom:4 }}>Position {i+1}</div>
                      <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:300 }}>{exp.role||"New Role"}{exp.company&&<span style={{ color:"var(--ash)" }}> · {exp.company}</span>}</h3>
                    </div>
                    {i>0&&<button className="ghost-btn" style={{ fontSize:12,padding:"6px 14px" }} onClick={()=>rmExp(i)}>Remove</button>}
                  </div>
                  <div style={g2}><F label="Company"><input placeholder="Acme Corp" value={exp.company} onChange={e=>setExp(i,"company",e.target.value)} /></F><F label="Role"><input placeholder="VP Engineering" value={exp.role} onChange={e=>setExp(i,"role",e.target.value)} /></F></div>
                  <div style={g2}>
                    <F label="Start Date"><input placeholder="March 2020" value={exp.startDate} onChange={e=>setExp(i,"startDate",e.target.value)} /></F>
                    <F label="End Date">
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <input placeholder="December 2023" value={exp.endDate} onChange={e=>setExp(i,"endDate",e.target.value)} disabled={exp.current} style={{ opacity:exp.current?0.3:1 }} />
                        <label style={{ display:"flex",gap:8,alignItems:"center",whiteSpace:"nowrap",fontSize:13,color:"var(--ash)",cursor:"pointer" }}>
                          <input type="checkbox" checked={exp.current} onChange={e=>setExp(i,"current",e.target.checked)} style={{ width:15,height:15,accentColor:"var(--gold)" }} /> Present
                        </label>
                      </div>
                    </F>
                  </div>
                  <F label="Responsibilities & Achievements"><textarea placeholder="Led team of 12, reduced costs by 30%..." value={exp.bullets} onChange={e=>setExp(i,"bullets",e.target.value)} style={{ minHeight:100 }} /></F>
                  <p style={{ fontSize:11,color:"rgba(255,255,255,0.18)",marginTop:-8 }}>Claude will refine these into polished, metric-driven bullets.</p>
                </div>
              ))}
              <button className="ghost-btn" onClick={addExp} style={{ width:"100%",padding:15,marginBottom:20,textAlign:"center",borderStyle:"dashed",borderRadius:12 }}>+ Add Another Position</button>
              <div className="card fade-up d2">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:20 }}>Education</h2>
                {form.education.map((edu,i)=>(
                  <div key={i} style={{ marginBottom:14 }}>
                    <div style={g2}><F label="Institution"><input placeholder="MIT" value={edu.school} onChange={e=>setEdu(i,"school",e.target.value)} /></F><F label="Degree"><input placeholder="BSc Computer Science" value={edu.degree} onChange={e=>setEdu(i,"degree",e.target.value)} /></F></div>
                    <div style={g2}><F label="Field"><input placeholder="Computer Science" value={edu.field} onChange={e=>setEdu(i,"field",e.target.value)} /></F><F label="Year"><input placeholder="2019" value={edu.year} onChange={e=>setEdu(i,"year",e.target.value)} /></F></div>
                    {i<form.education.length-1&&<GoldLine />}
                  </div>
                ))}
                <button className="ghost-btn" style={{ fontSize:12,marginTop:4 }} onClick={addEdu}>+ Add Education</button>
              </div>
              <div className="card fade-up d3">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:20 }}>Skills & Certifications</h2>
                <F label="Key Skills"><textarea placeholder="Leadership, Product Strategy, SQL, Figma, Agile..." value={form.skills} onChange={e=>set("skills",e.target.value)} /></F>
                <F label="Certifications"><input placeholder="PMP, AWS, Google Analytics..." value={form.certifications} onChange={e=>set("certifications",e.target.value)} /></F>
              </div>
              <div className="card fade-up d4">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:16 }}>Resume Style</h2>
                <TemplateSelector />
              </div>
              <div className="btn-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <button className="ghost-btn" onClick={()=>go(1)}>← Back</button>
                <button className="gold-btn" onClick={generateBuild} disabled={loading} style={{ minWidth:210 }}>
                  {loading?<span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>:"✦ Generate Resume"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 1 — TAILOR ══ */}
          {step===2 && mode==="tailor" && (
            <div>
              <div className="card fade-up d1">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Upload Your Existing Resume</h2>
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:24, fontWeight:300 }}>Claude will read your PDF and rewrite it to match the job you want — even if the roles are completely different.</p>
                <div className={`drop-zone${dragOver?" drag-over":""}`} onClick={()=>fileRef.current?.click()} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}} style={{ marginBottom:24 }}>
                  <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
                  {uploadedPdf ? (
                    <div>
                      <div style={{ fontSize:28,color:"var(--gold)",marginBottom:8 }}>✓</div>
                      <div style={{ fontWeight:500,color:"var(--gold)",marginBottom:4,fontSize:14 }}>{uploadedPdf.name}</div>
                      <div style={{ fontSize:12,color:"var(--ash)" }}>Click to replace</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom:12,color:"var(--ash)" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div style={{ fontWeight:500,marginBottom:4,fontSize:14 }}>Drop your PDF resume here</div>
                      <div style={{ fontSize:12,color:"var(--ash)" }}>or click to browse · PDF only · Max 5MB</div>
                    </div>
                  )}
                </div>
                <F label="Target Job — Describe the role you're applying for">
                  <textarea placeholder={"Example: I'm applying for a Cashier position at a local café. The job involves handling cash, serving customers, and keeping the counter tidy. I want my cybersecurity background reframed to highlight transferable skills: attention to detail, following procedures precisely, reliability, and working under pressure."} value={jobDescription} onChange={e=>setJobDescription(e.target.value)} style={{ minHeight:150 }} />
                </F>
                <p style={{ fontSize:11,color:"rgba(255,255,255,0.18)",marginTop:-8,marginBottom:20 }}>The more context you give, the better the tailoring.</p>
                <F label="Resume Style"><TemplateSelector /></F>
              </div>
              <div className="btn-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <button className="ghost-btn" onClick={()=>go(1)}>← Back</button>
                <button className="gold-btn" onClick={generateTailor} disabled={loading} style={{ minWidth:220 }}>
                  {loading?<span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>:"⟳ Tailor My Resume"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 1 — LINKEDIN ══ */}
          {step===2 && mode==="linkedin" && (
            <div>
              <div className="card fade-up d1">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Your LinkedIn Profile</h2>
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Paste your LinkedIn URL to auto-import, or fill in the fields manually.</p>
                <LinkedInImport onImport={data=>setLiData(d=>({...d,...Object.fromEntries(Object.entries(data).filter(([,v])=>v))}))} />
                <div style={g2}>
                  <F label="Your Name"><input placeholder="Alexandra Chen" value={liData.name} onChange={e=>setLiData(d=>({...d,name:e.target.value}))} /></F>
                  <F label="Target Role / Industry"><input placeholder="Cybersecurity Engineer · Tech" value={liData.targetRole} onChange={e=>setLiData(d=>({...d,targetRole:e.target.value}))} /></F>
                </div>
                <F label="Current Headline"><input placeholder="Security Analyst at XYZ Corp | Protecting digital assets" value={liData.headline} onChange={e=>setLiData(d=>({...d,headline:e.target.value}))} /></F>
                <F label="About / Summary Section"><textarea placeholder="Paste your current About section here..." value={liData.about} onChange={e=>setLiData(d=>({...d,about:e.target.value}))} style={{ minHeight:120 }} /></F>
                <F label="Experience"><textarea placeholder={"Senior Security Analyst at ABC Corp (2021–present)\n– Monitored network traffic\n– Led incident response\n\nJunior Analyst at DEF Ltd (2019–2021)"} value={liData.experience} onChange={e=>setLiData(d=>({...d,experience:e.target.value}))} style={{ minHeight:140 }} /></F>
                <F label="Skills (comma separated)"><input placeholder="Penetration Testing, SIEM, Python, Network Security..." value={liData.skills} onChange={e=>setLiData(d=>({...d,skills:e.target.value}))} /></F>
              </div>
              <div className="btn-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <button className="ghost-btn" onClick={()=>go(1)}>← Back</button>
                <button className="gold-btn" onClick={generateLinkedIn} disabled={loading} style={{ minWidth:220 }}>
                  {loading?<span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>:"in  Analyse My Profile"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 1 — APPLY MODE ══ */}
          {step===2 && mode==="apply" && (
            <div>
              {/* Glowing banner */}
              <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04))", border:"1px solid var(--gold-border)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontSize:28 }}>⚡</div>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"var(--gold)", marginBottom:2 }}>Apply Mode — Full Pre-Interview Package</div>
                  <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Paste a job URL or description + upload your resume → get a tailored resume, cover letter, and interview prep in one shot.</div>
                </div>
              </div>

              <div className="card fade-up d1">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>The Job</h2>
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Provide the job you want to apply for. You can paste the URL, paste the description, or both.</p>

                {/* Input mode toggle */}
                <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                  {[{id:"url",label:"Job URL"},{id:"text",label:"Paste Description"},{id:"both",label:"Both"}].map(t=>(
                    <button key={t.id} onClick={()=>setApplyInput(a=>({...a,inputMode:t.id}))}
                      style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${applyInput.inputMode===t.id?"var(--gold)":"rgba(255,255,255,0.1)"}`, background:applyInput.inputMode===t.id?"var(--gold-dim)":"transparent", color:applyInput.inputMode===t.id?"var(--gold)":"var(--ash)", cursor:"pointer", fontSize:12, fontFamily:"var(--font-body)", fontWeight:500, transition:"all 0.2s" }}
                    >{t.label}</button>
                  ))}
                </div>

                {(applyInput.inputMode==="url"||applyInput.inputMode==="both") && (
                  <F label="Job Posting URL">
                    <input placeholder="https://www.linkedin.com/jobs/view/... or any job board URL" value={applyInput.jobUrl} onChange={e=>setApplyInput(a=>({...a,jobUrl:e.target.value}))} />
                    <p style={{ fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:5 }}>Claude will fetch and read the full job posting automatically.</p>
                  </F>
                )}
                {(applyInput.inputMode==="text"||applyInput.inputMode==="both") && (
                  <F label="Job Description">
                    <textarea placeholder={"Paste the full job description here...\n\nExample:\nSoftware Engineer – Payments Team\nAcme Corp · San Francisco, CA\n\nWe're looking for a backend engineer to join our payments team...\n\nRequirements:\n• 3+ years Python experience\n• Experience with distributed systems..."} value={applyInput.jobText} onChange={e=>setApplyInput(a=>({...a,jobText:e.target.value}))} style={{ minHeight:180 }} />
                  </F>
                )}
              </div>

              {/* Resume upload */}
              <div className="card fade-up d2">
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:4 }}>Your Resume</h2>
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Upload your current resume PDF — Claude will tailor it specifically to this job.</p>
                <div className={`drop-zone${dragOver?" drag-over":""}`}
                  onClick={()=>applyFileRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);
                    const file=e.dataTransfer.files[0];
                    if(!file||file.type!=="application/pdf"){setErr("Please upload a PDF.");return;}
                    const r=new FileReader(); r.onload=ev=>{setApplyResume({name:file.name,base64:ev.target.result.split(",")[1]});setErr("");}; r.readAsDataURL(file);
                  }}>
                  <input ref={applyFileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>{
                    const file=e.target.files[0]; if(!file) return;
                    const r=new FileReader(); r.onload=ev=>{setApplyResume({name:file.name,base64:ev.target.result.split(",")[1]});setErr("");}; r.readAsDataURL(file);
                  }} />
                  {applyResume ? (
                    <div><div style={{ fontSize:28,color:"var(--gold)",marginBottom:8 }}>✓</div><div style={{ fontWeight:500,color:"var(--gold)",fontSize:14,marginBottom:4 }}>{applyResume.name}</div><div style={{ fontSize:12,color:"var(--ash)" }}>Click to replace</div></div>
                  ) : (
                    <div>
                      <div style={{ marginBottom:12,color:"var(--ash)" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                      <div style={{ fontWeight:500,marginBottom:4,fontSize:14 }}>Drop your resume PDF here</div>
                      <div style={{ fontSize:12,color:"var(--ash)" }}>or click to browse · Max 5MB</div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop:20 }}>
                  <F label="Resume Style"><TemplateSelector /></F>
                </div>
              </div>

              <div className="btn-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <button className="ghost-btn" onClick={()=>go(1)}>← Back</button>
                <button className="gold-btn" onClick={generateApply} disabled={loading} style={{ minWidth:240 }}>
                  {loading
                    ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>
                    : "⚡ Generate Full Package"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — RESULTS ══ */}
          {step===3 && (
            <div>
              {/* Apply Mode Results */}
              {applyResult && (
                <div className="fade-up">
                  {/* Header */}
                  <div className="card" style={{ borderColor:"rgba(201,168,76,0.3)", background:"linear-gradient(135deg,rgba(201,168,76,0.07),rgba(201,168,76,0.02))", marginBottom:24 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14, marginBottom:16 }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:300, color:"var(--gold)", marginBottom:4 }}>⚡ Apply Package Ready</div>
                        <div style={{ fontSize:13,color:"var(--ash)",fontWeight:300 }}>
                          {applyResult.company && <span style={{ color:"#e2e2ea",fontWeight:500 }}>{applyResult.company}</span>}
                          {applyResult.jobTitle && <span style={{ color:"var(--ash)" }}> · {applyResult.jobTitle}</span>}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>makeShareLink(applyResult.resume)}>{shareMsg||"🔗 Share"}</button>
                        <button className="gold-btn" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>exportPDF(applyResult.resume?.name)}>⬇ Download PDF</button>
                      </div>
                    </div>

                    {/* Fit score */}
                    {applyResult.fitScore && (
                      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                            <span style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)" }}>Job Fit Score</span>
                            <span style={{ fontFamily:"var(--font-display)",fontSize:22,fontWeight:300,color:applyResult.fitScore>=70?"#4ade80":applyResult.fitScore>=50?"#fbbf24":"#f87171" }}>{applyResult.fitScore}<span style={{ fontSize:13,color:"var(--ash)" }}>/100</span></span>
                          </div>
                          <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:999,height:5,overflow:"hidden" }}>
                            <div style={{ width:`${applyResult.fitScore}%`,height:"100%",background:`linear-gradient(90deg,${applyResult.fitScore>=70?"#4ade8088,#4ade80":applyResult.fitScore>=50?"#fbbf2488,#fbbf24":"#f8717188,#f87171"})`,borderRadius:999,transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
                          </div>
                          {applyResult.missingKeywords?.length>0 && (
                            <p style={{ fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:6 }}>
                              Missing keywords: {applyResult.missingKeywords.slice(0,5).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tab switcher */}
                  <div style={{ display:"flex", gap:4, marginBottom:20, background:"var(--mist2)", borderRadius:12, padding:4 }}>
                    {[
                      {id:"resume",   label:"📄 Tailored Resume"},
                      {id:"cover",    label:"✉️ Cover Letter"},
                      {id:"interview",label:"🎯 Interview Prep"},
                    ].map(t=>(
                      <button key={t.id} onClick={()=>setApplyTab(t.id)} style={{
                        flex:1, padding:"10px 8px", borderRadius:9, border:"none", cursor:"pointer",
                        fontFamily:"var(--font-body)", fontSize:13, fontWeight:500, transition:"all 0.25s",
                        background: applyTab===t.id ? "var(--ink2)" : "transparent",
                        color:      applyTab===t.id ? "#e2e2ea" : "var(--ash)",
                        boxShadow:  applyTab===t.id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                      }}>{t.label}</button>
                    ))}
                  </div>

                  {/* Tab: Resume */}
                  {applyTab==="resume" && applyResult.resume && (
                    <div className="scale-in">
                      <ATSMeter text={`${applyResult.resume.summary||""} ${applyResult.resume.experience||""} ${applyResult.resume.skills||""}`} />
                      <div style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)",marginTop:16 }}>
                        <Preview data={applyResult.resume} template={form.template} />
                      </div>
                    </div>
                  )}

                  {/* Tab: Cover Letter */}
                  {applyTab==="cover" && applyResult.coverLetter && (
                    <div className="card scale-in" style={{ background:"#fff", color:"#1a1a2e" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:10 }}>
                        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, fontWeight:300, color:"#1a1a2e" }}>Cover Letter</div>
                        <button onClick={()=>{
                          const blob=new Blob([applyResult.coverLetter],{type:"text/plain"});
                          Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"cover_letter.txt"}).click();
                        }} style={{ fontSize:12,padding:"8px 16px",borderRadius:8,border:"1px solid #ddd",background:"transparent",cursor:"pointer",fontFamily:"var(--font-body)",color:"#555",transition:"all 0.2s" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#f5f5f5";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                        >Download .txt</button>
                      </div>
                      <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, lineHeight:1.8, color:"#333", whiteSpace:"pre-wrap" }}>
                        {applyResult.coverLetter}
                      </div>
                    </div>
                  )}

                  {/* Tab: Interview Prep */}
                  {applyTab==="interview" && applyResult.interviewPrep && (
                    <div className="scale-in">
                      <div style={{ marginBottom:16, padding:"14px 18px", background:"rgba(201,168,76,0.06)", border:"1px solid var(--gold-border)", borderRadius:11, fontSize:13, color:"var(--ash)", lineHeight:1.6 }}>
                        <strong style={{ color:"var(--gold)" }}>🎯 Prep tip:</strong> These questions are tailored specifically to this job and your background. Practise answering out loud — aim for 2 minutes per answer using the STAR method (Situation, Task, Action, Result).
                      </div>
                      {(applyResult.interviewPrep||[]).map((item,i)=>(
                        <div key={i} className="card fade-up" style={{ animationDelay:`${i*0.06}s`, marginBottom:14 }}>
                          <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
                            <div style={{ width:28,height:28,borderRadius:8,background:"var(--gold-dim)",border:"1px solid var(--gold-border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--gold)",flexShrink:0 }}>{i+1}</div>
                            <div style={{ fontWeight:500,fontSize:15,lineHeight:1.4 }}>{item.question}</div>
                          </div>
                          <div style={{ marginLeft:40 }}>
                            <div style={{ fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:6 }}>How to answer</div>
                            <div style={{ fontSize:13,color:"var(--ash)",lineHeight:1.7 }}>{item.guidance}</div>
                            {item.keyPoints && (
                              <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
                                {item.keyPoints.map((kp,j)=>(
                                  <span key={j} style={{ fontSize:11,padding:"3px 10px",borderRadius:8,background:"var(--mist)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--ash)" }}>{kp}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Regular resume result */}
              {result && (
                <>
                  <div className="card scale-in" style={{ borderColor:"rgba(74,222,128,0.2)", background:"rgba(74,222,128,0.035)", marginBottom:24 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, color:"#4ade80", marginBottom:4 }}>✓ Resume Complete</div>
                        <div style={{ fontSize:13,color:"var(--ash)",fontWeight:300 }}>Your AI-crafted resume is ready. Review below, then download or print.</div>
                      </div>
                      <div className="result-actions" style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={downloadTxt}>Download .txt</button>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>makeShareLink(result)}>{shareMsg||"🔗 Share"}</button>
                        <button className="gold-btn" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>exportPDF(result.name)}>⬇ Download PDF</button>
                      </div>
                    </div>
                    <ATSMeter text={`${result.summary||""} ${result.experience||""} ${result.skills||""}`} />
                  </div>
                  <div className="fade-up" style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)", marginBottom:32 }}>
                    <Preview data={result} template={form.template} />
                  </div>
                  <JobRecommendations role={result.targetRole} skills={result.skills} location={form.location} />
                </>
              )}

              {liResult && (
                <>
                  <div style={{ textAlign:"right", marginBottom:18 }}>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                  </div>
                  <LinkedInResults data={liResult} />
                </>
              )}
            </div>
          )}

          {/* Error */}
          {err && (
            <div className="fade-in" style={{ marginTop:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>
              {err}
            </div>
          )}
        </div>
      </div>
    </>
  );
}