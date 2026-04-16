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

function LiveJobsSearch({ user, navigate }) {
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
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:500, color:"var(--text-primary)", marginBottom:8 }}>AI-powered job search</div>
            <div style={{ fontSize:13, color:"var(--ash)", lineHeight:1.7 }}>
              Claude generates targeted search links across Lever, Greenhouse, LinkedIn, Indeed and more — tailored to your role.
            </div>
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
            <div style={{ background:"#fff", borderRadius:16, padding:"32px 36px", boxShadow:"0 40px 100px rgba(0,0,0,0.6)", position:"relative", fontFamily:"Georgia, serif" }}>
              <div style={{ borderBottom:"2px solid #1a1a2e", paddingBottom:16, marginBottom:18 }}>
                <div style={{ fontSize:22, fontWeight:300, color:"#1a1a2e" }}>Alexandra Chen</div>
                <div style={{ fontSize:13, color:"#8a8a96", fontStyle:"italic", marginBottom:8 }}>Senior Product Manager</div>
                <div style={{ fontSize:11, color:"#666", display:"flex", gap:14, flexWrap:"wrap" }}>
                  <span>alex.chen@email.com</span><span>San Francisco, CA</span>
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a1a2e", borderBottom:"1px solid rgba(26,26,46,0.15)", paddingBottom:4, marginBottom:8 }}>Profile</div>
                <div style={{ fontSize:11, color:"#333", lineHeight:1.6, fontStyle:"italic" }}>Results-driven Product Manager with 7+ years scaling B2B SaaS products from 0 to $12M ARR. Led cross-functional teams delivering 40% improvement in user retention.</div>
              </div>
              <div>
                <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a1a2e", borderBottom:"1px solid rgba(26,26,46,0.15)", paddingBottom:4, marginBottom:8 }}>Experience</div>
                {[{role:"Senior Product Manager",co:"Stripe",dates:"2021–Present"},{role:"Product Manager",co:"Notion",dates:"2019–2021"}].map((j,i)=>(
                  <div key={i} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:600, color:"#1a1a2e" }}><span>{j.role} · {j.co}</span><span style={{ color:"#8a8a96", fontWeight:400 }}>{j.dates}</span></div>
                    <div style={{ width:"100%", height:5, background:"rgba(0,0,0,0.06)", borderRadius:3, marginTop:5 }} />
                    <div style={{ width:"85%", height:5, background:"rgba(0,0,0,0.06)", borderRadius:3, marginTop:4 }} />
                  </div>
                ))}
              </div>
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
