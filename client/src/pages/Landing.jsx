import { useState, useEffect, useRef } from "react";

function HeroGlow() {
  return (
    <>
      <div style={{ position:"fixed", top:"-20%", left:"20%", width:"60%", height:600, background:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", right:"-5%", width:400, height:400, background:"radial-gradient(ellipse, rgba(201,168,76,0.03) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

function ATSScoreHook({ onSignUp }) {
  const [text, setText]       = useState("");
  const [score, setScore]     = useState(null);
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
        <div style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:300, marginBottom:8 }}>How ATS-friendly is your resume?</div>
        <div style={{ fontSize:14, color:"var(--ash)" }}>Paste your resume text below for an instant score — no account needed.</div>
      </div>
      {!score ? (
        <>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your resume text here..." rows={8} style={{ width:"100%", marginBottom:14, resize:"vertical", minHeight:160, fontFamily:"var(--font-body)", fontSize:13 }} />
          <button className="gold-btn" onClick={check} disabled={loading||!text.trim()} style={{ width:"100%", fontSize:14, padding:"14px" }}>{loading ? "Analysing…" : "Check My ATS Score →"}</button>
        </>
      ) : (
        <div className="fade-in">
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:72, fontWeight:300, color, lineHeight:1 }}>{score.total}</div>
            <div style={{ fontSize:14, color:"var(--ash)", marginBottom:16 }}>out of 100</div>
            <div style={{ maxWidth:400, margin:"0 auto", background:"rgba(255,255,255,0.05)", borderRadius:999, height:8, overflow:"hidden" }}>
              <div style={{ width:`${score.total}%`, height:"100%", background:`linear-gradient(90deg,${color}88,${color})`, borderRadius:999, transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginBottom:24 }}>
            {[
              { label:"Keywords found",  value:score.hits.length, good:score.hits.length>=8 },
              { label:"Word count",      value:score.wordCount,   good:score.wordCount>=250 },
              { label:"Metrics detected",value:(text.match(/\d+%|\$\d+|\d+x|\d+\+/g)||[]).length, good:(text.match(/\d+%|\$\d+|\d+x|\d+\+/g)||[]).length>=3 },
            ].map((s,i)=>(
              <div key={i} style={{ padding:"14px", background:"rgba(0,0,0,0.2)", borderRadius:12, textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color:s.good?"#4ade80":"#f87171" }}>{s.value}</div>
                <div style={{ fontSize:11, color:"var(--ash)", marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"20px 24px", background:score.total>=70?"rgba(74,222,128,0.06)":"rgba(248,113,113,0.06)", borderRadius:12, border:`1px solid ${score.total>=70?"rgba(74,222,128,0.2)":"rgba(248,113,113,0.2)"}`, marginBottom:20, textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:8, color:score.total>=70?"#4ade80":"#f87171" }}>
              {score.total>=70?"Good score — let's make it perfect":score.total>=50?"Room to improve — let AI fix it":"Low score — this needs fixing before you apply"}
            </div>
            <div style={{ fontSize:13, color:"var(--ash)", marginBottom:16 }}>
              {score.total>=70?"Your resume passes basic ATS screening. Crafted Resume can optimise it further.":"Many ATS systems will filter this resume out automatically. Crafted Resume can fix it in seconds."}
            </div>
            <button className="gold-btn pulse" style={{ fontSize:14, padding:"12px 32px" }} onClick={onSignUp}>Fix My Resume for Free →</button>
          </div>
          <div style={{ textAlign:"center" }}>
            <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{ setScore(null); setText(""); }}>Check another resume</button>
          </div>
        </div>
      )}
    </div>
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

  // Fetch when scrolled into view — avoids rate limiting on page load
  const containerRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = containerRef.current;
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
    <div ref={containerRef} style={{ textAlign:"center", padding:compact?"20px 0":"40px 0" }}>
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


function LiveJobsSearch({ user, navigate }) {
  const [showSmartDemo, setShowSmartDemo] = useState(false);
  const [what, setWhat]   = useState("software engineer");
  const [where, setWhere] = useState("");
  const [search, setSearch] = useState({ what:"software engineer", where:"" });
  const [tab, setTab]     = useState("live");

  const doSearch = () => setSearch({ what, where });

  const [aiSearches, setAiSearches]     = useState(null);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchErr, setAiSearchErr]   = useState("");

  const fetchAiSearches = async () => {
    setAiSearchLoading(true); setAiSearchErr(""); setAiSearches(null);
    try {
      const API = process.env.REACT_APP_API_URL || "";
      const res  = await fetch(`${API}/api/job-search-links`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role: what, location: where }),
      });
      const data = await res.json();
      if (!res.ok) { setAiSearchErr(data.error||"Something went wrong."); return; }
      setAiSearches(data.searches);
    } catch(e) { setAiSearchErr("Network error — please try again."); }
    finally { setAiSearchLoading(false); }
  };

  return (
    <div>
      {/* Search inputs */}
      <div style={{ display:"flex", gap:10, maxWidth:620, margin:"0 auto 20px", flexWrap:"wrap" }}>
        <input value={what} onChange={e=>setWhat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Job title or keyword..." style={{ flex:2, minWidth:160 }} />
        <input value={where} onChange={e=>setWhere(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Location (optional)" style={{ flex:1, minWidth:120 }} />
        <button className="gold-btn" onClick={doSearch} style={{ flexShrink:0, padding:"10px 20px", fontSize:13 }}>Search</button>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:4, maxWidth:400, margin:"0 auto 24px", background:"var(--mist2)", borderRadius:12, padding:4 }}>
        {[
          { id:"live",    label:"🔴 Live Listings" },
          { id:"boolean", label:"🎯 Smart Search" },
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"9px 8px", borderRadius:9, border:"none", cursor:"pointer",
            fontFamily:"var(--font-body)", fontSize:13, fontWeight:500, transition:"all 0.2s",
            background: tab===t.id ? "var(--ink2)" : "transparent",
            color:      tab===t.id ? "var(--text-primary)" : "var(--ash)",
            boxShadow:  tab===t.id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Live Listings tab */}
      {tab==="live" && (
        <LiveJobs key={search.what+search.where} what={search.what} where={search.where} title={true} />
      )}

      {/* Smart Search tab */}
      {tab==="boolean" && (
        <div className="fade-in" style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:24, position:"relative" }}>
            <div style={{ fontSize:15, fontWeight:500, color:"var(--text-primary)", marginBottom:8 }}>AI-powered job search</div>
            <div style={{ fontSize:13, color:"var(--ash)", lineHeight:1.7, marginBottom:10 }}>
              Claude generates targeted search links across Lever, Greenhouse, LinkedIn, Indeed and more — tailored to your role.
            </div>
            {/* How to use button */}
            <button onClick={()=>setShowSmartDemo(true)} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"var(--ash)", fontSize:12, fontFamily:"var(--font-body)", padding:"4px 8px", borderRadius:8, transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--ash)"}
            >
              <span style={{ width:16, height:16, borderRadius:"50%", border:"1.5px solid currentColor", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:600, flexShrink:0 }}>?</span>
              How to use Smart Search?
            </button>
            {/* Demo popup */}
            {showSmartDemo && (
              <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:1000, width:520, background:"#111113", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 40px 100px rgba(0,0,0,0.8)", overflow:"hidden" }}>
                {/* Popup header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)" }}>🎯 How to use Smart Search</div>
                  <button onClick={()=>setShowSmartDemo(false)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"var(--ash)", fontSize:12, padding:"3px 10px", cursor:"pointer", fontFamily:"var(--font-body)" }}>✕ Close</button>
                </div>
                {/* Backdrop */}
                <div onClick={()=>setShowSmartDemo(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:-1 }} />
                <SmartSearchDemo />
              </div>
            )}
          </div>

          {!aiSearches && !aiSearchLoading && (
            <div style={{ textAlign:"center", marginBottom:20 }}>
              {user?.subscriptionStatus === "active" ? (
                <button className="gold-btn pulse" style={{ fontSize:14, padding:"13px 32px" }} onClick={fetchAiSearches}>
                  ✦ Generate Job Search Links
                </button>
              ) : (
                <div style={{ padding:"28px 24px", borderRadius:14, border:"1px solid var(--gold-border)", background:"var(--gold-dim)" }}>
                  <div style={{ fontSize:16, marginBottom:8 }}>✦</div>
                  <div style={{ fontSize:15, fontWeight:500, color:"var(--text-primary)", marginBottom:6 }}>Premium feature</div>
                  <div style={{ fontSize:13, color:"var(--ash)", marginBottom:18, lineHeight:1.6 }}>
                    AI-generated job search links are available on the Premium plan. Upgrade to get targeted searches across Lever, Greenhouse, LinkedIn and more — tailored to your exact role.
                  </div>
                  {!user ? (
                    <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                      <button className="gold-btn" style={{ fontSize:13, padding:"10px 24px" }} onClick={()=>navigate("/register")}>Get Started Free →</button>
                      <button className="ghost-btn" style={{ fontSize:13, padding:"10px 20px" }} onClick={()=>navigate("/login")}>Sign In</button>
                    </div>
                  ) : (
                    <button className="gold-btn pulse" style={{ fontSize:13, padding:"10px 28px" }} onClick={()=>navigate("/subscribe")}>
                      Upgrade to Premium →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {aiSearchLoading && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <span style={{ width:18,height:18,border:"2px solid rgba(201,168,76,0.3)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.75s linear infinite",display:"inline-block" }} />
              <div style={{ fontSize:12, color:"var(--ash)", marginTop:10 }}>Finding the best searches for {what||"your role"}…</div>
            </div>
          )}

          {aiSearchErr && (
            <div style={{ textAlign:"center", fontSize:13, color:"#f87171", marginBottom:16 }}>
              {aiSearchErr}
              <button className="ghost-btn" style={{ fontSize:12, marginLeft:10 }} onClick={fetchAiSearches}>Retry</button>
            </div>
          )}

          {aiSearches && (
            <div className="fade-in">
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                {aiSearches.map((s,i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderRadius:10, border:"1px solid var(--ghost-border)", background:"var(--mist2)", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.background="var(--gold-dim)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ghost-border)";e.currentTarget.style.background="var(--mist2)";}}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)", marginBottom:2 }}>{s.label}</div>
                          <div style={{ fontSize:11, color:"var(--ash)", fontFamily:"monospace" }}>{s.query.length>55?s.query.slice(0,55)+"…":s.query}</div>
                        </div>
                      </div>
                      <span style={{ fontSize:14, color:"var(--gold)", flexShrink:0, marginLeft:12 }}>↗</span>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ textAlign:"center" }}>
                <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>{setAiSearches(null); fetchAiSearches();}}>↺ Regenerate</button>
              </div>
            </div>
          )}

          {/* Platform quick links always visible */}
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:20, paddingTop:20, borderTop:"1px solid var(--border-subtle)" }}>
            {[
              { name:"LinkedIn",  url:`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(what)}&location=${encodeURIComponent(where||"")}`, color:"#0a66c2" },
              { name:"Indeed",    url:`https://www.indeed.com/jobs?q=${encodeURIComponent(what)}&l=${encodeURIComponent(where||"")}`, color:"#003a9b" },
              { name:"Remotive",  url:`https://remotive.com/remote-jobs?search=${encodeURIComponent(what)}`, color:"#7c3aed" },
              { name:"Glassdoor", url:`https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(what)}`, color:"#0caa41" },
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.08)", background:"var(--mist2)", textDecoration:"none", color:"var(--ash)", fontSize:12, transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color+"66";e.currentTarget.style.color="var(--text-primary)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="var(--ash)";}}
              >
                <span style={{ width:7,height:7,borderRadius:"50%",background:p.color,display:"inline-block" }} />
                {p.name} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


const HERO_FIELDS = [
  {key:'fn', val:'Alexandra Chen',   x:100, y:170},
  {key:'fr', val:'Product Manager',  x:290, y:170},
  {key:'fe', val:'alex@email.com',   x:100, y:208},
  {key:'fl', val:'San Francisco',    x:290, y:208},
  {key:'fs', val:'SQL · Figma · Agile · Strategy', x:195, y:245},
];
const HERO_LOAD_MSGS = ['Crafting your story…','Polishing bullet points…','Optimising for ATS…','Almost there…'];

function HeroDemo() {
  const [slide, setSlide] = useState(0);
  const [fields, setFields] = useState({fn:'',fr:'',fe:'',fl:'',fs:''});
  const [cursorPos, setCursorPos] = useState({x:-100,y:-100,visible:false});
  const [loadMsg, setLoadMsg] = useState('Crafting your story…');
  const [loadStep, setLoadStep] = useState(0);
  const [pdfReady, setPdfReady] = useState(false);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;
    async function run() {
      // Reset
      setSlide(0); setPdfReady(false);
      setFields({fn:'',fr:'',fe:'',fl:'',fs:''});
      setCursorPos({x:-100,y:-100,visible:false});
      await sleep(700);

      // Type each field
      for (const f of HERO_FIELDS) {
        if (cancelled) return;
        setCursorPos({x:f.x, y:f.y, visible:true});
        await sleep(350);
        for (let i = 1; i <= f.val.length; i++) {
          if (cancelled) return;
          setFields(prev => ({...prev, [f.key]: f.val.slice(0,i)}));
          await sleep(f.val.length > 20 ? 38 : 55);
        }
        await sleep(120);
      }

      // Click generate
      if (cancelled) return;
      setCursorPos({x:400, y:310, visible:true});
      await sleep(500);
      setSlide(1);
      setCursorPos({x:-100,y:-100,visible:false});

      // Loading messages
      for (let i = 0; i < 4; i++) {
        if (cancelled) return;
        setLoadMsg(HERO_LOAD_MSGS[i]); setLoadStep(i);
        await sleep(950);
      }

      // Result
      if (cancelled) return;
      setSlide(2);
      await sleep(1800);

      // Click download
      if (cancelled) return;
      setCursorPos({x:390, y:118, visible:true});
      await sleep(500);
      setSlide(3); setPdfReady(false);
      setCursorPos({x:-100,y:-100,visible:false});
      await sleep(400);
      setPdfReady(true);
      await sleep(2400);
      if (!cancelled) run();
    }
    run();
    return () => { cancelled = true; };
  }, []);

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  const slideStyle = (n) => ({
    position:'absolute', inset:0,
    opacity: slide===n ? 1 : 0,
    transition:'opacity 0.5s',
    pointerEvents: slide===n ? 'all' : 'none',
  });

  const inp = (key) => ({
    background:'#0d0d0f', border:`1px solid ${fields[key] ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius:7, padding:'7px 10px', fontSize:11, color:'#e2e2ea',
    width:'100%', fontFamily:'Outfit,sans-serif', minHeight:32,
  });

  return (
    <div style={{ background:'#111113', borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'0 40px 100px rgba(0,0,0,0.7)', position:'relative', fontFamily:'Outfit,sans-serif' }}>
      {/* Browser bar */}
      <div style={{ background:'#0d0d0f', padding:'9px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', gap:4 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:'50%',background:c }} />)}
        </div>
        <div style={{ flex:1, background:'#1a1a1f', borderRadius:5, padding:'3px 10px', fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'monospace' }}>
          craftedresume.io/{slide < 2 ? 'build' : 'build/results'}
        </div>
      </div>

      {/* Mini header */}
      <div style={{ background:'#111113', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'0 16px', height:40, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:13, fontWeight:300, color:'#e2e2ea', letterSpacing:'0.06em' }}>Crafted<span style={{ color:'#c9a84c', fontWeight:400 }}>Resume</span></div>
        <div style={{ display:'flex', gap:6 }}>
          <div style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', borderRadius:6, padding:'3px 10px', fontSize:10 }}>Sign In</div>
          <div style={{ background:'linear-gradient(135deg,#c9a84c,#e8c96d)', color:'#0d0d0f', borderRadius:6, padding:'3px 10px', fontSize:10, fontWeight:600 }}>Get Started</div>
        </div>
      </div>

      {/* Step pills */}
      <div style={{ background:'#0d0d0f', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'6px 16px', display:'flex', gap:10, alignItems:'center' }}>
        {['Fill details','Generate','Review','Download'].map((s,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:6,height:6,borderRadius:'50%', background: i<slide?'rgba(201,168,76,0.5)':i===slide?'#c9a84c':'rgba(255,255,255,0.1)', transition:'background 0.3s', boxShadow:i===slide?'0 0 6px rgba(201,168,76,0.5)':'none' }} />
            <span style={{ fontSize:10, color:i===slide?'rgba(201,168,76,0.8)':'rgba(255,255,255,0.25)', transition:'color 0.3s' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Screen */}
      <div style={{ position:'relative', height:320, overflow:'hidden', background:'#0d0d0f' }}>

        {/* Cursor */}
        <div style={{ position:'absolute', left:cursorPos.x, top:cursorPos.y, opacity:cursorPos.visible?1:0, transition:'left 0.6s cubic-bezier(0.4,0,0.2,1),top 0.6s cubic-bezier(0.4,0,0.2,1),opacity 0.3s', pointerEvents:'none', zIndex:50, width:16, height:16 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 1.5L13 8L8.5 9.5L6.5 14L3 1.5Z" fill="white" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Slide 0: Form */}
        <div style={slideStyle(0)}>
          <div style={{ padding:'14px 16px' }}>
            <div style={{ background:'#111113', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'14px' }}>
              <div style={{ fontSize:13, fontWeight:400, color:'#e2e2ea', marginBottom:2 }}>Personal Information</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>Your basic details and target role.</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:3 }}>FULL NAME</div>
                  <div style={inp('fn')}>{fields.fn || <span style={{ color:'rgba(255,255,255,0.15)' }}>Alexandra Chen</span>}</div>
                </div>
                <div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:3 }}>TARGET ROLE</div>
                  <div style={inp('fr')}>{fields.fr || <span style={{ color:'rgba(255,255,255,0.15)' }}>Product Manager</span>}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:3 }}>EMAIL</div>
                  <div style={inp('fe')}>{fields.fe || <span style={{ color:'rgba(255,255,255,0.15)' }}>alex@email.com</span>}</div>
                </div>
                <div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:3 }}>LOCATION</div>
                  <div style={inp('fl')}>{fields.fl || <span style={{ color:'rgba(255,255,255,0.15)' }}>San Francisco</span>}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:3 }}>SKILLS</div>
                <div style={inp('fs')}>{fields.fs || <span style={{ color:'rgba(255,255,255,0.15)' }}>SQL · Figma · Agile</span>}</div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
                <div style={{ background:'linear-gradient(135deg,#c9a84c,#e8c96d)', color:'#0d0d0f', borderRadius:7, padding:'9px 24px', fontSize:12, fontWeight:600, cursor:'pointer' }}>✦ Generate Resume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 1: Loading */}
        <div style={slideStyle(1)}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16 }}>
            <div style={{ width:36,height:36,border:'2.5px solid rgba(201,168,76,0.15)',borderTopColor:'#c9a84c',borderRadius:'50%',animation:'spin 0.85s linear infinite' }} />
            <div style={{ fontSize:14, color:'#c9a84c', fontWeight:300, transition:'opacity 0.3s' }}>{loadMsg}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>Claude AI is writing your resume</div>
            <div style={{ display:'flex', gap:6, marginTop:4 }}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{ width:6,height:6,borderRadius:'50%', background:i===loadStep?'#c9a84c':'rgba(255,255,255,0.1)', transition:'background 0.3s' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Slide 2: Result */}
        <div style={slideStyle(2)}>
          <div style={{ padding:'12px 14px' }}>
            <div style={{ background:'rgba(74,222,128,0.04)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:10, padding:'10px 14px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, color:'#4ade80', marginBottom:1 }}>✓ Resume Complete</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Review below, then download or share</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', borderRadius:6, padding:'5px 10px', fontSize:10 }}>🔗 Share</div>
                <div style={{ background:'linear-gradient(135deg,#c9a84c,#e8c96d)', color:'#0d0d0f', borderRadius:6, padding:'5px 10px', fontSize:10, fontWeight:600 }}>⬇ Download PDF</div>
              </div>
            </div>
            <div style={{ background:'#fff', borderRadius:10, padding:'14px 16px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, color:'#1a1a2e', borderBottom:'1.5px solid #1a1a2e', paddingBottom:6, marginBottom:6 }}>Alexandra Chen</div>
              <div style={{ fontSize:10, color:'#8a8a96', fontStyle:'italic', marginBottom:4 }}>Senior Product Manager</div>
              <div style={{ fontSize:8, color:'#999', marginBottom:10 }}>alex@email.com · San Francisco, CA · linkedin.com/in/alex</div>
              {['PROFILE','EXPERIENCE','SKILLS'].map((s,si)=>(
                <div key={s} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:7, fontWeight:700, letterSpacing:'1.5px', color:'#1a1a2e', borderBottom:'0.5px solid rgba(26,26,46,0.2)', paddingBottom:2, marginBottom:4 }}>{s}</div>
                  {[90,76,si<2?62:0].filter(Boolean).map((w,i)=>(
                    <div key={i} style={{ height:5, width:`${w}%`, background:'#eee', borderRadius:2, marginBottom:3 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 3: PDF */}
        <div style={slideStyle(3)}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:14 }}>
            <div style={{ background:'#1a1a1f', borderRadius:10, padding:'20px', position:'relative' }}>
              <div style={{ background:'#fff', width:140, height:190, borderRadius:4, boxShadow:'0 12px 40px rgba(0,0,0,0.4)', padding:'12px' }}>
                <div style={{ height:7,background:'#1a1a2e',borderRadius:2,width:'55%',marginBottom:3 }} />
                <div style={{ height:4,background:'#eee',borderRadius:1,width:'38%',marginBottom:8 }} />
                {[90,76,85,70,60].map((w,i)=><div key={i} style={{ height:4,background:'#eee',borderRadius:1,width:`${w}%`,marginBottom:3 }} />)}
              </div>
              <div style={{ position:'absolute', top:-10, right:-10, width:32, height:32, background:'#4ade80', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, opacity:pdfReady?1:0, transform:pdfReady?'scale(1)':'scale(0)', transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>✓</div>
            </div>
            <div style={{ fontSize:12, color:'#4ade80', opacity:pdfReady?1:0, transition:'opacity 0.5s' }}>PDF saved to your device</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ user, navigate }) {
  const go = (step) => navigate(step===1 ? "/dashboard" : "/");

  return (
    <div style={{ minHeight:"100vh", background:"var(--ink)", position:"relative", overflowX:"hidden" }}>
      <HeroGlow />
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px 90px", position:"relative", zIndex:2 }}>

        {/* Hero */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:40, alignItems:"center", padding:"60px 0 60px", maxWidth:1100, margin:"0 auto" }}>
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
              <button className="gold-btn pulse" onClick={()=>go(1)} style={{ fontSize:14, padding:"14px 36px" }}>Get Started Free →</button>
              <button className="ghost-btn" onClick={()=>navigate("/login")} style={{ fontSize:14, padding:"14px 28px" }}>Sign In</button>
            </div>
            <div className="fade-in" style={{ marginTop:32, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap", animationDelay:"0.4s" }}>
              {["Free to start","No watermarks","Cancel anytime"].map((t,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--ash)" }}>
                  <span style={{ color:"#4ade80" }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay:"0.3s", position:"relative" }}>
            <div style={{ position:"absolute", inset:-40, background:"radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
            <HeroDemo />
          </div>
        </div>

        {/* Stats */}
        <div className="fade-in" style={{ borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)", padding:"32px 0", marginBottom:80 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:40, flexWrap:"wrap" }}>
            {[{stat:"4 tools",label:"in one platform"},{stat:"ATS optimised",label:"every resume"},{stat:"$20/month",label:"all features included"},{stat:"Cancel anytime",label:"no lock-in"}].map((s,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:300, color:"var(--gold)", marginBottom:4 }}>{s.stat}</div>
                <div style={{ fontSize:12, color:"var(--ash)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ maxWidth:1100, margin:"0 auto 100px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:14 }}>Everything you need to get hired</h2>
            <p style={{ color:"var(--ash)", fontSize:16, fontWeight:300 }}>Four powerful tools. One platform.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {[
              { icon:"⚡", title:"Apply Mode",        badge:"Premium", mode:"apply",    desc:"Paste any job URL. Get a tailored resume, cover letter, and interview prep — all in one shot." },
              { icon:"✦",  title:"Build Resume",       badge:"Free",    mode:"build",    desc:"Start from scratch. Fill in your details and get a polished, ATS-optimised resume in under 2 minutes." },
              { icon:"↑",  title:"Tailor to a Job",    badge:"Free",    mode:"tailor",   desc:"Upload your PDF and rewrite it specifically for any role." },
              { icon:"in", title:"LinkedIn Optimizer", badge:"Free",    mode:"linkedin", desc:"Get a full AI audit of your LinkedIn profile with prioritised, actionable fixes." },
            ].map((f,i)=>(
              <div key={i} className="card" style={{ padding:"28px 24px", cursor:"pointer" }} onClick={()=>navigate(`/${f.mode}`)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <span style={{ fontSize:24, color:"var(--gold)" }}>{f.icon}</span>
                  <span style={{ fontSize:9, padding:"3px 10px", borderRadius:8, background:f.badge==="Premium"?"linear-gradient(135deg,#c9a84c,#e8c96d)":"rgba(74,222,128,0.1)", color:f.badge==="Premium"?"#0d0d0f":"#4ade80", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", border:f.badge==="Free"?"1px solid rgba(74,222,128,0.3)":"none" }}>{f.badge}</span>
                </div>
                <div style={{ fontWeight:500, fontSize:16, marginBottom:10, color:"var(--text-primary)" }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ maxWidth:480, margin:"0 auto 100px", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:14 }}>Simple pricing</h2>
          <p style={{ color:"var(--ash)", fontSize:16, fontWeight:300, marginBottom:40 }}>Start free. Upgrade when you're ready.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
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
            <div style={{ padding:"28px 24px", textAlign:"left", background:"var(--gold-dim)", border:"1px solid var(--gold-border)", borderRadius:16, position:"relative" }}>
              <div style={{ position:"absolute", top:-10, right:16, fontSize:9, padding:"3px 12px", borderRadius:8, background:"linear-gradient(135deg,#c9a84c,#e8c96d)", color:"#0d0d0f", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Popular</div>
              <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Premium</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:36, fontWeight:300, color:"var(--gold)", marginBottom:4 }}>$20<span style={{ fontSize:14, color:"var(--ash)" }}>/mo</span></div>
              <div style={{ fontSize:12, color:"var(--ash)", marginBottom:20 }}>Cancel anytime</div>
              {["Everything in Free","Apply Mode","PDF Download","Share Link","ATS Fix My Score","AI Resume Assistant","Job Recommendations"].map((f,i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13 }}>
                  <span style={{ color:"var(--gold)", flexShrink:0 }}>✦</span><span style={{ color:"var(--text-primary)" }}>{f}</span>
                </div>
              ))}
              <button className="gold-btn pulse" style={{ width:"100%", marginTop:20, fontSize:13 }} onClick={()=>navigate("/subscribe")}>Start Free →</button>
            </div>
          </div>
        </div>

        {/* Live Jobs */}
        <div style={{ marginBottom:80 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:300, letterSpacing:"-1px", marginBottom:10 }}>Live job listings</h2>
            <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>Real jobs from thousands of boards — updated daily.</p>
          </div>
          <LiveJobsSearch user={user} navigate={navigate} />
        </div>

        {/* ATS Hook */}
        <ATSScoreHook onSignUp={()=>navigate("/register")} />

        {/* Final CTA */}
        <div style={{ textAlign:"center", padding:"80px 0 60px", borderTop:"1px solid var(--border-subtle)" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:48, fontWeight:300, letterSpacing:"-1.5px", marginBottom:16 }}>
            Your next job starts<br />
            <em style={{ background:"linear-gradient(135deg,#c9a84c,#f0d98a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>with a great resume.</em>
          </h2>
          <p style={{ color:"var(--ash)", fontSize:16, marginBottom:36 }}>Join thousands of job seekers who use Crafted Resume to stand out.</p>
          <button className="gold-btn pulse" onClick={()=>go(1)} style={{ fontSize:15, padding:"16px 48px" }}>Get Started Free →</button>
        </div>

      </div>
    </div>
  );
}
