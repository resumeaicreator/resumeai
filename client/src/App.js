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
      --text-primary: #e2e2ea; --text-secondary: #5a5a68;
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
    @keyframes bounce    { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
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
      .gold-btn { padding:12px 16px !important; font-size:12px !important; }
      .ghost-btn { padding:11px 14px !important; font-size:12px !important; }
      .drop-zone { padding:28px 16px !important; }
      .hero-h1 { font-size:32px !important; letter-spacing:-1px !important; }
      .main-pad { padding:0 16px 80px !important; }
      .header-pills { display:none !important; }
      .result-actions { flex-direction:column !important; }
      .result-actions button { width:100% !important; }
      .li-card { padding:16px !important; }
    }
    @media (max-width:480px) {
      .hero-h1 { font-size:28px !important; }
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
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:"block",flexShrink:0}}>
      <rect width="36" height="36" rx="9" fill="url(#logoGrad)" />
      {/* C */}
      <path d="M20 11.5a6 6 0 1 0 0 13" stroke="#0d0d0f" strokeWidth="2.2" strokeLinecap="round" fill="none"
        style={{strokeDasharray:40,strokeDashoffset:40,animation:"drawLine 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards"}} />
      {/* R */}
      <path d="M23 13h3a2.5 2.5 0 0 1 0 5h-3V13z M26 18l3 5.5" stroke="#0d0d0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        style={{strokeDasharray:40,strokeDashoffset:40,animation:"drawLine 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) forwards"}} />
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

const ATS_TIPS = {
  high: [
    "Strong action verbs detected. Make sure every bullet starts with one.",
    "Good keyword density. Consider adding industry-specific certifications.",
    "Your resume scores well — tailor the summary to each specific job posting for best results.",
  ],
  mid: [
    "Add more measurable results — numbers like percentages, dollar amounts, or team sizes boost ATS scores.",
    "Try starting more bullet points with strong verbs like: Led, Drove, Scaled, Delivered, Launched.",
    "Mirror exact language from the job description — ATS systems match keywords literally.",
    "Add a Skills section with specific tools and technologies relevant to your target role.",
  ],
  low: [
    "Your resume needs more action verbs. Replace passive phrases with: Led, Built, Managed, Delivered.",
    "Add quantified achievements — e.g. 'Increased sales by 30%' beats 'Responsible for sales'.",
    "Include a dedicated Skills section listing technical tools, software, and relevant keywords.",
    "Rewrite your summary to include your job title and 2-3 keywords from the job you're applying for.",
    "Avoid paragraphs — ATS systems prefer bullet points for experience sections.",
  ],
};

