import { useNavigate } from "react-router-dom";

const TOOLS = [
  { id:"apply",
    hot:true,
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
];

const ROUTE_MAP = {
  apply:          "/apply",
  build:          "/build",
  tailor:         "/tailor",
  linkedin:       "/linkedin",
  interview:      "/interview",
  "linkedin-quick":"/linkedin-writer",
};

const GREETINGS = (name) => [
  `Good to see you, ${name}. What are we working on?`,
  `Hey ${name} — let's get you hired. What do you need?`,
  `Welcome back, ${name}. What's the move today?`,
  `Ready when you are, ${name}. Pick a tool.`,
  `Let's get to work, ${name}. What do you need?`,
  `${name}, your next opportunity starts here. What's first?`,
];

export default function Dashboard({ user }) {
  const navigate  = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting  = GREETINGS(firstName)[Math.floor(Math.random() * 6)];

  return (
    <div className="scale-in">
      <div style={{ textAlign:"center", padding:"52px 0 36px" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:300, letterSpacing:"-1px", marginBottom:10 }}>
          {greeting}
        </h2>
        <p style={{ color:"var(--ash)", fontSize:15, fontWeight:300 }}>Pick a tool to get started.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, marginBottom:20 }}>
        {TOOLS.map((m,i) => (
          <div key={m.id} className={`mode-card fade-up d${i+1}`}
            onClick={()=>navigate(ROUTE_MAP[m.id])}
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
        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>navigate("/")}>← Back</button>
      </div>
    </div>
  );
}
