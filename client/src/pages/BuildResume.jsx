import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "./TemplateSelector";

const blank    = () => ({ company:"",role:"",startDate:"",endDate:"",current:false,bullets:"" });
const blankEdu = () => ({ school:"",degree:"",field:"",year:"" });
const init = {
  name:"",email:"",phone:"",location:"",linkedin:"",
  targetRole:"",targetIndustry:"",
  experiences:[blank()],education:[blankEdu()],
  skills:"",certifications:"",template:"executive"
};
const EXAMPLE = {
  name:"Alex Rivera", email:"alex.rivera@email.com", phone:"+1 415 555 0192",
  location:"San Francisco, CA", linkedin:"linkedin.com/in/alexrivera",
  targetRole:"Senior Product Manager", targetIndustry:"Technology / SaaS",
  template:"executive",
  experiences:[
    { company:"Acme Tech", role:"Product Manager", startDate:"Jan 2021", endDate:"", current:true,
      bullets:"Led cross-functional team of 12 to ship payments redesign, increasing conversion by 24%.\nOwned roadmap for core checkout flow serving 2M monthly users.\nDrove 0→1 launch of subscription product generating $1.8M ARR in first year." },
    { company:"StartupCo", role:"Associate PM", startDate:"Jun 2019", endDate:"Dec 2020", current:false,
      bullets:"Defined MVP requirements for mobile app, shipped in 10 weeks.\nManaged backlog of 200+ tickets across 3 engineering squads.\nIncreased DAU by 18% through A/B tested onboarding redesign." },
  ],
  education:[{ school:"UC Berkeley", degree:"BSc", field:"Computer Science", year:"2019" }],
  skills:"Product Strategy, Roadmapping, A/B Testing, SQL, Figma, Agile / Scrum",
  certifications:"Pragmatic Marketing Certified",
};



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