function ATSMeter({ text, onFix, onUpgrade }) {
  const [expanded, setExpanded] = useState(false);
  const [fixing, setFixing]     = useState(false);
  const lower  = (text||"").toLowerCase();
  const hits   = ATS_WORDS.filter(w => lower.includes(w));
  const score  = Math.min(98, 28 + Math.round((hits.length/ATS_WORDS.length)*70));
  const color  = score>=70?"#4ade80":score>=50?"#fbbf24":"#f87171";
  const level  = score>=70?"high":score>=50?"mid":"low";
  const tips   = ATS_TIPS[level];
  const missing = ATS_WORDS.filter(w => !lower.includes(w)).slice(0,6);

  const handleFix = async () => {
    if (!onFix) return;
    setFixing(true);
    await onFix(missing, tips);
    setFixing(false);
  };

  return (
    <div style={{ marginTop:20, padding:"18px 20px", background:"rgba(0,0,0,0.18)", borderRadius:12, border:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
        <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)" }}>ATS Compatibility</span>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {onFix && score < 98 && (
            <button onClick={handleFix} disabled={fixing} className="gold-btn" style={{ fontSize:11, padding:"5px 14px" }}>
              {fixing ? <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:10,height:10,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block"}} />Fixing…</span> : "✦ Fix My Score"}
            </button>
          )}
          {!onFix && onUpgrade && score < 98 && (
            <button onClick={onUpgrade} className="ghost-btn" style={{ fontSize:11, padding:"5px 14px", borderColor:"var(--gold-border)", color:"var(--gold)" }}>
              🔒 Fix My Score
            </button>
          )}
          <span style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color }}>{score}<span style={{ fontSize:13, color:"var(--ash)" }}>/100</span></span>
        </div>
      </div>
      <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:999, height:4, overflow:"hidden", marginBottom:10 }}>
        <div style={{ width:`${score}%`, height:"100%", background:`linear-gradient(90deg,${color}66,${color})`, borderRadius:999, transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      {hits.length>0 && <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginBottom:10 }}>Detected: {hits.slice(0,5).join(" · ")}</p>}

      <button onClick={()=>setExpanded(e=>!e)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:"var(--gold)", fontFamily:"var(--font-body)", letterSpacing:"0.06em", padding:0, display:"flex", alignItems:"center", gap:5 }}>
        {expanded ? "▲ Hide tips" : "▼ How to improve your score"}
      </button>

      {expanded && (
        <div style={{ marginTop:14 }} className="fade-in">
          <div style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--ash)", marginBottom:10 }}>
            {score>=70 ? "✓ Looking good — fine-tuning tips" : score>=50 ? "⚠ Room to improve" : "✗ Needs work — key fixes"}
          </div>
          {tips.map((tip,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:10, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:9, borderLeft:`2.5px solid ${color}` }}>
              <span style={{ color, flexShrink:0, fontSize:13 }}>{"→"}</span>
              <span style={{ fontSize:13, color:"var(--text-primary)", lineHeight:1.6 }}>{tip}</span>
            </div>
          ))}
          {missing.length>0 && (
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:11, color:"var(--ash)", marginBottom:6 }}>Try adding these power words:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {missing.map((w,i)=>(
                  <span key={i} style={{ fontSize:11, padding:"3px 10px", borderRadius:8, background:"var(--gold-dim)", border:"1px solid var(--gold-border)", color:"var(--gold)", textTransform:"capitalize" }}>{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Resume Chat ─── */
function ResumeChat({ resume, onUpdate }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi! I can help you refine your resume. Try asking me to change the tone, improve a section, add metrics, or switch up the style." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const bottomRef             = useRef(null);
  const API = process.env.REACT_APP_API_URL||"";

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role:"user", content:msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/resume-chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body: JSON.stringify({ message:msg, resume, history: newMessages.slice(-6) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Something went wrong.");
      setMessages(m=>[...m, { role:"assistant", content:data.reply }]);
      if (data.updatedResume) onUpdate(data.updatedResume);
    } catch(e) {
      setMessages(m=>[...m, { role:"assistant", content:`Sorry, something went wrong: ${e.message}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ marginTop:24 }}>
      <button onClick={()=>setOpen(o=>!o)} className="ghost-btn" style={{ fontSize:12, display:"flex", alignItems:"center", gap:8, borderColor:"var(--gold-border)", color:"var(--gold)" }}>
        <span style={{ fontSize:16 }}>✦</span>
        {open ? "Close AI Assistant" : "✦ Edit with AI Assistant"}
      </button>

      {open && (
        <div className="fade-in" style={{ marginTop:16, border:"1px solid var(--gold-border)", borderRadius:14, overflow:"hidden", background:"var(--ink2)" }}>
          {/* Header */}
          <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border-subtle)", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:14, color:"var(--gold)" }}>✦</span>
            <span style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)" }}>Resume AI Assistant</span>
            <span style={{ fontSize:11, color:"var(--ash)", marginLeft:"auto" }}>Premium</span>
          </div>

          {/* Messages */}
          <div style={{ height:280, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{
                  maxWidth:"80%", padding:"10px 14px", borderRadius:12,
                  background: m.role==="user" ? "var(--gold)" : "var(--ink3)",
                  color: m.role==="user" ? "#0d0d0f" : "var(--text-primary)",
                  fontSize:13, lineHeight:1.6,
                  borderBottomRightRadius: m.role==="user" ? 4 : 12,
                  borderBottomLeftRadius:  m.role==="user" ? 12 : 4,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", justifyContent:"flex-start" }}>
                <div style={{ padding:"10px 14px", borderRadius:12, background:"var(--ink3)", display:"flex", gap:5, alignItems:"center" }}>
                  {[0,1,2].map(i=>(
                    <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block", animation:`bounce 1s ${i*0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding:"8px 16px", borderTop:"1px solid var(--border-subtle)", display:"flex", gap:6, flexWrap:"wrap" }}>
            {["Make it more concise","Add more metrics","More confident tone","Improve the summary"].map((s,i)=>(
              <button key={i} onClick={()=>setInput(s)} style={{ fontSize:11, padding:"4px 10px", borderRadius:8, border:"1px solid var(--ghost-border)", background:"transparent", color:"var(--ash)", cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.color="var(--ash)";}}
              >{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border-subtle)", display:"flex", gap:10 }}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder="e.g. Make the summary more confident..."
              style={{ flex:1, background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:9, padding:"10px 14px", color:"var(--text-primary)", fontSize:13, fontFamily:"var(--font-body)", outline:"none" }}
            />
            <button onClick={send} disabled={loading||!input.trim()} className="gold-btn" style={{ padding:"10px 18px", fontSize:13, flexShrink:0 }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Premium Lock Overlay ─── */
/* ─── ATS Score Hook (Landing Page) ─── */
function ATSScoreHook({ onSignUp }) {
  const [text, setText]     = useState("");
  const [score, setScore]   = useState(null);
  const [loading, setLoading] = useState(false);

  const ATS_WORDS = ["led","managed","developed","increased","reduced","achieved","collaborated","implemented","delivered","optimized","launched","spearheaded","drove","built","designed","scaled","streamlined","negotiated","mentored","generated"];

  const check = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const hits = ATS_WORDS.filter(w => lower.includes(w));
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const lengthScore = Math.min(30, Math.round((wordCount / 400) * 30));
      const keywordScore = Math.round((hits.length / ATS_WORDS.length) * 50);
      const quantScore = (text.match(/\d+%|\$\d+|\d+x|\d+\+/g)||[]).length * 3;
      const total = Math.min(98, 25 + lengthScore + keywordScore + quantScore);
      setScore({ total, hits, wordCount });
      setLoading(false);
    }, 800);
  };

  const color = score ? (score.total >= 70 ? "#4ade80" : score.total >= 50 ? "#fbbf24" : "#f87171") : "var(--gold)";

  return (
    <div style={{ maxWidth:800, margin:"0 auto 80px", padding:"40px", background:"var(--ink2)", borderRadius:20, border:"1px solid var(--border-subtle)" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:300, marginBottom:8 }}>
          How ATS-friendly is your resume?
        </div>
        <div style={{ fontSize:14, color:"var(--ash)" }}>Paste your resume text below for an instant score — no account needed.</div>
      </div>

      {!score ? (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={8}
            style={{ width:"100%", marginBottom:14, resize:"vertical", minHeight:160, fontFamily:"var(--font-body)", fontSize:13 }}
          />
          <button
            className="gold-btn"
            onClick={check}
            disabled={loading || !text.trim()}
            style={{ width:"100%", fontSize:14, padding:"14px" }}
          >
            {loading ? "Analysing…" : "Check My ATS Score →"}
          </button>
        </>
      ) : (
        <div className="fade-in">
          {/* Score display */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:72, fontWeight:300, color, lineHeight:1 }}>{score.total}</div>
            <div style={{ fontSize:14, color:"var(--ash)", marginBottom:16 }}>out of 100</div>
            <div style={{ maxWidth:400, margin:"0 auto", background:"rgba(255,255,255,0.05)", borderRadius:999, height:8, overflow:"hidden" }}>
              <div style={{ width:`${score.total}%`, height:"100%", background:`linear-gradient(90deg,${color}88,${color})`, borderRadius:999, transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>

          {/* Feedback */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginBottom:24 }}>
            {[
              { label:"Keywords found", value:score.hits.length, max:20, good: score.hits.length >= 8 },
              { label:"Word count", value:score.wordCount, max:600, good: score.wordCount >= 250 },
              { label:"Metrics detected", value:(text.match(/\d+%|\$\d+|\d+x|\d+\+/g)||[]).length, max:10, good: (text.match(/\d+%|\$\d+|\d+x|\d+\+/g)||[]).length >= 3 },
            ].map((stat,i) => (
              <div key={i} style={{ padding:"14px", background:"rgba(0,0,0,0.2)", borderRadius:12, textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color: stat.good ? "#4ade80" : "#f87171" }}>{stat.value}</div>
                <div style={{ fontSize:11, color:"var(--ash)", marginTop:4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Verdict + CTA */}
          <div style={{ padding:"20px 24px", background: score.total >= 70 ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)", borderRadius:12, border:`1px solid ${score.total >= 70 ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, marginBottom:20, textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:8, color: score.total >= 70 ? "#4ade80" : "#f87171" }}>
              {score.total >= 70 ? "Good score — let's make it perfect" : score.total >= 50 ? "Room to improve — let AI fix it" : "Low score — this needs fixing before you apply"}
            </div>
            <div style={{ fontSize:13, color:"var(--ash)", marginBottom:16 }}>
              {score.total >= 70 ? "Your resume passes basic ATS screening. Crafted Resume can optimise it further and tailor it to specific jobs." : "Many ATS systems will filter this resume out automatically. Crafted Resume can rewrite and optimise it in seconds."}
            </div>
            <button className="gold-btn pulse" style={{ fontSize:14, padding:"12px 32px" }} onClick={onSignUp}>
              Fix My Resume for Free →
            </button>
          </div>
          <div style={{ textAlign:"center" }}>
            <button className="ghost-btn" style={{ fontSize:12 }} onClick={() => { setScore(null); setText(""); }}>Check another resume</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Locked Preview for free users ─── */
function LockedPreview({ data, template, onUpgrade }) {
  return (
    <div style={{ position:"relative", borderRadius:18, overflow:"hidden" }}>
      {/* Show top portion clearly */}
      <div style={{ maxHeight:580, overflow:"hidden" }}>
        <Preview data={data} template={template} />
      </div>
      {/* Blur fade over the bottom */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(to bottom, transparent, var(--ink) 70%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:32, gap:12 }}>
        <div style={{ fontSize:14, color:"var(--text-primary)", fontWeight:500 }}>Your resume is ready — upgrade to view and download</div>
        <div style={{ fontSize:12, color:"var(--ash)", marginBottom:4 }}>PDF export · Share link · ATS fixer · Full preview</div>
        <button className="gold-btn pulse" style={{ fontSize:13, padding:"11px 28px" }} onClick={onUpgrade}>
          Unlock for $15/month →
        </button>
      </div>
    </div>
  );
}
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
    elegant:  { accent:"#6b4c3b", sub:"#9a7b6b", font:"'Cormorant Garamond',Georgia,serif", body:"'Outfit',sans-serif" },
    bold:     { accent:"#111",    sub:"#444",     font:"'Outfit',sans-serif",                body:"'Outfit',sans-serif" },
    navy:     { accent:"#1b3a5c", sub:"#5a7a9a",  font:"'Outfit',sans-serif",                body:"'Outfit',sans-serif" },
    creative: { accent:"#5b2d8e", sub:"#8a6aaa",  font:"'Cormorant Garamond',Georgia,serif", body:"'Outfit',sans-serif" },
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
/* ─── Interview Prep Form ─── */
function InterviewPrepForm({ onResult, setErr, loading, setLoading, loadMsg, startLoad }) {
  const [role, setRole]       = useState("");
  const [company, setCompany] = useState("");
  const [background, setBackground] = useState("");
  const API = process.env.REACT_APP_API_URL||"";

  const generate = async () => {
    if (!role.trim()) { setErr("Please enter the job role."); return; }
    setErr("");
    const iv = startLoad(["Researching the role…","Crafting your questions…","Writing guidance…","Finalising…"]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/interview-prep`, {
        method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include",
        body: JSON.stringify({ role: role.trim(), company: company.trim(), background: background.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Something went wrong."); return; }
      onResult(data);
    } catch(e) { setErr(e.message||"Network error."); }
    finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, marginBottom:20 }}>Tell us about the interview</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:16 }}>
        <div>
          <label className="field-label">Job Role *</label>
          <input placeholder="e.g. Senior Product Manager" value={role} onChange={e=>setRole(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Company (optional)</label>
          <input placeholder="e.g. Google, a startup, any company" value={company} onChange={e=>setCompany(e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <label className="field-label">Your Background (optional but recommended)</label>
        <textarea
          placeholder="Brief summary of your experience e.g. 5 years in product management, built 0-to-1 features, led teams of 8..."
          value={background}
          onChange={e=>setBackground(e.target.value)}
          style={{ minHeight:100 }}
        />
      </div>
      <button className="gold-btn" onClick={generate} disabled={loading||!role.trim()} style={{ width:"100%", fontSize:14, padding:"14px" }}>
        {loading ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><span style={{ width:16,height:16,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />{loadMsg}</span> : "🎯 Generate Interview Questions →"}
      </button>
    </div>
  );
}

/* ─── LinkedIn Writer Form ─── */
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
          <div style={{ fontSize:13, color:"var(--text-primary)", background:"rgba(255,255,255,0.035)", borderRadius:9, padding:"11px 15px", borderLeft:"2.5px solid var(--gold)", lineHeight:1.65 }}>
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

/* ─── Live Jobs Search Wrapper (landing page) ─── */
function LiveJobsSearch() {
  const [what, setWhat]     = useState("software engineer");
  const [where, setWhere]   = useState("");
  const [search, setSearch] = useState({ what:"software engineer", where:"" });

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:24, maxWidth:620, margin:"0 auto 24px" }}>
        <input
          value={what}
          onChange={e=>setWhat(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setSearch({what,where})}
          placeholder="Job title or keyword..."
          style={{ flex:2 }}
        />
        <input
          value={where}
          onChange={e=>setWhere(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setSearch({what,where})}
          placeholder="Location (optional)"
          style={{ flex:1 }}
        />
        <button className="gold-btn" onClick={()=>setSearch({what,where})} style={{ flexShrink:0, padding:"10px 20px", fontSize:13 }}>Search</button>
      </div>
      <LiveJobs key={search.what+search.where} what={search.what} where={search.where} title={true} />
    </div>
  );
}

/* ─── Live Job Listings (Adzuna) ─── */
function LiveJobs({ what, where, title, compact }) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [fetched, setFetched] = useState(false);
  const [err, setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL || "";

  const fetchJobs = async (p = 1) => {
    setLoading(true);
    setErr("");
    try {
      const params = new URLSearchParams({ what: what || "software engineer", page: p });
      if (where) params.set("where", where);
      const res = await fetch(`${API}/api/live-jobs?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Could not load jobs. Please try again.");
        setFetched(true);
        return;
      }
      if (!data.jobs || data.jobs.length === 0) {
        setErr(`No listings found for "${what}". Try a different search term.`);
        setFetched(true);
        return;
      }
      setJobs(data.jobs);
      setTotal(data.total || 0);
      setPage(p);
      setFetched(true);
    } catch(e) {
      setErr("Network error — please check your connection and try again.");
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = n => n >= 1000 ? `$${Math.round(n/1000)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days/7)}w ago`;
    return `${Math.floor(days/30)}mo ago`;
  };

  if (!fetched) {
    return (
      <div style={{ textAlign:"center", padding: compact ? "20px 0" : "40px 0" }}>
        <button className="gold-btn" onClick={()=>fetchJobs(1)} disabled={loading} style={{ fontSize:13, padding:"11px 28px" }}>
          {loading
            ? <span style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ width:14,height:14,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block"}} />Loading jobs…</span>
            : "✦ Load Live Job Listings"}
        </button>
        <div style={{ fontSize:12, color:"var(--ash)", marginTop:8 }}>Live listings from thousands of job boards</div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ fontSize:13, color:"#f87171", marginBottom:14 }}>{err}</div>
        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{ setFetched(false); setErr(""); }}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:13, color:"var(--ash)" }}>{total.toLocaleString()} live listings for <strong style={{ color:"var(--text-primary)" }}>{what}</strong></div>
          <button onClick={()=>fetchJobs(1)} disabled={loading} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:12, fontFamily:"var(--font-body)" }}>
            {loading ? "Refreshing…" : "↺ Refresh"}
          </button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12, marginBottom:16 }}>
        {jobs.map((job,i) => (
          <a key={job.id||i} href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <div className="card" style={{ padding:"16px 18px", cursor:"pointer", height:"100%", transition:"all 0.2s", borderColor:"rgba(255,255,255,0.06)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)";}}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, gap:8 }}>
                <div style={{ fontWeight:500, fontSize:14, color:"var(--text-primary)", lineHeight:1.3 }}>{job.title}</div>
                <span style={{ fontSize:10, color:"var(--ash)", whiteSpace:"nowrap", flexShrink:0 }}>{timeAgo(job.created)}</span>
              </div>
              <div style={{ fontSize:12, color:"var(--gold)", marginBottom:4 }}>{job.company}</div>
              <div style={{ fontSize:12, color:"var(--ash)", marginBottom:8 }}>{job.location}</div>
              {formatSalary(job.salaryMin, job.salaryMax) && (
                <div style={{ fontSize:11, padding:"3px 10px", borderRadius:8, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ade80", display:"inline-block", marginBottom:8 }}>
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
              )}
              <div style={{ fontSize:11, color:"var(--ash)", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {job.description}
              </div>
              <div style={{ marginTop:10, fontSize:11, color:"var(--gold)", letterSpacing:"0.06em" }}>Apply ↗</div>
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {total > 6 && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:8 }}>
          <button className="ghost-btn" style={{ fontSize:11, padding:"6px 14px" }} onClick={()=>fetchJobs(Math.max(1,page-1))} disabled={loading||page===1}>← Prev</button>
          <span style={{ fontSize:12, color:"var(--ash)", padding:"6px 10px" }}>Page {page}</span>
          <button className="ghost-btn" style={{ fontSize:11, padding:"6px 14px" }} onClick={()=>fetchJobs(page+1)} disabled={loading}>Next →</button>
        </div>
      )}
    </div>
  );
}

function JobRecommendations({ role, skills, location }) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs]       = useState(null);
  const [expanded, setExpanded] = useState(false);

  const roleClean = (role||"").trim();
  const skillList = (skills||"").split(/[,|]/).map(s=>s.trim()).filter(Boolean).slice(0,10);

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
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"var(--mist2)", textDecoration:"none", transition:"all 0.25s", color:"var(--text-primary)" }}
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
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";e.currentTarget.style.color="var(--text-primary)";}}
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
                      <div style={{ fontWeight:500, fontSize:14, color:"var(--text-primary)" }}>{job.title}</div>
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:"var(--gold-dim)", color:"var(--gold)", whiteSpace:"nowrap", marginLeft:8 }}>{job.match}% match</span>
                    </div>
                    <div style={{ fontSize:12, color:"var(--ash)", marginBottom:10, lineHeight:1.5 }}>{job.reason}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                      {(job.skills||[]).map((s,j)=>(
                        <span key={j} style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:"var(--mist)", border:"1px solid rgba(255,255,255,0.08)", color:"var(--ash)" }}>{s}</span>
                      ))}
                    </div>
                    <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.searchQuery||job.title)}&location=${encodeURIComponent(location||"")}`} target="_blank" rel="noopener noreferrer"
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

          {/* Live listings for this role */}
          <div style={{ marginTop:24, borderTop:"1px solid var(--border-subtle)", paddingTop:24 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)", marginBottom:16 }}>Live listings for {roleClean}</div>
            <LiveJobs what={roleClean} where={location} title={false} compact={true} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LinkedIn URL Import ─── */
/* ─── Shared Resume Page ─── */
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

/* ─── Auth Pages ─── */
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

function SubscribePage({ user, onSubscribed, onLogout, onBack }) {
  const [loading,setLoading] = useState(false);
  const [err,setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL||"";

  const checkout = async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch(`${API}/api/auth/billing/checkout`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});
      const data = await res.json();
      if (!res.ok){setErr(data.error||"Something went wrong."); return;}
      window.location.href = data.url;
    } catch(e){ setErr("Network error. Please try again."); }
    finally{ setLoading(false); }
  };

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`,{method:"POST",credentials:"include"});
    onLogout();
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:440,textAlign:"center"}}>
        {/* Top bar with back + sign out */}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
          {onBack
            ? <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={onBack}>← Back</button>
            : <div />
          }
          <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px",color:"#f87171",borderColor:"rgba(248,113,113,0.2)"}} onClick={logout}>
            Sign Out
          </button>
        </div>
        <div style={{fontFamily:"var(--font-display)",fontSize:40,fontWeight:300,marginBottom:10}}>
          Unlock <em style={{color:"var(--gold)"}}>Crafted Resume</em>
        </div>
        <p style={{color:"var(--ash)",fontSize:15,marginBottom:36,lineHeight:1.7}}>
          Full access to all tools — Apply Mode, PDF tailoring, LinkedIn optimizer, ATS scoring, and more.
        </p>
        <div className="card" style={{padding:"32px 28px",marginBottom:16}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:52,fontWeight:300,marginBottom:4}}>
            $15<span style={{fontSize:18,color:"var(--ash)"}}>/month</span>
          </div>
          <div style={{fontSize:13,color:"var(--ash)",marginBottom:28}}>Cancel anytime. No contracts.</div>
          {[
            "Unlimited resume generations",
            "Apply Mode — full package from any job URL",
            "PDF tailoring for any role",
            "LinkedIn profile optimizer",
            "ATS scoring + job fit analysis",
            "PDF export + share links",
          ].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,textAlign:"left"}}>
              <span style={{color:"#4ade80",flexShrink:0}}>✓</span>
              <span style={{fontSize:14}}>{f}</span>
            </div>
          ))}
          {err && <div style={{margin:"14px 0",padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:9,fontSize:13,color:"#f87171"}}>{err}</div>}
          <button className="gold-btn pulse" onClick={checkout} disabled={loading} style={{width:"100%",marginTop:20,fontSize:14,padding:"14px"}}>
            {loading ? "Redirecting to Stripe…" : "Subscribe — $15/month →"}
          </button>
          <div style={{marginTop:12,fontSize:11,color:"var(--ash)"}}>
            Secured by Stripe. We never see your card details.
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountPage({ user, onLogout, onBack }) {
  const [loading,setLoading] = useState(false);
  const API = process.env.REACT_APP_API_URL||"";

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/billing/portal`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});
      const data = await res.json();
      if (res.ok) window.location.href = data.url;
    } catch(e){}
    finally { setLoading(false); }
  };

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`,{method:"POST",credentials:"include"});
    onLogout();
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={onBack}>← Back</button>
          <div style={{fontFamily:"var(--font-display)",fontSize:32,fontWeight:300}}>Account</div>
          <div style={{width:80}} />
        </div>
        <div className="card" style={{padding:"28px 24px"}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)",marginBottom:4}}>Signed in as</div>
            <div style={{fontSize:15,fontWeight:500}}>{user?.name}</div>
            <div style={{fontSize:13,color:"var(--ash)"}}>{user?.email}</div>
          </div>
          <div style={{height:1,background:"var(--border-subtle)",margin:"16px 0"}} />
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)",marginBottom:6}}>Subscription</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:user?.subscriptionStatus==="active"?"#4ade80":"#f87171",display:"inline-block"}} />
              <span style={{fontSize:14,fontWeight:500,color:user?.subscriptionStatus==="active"?"#4ade80":"#f87171"}}>
                {user?.subscriptionStatus==="active" ? "Active — $15/month" : user?.subscriptionStatus==="past_due" ? "⚠ Payment failed — update billing" : "No active subscription"}
              </span>
            </div>
          </div>
          <button className="ghost-btn" onClick={openPortal} disabled={loading} style={{width:"100%",marginBottom:10}}>
            {loading ? "Opening…" : "Manage Billing / Cancel →"}
          </button>
          <button className="ghost-btn" onClick={logout} style={{width:"100%",color:"#f87171",borderColor:"rgba(248,113,113,0.2)"}}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─── Forgot Password Page ─── */
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

