import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Landing      from "./pages/Landing";
import Blog         from "./pages/Blog";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import Subscribe    from "./pages/Subscribe";
import Account      from "./pages/Account";
import Dashboard    from "./pages/Dashboard";
import BuildResume  from "./pages/BuildResume";
import TailorJob    from "./pages/TailorJob";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import ApplyMode      from "./pages/ApplyMode";
import InterviewPrep  from "./pages/InterviewPrep";
import LinkedInWriter from "./pages/LinkedInWriter";

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
    @keyframes fadeIn    { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
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



function HeroGlow() {
  return (
    <>
      <div style={{ position:"fixed", top:"-20%", left:"20%", width:"60%", height:600, background:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", right:"-5%", width:400, height:400, background:"radial-gradient(ellipse, rgba(201,168,76,0.03) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

function LiveJobs({ what, where, title, compact }) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [fetched, setFetched] = useState(false);
  const [err, setErr]         = useState("");
  const API = process.env.REACT_APP_API_URL || "";

  const fetchJobs = async (p=1) => {
    setLoading(true); setErr("");
    try {
      const params = new URLSearchParams({ what: what||"software engineer", page: p });
      if (where) params.set("where", where);
      const res  = await fetch(`${API}/api/live-jobs?${params}`);
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Could not load jobs."); setFetched(true); return; }
      if (!data.jobs||data.jobs.length===0) { setErr(`No listings found for "${what}".`); setFetched(true); return; }
      setJobs(data.jobs); setTotal(data.total||0); setPage(p); setFetched(true);
    } catch(e) { setErr("Network error — please try again."); setFetched(true); }
    finally { setLoading(false); }
  };

  // Fetch when scrolled into view — avoids rate limiting
  const liveJobsRef = useRef(null);
  useEffect(() => {
    const el = liveJobsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { fetchJobs(1); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = n => n>=1000?`$${Math.round(n/1000)}k`:`$${n}`;
  const sal = (min,max) => !min&&!max?null:min&&max?`${fmt(min)} – ${fmt(max)}`:min?`From ${fmt(min)}`:`Up to ${fmt(max)}`;
  const ago = d => { if(!d)return""; const days=Math.floor((Date.now()-new Date(d).getTime())/86400000); return days===0?"Today":days===1?"Yesterday":days<7?`${days}d ago`:days<30?`${Math.floor(days/7)}w ago`:`${Math.floor(days/30)}mo ago`; };

  if (!fetched) return (
    <div ref={liveJobsRef} style={{ textAlign:"center", padding:compact?"20px 0":"40px 0" }}>
      <span style={{ width:18,height:18,border:"2px solid rgba(201,168,76,0.3)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />
      <div style={{ fontSize:12, color:"var(--ash)", marginTop:10 }}>Loading live listings…</div>
    </div>
  );

  if (err) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:13, color:"#f87171", marginBottom:14 }}>{err}</div>
      <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{ setFetched(false); setErr(""); }}>Try Again</button>
    </div>
  );

  return (
    <div>
      {title && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:13, color:"var(--ash)" }}>{total.toLocaleString()} listings for <strong style={{ color:"var(--text-primary)" }}>{what}</strong></div>
          <button onClick={()=>fetchJobs(1)} disabled={loading} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:12, fontFamily:"var(--font-body)" }}>{loading?"Refreshing…":"↺ Refresh"}</button>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12, marginBottom:16 }}>
        {jobs.map((job,i)=>(
          <a key={job.id||i} href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <div className="card" style={{ padding:"16px 18px", cursor:"pointer", height:"100%", transition:"all 0.2s", borderColor:"rgba(255,255,255,0.06)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)";}}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, gap:8 }}>
                <div style={{ fontWeight:500, fontSize:14, color:"var(--text-primary)", lineHeight:1.3 }}>{job.title}</div>
                <span style={{ fontSize:10, color:"var(--ash)", whiteSpace:"nowrap", flexShrink:0 }}>{ago(job.created)}</span>
              </div>
              <div style={{ fontSize:12, color:"var(--gold)", marginBottom:4 }}>{job.company}</div>
              <div style={{ fontSize:12, color:"var(--ash)", marginBottom:8 }}>{job.location}</div>
              {sal(job.salaryMin,job.salaryMax)&&<div style={{ fontSize:11, padding:"3px 10px", borderRadius:8, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ade80", display:"inline-block", marginBottom:8 }}>{sal(job.salaryMin,job.salaryMax)}</div>}
              <div style={{ fontSize:11, color:"var(--ash)", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{job.description}</div>
              <div style={{ marginTop:10, fontSize:11, color:"var(--gold)", letterSpacing:"0.06em" }}>Apply ↗</div>
            </div>
          </a>
        ))}
      </div>
      {total>6&&(
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:8 }}>
          <button className="ghost-btn" style={{ fontSize:11, padding:"6px 14px" }} onClick={()=>fetchJobs(Math.max(1,page-1))} disabled={loading||page===1}>← Prev</button>
          <span style={{ fontSize:12, color:"var(--ash)", padding:"6px 10px" }}>Page {page}</span>
          <button className="ghost-btn" style={{ fontSize:11, padding:"6px 14px" }} onClick={()=>fetchJobs(page+1)} disabled={loading}>Next →</button>
        </div>
      )}
    </div>
  );
}

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
          Unlock for $20/month →
        </button>
      </div>
    </div>
  );
}
function Sec({ title, accent, border, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:accent, borderBottom:border||`1.5px solid ${accent}33`, paddingBottom:6, marginBottom:12 }}>{title}</h2>
      {children}
    </div>
  );
}