export default function BuildResume({ callAPI, onResult, startLoad, loadMsg }) {
  const navigate = useNavigate();
  const [form, setForm]       = useState(() => {
    try { const s = sessionStorage.getItem("cr_build"); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const g2  = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 };
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const updExp = (i,k,v) => set("experiences", form.experiences.map((x,j) => j===i ? {...x,[k]:v} : x));
  const updEdu = (i,k,v) => set("education",   form.education.map((x,j)   => j===i ? {...x,[k]:v} : x));

  useEffect(() => {
    try { sessionStorage.setItem("cr_build", JSON.stringify(form)); } catch {}
  }, [form]);

  const generate = async () => {
    setErr("");
    const iv = startLoad(["Crafting your story…","Polishing bullet points…","Optimising for ATS…","Almost there…"]);
    setLoading(true);
    try {
      const res = await callAPI("/api/generate", {
        name:form.name, email:form.email, phone:form.phone, location:form.location,
        linkedin:form.linkedin, targetRole:form.targetRole, targetIndustry:form.targetIndustry,
        experiences:form.experiences, education:form.education,
        skills:form.skills, certifications:form.certifications,
      });
      onResult(res, form.template);
      navigate("/build/results");
    } catch(e) {
      if (e.message==="premium_required") navigate("/subscribe");
      else if (e.message==="login_required") navigate("/login");
      else setErr(e.message || "Generation failed — please try again.");
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <div>
      {err && <div className="fade-in" style={{ marginBottom:16,padding:"14px 18px",background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:11,color:"#f87171",fontSize:13 }}>{err}</div>}

      {/* Personal Info */}
      <div className="card fade-up d1">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10 }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-display)",fontSize:24,fontWeight:300,marginBottom:4 }}>Personal Information</h2>
            <p style={{ color:"var(--ash)",fontSize:13,fontWeight:300 }}>Your basic details and target role.</p>
          </div>
          <button className="ghost-btn" style={{ fontSize:11,padding:"7px 14px" }} onClick={()=>setForm({...EXAMPLE})}>✦ Fill Example</button>
          <button className="ghost-btn" style={{ fontSize:11,padding:"7px 14px" }} onClick={()=>{ setForm(init); try{sessionStorage.removeItem("cr_build");}catch{} }}>Start Over</button>
        </div>
        <div style={g2}>
          <F label="Full Name"><input placeholder="Alexandra Chen" value={form.name} onChange={e=>set("name",e.target.value)} /></F>
          <F label="Target Role"><input placeholder="Chief Product Officer" value={form.targetRole} onChange={e=>set("targetRole",e.target.value)} /></F>
        </div>
        <div style={g2}>
          <F label="Email"><input placeholder="alex@example.com" value={form.email} onChange={e=>set("email",e.target.value)} /></F>
          <F label="Phone"><input placeholder="+1 555 000 1234" value={form.phone} onChange={e=>set("phone",e.target.value)} /></F>
        </div>
        <div style={g2}>
          <F label="Location"><input placeholder="San Francisco, CA" value={form.location} onChange={e=>set("location",e.target.value)} /></F>
          <F label="Target Industry"><input placeholder="Technology / FinTech" value={form.targetIndustry} onChange={e=>set("targetIndustry",e.target.value)} /></F>
        </div>
        <F label="LinkedIn URL"><input placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={e=>set("linkedin",e.target.value)} /></F>
      </div>

      {/* Experience */}
      {form.experiences.map((exp,i) => (
        <div key={i} className="card fade-up" style={{ animationDelay:`${0.1+i*0.08}s` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"var(--font-display)",fontSize:22,fontWeight:300,marginBottom:2 }}>
                {i===0 ? "Most Recent Role" : `Previous Role ${i}`}
              </h2>
              <p style={{ color:"var(--ash)",fontSize:13,fontWeight:300 }}>Include metrics where possible.</p>
            </div>
            {form.experiences.length > 1 && (
              <button className="ghost-btn" style={{ fontSize:11 }} onClick={()=>set("experiences",form.experiences.filter((_,j)=>j!==i))}>Remove</button>
            )}
          </div>
          <div style={g2}>
            <F label="Job Title"><input placeholder="Senior Product Manager" value={exp.role} onChange={e=>updExp(i,"role",e.target.value)} /></F>
            <F label="Company"><input placeholder="Acme Corp" value={exp.company} onChange={e=>updExp(i,"company",e.target.value)} /></F>
          </div>
          <div style={g2}>
            <F label="Start Date"><input placeholder="Jan 2021" value={exp.startDate} onChange={e=>updExp(i,"startDate",e.target.value)} /></F>
            <F label="End Date">
              <input placeholder={exp.current?"Present":"Dec 2023"} value={exp.endDate} disabled={exp.current} onChange={e=>updExp(i,"endDate",e.target.value)} />
            </F>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:-8,marginBottom:16 }}>
              <input type="checkbox" id={`cur-${i}`} checked={exp.current} onChange={e=>set("experiences",form.experiences.map((x,j)=>j===i?{...x,current:e.target.checked,endDate:""}:x))} style={{ width:14,height:14,margin:0,cursor:"pointer",accentColor:"var(--gold)",flexShrink:0 }} />
              <label htmlFor={`cur-${i}`} style={{ fontSize:12,color:"var(--ash)",cursor:"pointer",userSelect:"none" }}>Current role</label>
            </div>
          </div>
          <F label="Key Achievements & Responsibilities">
            <textarea placeholder={"Led a team of 8 engineers to ship new payments flow, reducing checkout time by 30%.\nOwned product roadmap for core platform serving 500K users.\nIncreased NPS from 32 to 58 through targeted UX improvements."} value={exp.bullets} onChange={e=>updExp(i,"bullets",e.target.value)} style={{ minHeight:110 }} />
          </F>
        </div>
      ))}
      <div style={{ textAlign:"center",marginBottom:16 }}>
        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>set("experiences",[...form.experiences,blank()])}>+ Add Another Role</button>
      </div>

      {/* Education */}
      {form.education.map((edu,i) => (
        <div key={i} className="card fade-up" style={{ animationDelay:`${0.2+i*0.08}s` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
            <h2 style={{ fontFamily:"var(--font-display)",fontSize:22,fontWeight:300 }}>Education</h2>
            {form.education.length > 1 && (
              <button className="ghost-btn" style={{ fontSize:11 }} onClick={()=>set("education",form.education.filter((_,j)=>j!==i))}>Remove</button>
            )}
          </div>
          <div style={g2}>
            <F label="School / University"><input placeholder="Stanford University" value={edu.school} onChange={e=>updEdu(i,"school",e.target.value)} /></F>
            <F label="Degree"><input placeholder="BSc / MBA / PhD" value={edu.degree} onChange={e=>updEdu(i,"degree",e.target.value)} /></F>
          </div>
          <div style={g2}>
            <F label="Field of Study"><input placeholder="Computer Science" value={edu.field} onChange={e=>updEdu(i,"field",e.target.value)} /></F>
            <F label="Graduation Year"><input placeholder="2019" value={edu.year} onChange={e=>updEdu(i,"year",e.target.value)} /></F>
          </div>
        </div>
      ))}
      <div style={{ textAlign:"center",marginBottom:16 }}>
        <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>set("education",[...form.education,blankEdu()])}>+ Add Another Qualification</button>
      </div>

      {/* Skills */}
      <div className="card fade-up d2">
        <h2 style={{ fontFamily:"var(--font-display)",fontSize:22,fontWeight:300,marginBottom:16 }}>Skills & Certifications</h2>
        <F label="Skills (comma separated)">
          <input placeholder="Python, SQL, Product Strategy, Figma, Agile..." value={form.skills} onChange={e=>set("skills",e.target.value)} />
        </F>
        <F label="Certifications (optional)">
          <input placeholder="AWS Solutions Architect, PMP, Google Analytics..." value={form.certifications} onChange={e=>set("certifications",e.target.value)} />
        </F>
      </div>

      {/* Template */}
      <div className="card fade-up d3">
        <h2 style={{ fontFamily:"var(--font-display)",fontSize:22,fontWeight:300,marginBottom:16 }}>Resume Style</h2>
        <TemplateSelector value={form.template} onChange={t=>set("template",t)} />
      </div>
      {/* Actions */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap" }}>
        <button className="ghost-btn" onClick={()=>navigate("/dashboard")}>← Back</button>
        <button className="gold-btn" onClick={generate} disabled={loading} style={{ minWidth:210 }}>
          {loading
            ? <span style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center" }}><Spinner />{loadMsg}</span>
            : "✦ Generate Resume"}
        </button>
      </div>
    </div>
  );
}