/* ─── Reset Password Page ─── */
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

/* ─── Email Verified Banner ─── */
/* ─── Expired Subscription Banner ─── */
function ExpiredBanner({ status, onUpgrade }) {
  if (status === "active") return null;
  const isPastDue = status === "past_due";
  return (
    <div className="fade-in" style={{
      position:"fixed", top:70, left:"50%", transform:"translateX(-50%)",
      zIndex:999, padding:"12px 20px", borderRadius:12, fontSize:13,
      display:"flex", alignItems:"center", gap:12,
      background: isPastDue ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.08)",
      border: isPastDue ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(248,113,113,0.2)",
      color: isPastDue ? "#fbbf24" : "#f87171",
      boxShadow:"0 8px 32px rgba(0,0,0,0.3)", maxWidth:520, width:"90vw",
    }}>
      <span style={{fontSize:16}}>{isPastDue ? "⚠" : "ℹ"}</span>
      <span style={{flex:1}}>
        {isPastDue
          ? "Your payment failed — update your billing to keep access."
          : "Your subscription has expired. Upgrade to regain full access."}
      </span>
      <button onClick={onUpgrade} style={{
        background:"none", border:"1px solid currentColor", borderRadius:8,
        color:"inherit", fontSize:11, padding:"5px 12px", cursor:"pointer",
        fontFamily:"var(--font-body)", flexShrink:0, whiteSpace:"nowrap"
      }}>
        {isPastDue ? "Update Billing" : "Upgrade →"}
      </button>
    </div>
  );
}