function Preview({ data, template }) {
  if (!data) return null;

  // ── EXECUTIVE: Classic serif, single column, gold rule ──────────────
  if (!template || template==="executive") {
    const A="#1a1a2e", S="#8a8a96";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#1a1a2e", fontFamily:"'Outfit',sans-serif", padding:"52px 60px", lineHeight:1.65, fontSize:13.5 }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:38, fontWeight:600, letterSpacing:"-0.5px", color:A, marginBottom:2 }}>{data.name}</h1>
          <div style={{ fontSize:15, fontStyle:"italic", color:S, marginBottom:12, fontFamily:"'Cormorant Garamond',Georgia,serif" }}>{data.targetRole}</div>
          <div style={{ height:2, background:`linear-gradient(90deg,${A},${A}22)`, marginBottom:10 }} />
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:11.5, color:"#666" }}>
            {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
          </div>
        </div>
        {data.summary    && <Sec title="Profile"    accent={A}><p style={{ color:"#333", fontStyle:"italic", lineHeight:1.8 }}>{data.summary}</p></Sec>}
        {data.experience && <Sec title="Experience" accent={A}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${A}'>•</span>`) }} style={{ color:"#333" }} /></Sec>}
        {data.education  && <Sec title="Education"  accent={A}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
        {data.skills     && <Sec title="Skills"     accent={A}><div style={{ color:"#333" }}>{data.skills}</div></Sec>}
        {data.certifications && <Sec title="Certifications" accent={A}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
      </div>
    );
  }

  // ── MODERN: Two-column sidebar, blue accent ──────────────────────────
  if (template==="modern") {
    const A="#0f4c81", SIDE="#f0f4f8";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#222", fontFamily:"'Outfit',sans-serif", fontSize:13, lineHeight:1.6, display:"flex", minHeight:"100%" }}>
        {/* Sidebar */}
        <div style={{ width:"32%", background:SIDE, padding:"40px 24px", flexShrink:0 }}>
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:A, lineHeight:1.2, marginBottom:4 }}>{data.name}</h1>
            <div style={{ fontSize:12, color:"#555", fontWeight:500 }}>{data.targetRole}</div>
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:A, marginBottom:8 }}>Contact</div>
            {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=>(
              <div key={i} style={{ fontSize:11, color:"#444", marginBottom:4, wordBreak:"break-all" }}>{v}</div>
            ))}
          </div>
          {data.skills && (
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:A, marginBottom:8 }}>Skills</div>
              {data.skills.split(/[,|\n]/).filter(Boolean).map((s,i)=>(
                <div key={i} style={{ fontSize:11, color:"#333", marginBottom:6 }}>
                  <div style={{ marginBottom:3 }}>{s.trim()}</div>
                  <div style={{ height:4, background:"#ddd", borderRadius:2 }}><div style={{ height:"100%", width:`${75+Math.random()*20}%`, background:A, borderRadius:2 }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Main */}
        <div style={{ flex:1, padding:"40px 32px" }}>
          {data.summary    && <Sec title="About Me"   accent={A}><p style={{ color:"#333" }}>{data.summary}</p></Sec>}
          {data.experience && <Sec title="Experience" accent={A}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${A}'>•</span>`) }} style={{ color:"#333" }} /></Sec>}
          {data.education  && <Sec title="Education"  accent={A}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
          {data.certifications && <Sec title="Certifications" accent={A}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
        </div>
      </div>
    );
  }

  // ── MINIMAL: Ultra clean, lots of whitespace, thin rules ────────────
  if (template==="minimal") {
    const A="#2c2c2c";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#222", fontFamily:"Georgia,serif", padding:"60px 70px", lineHeight:1.8, fontSize:13.5 }}>
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:32, fontWeight:400, letterSpacing:"0.02em", color:A, marginBottom:4 }}>{data.name}</h1>
          <div style={{ fontSize:13, color:"#888", letterSpacing:"0.08em", marginBottom:16 }}>{data.targetRole?.toUpperCase()}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:20, fontSize:11.5, color:"#666" }}>
            {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
          </div>
        </div>
        {data.summary    && <Sec title="Summary"    accent="#888" border="1px solid #eee"><p style={{ color:"#333", fontStyle:"italic" }}>{data.summary}</p></Sec>}
        {data.experience && <Sec title="Experience" accent="#888" border="1px solid #eee"><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
        {data.education  && <Sec title="Education"  accent="#888" border="1px solid #eee"><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
        {data.skills     && <Sec title="Skills"     accent="#888" border="1px solid #eee"><div style={{ color:"#333" }}>{data.skills}</div></Sec>}
        {data.certifications && <Sec title="Certifications" accent="#888" border="1px solid #eee"><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
      </div>
    );
  }

  // ── ELEGANT: Warm serif, centered header, decorative rules ──────────
  if (template==="elegant") {
    const A="#6b4c3b", S="#9a7b6b";
    return (
      <div id="resume-output" style={{ background:"#fffdf9", color:"#2a1f1a", fontFamily:"'Outfit',sans-serif", padding:"52px 60px", lineHeight:1.7, fontSize:13.5 }}>
        <div style={{ textAlign:"center", marginBottom:30, paddingBottom:20, borderBottom:`1px solid ${A}44` }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:40, fontWeight:400, color:A, marginBottom:4, letterSpacing:"0.03em" }}>{data.name}</h1>
          <div style={{ fontSize:14, color:S, fontStyle:"italic", marginBottom:12 }}>{data.targetRole}</div>
          <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:16, fontSize:11.5, color:"#888" }}>
            {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=>(
              <span key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>{i>0&&<span style={{ color:`${A}66` }}>·</span>}{v}</span>
            ))}
          </div>
        </div>
        {data.summary    && <Sec title="Profile"    accent={A}><p style={{ color:"#444", fontStyle:"italic", lineHeight:1.9 }}>{data.summary}</p></Sec>}
        {data.experience && <Sec title="Experience" accent={A}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${A}'>◆</span>`) }} style={{ color:"#333" }} /></Sec>}
        {data.education  && <Sec title="Education"  accent={A}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
        {data.skills     && <Sec title="Skills"     accent={A}><div style={{ color:"#333" }}>{data.skills}</div></Sec>}
        {data.certifications && <Sec title="Certifications" accent={A}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
      </div>
    );
  }

  // ── BOLD: Dark header bar, high contrast, strong typography ─────────
  if (template==="bold") {
    const A="#111", HL="#e8c96d";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#111", fontFamily:"'Outfit',sans-serif", fontSize:13.5, lineHeight:1.6 }}>
        {/* Header block */}
        <div style={{ background:A, color:"#fff", padding:"36px 52px", marginBottom:0 }}>
          <h1 style={{ fontSize:34, fontWeight:800, letterSpacing:"-0.5px", marginBottom:4, color:"#fff" }}>{data.name}</h1>
          <div style={{ fontSize:14, color:HL, fontWeight:600, letterSpacing:"0.08em", marginBottom:14 }}>{data.targetRole?.toUpperCase()}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:11.5, color:"rgba(255,255,255,0.7)" }}>
            {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
          </div>
        </div>
        <div style={{ padding:"36px 52px" }}>
          {data.summary    && <Sec title="Profile"    accent={A} border={`2px solid ${A}`}><p style={{ color:"#333" }}>{data.summary}</p></Sec>}
          {data.experience && <Sec title="Experience" accent={A} border={`2px solid ${A}`}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${HL};background:${A};padding:0 3px'>•</span>`) }} style={{ color:"#333" }} /></Sec>}
          {data.education  && <Sec title="Education"  accent={A} border={`2px solid ${A}`}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
          {data.skills     && <Sec title="Skills"     accent={A} border={`2px solid ${A}`}><div style={{ color:"#333" }}>{data.skills}</div></Sec>}
          {data.certifications && <Sec title="Certifications" accent={A} border={`2px solid ${A}`}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
        </div>
      </div>
    );
  }

  // ── NAVY: Corporate two-tone, left accent bar ────────────────────────
  if (template==="navy") {
    const A="#1b3a5c", S="#5a7a9a", BAR="#e8f0f7";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#1b2a3b", fontFamily:"'Outfit',sans-serif", fontSize:13.5, lineHeight:1.65, display:"flex", minHeight:"100%" }}>
        <div style={{ width:6, background:A, flexShrink:0 }} />
        <div style={{ flex:1, padding:"48px 52px" }}>
          <div style={{ background:BAR, margin:"-48px -52px 32px", padding:"36px 52px", borderBottom:`3px solid ${A}` }}>
            <h1 style={{ fontSize:32, fontWeight:700, color:A, marginBottom:4 }}>{data.name}</h1>
            <div style={{ fontSize:14, color:S, fontWeight:500, marginBottom:12 }}>{data.targetRole}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:11.5, color:"#555" }}>
              {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
            </div>
          </div>
          {data.summary    && <Sec title="Professional Summary" accent={A}><p style={{ color:"#333" }}>{data.summary}</p></Sec>}
          {data.experience && <Sec title="Work Experience"      accent={A}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${A}'>▸</span>`) }} style={{ color:"#333" }} /></Sec>}
          {data.education  && <Sec title="Education"            accent={A}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
          {data.skills     && <Sec title="Core Skills"          accent={A}><div style={{ color:"#333", display:"flex", flexWrap:"wrap", gap:"6px 16px" }}>{data.skills.split(/[,|]/).map((s,i)=><span key={i} style={{ background:BAR, padding:"2px 10px", borderRadius:4, fontSize:12, border:`1px solid ${A}22` }}>{s.trim()}</span>)}</div></Sec>}
          {data.certifications && <Sec title="Certifications" accent={A}><div style={{ color:"#333" }}>{data.certifications}</div></Sec>}
        </div>
      </div>
    );
  }

  // ── CREATIVE: Purple gradient header, two-column, modern ────────────
  if (template==="creative") {
    const A="#5b2d8e", GRAD="linear-gradient(135deg,#5b2d8e,#9b59b6)";
    return (
      <div id="resume-output" style={{ background:"#fff", color:"#1a1a2e", fontFamily:"'Outfit',sans-serif", fontSize:13.5, lineHeight:1.65 }}>
        {/* Gradient header */}
        <div style={{ background:GRAD, color:"#fff", padding:"40px 52px", marginBottom:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
            <div>
              <h1 style={{ fontSize:34, fontWeight:700, letterSpacing:"-0.3px", marginBottom:4, color:"#fff" }}>{data.name}</h1>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.85)", fontWeight:400 }}>{data.targetRole}</div>
            </div>
            <div style={{ textAlign:"right", fontSize:11.5, color:"rgba(255,255,255,0.75)", lineHeight:1.9 }}>
              {[data.email,data.phone,data.location,data.linkedin].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ display:"flex" }}>
          <div style={{ flex:"0 0 62%", padding:"36px 32px 36px 52px", borderRight:`1px solid #eee` }}>
            {data.summary    && <Sec title="About"      accent={A}><p style={{ color:"#333" }}>{data.summary}</p></Sec>}
            {data.experience && <Sec title="Experience" accent={A}><div dangerouslySetInnerHTML={{ __html:data.experience.replace(/\n/g,"<br/>").replace(/•/g,`<span style='color:${A}'>✦</span>`) }} style={{ color:"#333" }} /></Sec>}
            {data.education  && <Sec title="Education"  accent={A}><div dangerouslySetInnerHTML={{ __html:data.education.replace(/\n/g,"<br/>") }} style={{ color:"#333" }} /></Sec>}
          </div>
          <div style={{ flex:1, padding:"36px 36px 36px 28px", background:"#faf8ff" }}>
            {data.skills && (
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:A, marginBottom:12 }}>Skills</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {data.skills.split(/[,|\n]/).filter(Boolean).map((s,i)=>(
                    <div key={i}>
                      <div style={{ fontSize:12, marginBottom:4, color:"#333" }}>{s.trim()}</div>
                      <div style={{ height:5, background:"#e8d5f5", borderRadius:3 }}><div style={{ height:"100%", width:`${70+((i*17)%25)}%`, background:GRAD, borderRadius:3 }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications && (
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:A, marginBottom:10 }}>Certifications</div>
                <div style={{ color:"#333", fontSize:13 }}>{data.certifications}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
/* ─── LinkedIn Results ─── */
/* ─── Interview Prep Form ─── */
/* ─── LinkedIn Writer Form ─── */
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


function SmartSearchDemo() {
  const [step, setStep]               = useState(0);
  const [role, setRole]               = useState('');
  const [loc, setLoc]                 = useState('');
  const [links, setLinks]             = useState([]);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [clickedLink, setClickedLink] = useState(null);
  const [curX, setCurX]               = useState(-100);
  const [curY, setCurY]               = useState(-100);
  const [curVis, setCurVis]           = useState(false);
  const [loadMsg, setLoadMsg]         = useState('Finding the best searches...');
  const [gQuery, setGQuery]           = useState('');

  const ROLE = 'Software Engineer';
  const LOC  = 'San Francisco, CA';
  const DEMO_LINKS = [
    { icon:'\u{1F3E2}', label:'Lever & Greenhouse', q:'(site:lever.co OR site:greenhouse.io) Software Engineer San Francisco' },
    { icon:'\u{1F4BC}', label:'LinkedIn Jobs',      q:'site:linkedin.com/jobs Software Engineer San Francisco' },
    { icon:'\u{1F310}', label:'Indeed SF',          q:'site:indeed.com Software Engineer San Francisco CA' },
    { icon:'\u{1F30D}', label:'Remote roles',       q:'remote Software Engineer site:lever.co OR site:greenhouse.io' },
    { icon:'\u{1F680}', label:'Startups (YC)',      q:'site:workatastartup.com Software Engineer San Francisco' },
    { icon:'\u{1F3AF}', label:'Big Tech',           q:'Software Engineer San Francisco Google Apple Meta 2025' },
  ];

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStep(0); setRole(''); setLoc(''); setLinks([]);
      setHoveredLink(null); setClickedLink(null); setCurVis(false);
      await sleep(600);
      setCurX(130); setCurY(88); setCurVis(true); await sleep(350);
      for (let i = 1; i <= ROLE.length; i++) { if (cancelled) return; setRole(ROLE.slice(0,i)); await sleep(52); }
      await sleep(200);
      setCurX(340); setCurY(88); await sleep(350);
      for (let i = 1; i <= LOC.length; i++) { if (cancelled) return; setLoc(LOC.slice(0,i)); await sleep(60); }
      await sleep(300);
      setCurX(240); setCurY(148); await sleep(400);
      setStep(1); setCurVis(false);
      const msgs = ['Finding the best searches...','Crafting targeted queries...','Almost ready...'];
      for (const m of msgs) { if (cancelled) return; setLoadMsg(m); await sleep(800); }
      setStep(2); setLinks([]);
      for (let i = 0; i < DEMO_LINKS.length; i++) {
        if (cancelled) return;
        setLinks(prev => [...prev, DEMO_LINKS[i]]);
        await sleep(160);
      }
      await sleep(500);
      setCurX(240); setCurY(240); setCurVis(true); await sleep(300);
      setHoveredLink(0); await sleep(700);
      setClickedLink(0); setHoveredLink(null); await sleep(300);
      setGQuery(DEMO_LINKS[0].q);
      setStep(3); setCurVis(false);
      await sleep(3500);
      setCurX(76); setCurY(228); setCurVis(true);
      await sleep(2000);
      setCurVis(false); await sleep(800);
      if (!cancelled) run();
    }
    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inp = (val) => ({
    background:'#111113',
    border:`1px solid ${val ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius:8, padding:'8px 12px', fontSize:12, color:'#e2e2ea', minHeight:34, transition:'border-color .2s',
  });

  return (
    <div style={{ background:'#0d0d0f', minHeight:300, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', left:curX, top:curY, opacity:curVis?1:0, transition:'left .6s cubic-bezier(.4,0,.2,1),top .6s cubic-bezier(.4,0,.2,1),opacity .3s', pointerEvents:'none', zIndex:20 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 1.5L13 8L8.5 9.5L6.5 14L3 1.5Z" fill="white" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5"/></svg>
      </div>

      {step===0 && (
        <div style={{ padding:16 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:10 }}>Enter your role and location to generate targeted job search links:</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'.08em', marginBottom:4 }}>JOB TITLE / ROLE</div>
              <div style={inp(role)}>{role || <span style={{ color:'rgba(255,255,255,0.2)' }}>e.g. Software Engineer</span>}</div>
            </div>
            <div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'.08em', marginBottom:4 }}>LOCATION</div>
              <div style={inp(loc)}>{loc || <span style={{ color:'rgba(255,255,255,0.2)' }}>e.g. San Francisco, CA</span>}</div>
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#c9a84c,#e8c96d)', color:'#0d0d0f', borderRadius:8, padding:'9px 24px', fontSize:12, fontWeight:600, textAlign:'center' }}>Generate Job Search Links</div>
        </div>
      )}

      {step===1 && (
        <div style={{ textAlign:'center', padding:'28px 0' }}>
          <div style={{ width:28, height:28, border:'2px solid rgba(201,168,76,0.15)', borderTopColor:'#c9a84c', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
          <div style={{ fontSize:13, color:'#c9a84c' }}>{loadMsg}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:4 }}>Claude is tailoring queries for your role</div>
        </div>
      )}

      {step===2 && (
        <div style={{ padding:16 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:10 }}>6 searches for {ROLE} in {LOC} — click any to open Google:</div>
          {links.map((l,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', borderRadius:9, border:`1px solid ${hoveredLink===i||clickedLink===i?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.06)'}`, background:hoveredLink===i||clickedLink===i?'rgba(201,168,76,0.06)':'rgba(255,255,255,0.02)', cursor:'pointer', marginBottom:6, transition:'all .2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:15 }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:500, color:'#e2e2ea', marginBottom:1 }}>{l.label}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>{l.q.length>42?l.q.slice(0,42)+'...':l.q}</div>
                </div>
              </div>
              <span style={{ fontSize:13, color:'#c9a84c', opacity:hoveredLink===i||clickedLink===i?1:0.4 }}>&#8599;</span>
            </div>
          ))}
          <div style={{ textAlign:'center', marginTop:6, fontSize:10, color:'rgba(255,255,255,0.2)' }}>Each link opens Google — browse results — apply directly</div>
        </div>
      )}

      {step===3 && (
        <div style={{ background:'#fff', borderRadius:10, margin:10, overflow:'hidden' }}>
          <div style={{ background:'#fff', padding:'10px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #eee' }}>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:-1 }}>
              <span style={{ color:'#4285f4' }}>G</span><span style={{ color:'#ea4335' }}>o</span><span style={{ color:'#fbbc05' }}>o</span><span style={{ color:'#34a853' }}>g</span><span style={{ color:'#ea4335' }}>l</span><span style={{ color:'#4285f4' }}>e</span>
            </div>
            <div style={{ flex:1, border:'1.5px solid #ddd', borderRadius:24, padding:'5px 14px', fontSize:10, color:'#444', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{gQuery.length>50?gQuery.slice(0,50)+'...':gQuery}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
          </div>
          <div style={{ display:'flex', padding:'0 14px', borderBottom:'1px solid #eee' }}>
            {['All','Jobs','News'].map((t,i) => (
              <div key={t} style={{ padding:'7px 12px', fontSize:11, color:i===0?'#1a73e8':'#666', borderBottom:`2px solid ${i===0?'#1a73e8':'transparent'}` }}>{t}</div>
            ))}
          </div>
          <div style={{ padding:'4px 0' }}>
            <div style={{ padding:'4px 14px', fontSize:10, color:'#666' }}>About 14,200,000 results (0.43 seconds)</div>
            {[
              { url:'lever.co/stripe/software-engineer-sf', title:'Software Engineer, Payments Infrastructure - Stripe', desc:'San Francisco, CA · Full-time · $160K-$220K. Join our payments infrastructure team...' },
              { url:'greenhouse.io/openai/software-engineer', title:'Software Engineer - Applied AI, OpenAI', desc:'San Francisco, CA · On-site · Build systems powering next-gen AI products. Strong Python & distributed systems required...' },
              { url:'lever.co/coinbase/software-engineer', title:'Software Engineer, Platform - Coinbase', desc:'San Francisco, CA (Hybrid) · Competitive salary + equity. 2+ yrs backend experience preferred...' },
            ].map((r,i) => (
              <div key={i} style={{ padding:'9px 14px 8px', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ fontSize:10, color:'#188038', marginBottom:2 }}>{r.url}</div>
                <div style={{ fontSize:13, color:'#1a0dab', marginBottom:3, cursor:'pointer' }}>{r.title}</div>
                <div style={{ fontSize:11, color:'#666', lineHeight:1.5 }}>{r.desc}</div>
                <div style={{ display:'inline-block', marginTop:4, background:'#1a73e8', color:'#fff', borderRadius:4, padding:'2px 8px', fontSize:10, cursor:'pointer' }}>Apply Now</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SmartSearchLinks({ role, location }) {
  const [searches, setSearches]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState("");
  const [showDemo, setShowDemo]   = useState(false);
  const navigate = useNavigate(); // eslint-disable-line
  const API = process.env.REACT_APP_API_URL || "";

  const fetch_ = async () => {
    setLoading(true); setErr(""); setSearches(null);
    try {
      const res  = await fetch(`${API}/api/job-search-links`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"include",
        body: JSON.stringify({ role, location }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error||"Something went wrong."); return; }
      setSearches(data.searches);
    } catch(e) { setErr("Network error — please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:500, color:"var(--text-primary)", marginBottom:4 }}>AI-powered job search</div>
        <div style={{ fontSize:12, color:"var(--ash)", lineHeight:1.7, marginBottom:8 }}>
          Claude generates 6 targeted Google search links across Lever, Greenhouse, LinkedIn and more — tailored to <strong style={{ color:"var(--gold)", fontWeight:500 }}>{role}</strong>{location ? ` in ${location}` : ""}.
        </div>
        <button onClick={()=>setShowDemo(true)} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"var(--ash)", fontSize:12, fontFamily:"var(--font-body)", padding:0, transition:"color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.color="var(--ash)"}
        >
          <span style={{ width:15, height:15, borderRadius:"50%", border:"1.5px solid currentColor", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:600, flexShrink:0 }}>?</span>
          How to use Smart Search?
        </button>
      </div>

      {/* Demo popup */}
      {showDemo && (
        <>
          <div onClick={()=>setShowDemo(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:999 }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:1000, width:Math.min(520, window.innerWidth-32), background:"#111113", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 40px 100px rgba(0,0,0,0.8)", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)" }}>How to use Smart Search</div>
              <button onClick={()=>setShowDemo(false)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"var(--ash)", fontSize:12, padding:"3px 10px", cursor:"pointer", fontFamily:"var(--font-body)" }}>✕ Close</button>
            </div>
            <SmartSearchDemo />
          </div>
        </>
      )}

      {/* Generate button or premium gate */}
      {!searches && !loading && (
        <div style={{ marginBottom:16 }}>
          <button className="gold-btn pulse" style={{ fontSize:13, padding:"11px 28px" }} onClick={fetch_}>
            ✦ Generate Job Search Links
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <span style={{ width:18, height:18, border:"2px solid rgba(201,168,76,0.3)", borderTopColor:"var(--gold)", borderRadius:"50%", animation:"spin 0.75s linear infinite", display:"inline-block" }} />
          <div style={{ fontSize:12, color:"var(--ash)", marginTop:10 }}>Finding the best searches for {role}…</div>
        </div>
      )}

      {/* Error */}
      {err && (
        <div style={{ fontSize:13, color:"#f87171", marginBottom:12 }}>
          {err} <button className="ghost-btn" style={{ fontSize:12, marginLeft:8 }} onClick={fetch_}>Retry</button>
        </div>
      )}

      {/* Results */}
      {searches && (
        <div className="fade-in">
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {searches.map((s,i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderRadius:10, border:"1px solid var(--ghost-border)", background:"var(--mist2)", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.background="var(--gold-dim)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.background="var(--mist2)";}}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)", marginBottom:2 }}>{s.label}</div>
                      <div style={{ fontSize:11, color:"var(--ash)", fontFamily:"monospace" }}>{s.query.length>55?s.query.slice(0,55)+"...":s.query}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:14, color:"var(--gold)", flexShrink:0, marginLeft:12 }}>↗</span>
                </div>
              </a>
            ))}
          </div>
          <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{setSearches(null); fetch_();}}>↺ Regenerate</button>
        </div>
      )}
    </div>
  );
}

function JobRecommendations({ role, skills, location }) {
  const [tab, setTab]         = useState("live");       // "live" | "boolean" | "ai"
  const [aiJobs, setAiJobs]   = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [expanded, setExpanded]   = useState(false);

  const roleClean = (role||"").trim();
  const skillList = (skills||"").split(/[,|]/).map(s=>s.trim()).filter(Boolean).slice(0,10);

  const fetchAiJobs = async () => {
    setAiLoading(true);
    const API = process.env.REACT_APP_API_URL || "";
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role: roleClean, skills: skillList, location }),
      });
      if (res.ok) setAiJobs(await res.json());
    } catch(e) {}
    finally { setAiLoading(false); }
  };

  if (!roleClean) return null;

  return (
    <div className="card fade-up" style={{ borderColor:"rgba(201,168,76,0.15)", marginTop:8 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:300, marginBottom:3 }}>
            Find Jobs for <em style={{ color:"var(--gold)" }}>{roleClean}</em>
          </div>
          <div style={{ fontSize:13, color:"var(--ash)", fontWeight:300 }}>Live listings, smart boolean searches, and AI-curated suggestions.</div>
        </div>
        {!expanded && (
          <button className="gold-btn" style={{ fontSize:12, padding:"10px 20px", flexShrink:0 }} onClick={()=>setExpanded(true)}>
            ✦ Find Jobs
          </button>
        )}
      </div>

      {expanded && (
        <div className="fade-in">
          {/* Tab switcher */}
          <div style={{ display:"flex", gap:4, marginBottom:20, background:"var(--mist2)", borderRadius:12, padding:4 }}>
            {[
              { id:"live",    label:"🔴 Live Listings" },
              { id:"boolean", label:"🎯 Smart Search" },
              { id:"ai",      label:"✦ AI Suggestions" },
            ].map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                flex:1, padding:"9px 8px", borderRadius:9, border:"none", cursor:"pointer",
                fontFamily:"var(--font-body)", fontSize:12, fontWeight:500, transition:"all 0.2s",
                background: tab===t.id ? "var(--ink2)" : "transparent",
                color:      tab===t.id ? "var(--text-primary)" : "var(--ash)",
                boxShadow:  tab===t.id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Tab: Live Listings */}
          {tab==="live" && (
            <LiveJobs key={roleClean+location} what={roleClean} where={location} title={true} compact={true} />
          )}

          {/* Tab: Smart Search */}
          {tab==="boolean" && (
            <SmartSearchLinks role={roleClean} location={location} />
          )}

          {/* Tab: AI Suggestions */}
          {tab==="ai" && (
            <div className="fade-in">
              {!aiJobs ? (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <button className="gold-btn" onClick={fetchAiJobs} disabled={aiLoading} style={{ fontSize:13, padding:"11px 28px" }}>
                    {aiLoading
                      ? <span style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ width:14,height:14,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0d0d0f",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />Finding roles…</span>
                      : "✦ Get AI-Curated Roles"}
                  </button>
                  <div style={{ fontSize:12, color:"var(--ash)", marginTop:8 }}>AI analyses your resume and suggests the best-matching roles</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ash)",marginBottom:14 }}>Roles matched to your resume</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
                    {(aiJobs.suggestions||[]).map((job,i) => (
                      <div key={i} className="card fade-up" style={{ animationDelay:`${i*0.07}s`, borderColor:"rgba(201,168,76,0.15)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                          <div style={{ fontWeight:500, fontSize:14, color:"var(--text-primary)" }}>{job.title}</div>
                          <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:"var(--gold-dim)",color:"var(--gold)",whiteSpace:"nowrap",marginLeft:8 }}>{job.match}% match</span>
                        </div>
                        <div style={{ fontSize:12,color:"var(--ash)",marginBottom:10,lineHeight:1.5 }}>{job.reason}</div>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
                          {(job.skills||[]).map((s,j)=>(
                            <span key={j} style={{ fontSize:10,padding:"2px 8px",borderRadius:8,background:"var(--mist)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--ash)" }}>{s}</span>
                          ))}
                        </div>
                        <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.searchQuery||job.title)}&location=${encodeURIComponent(location||"")}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize:11,color:"var(--gold)",textDecoration:"none",letterSpacing:"0.06em",textTransform:"uppercase" }}
                        >Search on LinkedIn ↗</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop:20, textAlign:"center" }}>
            <button className="ghost-btn" style={{ fontSize:11 }} onClick={()=>setExpanded(false)}>Collapse ↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Tools Dropdown ─── */
function ToolsDropdown({ navigate, setErr, setResult, setLiResult, setApplyResult }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const tools = [
    { label:"Build Resume",       icon:"✦",  path:"/build",           desc:"Start from scratch" },
    { label:"Tailor to a Job",    icon:"↑",  path:"/tailor",          desc:"Rewrite for any role" },
    { label:"LinkedIn Optimizer", icon:"in", path:"/linkedin",         desc:"Fix your profile" },
    { label:"Apply Mode",         icon:"⚡", path:"/apply",           desc:"Full package from a URL", hot:true },
    { label:"Interview Prep",     icon:"🎯", path:"/interview",       desc:"Tailored Q&A" },
    { label:"LinkedIn Writer",    icon:"✍️", path:"/linkedin-writer", desc:"Headlines & About" },
  ];

  const handlePick = (path) => {
    setOpen(false);
    setErr && setErr("");
    setResult && setResult(null);
    setLiResult && setLiResult(null);
    setApplyResult && setApplyResult(null);
    navigate(path);
  };

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{ fontSize:11, letterSpacing:"0.07em", textTransform:"uppercase", padding:"6px 12px", borderRadius:7, border:"1px solid var(--ghost-border)", color: open ? "var(--gold)" : "var(--ash)", background:"transparent", cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s",
          borderColor: open ? "var(--gold-border)" : "var(--ghost-border)" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold)";}}
        onMouseLeave={e=>{ if(!open){e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.color="var(--ash)";} }}
      >
        Tools
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transition:"transform 0.2s", transform: open?"rotate(180deg)":"rotate(0deg)" }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", right:0, width:240,
          background:"var(--ink2)", border:"1px solid var(--border-subtle)", borderRadius:14,
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)", overflow:"hidden", zIndex:200,
          animation:"fadeIn 0.15s ease"
        }}>
          <div style={{ padding:"6px" }}>
            {tools.map((t,i) => (
              <button key={t.path} onClick={()=>handlePick(t.path)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
                borderRadius:9, border:"none", background:"transparent", cursor:"pointer",
                fontFamily:"var(--font-body)", textAlign:"left", transition:"background 0.15s", position:"relative"
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--mist2)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <span style={{ width:28, height:28, borderRadius:7, background:"var(--mist)", border:"1px solid var(--border-subtle)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)", marginBottom:1 }}>{t.label}</div>
                  <div style={{ fontSize:11, color:"var(--ash)" }}>{t.desc}</div>
                </div>
                {t.hot && <span style={{ position:"absolute", top:8, right:10, fontSize:8, padding:"2px 7px", borderRadius:6, background:"linear-gradient(135deg,#c9a84c,#e8c96d)", color:"#0d0d0f", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>New</span>}
              </button>
            ))}
          </div>
          <div style={{ borderTop:"1px solid var(--border-subtle)", padding:"6px" }}>
            <button onClick={()=>{ setOpen(false); navigate("/dashboard"); }} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"none", background:"transparent", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:12, color:"var(--ash)", textAlign:"left", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--mist2)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              View all tools →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Resume Page ─── */
/* ─── Auth Pages ─── */
/* ─── Forgot Password Page ─── */
/* ─── Reset Password Page ─── */
/* ─── Email Verified Banner ─── */
/* ─── Expired Subscription Banner ─── */
function ExpiredBanner({ status, onUpgrade }) {
  if (status === "active") return null;
  const isPastDue = status === "past_due";
  return (
    <div className="fade-in" style={{
      position:"fixed", top:68, left:"50%", transform:"translateX(-50%)",
      zIndex:90, padding:"12px 20px", borderRadius:12, fontSize:13,
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

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
const blank    = () => ({ company:"",role:"",startDate:"",endDate:"",current:false,bullets:"" });
const blankEdu = () => ({ school:"",degree:"",field:"",year:"" });
const init = { name:"",email:"",phone:"",location:"",linkedin:"",targetRole:"",targetIndustry:"",experiences:[blank()],education:[blankEdu()],skills:"",certifications:"",template:"executive" };

export default function App() {
  const navigate    = useNavigate();
  const location    = useLocation();

  const [step,setStep]         = useState(0);
  const [mode,setMode]         = useState("");
  const [form,setForm]         = useState(init);
  const [,setLoading]          = useState(false);
  const [loadMsg,setLoadMsg]   = useState("");
  const [result,setResult]     = useState(null);
  const [liResult,setLiResult] = useState(null);
  const [err,setErr]           = useState("");
  const [darkMode,setDarkMode] = useState(true);
  const [shareMsg,setShareMsg] = useState("");
  const [user,setUser]         = useState(null);
  const [authReady,setAuthReady] = useState(false);
  const [page,setPage]         = useState("app");
  const [resetToken,setResetToken] = useState("");
  const [showVerifyBanner,setShowVerifyBanner] = useState(false);
  const [isShared,setIsShared] = useState(false);

  // Apply Mode state
  const [applyResult,setApplyResult] = useState(null);
  const [applyTab,setApplyTab]       = useState("resume");

  // New tools state
  const [interviewResult,setInterviewResult]           = useState(null);
  const [linkedInWriterResult,setLinkedInWriterResult] = useState(null);

  // ── URL is the single source of truth ────────────────────────────
  // Derive step, mode, page directly from the current URL.
  // All navigation goes through navigate() — never setStep/setMode/setPage directly.
  const pathToState = (path) => {
    const map = {
      "/":               { page:"app",      step:0, mode:"" },
      "/dashboard":      { page:"app",      step:1, mode:"" },
      "/build":          { page:"app",      step:2, mode:"build" },
      "/tailor":         { page:"app",      step:2, mode:"tailor" },
      "/linkedin":       { page:"app",      step:2, mode:"linkedin" },
      "/apply":          { page:"app",      step:2, mode:"apply" },
      "/interview":      { page:"app",      step:2, mode:"interview" },
      "/linkedin-writer":{ page:"app",      step:2, mode:"linkedin-quick" },
      "/build/results":  { page:"app",      step:3, mode:"build" },
      "/tailor/results": { page:"app",      step:3, mode:"tailor" },
      "/linkedin/results":{ page:"app",     step:3, mode:"linkedin" },
      "/apply/results":  { page:"app",      step:3, mode:"apply" },
      "/interview/results":{ page:"app",    step:3, mode:"interview" },
      "/linkedin-writer/results":{ page:"app", step:3, mode:"linkedin-quick" },
      "/blog":             { page:"blog",     step:0, mode:"" },
      "/login":          { page:"login",    step:0, mode:"" },
      "/register":       { page:"register", step:0, mode:"" },
      "/forgot":         { page:"forgot",   step:0, mode:"" },
      "/reset":          { page:"reset",    step:0, mode:"" },
      "/account":        { page:"account",  step:0, mode:"" },
      "/subscribe":      { page:"subscribe",step:0, mode:"" },
    };
    if (path.startsWith("/blog")) return { page:"blog", step:0, mode:"" };
    return map[path] || { page:"app", step:0, mode:"" };
  };

  // Apply state from URL on every navigation (including browser back/forward)
  useEffect(() => {
    if (!authReady) return;
    const { page: p, step: s, mode: m } = pathToState(location.pathname);
    setPage(p);
    setStep(s);
    setMode(m);
    setTimeout(() => containerRef.current?.scrollTo({ top:0, behavior:"smooth" }), 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, location.pathname]);

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
    // Listen for login events from Login page
    const onLogin = e => { setUser(e.detail); setAuthReady(true); };
    window.addEventListener("cr_login", onLogin);

    // Read cached user from localStorage for instant load
    // Only set authReady=true if we have cached data (server will verify)
    try {
      const cached = localStorage.getItem("cr_user");
      if (cached) { setUser(JSON.parse(cached)); }
    } catch {}

    // Verify with server in background
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then(async r => {
        if (r.ok) return r.json();
        // Access token expired — try refresh
        const ref = await fetch(`${API}/api/auth/refresh`, { method:"POST", credentials:"include" }).catch(()=>null);
        if (ref?.ok) {
          const r2 = await fetch(`${API}/api/auth/me`, { credentials:"include" });
          if (r2.ok) return r2.json();
        }
        return null;
      })
      .then(data => {
        if (data?.user) {
          try { localStorage.setItem("cr_user", JSON.stringify(data.user)); } catch {}
          setUser(data.user);
        } else {
          // Server says not logged in — clear any cached user
          try { localStorage.removeItem("cr_user"); } catch {}
          setUser(false);
        }
        setAuthReady(true);
      })
      .catch(() => {
        try { localStorage.removeItem("cr_user"); } catch {}
        setUser(false);
        setAuthReady(true);
      });

    return () => window.removeEventListener("cr_login", onLogin);
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

  /* ── sessionStorage removed — URL is now source of truth ── */

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
              // auth loaded — URL already set correctly
            } else {
              setUser(false);
              setAuthReady(true);
              navigate("/login");
            }
          })
          .catch(() => { setUser(false); setAuthReady(true); navigate("/login"); });
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
        navigate("/login");
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
      // Password reset link
      const resetTok = p.get("token");
      if (resetTok) {
        setResetToken(resetTok);
        navigate("/reset");
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

  const resetAll = () => {
    // Clear all results
    setResult(null); setLiResult(null); setApplyResult(null);
    setInterviewResult(null); setLinkedInWriterResult(null);
    // Navigate back to the form that produced the result
    const path = window.location.pathname;
    if (path.startsWith("/apply"))               navigate("/apply");
    else if (path.startsWith("/linkedin-writer")) navigate("/linkedin-writer");
    else if (path.startsWith("/linkedin"))        navigate("/linkedin");
    else if (path.startsWith("/interview"))       navigate("/interview");
    else if (path.startsWith("/tailor"))          navigate("/tailor");
    else                                          navigate("/build");
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
      try{localStorage.removeItem("cr_user");}catch{}
      setUser(false);
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        sessionStorage.setItem("cr_redirect", window.location.pathname);
      }
      throw new Error("login_required");
    }
    if (res.status===402) { throw new Error("premium_required"); }
    if (!res.ok){ const d=await res.json().catch(()=>({})); throw new Error(d.error||"Server error"); }
    return res.json();
  };


;

;

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


  return (
    <>
      <FontLink />
      {/* ── Route to auth/subscribe/account pages ── */}
      {!authReady && (
        <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{width:20,height:20,border:"2px solid rgba(201,168,76,0.3)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block"}} />
        </div>
      )}
      {authReady && page==="login"     && <Login />}
      {authReady && page==="register"  && <Register />}
      {page==="forgot"                 && <ForgotPassword />}
      {page==="reset"                  && <ResetPassword token={resetToken} />}
      {authReady && page==="subscribe" && <Subscribe user={user} setUser={setUser} />}
      {authReady && page==="account"   && <Account   user={user} setUser={setUser} />}
      {page==="blog" && <Blog />}
      {showVerifyBanner && <VerifyBanner onClose={()=>setShowVerifyBanner(false)} />}
      {user && user.subscriptionStatus !== "active" && user.subscriptionStatus === "past_due" && page==="app" && (
        <ExpiredBanner status={user.subscriptionStatus} onUpgrade={()=>navigate("/subscribe")} />
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

            {/* Logo → landing page */}
            <div onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}
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

              {/* Tools dropdown */}
              <ToolsDropdown navigate={navigate} setErr={setErr} setResult={setResult} setLiResult={setLiResult} setApplyResult={setApplyResult} />

              <button className="theme-toggle" onClick={()=>setDarkMode(d=>!d)} title="Toggle light/dark mode">
                {darkMode ? "☀️" : "🌙"}
              </button>
              {user ? (
                <button className="ghost-btn" style={{fontSize:11,padding:"6px 12px"}} onClick={()=>navigate("/account")}>
                  {user.name?.split(" ")[0] || "Account"} ↗
                </button>
              ) : (
                <button className="gold-btn" style={{fontSize:11,padding:"7px 16px"}} onClick={()=>navigate("/login")}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ══ MAIN ══ */}
        <div ref={containerRef} className="main-pad" style={{ maxWidth: step===0 ? 1200 : 960, margin:"0 auto", padding:"0 40px 90px", position:"relative", zIndex:2 }}>

          {/* ══ LANDING (step 0) ══ */}
          {step===0 && <Landing user={user} navigate={navigate} />}

          {/* ══ TOOL PICKER (step 1) ══ */}
          {step===1 && <Dashboard user={user} />}

          {/* Steps indicator — only show on form + results, not shared view */}
          {step > 1 && !isShared && <Steps current={step-1} />}

          {/* ══ BUILD RESUME ══ */}
          {step===2 && mode==="build" && (
            <div>
              <BuildResume
                callAPI={callAPI}
                startLoad={startLoad}
                loadMsg={loadMsg}
                onResult={(res, template) => {
                  setResult(res);
                  setForm(f => ({...f, template: template||f.template}));
                }}
              />
            </div>
          )}

          {/* ══ TAILOR JOB ══ */}
          {step===2 && mode==="tailor" && (
            <div>
              <TailorJob
                callAPI={callAPI}
                startLoad={startLoad}
                loadMsg={loadMsg}
                onResult={(res, template) => {
                  setResult(res);
                  setForm(f => ({...f, template: template||f.template}));
                }}
              />
            </div>
          )}


          {/* ══ STEP 1 — LINKEDIN ══ */}
          {step===2 && mode==="linkedin" && (
            <LinkedInOptimizer
              callAPI={callAPI}
              startLoad={startLoad}
              loadMsg={loadMsg}
              onResult={res => setLiResult(res)}
            />
          )}


          {/* ══ STEP 1 — APPLY MODE ══ */}
          {step===2 && mode==="apply" && (
            <ApplyMode
              callAPI={callAPI}
              startLoad={startLoad}
              loadMsg={loadMsg}
              onResult={(res, template) => {
                setApplyResult(res);
                setApplyTab("resume");
                setForm(f => ({...f, template: template||f.template}));
              }}
            />
          )}


          {/* ══ INTERVIEW PREP ══ */}
          {step===2 && mode==="interview" && (
            <InterviewPrep
              callAPI={callAPI}
              startLoad={startLoad}
              loadMsg={loadMsg}
              onResult={r => setInterviewResult(r)}
            />
          )}

          {/* ══ LINKEDIN WRITER ══ */}
          {step===2 && mode==="linkedin-quick" && (
            <LinkedInWriter
              callAPI={callAPI}
              startLoad={startLoad}
              loadMsg={loadMsg}
              onResult={r => setLinkedInWriterResult(r)}
            />
          )}

          {/* ══ STEP 2 — RESULTS ══ */}
          {step===3 && (
            <div>
              {/* Back button + Start Over on all results */}
              <div style={{marginBottom:16, display:"flex", gap:8}}>
                <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>{
                  // Derive back destination from current URL
                  const path = location.pathname;
                  if (path.startsWith("/apply"))          navigate("/apply");
                  else if (path.startsWith("/linkedin-writer")) navigate("/linkedin-writer");
                  else if (path.startsWith("/linkedin"))  navigate("/linkedin");
                  else if (path.startsWith("/interview")) navigate("/interview");
                  else if (path.startsWith("/tailor"))    navigate("/tailor");
                  else                                    navigate("/build");
                }}>← Back</button>
                <button className="ghost-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={resetAll}>Start Over</button>
              </div>
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
                          <button className="gold-btn pulse" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>navigate("/subscribe")}>✦ Upgrade for Full Access</button>
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
                        <ATSMeter text={`${applyResult.resume.summary||""} ${applyResult.resume.experience||""} ${applyResult.resume.skills||""}`} onFix={isPaidApply ? fixATS : null} onUpgrade={()=>navigate("/subscribe")} />
                        <div style={{ marginTop:16 }}>
                          {isPaidApply
                            ? <div style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)" }}><Preview data={applyResult.resume} template={form.template} /></div>
                            : <LockedPreview data={applyResult.resume} template={form.template} onUpgrade={()=>navigate("/subscribe")} />
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
                          <button className="gold-btn" style={{ fontSize:13, padding:"10px 28px" }} onClick={()=>navigate("/subscribe")}>Unlock with Premium →</button>
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
                          <button className="gold-btn pulse" style={{ fontSize:13, padding:"11px 28px" }} onClick={()=>navigate("/subscribe")}>Unlock Interview Prep →</button>
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
                            <button className="gold-btn pulse" style={{ fontSize:12,padding:"10px 22px" }} onClick={()=>navigate("/subscribe")}>
                              ✦ Upgrade to Download
                            </button>
                          )}
                        </div>
                      </div>
                      <ATSMeter
                        text={`${result.summary||""} ${result.experience||""} ${result.skills||""}`}
                        onFix={isPaid ? fixATS : null}
                        onUpgrade={()=>navigate("/subscribe")}
                      />
                    </div>
                  )}
                  <div className="fade-up" style={{ marginBottom:32 }}>
                    {isPaid || isShared
                      ? <div style={{ borderRadius:18,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.65)" }}><Preview data={result} template={form.template} /></div>
                      : <LockedPreview data={result} template={form.template} onUpgrade={()=>navigate("/subscribe")} />
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
                          <button className="gold-btn" style={{fontSize:12,padding:"8px 20px"}} onClick={()=>navigate("/subscribe")}>Unlock with Premium →</button>
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