function VerifyBanner({ onClose }) {
  return (
    <div className="fade-in" style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"14px 24px",background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:12,fontSize:13,color:"#4ade80",display:"flex",alignItems:"center",gap:12,boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
      <span style={{fontSize:18}}>✓</span>
      <span>Email verified — welcome to Crafted Resume!</span>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#4ade80",cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
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
  const [user,setUser]         = useState(null);   // null = not loaded, false = logged out
  const [authReady,setAuthReady] = useState(false);
  const [page,setPage]         = useState("app");
  const [resetToken,setResetToken] = useState("");
  const [showVerifyBanner,setShowVerifyBanner] = useState(false);
  const [isShared,setIsShared] = useState(false);

  // Apply Mode state
  const [applyInput,setApplyInput]   = useState({ jobUrl:"", jobText:"", inputMode:"url" });
  const [applyResume,setApplyResume] = useState(null);
  const [applyResult,setApplyResult] = useState(null);
  const [applyTab,setApplyTab]       = useState("resume");
  const applyFileRef = useRef(null);

  // New tools state
  const [interviewResult,setInterviewResult]           = useState(null);
  const [linkedInWriterResult,setLinkedInWriterResult] = useState(null);

  const fileRef      = useRef(null);
  const containerRef = useRef(null);

  /* ── Theme ── */
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  /* ── Bootstrap: check if user is already logged in ── */
  useEffect(() => {
    // If a reset token or verify token is in the URL, skip bootstrap
    // and let the URL param effect handle the page
    const p = new URLSearchParams(window.location.search);
    if (p.get("token") || p.get("_at")) {
      setAuthReady(true);
      return;
    }
    const API = process.env.REACT_APP_API_URL || "";
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUser(data?.user || false); setAuthReady(true); })
      .catch(() => { setUser(false); setAuthReady(true); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /* ── Restore shared resume / handle email links from URL ── */
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);

      // Google OAuth cross-domain token exchange
      const at = p.get("_at");
      const rt = p.get("_rt");
      if (at && rt) {
        window.history.replaceState({}, "", window.location.pathname);
        const API = process.env.REACT_APP_API_URL || "";
        fetch(`${API}/api/auth/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ accessToken: at, refreshToken: rt }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.user) {
              setUser(data.user);
              setAuthReady(true);
              setPage(data.user.subscriptionStatus === "active" ? "app" : "app");
            } else {
              setUser(false);
              setAuthReady(true);
              setPage("login");
            }
          })
          .catch(() => { setUser(false); setAuthReady(true); setPage("login"); });
        return;
      }

      // Shared resume link — load into app as normal result, mark as shared
      const enc = p.get("resume");
      if (enc) {
        const data = JSON.parse(decodeURIComponent(atob(enc)));
        setResult(data);
        setStep(3);
        setIsShared(true);
        window.history.replaceState({}, "", window.location.pathname);
        setAuthReady(true);
        return;
      }
      // Email verified redirect
      if (p.get("verified") === "true") {
        setShowVerifyBanner(true);
        setPage("login");
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
      // Password reset link
      const resetTok = p.get("token");
      if (resetTok) {
        setResetToken(resetTok);
        setPage("reset");
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
    } catch(e) {}
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
  const resetAll = () => { setResult(null);setLiResult(null);setApplyResult(null);setInterviewResult(null);setLinkedInWriterResult(null);setUploadedPdf(null);setApplyResume(null);setJobDescription("");setMode("");setApplyInput({jobUrl:"",jobText:"",inputMode:"url"});go(0); };

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

  const callAPI = async (endpoint, body, isRetry = false) => {
    const API = process.env.REACT_APP_API_URL||"";
    const res = await fetch(`${API}${endpoint}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(body)});
    if (res.status===401) {
      // Try refreshing the token once before logging out
      if (!isRetry) {
        try {
          const refresh = await fetch(`${API}/api/auth/refresh`, {method:"POST", credentials:"include"});
          if (refresh.ok) return callAPI(endpoint, body, true);
        } catch(e) {}
      }
      setUser(false); setPage("login"); throw new Error("Please log in to continue.");
    }
    if (res.status===402) { throw new Error("premium_required"); }
    if (!res.ok){ const d=await res.json().catch(()=>({})); throw new Error(d.error||"Server error"); }
    return res.json();
  };

  const generateBuild = async () => {
    const iv=startLoad(["Analysing your details…","Writing your bullet points…","Optimising for ATS…","Adding the finishing touches…"]);
    setResult(null);
    try { setResult(await callAPI("/api/generate",{name:form.name,email:form.email,phone:form.phone,location:form.location,linkedin:form.linkedin,targetRole:form.targetRole,targetIndustry:form.targetIndustry,experiences:form.experiences,education:form.education,skills:form.skills,certifications:form.certifications})); go(3); }
    catch(e){ if(e.message==="premium_required"){setPage("subscribe");}else{setErr(e.message||"Generation failed.");} }
    finally { clearInterval(iv); setLoading(false); }
  };

  const generateTailor = async () => {
    if (!uploadedPdf){ setErr("Please upload your resume PDF first."); return; }
    if (!jobDescription.trim()){ setErr("Please describe the job you're targeting."); return; }
    const iv=startLoad(["Reading your resume…","Matching it to the role…","Rewriting your experience…","Polishing the result…"]);
    setResult(null);
    try { setResult(await callAPI("/api/tailor",{pdfBase64:uploadedPdf.base64,jobDescription,template:form.template})); go(3); }
    catch(e){ if(e.message==="premium_required"){setPage("subscribe");}else{setErr(e.message||"Tailoring failed.");} }
    finally { clearInterval(iv); setLoading(false); }
  };

  const generateLinkedIn = async () => {
    if (!liData.name.trim()){ setErr("Please enter your name at minimum."); return; }
    const iv=startLoad(["Reading your profile…","Spotting what to improve…","Writing your suggestions…","Putting it all together…"]);
    setLiResult(null);
    try { setLiResult(await callAPI("/api/linkedin",liData)); go(3); }
    catch(e){ if(e.message==="premium_required"){setPage("subscribe");}else{setErr(e.message||"LinkedIn analysis failed.");} }
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
      "Matching your background to the role…",
      "Rewriting your resume…",
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
    } catch(e){ if(e.message==="premium_required"){setPage("subscribe");}else{setErr(e.message||"Apply Mode failed — please try again.");} }
    finally { clearInterval(iv); setLoading(false); }
  };

  const downloadTxt = () => {
    if (!result) return;
    const t=`${result.name}\n${result.email} | ${result.phone} | ${result.location}\n${result.linkedin}\n\n${"═".repeat(60)}\n${(result.targetRole||"").toUpperCase()}\n${"═".repeat(60)}\n\nPROFILE\n${result.summary}\n\nEXPERIENCE\n${result.experience}\n\nEDUCATION\n${result.education}\n\nSKILLS\n${result.skills}`;
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([t],{type:"text/plain"})),download:`${(result.name||"resume").replace(/\s/g,"_")}_resume.txt`}).click();
  };

  const fixATS = async (missingWords, tips) => {
    setErr("");
    try {
      const current = result || applyResult?.resume;
      if (!current) return;
      const fixed = await callAPI("/api/fix-ats", {
        resume: current,
        missingWords,
        tips,
      });
      if (result) setResult(fixed);
      else if (applyResult) setApplyResult(r => ({ ...r, resume: fixed }));
    } catch(e) {
      setErr(e.message || "ATS fix failed. Please try again.");
    }
  };

  const g2 = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 };

  const TemplateSelector = () => (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
      {[{id:"executive",title:"Executive",desc:"Serif, commanding"},{id:"modern",title:"Modern",desc:"Clean sans-serif"},{id:"minimal",title:"Minimal",desc:"Let content lead"},{id:"elegant",title:"Elegant",desc:"Warm serif tones"},{id:"bold",title:"Bold",desc:"High contrast"},{id:"navy",title:"Navy",desc:"Corporate blue"},{id:"creative",title:"Creative",desc:"Purple accent"}].map(t=>(
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
      {/* ── Route to auth/subscribe/account pages ── */}
      {!authReady && (
        <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{width:20,height:20,border:"2px solid rgba(201,168,76,0.3)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block"}} />
        </div>
      )}
      {authReady && page==="login"    && <AuthPage mode="login"    onBack={()=>setPage("app")} onSuccess={u=>{setUser(u);setPage("app");}} switchMode={m=>setPage(m)} />}
      {authReady && page==="register" && <AuthPage mode="register" onBack={()=>setPage("app")} onSuccess={u=>{setUser(u);setPage("app");}} switchMode={m=>setPage(m)} />}
      {page==="forgot"    && <ForgotPasswordPage switchMode={m=>setPage(m)} />}
      {page==="reset"     && <ResetPasswordPage token={resetToken} onDone={()=>setPage("login")} />}
      {authReady && page==="subscribe" && <SubscribePage user={user} onSubscribed={()=>setPage("app")} onBack={()=>setPage("app")} onLogout={()=>{setUser(false);setPage("login");}} />}
      {authReady && page==="account"   && <AccountPage user={user} onBack={()=>setPage("app")} onLogout={()=>{setUser(false);setPage("login");}} />}
      {showVerifyBanner && <VerifyBanner onClose={()=>setShowVerifyBanner(false)} />}
      {user && user.subscriptionStatus !== "active" && page==="app" && (
        <ExpiredBanner status={user.subscriptionStatus} onUpgrade={()=>setPage("subscribe")} />
      )}
      {authReady && page==="app" && (
      <div style={{ minHeight:"100vh", background:"var(--ink)", position:"relative", overflowX:"hidden" }}>
        <HeroGlow />
        <Particles />

        {/* ── Animated grain overlay ── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:0.022,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* ══ HEADER ══ */}
        <header style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid var(--border-subtle)", background:"var(--header-bg)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", padding:"0 20px" }}>
          <div style={{ maxWidth:880, margin:"0 auto", display:"flex", alignItems:"center", height:60 }}>
            <div onClick={resetAll} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <LogoMark size={36} />
              <div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:300, letterSpacing:"0.06em", color:"var(--text-primary)", lineHeight:1 }}>
                  Crafted<span style={{ color:"var(--gold)", fontWeight:400 }}>Resume</span>
                </div>
                
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
                {[
                  {label:"Build",    mode:"build"},
                  {label:"Tailor",   mode:"tailor"},
                  {label:"LinkedIn", mode:"linkedin"},
                  {label:"Apply",    mode:"apply"},
                  {label:"Interview",mode:"interview"},
                  {label:"LI Writer",mode:"linkedin-quick"},
                ].map((f,i)=>(
                  <button key={f.label} onClick={()=>{
                    if (page !== "app") setPage("app");
                    setErr("");
                    setResult(null);
                    setLiResult(null);
                    setApplyResult(null);
                    setMode(f.mode);
                    go(2);
                  }} style={{ fontSize:10, letterSpacing:"0.07em", textTransform:"uppercase", padding:"5px 11px", borderRadius:7, border:"1px solid var(--ghost-border)", color:"var(--ash)", transition:"all 0.25s", cursor:"pointer", background:"transparent", fontFamily:"var(--font-body)" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.color="var(--ash)";}}
                  >{f.label}</button>
                ))}
              </div>
              <button className="theme-toggle" onClick={()=>setDarkMode(d=>!d)} title="Toggle light/dark mode">
                {darkMode ? "☀️" : "🌙"}
              </button>
              {user ? (
                <button className="ghost-btn" style={{fontSize:11,padding:"6px 12px"}} onClick={()=>setPage("account")}>
                  {user.name?.split(" ")[0] || "Account"} ↗
                </button>
              ) : (
                <button className="gold-btn" style={{fontSize:11,padding:"7px 16px"}} onClick={()=>setPage("login")}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ══ MAIN ══ */}
        <div ref={containerRef} className="main-pad" style={{ maxWidth: step===0 ? 1200 : 960, margin:"0 auto", padding:"0 40px 90px", position:"relative", zIndex:2 }}>

          {/* ══ LANDING (step 0) ══ */}
          {step===0 && (
            <div>

              {/* ── Hero ── */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:40, alignItems:"center", padding:"60px 0 60px", maxWidth:1100, margin:"0 auto" }}>
                {/* Left — copy */}
                <div>
                  <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", border:"1px solid var(--gold-border)", borderRadius:20, padding:"5px 16px", marginBottom:28 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }} />
                    AI-Powered Resume Tools
                  </div>
                  <h1 className="hero-h1 fade-up" style={{ fontFamily:"var(--font-display)", fontSize:62, fontWeight:300, letterSpacing:"-2px", lineHeight:1.05, marginBottom:24, animationDelay:"0.1s" }}>
                    From resume to<br />
                    <em style={{ background:"linear-gradient(135deg,#c9a84c,#f0d98a,#c9a84c)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"gradientShift 4s ease infinite" }}>
                      interview-ready.
                    </em>
                  </h1>
                  <p className="fade-up" style={{ color:"var(--ash)", fontSize:17, fontWeight:300, lineHeight:1.8, marginBottom:40, animationDelay:"0.18s" }}>
                    Build, tailor, and optimize your resume with AI. Get a tailored cover letter, interview prep, and ATS score — all from one job posting.
                  </p>
                  <div className="fade-up" style={{ display:"flex", gap:12, flexWrap:"wrap", animationDelay:"0.26s", maxWidth:380 }}>
                    <button className="gold-btn pulse" onClick={()=>go(1)} style={{ fontSize:14, padding:"14px 36px" }}>
                      Get Started Free →
                    </button>
                    <button className="ghost-btn" onClick={()=>go(1)} style={{ fontSize:14, padding:"14px 28px" }}>
                      Sign In
                    </button>
                  </div>
                  <div className="fade-in" style={{ marginTop:32, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap", animationDelay:"0.4s" }}>
                    {["Free to start","No watermarks","Cancel anytime"].map((t,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--ash)" }}>
                        <span style={{ color:"#4ade80" }}>✓</span> {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — product preview card */}
                <div className="fade-up" style={{ animationDelay:"0.3s", position:"relative" }}>
                  {/* Glow behind card */}
                  <div style={{ position:"absolute", inset:-40, background:"radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
                  <div style={{ background:"#fff", borderRadius:16, padding:"32px 36px", boxShadow:"0 40px 100px rgba(0,0,0,0.6)", position:"relative", fontFamily:"Georgia, serif" }}>
                    {/* Mock resume header */}
                    <div style={{ borderBottom:"2px solid #1a1a2e", paddingBottom:16, marginBottom:18 }}>
                      <div style={{ fontSize:22, fontWeight:300, color:"#1a1a2e", letterSpacing:"-0.5px" }}>Alexandra Chen</div>
                      <div style={{ fontSize:13, color:"#8a8a96", fontStyle:"italic", marginBottom:8 }}>Senior Product Manager</div>
                      <div style={{ fontSize:11, color:"#666", display:"flex", gap:14, flexWrap:"wrap" }}>
                        <span>alex.chen@email.com</span><span>San Francisco, CA</span><span>linkedin.com/in/alexchen</span>
                      </div>
                    </div>
                    {/* Mock profile */}
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a1a2e", borderBottom:"1px solid rgba(26,26,46,0.15)", paddingBottom:4, marginBottom:8 }}>Profile</div>
                      <div style={{ fontSize:11, color:"#333", lineHeight:1.6, fontStyle:"italic" }}>Results-driven Product Manager with 7+ years scaling B2B SaaS products from 0 to $12M ARR. Led cross-functional teams of 15+ across 3 time zones, delivering 40% improvement in user retention.</div>
                    </div>
                    {/* Mock experience lines */}
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a1a2e", borderBottom:"1px solid rgba(26,26,46,0.15)", paddingBottom:4, marginBottom:8 }}>Experience</div>
                      {[
                        { role:"Senior Product Manager", co:"Stripe", dates:"2021–Present" },
                        { role:"Product Manager", co:"Notion", dates:"2019–2021" },
                      ].map((j,i)=>(
                        <div key={i} style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:600, color:"#1a1a2e" }}><span>{j.role} · {j.co}</span><span style={{ color:"#8a8a96", fontWeight:400 }}>{j.dates}</span></div>
                          <div style={{ width:"100%", height:5, background:"rgba(0,0,0,0.06)", borderRadius:3, marginTop:5 }} />
                          <div style={{ width:"85%", height:5, background:"rgba(0,0,0,0.06)", borderRadius:3, marginTop:4 }} />
                        </div>
                      ))}
                    </div>
                    {/* ATS badge overlay */}
                    <div style={{ position:"absolute", bottom:24, right:24, background:"linear-gradient(135deg,#0d0d0f,#1a1a1f)", borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, border:"1px solid var(--gold-border)" }}>
                      <div>
                        <div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"#5a5a68", marginBottom:2 }}>ATS Score</div>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, color:"#4ade80" }}>94<span style={{ fontSize:11, color:"#5a5a68" }}>/100</span></div>
                      </div>
                      <div style={{ width:36, height:36, borderRadius:"50%", border:"2.5px solid #4ade80", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ color:"#4ade80", fontSize:14 }}>✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stats bar ── */}
              <div className="fade-in" style={{ borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)", padding:"32px 0", marginBottom:80 }}>
                <div style={{ display:"flex", justifyContent:"center", gap:40, flexWrap:"wrap" }}>
                  {[
                    { stat:"4 tools", label:"in one platform" },
                    { stat:"ATS optimised", label:"every resume" },
                    { stat:"$15/month", label:"all features included" },
                    { stat:"Cancel anytime", label:"no lock-in" },
                  ].map((s,i)=>(
                    <div key={i} style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color:"var(--gold)", marginBottom:4 }}>{s.stat}</div>
                      <div style={{ fontSize:12, color:"var(--ash)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Features ── */}
              <div style={{ maxWidth:1100, margin:"0 auto 100px" }}>
                <div style={{ textAlign:"center", marginBottom:56 }}>
                  <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:14 }}>Everything you need to get hired</h2>
                  <p style={{ color:"var(--ash)", fontSize:16, fontWeight:300 }}>Four powerful tools. One platform.</p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
                  {[
                    { icon:"⚡", title:"Apply Mode", badge:"Premium", desc:"Paste any job URL. Get a tailored resume, cover letter, and interview prep — all in one shot. The fastest way to apply." },
                    { icon:"✦", title:"Build Resume", badge:"Free", desc:"Start from scratch. Fill in your details and get a polished, ATS-optimised resume in under 2 minutes." },
                    { icon:"↑", title:"Tailor to a Job", badge:"Free", desc:"Already have a resume? Upload your PDF and rewrite it specifically for any role — even if the industries are different." },
                    { icon:"in", title:"LinkedIn Optimizer", badge:"Free", desc:"Get a full AI audit of your LinkedIn profile with prioritised, actionable fixes to attract more recruiters." },
                  ].map((f,i)=>(
                    <div key={i} className="card" style={{ padding:"28px 24px", cursor:"pointer" }} onClick={()=>go(1)}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                        <span style={{ fontSize:24, color:"var(--gold)" }}>{f.icon}</span>
                        <span style={{ fontSize:9, padding:"3px 10px", borderRadius:8, background: f.badge==="Premium" ? "linear-gradient(135deg,#c9a84c,#e8c96d)" : "rgba(74,222,128,0.1)", color: f.badge==="Premium" ? "#0d0d0f" : "#4ade80", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", border: f.badge==="Free" ? "1px solid rgba(74,222,128,0.3)" : "none" }}>{f.badge}</span>
                      </div>
                      <div style={{ fontWeight:500, fontSize:16, marginBottom:10, color:"var(--text-primary)" }}>{f.title}</div>
                      <div style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Pricing ── */}
              <div style={{ maxWidth:480, margin:"0 auto 100px", textAlign:"center" }}>
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:14 }}>Simple pricing</h2>
                <p style={{ color:"var(--ash)", fontSize:16, fontWeight:300, marginBottom:40 }}>Start free. Upgrade when you're ready.</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
                  {/* Free tier */}
                  <div className="card" style={{ padding:"28px 24px", textAlign:"left" }}>
                    <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ash)", marginBottom:8 }}>Free</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:36, fontWeight:300, marginBottom:4 }}>$0</div>
                    <div style={{ fontSize:12, color:"var(--ash)", marginBottom:20 }}>No card needed</div>
                    {["Build Resume","Tailor to Job","LinkedIn Optimizer","ATS Score + Tips"].map((f,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13 }}>
                        <span style={{ color:"#4ade80", flexShrink:0 }}>✓</span><span style={{ color:"var(--text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                    <button className="ghost-btn" style={{ width:"100%", marginTop:20, fontSize:13 }} onClick={()=>go(1)}>Get Started →</button>
                  </div>
                  {/* Premium tier */}
                  <div style={{ padding:"28px 24px", textAlign:"left", background:"var(--gold-dim)", border:"1px solid var(--gold-border)", borderRadius:16, position:"relative" }}>
                    <div style={{ position:"absolute", top:-10, right:16, fontSize:9, padding:"3px 12px", borderRadius:8, background:"linear-gradient(135deg,#c9a84c,#e8c96d)", color:"#0d0d0f", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Popular</div>
                    <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Premium</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:36, fontWeight:300, color:"var(--gold)", marginBottom:4 }}>$15<span style={{ fontSize:14, color:"var(--ash)" }}>/mo</span></div>
                    <div style={{ fontSize:12, color:"var(--ash)", marginBottom:20 }}>Cancel anytime</div>
                    {["Everything in Free","Apply Mode","PDF Download","Share Link","ATS Fix My Score","AI Resume Assistant","Job Recommendations"].map((f,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13 }}>
                        <span style={{ color:"var(--gold)", flexShrink:0 }}>✦</span><span style={{ color:"var(--text-primary)" }}>{f}</span>
                      </div>
                    ))}
                    <button className="gold-btn pulse" style={{ width:"100%", marginTop:20, fontSize:13 }} onClick={()=>go(1)}>Start Free →</button>
                  </div>
                </div>
              </div>

              {/* ── Live Job Listings ── */}
              <div style={{ marginBottom:80 }}>
                <div style={{ textAlign:"center", marginBottom:32 }}>
                  <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:10 }}>Live job listings</h2>
                  <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>Real jobs from thousands of boards — updated daily.</p>
                </div>
                <LiveJobsSearch />
              </div>

              {/* ── ATS Score Hook ── */}
              <ATSScoreHook onSignUp={()=>setPage("register")} />

              {/* ── Final CTA ── */}
              <div style={{ textAlign:"center", padding:"80px 0 60px", borderTop:"1px solid var(--border-subtle)" }}>
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:48, fontWeight:300, letterSpacing:"-1.5px", marginBottom:16 }}>
                  Your next job starts<br />
                  <em style={{ background:"linear-gradient(135deg,#c9a84c,#f0d98a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>with a great resume.</em>
                </h2>
                <p style={{ color:"var(--ash)", fontSize:16, marginBottom:36 }}>Join thousands of job seekers who use Crafted Resume to stand out.</p>
                <button className="gold-btn pulse" onClick={()=>go(1)} style={{ fontSize:15, padding:"16px 48px" }}>
                  Get Started Free →
                </button>
              </div>

            </div>
          )}

          {/* ══ TOOL PICKER (step 1) ══ */}
          {step===1 && !mode && (
            <div className="scale-in">
              <div style={{ textAlign:"center", padding:"52px 0 36px" }}>
                {(() => {
                  const firstName = user?.name?.split(" ")[0] || "there";
                  const greetings = [
                    `Good to see you, ${firstName}. What are we working on?`,
                    `Hey ${firstName} — let's get you hired. What do you need?`,
                    `Welcome back, ${firstName}. What's the move today?`,
                    `Ready when you are, ${firstName}. Pick a tool.`,
                    `Let's get to work, ${firstName}. What do you need?`,
                    `${firstName}, your next opportunity starts here. What's first?`,
                  ];
                  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
                  return (
                    <>
                      <h2 style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:300, letterSpacing:"-1px", marginBottom:10 }}>
                        {greeting}
                      </h2>
                      <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>Pick a tool to get started.</p>
                    </>
                  );
                })()}
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
                    desc:"Start from scratch. Fill in your details and get a polished resume in seconds." },
                  { id:"tailor",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
                    title:"Tailor to a Job",
                    desc:"Upload your existing resume PDF and rewrite it for any role." },
                  { id:"linkedin",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
                    title:"LinkedIn Optimizer",
                    desc:"AI audit of your LinkedIn profile with prioritised, actionable fixes." },
                  { id:"interview",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                    title:"Interview Prep",
                    desc:"Enter a role and company. Get tailored interview questions with expert guidance." },
                  { id:"linkedin-quick",
                    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                    title:"LinkedIn Writer",
                    desc:"Write a punchy LinkedIn headline and About section in seconds." },
                ].map((m,i)=>(
                  <div key={m.id} className={`mode-card fade-up d${i+1}`}
                    onClick={()=>{ setMode(m.id); go(2); }}
                    style={{ position:"relative", padding:"28px 24px" }}>
                    {m.hot && (
                      <div style={{ position:"absolute", top:14, right:14, fontSize:8, padding:"2px 8px", borderRadius:8, background:"linear-gradient(135deg,#c9a84c,#e8c96d)", color:"#0d0d0f", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>New</div>
                    )}
                    <div style={{ color:"var(--text-secondary)", marginBottom:16, transition:"color 0.3s" }}>{m.icon}</div>
                    <div style={{ fontWeight:500, fontSize:16, marginBottom:8, color:"var(--text-primary)" }}>{m.title}</div>
                    <div style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center", paddingTop:8 }}>
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>go(0)}>← Back</button>
              </div>
            </div>
          )}

          {/* Steps indicator — only show on form + results, not shared view */}
          {step > 1 && !isShared && <Steps current={step-1} />}

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
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:24, fontWeight:300 }}>Your PDF is read and rewritten to match the job you want — even if the roles are completely different.</p>
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
                  {loading?<span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>:"Analyse My Profile"}
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
                    <p style={{ fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:5 }}>The full job posting is fetched and read automatically.</p>
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
                <p style={{ color:"var(--ash)", fontSize:13, marginBottom:20, fontWeight:300 }}>Upload your current resume PDF and it will be tailored specifically to this job.</p>
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

          {/* ══ INTERVIEW PREP FORM ══ */}
          {step===2 && mode==="interview" && (
            <div>
              <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(74,222,128,0.06),rgba(74,222,128,0.02))", border:"1px solid rgba(74,222,128,0.2)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontSize:28 }}>🎯</div>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"#4ade80", marginBottom:2 }}>Interview Prep Generator</div>
                  <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Enter the role, company, and your background — get tailored interview questions with expert guidance on how to answer.</div>
                </div>
              </div>
              <div className="card fade-up d1">
                <InterviewPrepForm onResult={r=>{ setInterviewResult(r); go(3); }} setErr={setErr} loading={loading} setLoading={setLoading} loadMsg={loadMsg} startLoad={startLoad} />
              </div>
              <div style={{ textAlign:"center", marginTop:16 }}>
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>go(1)}>← Back</button>
              </div>
            </div>
          )}

          {/* ══ LINKEDIN WRITER FORM ══ */}
          {step===2 && mode==="linkedin-quick" && (
            <div>
              <div className="fade-up" style={{ background:"linear-gradient(135deg,rgba(10,102,194,0.08),rgba(10,102,194,0.02))", border:"1px solid rgba(10,102,194,0.2)", borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontSize:28 }}>✍️</div>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:300, color:"#60a5fa", marginBottom:2 }}>LinkedIn Headline & Summary Writer</div>
                  <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Get a punchy LinkedIn headline and compelling About section written by AI in seconds.</div>
                </div>
              </div>
              <div className="card fade-up d1">
                <LinkedInWriterForm onResult={r=>{ setLinkedInWriterResult(r); go(3); }} setErr={setErr} loading={loading} setLoading={setLoading} loadMsg={loadMsg} startLoad={startLoad} />
              </div>
              <div style={{ textAlign:"center", marginTop:16 }}>
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>go(1)}>← Back</button>
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
                          {applyResult.company && <span style={{ color:"var(--text-primary)",fontWeight:500 }}>{applyResult.company}</span>}
                          {applyResult.jobTitle && <span style={{ color:"var(--ash)" }}> · {applyResult.jobTitle}</span>}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                        {user?.subscriptionStatus==="active" ? (
                          <>
                            <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>makeShareLink(applyResult.resume)}>{shareMsg||"🔗 Share"}</button>
                            <button className="gold-btn" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>exportPDF(applyResult.resume?.name)}>⬇ Download PDF</button>
                          </>
                        ) : (
                          <button className="gold-btn pulse" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>setPage("subscribe")}>✦ Upgrade for Full Access</button>
                        )}
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
                        color:      applyTab===t.id ? "var(--text-primary)" : "var(--ash)",
                        boxShadow:  applyTab===t.id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                      }}>{t.label}</button>
                    ))}
                  </div>

                  {/* Tab: Resume */}
                  {applyTab==="resume" && applyResult.resume && (() => {
                    const isPaidApply = user?.subscriptionStatus === "active";
                    return (
                      <div className="scale-in">
                        <ATSMeter text={`${applyResult.resume.summary||""} ${applyResult.resume.experience||""} ${applyResult.resume.skills||""}`} onFix={isPaidApply ? fixATS : null} onUpgrade={()=>setPage("subscribe")} />
                        <div style={{ marginTop:16 }}>
                          {isPaidApply
                            ? <div style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)" }}><Preview data={applyResult.resume} template={form.template} /></div>
                            : <LockedPreview data={applyResult.resume} template={form.template} onUpgrade={()=>setPage("subscribe")} />
                          }
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tab: Cover Letter */}
                  {applyTab==="cover" && (() => {
                    const isPaidApply = user?.subscriptionStatus === "active";
                    return isPaidApply ? (
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
                    ) : (
                      <div className="card scale-in" style={{ background:"#fff", color:"#1a1a2e", position:"relative", overflow:"hidden" }}>
                        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, fontWeight:300, color:"#1a1a2e", marginBottom:16 }}>Cover Letter</div>
                        {/* Show first ~3 lines blurred out */}
                        <div style={{ filter:"blur(5px)", userSelect:"none", pointerEvents:"none", fontFamily:"'Outfit',sans-serif", fontSize:14, lineHeight:1.8, color:"#333", whiteSpace:"pre-wrap", maxHeight:120, overflow:"hidden" }}>
                          {applyResult.coverLetter?.slice(0, 300)}
                        </div>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.97) 65%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:32, gap:10 }}>
                          <div style={{ fontSize:14, fontWeight:500, color:"#1a1a2e" }}>🔒 Cover letter is a premium feature</div>
                          <div style={{ fontSize:12, color:"#666", marginBottom:4 }}>Upgrade to read, download and send your cover letter</div>
                          <button className="gold-btn" style={{ fontSize:13, padding:"10px 28px" }} onClick={()=>setPage("subscribe")}>Unlock with Premium →</button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tab: Interview Prep */}
                  {applyTab==="interview" && (() => {
                    const isPaidApply = user?.subscriptionStatus === "active";
                    return isPaidApply ? (
                      <div className="scale-in">
                        <div style={{ marginBottom:16, padding:"14px 18px", background:"rgba(201,168,76,0.06)", border:"1px solid var(--gold-border)", borderRadius:11, fontSize:13, color:"var(--ash)", lineHeight:1.6 }}>
                          <strong style={{ color:"var(--gold)" }}>🎯 Prep tip:</strong> These questions are tailored specifically to this job and your background. Practise answering out loud — aim for 2 minutes per answer using the STAR method.
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
                    ) : (
                      <div className="scale-in">
                        {/* Show first question as tease */}
                        {applyResult.interviewPrep?.slice(0,1).map((item,i)=>(
                          <div key={i} className="card" style={{ marginBottom:14, opacity:0.6 }}>
                            <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
                              <div style={{ width:28,height:28,borderRadius:8,background:"var(--gold-dim)",border:"1px solid var(--gold-border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--gold)",flexShrink:0 }}>1</div>
                              <div style={{ fontWeight:500,fontSize:15,lineHeight:1.4 }}>{item.question}</div>
                            </div>
                            <div style={{ marginLeft:40, filter:"blur(4px)", userSelect:"none" }}>
                              <div style={{ fontSize:13,color:"var(--ash)",lineHeight:1.7 }}>{item.guidance}</div>
                            </div>
                          </div>
                        ))}
                        {/* Locked overlay for rest */}
                        <div style={{ padding:"32px 24px", textAlign:"center", border:"1px solid var(--gold-border)", borderRadius:14, background:"var(--gold-dim)" }}>
                          <div style={{ fontSize:18, marginBottom:12 }}>🎯</div>
                          <div style={{ fontSize:15, fontWeight:500, marginBottom:8 }}>{(applyResult.interviewPrep?.length||0)} interview questions ready</div>
                          <div style={{ fontSize:13, color:"var(--ash)", marginBottom:20 }}>Tailored to this exact role and your background. Unlock to see all questions with detailed guidance.</div>
                          <button className="gold-btn pulse" style={{ fontSize:13, padding:"11px 28px" }} onClick={()=>setPage("subscribe")}>Unlock Interview Prep →</button>
                        </div>
                      </div>
                    );
                  })()}
                  {/* AI Assistant for Apply Mode */}
                  {user?.subscriptionStatus === "active" && (
                    <ResumeChat resume={applyResult.resume} onUpdate={updated=>setApplyResult(r=>({...r,resume:updated}))} />
                  )}
                </div>
              )}

              {/* Regular resume result */}
              {result && (() => {
                const isPaid = user?.subscriptionStatus === "active";
                return (
                <>
                  {!isShared && (
                    <div className="card scale-in" style={{ borderColor:"rgba(74,222,128,0.2)", background:"rgba(74,222,128,0.035)", marginBottom:24 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
                        <div>
                          <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:300, color:"#4ade80", marginBottom:4 }}>✓ Resume Complete</div>
                          <div style={{ fontSize:13,color:"var(--ash)",fontWeight:300 }}>
                            {isPaid ? "Your AI-crafted resume is ready. Review below, then download or print." : "Your resume is ready — upgrade to download, share, and fix your ATS score."}
                          </div>
                        </div>
                        <div className="result-actions" style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                          {isPaid ? (
                            <>
                              <button className="ghost-btn" style={{ fontSize:12 }} onClick={downloadTxt}>Download .txt</button>
                              <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>makeShareLink(result)}>{shareMsg||"🔗 Share"}</button>
                              <button className="gold-btn" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>exportPDF(result.name)}>⬇ Download PDF</button>
                            </>
                          ) : (
                            <button className="gold-btn pulse" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>setPage("subscribe")}>
                              ✦ Upgrade to Download
                            </button>
                          )}
                        </div>
                      </div>
                      <ATSMeter
                        text={`${result.summary||""} ${result.experience||""} ${result.skills||""}`}
                        onFix={isPaid ? fixATS : null}
                        onUpgrade={()=>setPage("subscribe")}
                      />
                    </div>
                  )}
                  <div className="fade-up" style={{ marginBottom:32 }}>
                    {isPaid || isShared
                      ? <div style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)" }}><Preview data={result} template={form.template} /></div>
                      : <LockedPreview data={result} template={form.template} onUpgrade={()=>setPage("subscribe")} />
                    }
                  </div>
                  {isPaid && !isShared && (
                    <ResumeChat resume={result} onUpdate={updated=>setResult(updated)} />
                  )}
                  {!isShared && (() => {
                    const isPaidJobs = user?.subscriptionStatus === "active";
                    return isPaidJobs
                      ? <JobRecommendations role={result.targetRole} skills={result.skills} location={form.location} />
                      : (
                        <div style={{marginTop:24,padding:"20px 24px",borderRadius:14,border:"1px solid var(--gold-border)",background:"var(--gold-dim)",textAlign:"center"}}>
                          <div style={{fontSize:14,fontWeight:500,marginBottom:8}}>✦ Job Recommendations</div>
                          <div style={{fontSize:13,color:"var(--ash)",marginBottom:16}}>Get matched to live job postings based on your resume — premium feature.</div>
                          <button className="gold-btn" style={{fontSize:12,padding:"8px 20px"}} onClick={()=>setPage("subscribe")}>Unlock with Premium →</button>
                        </div>
                      );
                  })()}
                </>
                );
              })()}

              {liResult && (
                <>
                  <div style={{ textAlign:"right", marginBottom:18 }}>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                  </div>
                  <LinkedInResults data={liResult} />
                </>
              )}

              {/* Interview Prep Results */}
              {interviewResult && (
                <div className="fade-up">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:300, color:"#4ade80" }}>🎯 Your Interview Questions</div>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                  </div>
                  {interviewResult.role && (
                    <div style={{ marginBottom:20, padding:"12px 18px", background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:10, fontSize:13, color:"var(--ash)" }}>
                      Prepared for: <strong style={{ color:"var(--text-primary)" }}>{interviewResult.role}{interviewResult.company ? ` at ${interviewResult.company}` : ""}</strong>
                    </div>
                  )}
                  <div style={{ marginBottom:16, padding:"14px 18px", background:"rgba(201,168,76,0.06)", border:"1px solid var(--gold-border)", borderRadius:11, fontSize:13, color:"var(--ash)", lineHeight:1.6 }}>
                    <strong style={{ color:"var(--gold)" }}>🎯 Prep tip:</strong> Practise answering out loud. Aim for 90 seconds per answer using the STAR method: Situation → Task → Action → Result.
                  </div>
                  {(interviewResult.questions||[]).map((item,i) => (
                    <div key={i} className="card fade-up" style={{ animationDelay:`${i*0.06}s`, marginBottom:14 }}>
                      <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
                        <div style={{ width:28,height:28,borderRadius:8,background:"var(--gold-dim)",border:"1px solid var(--gold-border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--gold)",flexShrink:0 }}>{i+1}</div>
                        <div style={{ fontWeight:500,fontSize:15,lineHeight:1.4 }}>{item.question}</div>
                      </div>
                      <div style={{ marginLeft:40 }}>
                        <div style={{ fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:6 }}>How to answer</div>
                        <div style={{ fontSize:13,color:"var(--ash)",lineHeight:1.7,marginBottom:10 }}>{item.guidance}</div>
                        {item.keyPoints && item.keyPoints.length > 0 && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {item.keyPoints.map((kp,j) => (
                              <span key={j} style={{ fontSize:11,padding:"3px 10px",borderRadius:8,background:"var(--mist)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--ash)" }}>{kp}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {interviewResult.generalTips && (
                    <div className="card" style={{ borderColor:"var(--gold-border)", background:"var(--gold-dim)" }}>
                      <div style={{ fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>General Tips for This Role</div>
                      <div style={{ fontSize:13, color:"var(--ash)", lineHeight:1.7 }}>{interviewResult.generalTips}</div>
                    </div>
                  )}
                </div>
              )}

              {/* LinkedIn Writer Results */}
              {linkedInWriterResult && (
                <div className="fade-up">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:300, color:"#60a5fa" }}>✍️ Your LinkedIn Copy</div>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={resetAll}>Start Over</button>
                  </div>

                  {/* Headlines */}
                  <div className="card fade-up" style={{ marginBottom:16, borderColor:"rgba(10,102,194,0.2)" }}>
                    <div style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#60a5fa",marginBottom:14 }}>Headline Options — pick your favourite</div>
                    {(linkedInWriterResult.headlines||[]).map((h,i) => (
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 0", borderBottom: i < (linkedInWriterResult.headlines.length-1) ? "1px solid var(--border-subtle)" : "none" }}>
                        <span style={{ width:22, height:22, borderRadius:"50%", background:"rgba(10,102,194,0.15)", border:"1px solid rgba(10,102,194,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#60a5fa", flexShrink:0 }}>{i+1}</span>
                        <div style={{ flex:1, fontSize:14, color:"var(--text-primary)", lineHeight:1.5 }}>{h}</div>
                        <button onClick={()=>navigator.clipboard.writeText(h)} style={{ background:"none", border:"1px solid var(--ghost-border)", borderRadius:6, padding:"4px 10px", fontSize:11, color:"var(--ash)", cursor:"pointer", fontFamily:"var(--font-body)", flexShrink:0 }}>Copy</button>
                      </div>
                    ))}
                  </div>

                  {/* About section */}
                  <div className="card fade-up" style={{ marginBottom:16, borderColor:"rgba(10,102,194,0.2)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#60a5fa" }}>About / Summary Section</div>
                      <button onClick={()=>navigator.clipboard.writeText(linkedInWriterResult.about||"")} style={{ background:"none", border:"1px solid var(--ghost-border)", borderRadius:6, padding:"4px 10px", fontSize:11, color:"var(--ash)", cursor:"pointer", fontFamily:"var(--font-body)" }}>Copy</button>
                    </div>
                    <div style={{ fontSize:13, color:"var(--text-primary)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{linkedInWriterResult.about}</div>
                  </div>

                  {/* Tips */}
                  {linkedInWriterResult.tips && linkedInWriterResult.tips.length > 0 && (
                    <div className="card fade-up" style={{ borderColor:"var(--gold-border)", background:"var(--gold-dim)" }}>
                      <div style={{ fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>Profile Optimisation Tips</div>
                      {linkedInWriterResult.tips.map((tip,i) => (
                        <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13 }}>
                          <span style={{ color:"var(--gold)", flexShrink:0 }}>→</span>
                          <span style={{ color:"var(--ash)", lineHeight:1.6 }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
      )}
    </>
  );
}