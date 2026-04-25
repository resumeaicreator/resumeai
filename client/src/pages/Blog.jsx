import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const POSTS = [
  {
    slug: "how-to-beat-ats-2025",
    title: "How to Beat ATS Systems in 2025 (And Actually Get Interviews)",
    description: "Applicant Tracking Systems reject 75% of resumes before a human sees them. Here's exactly how to optimise your resume to pass ATS filters and land more interviews.",
    date: "April 20, 2025",
    readTime: "6 min read",
    category: "Resume Tips",
    content: [
      { type:"p", text:"If you've been applying to jobs and hearing nothing back, an Applicant Tracking System (ATS) is likely the reason. Studies show that over 75% of resumes are rejected by ATS software before a human recruiter ever sees them. The good news? Once you understand how these systems work, you can beat them." },
      { type:"h2", text:"What Is an ATS?" },
      { type:"p", text:"An ATS is software that companies use to collect, sort and filter job applications. When you apply online, your resume goes into the ATS first. It scans for keywords, formatting and relevance — and if you don't match, you're out. Major companies like Google, Amazon and JPMorgan all use ATS software. Even smaller companies use tools like Greenhouse, Lever and Workday." },
      { type:"h2", text:"The 7 Biggest ATS Mistakes" },
      { type:"list", items:[
        "Using tables or columns — ATS parsers read left to right and get confused by multi-column layouts",
        "Saving as .docx with complex formatting — stick to simple, clean Word or PDF exports",
        "Missing keywords from the job description — ATS literally looks for exact matches",
        "Using headers like 'Where I've Worked' instead of 'Work Experience'",
        "Putting contact info in the header or footer — many ATS systems can't read those",
        "Using images, graphics or icons to represent skills",
        "Submitting a generic resume instead of tailoring it per application",
      ]},
      { type:"h2", text:"How to Optimise Your Resume for ATS" },
      { type:"p", text:"The single most important thing you can do is mirror the language in the job description. If the job says 'cross-functional collaboration', your resume should say exactly that — not 'working across teams'. ATS systems match strings, not meaning." },
      { type:"p", text:"Use standard section headers: Work Experience, Education, Skills, Certifications. Keep formatting clean — no fancy fonts, no text boxes, no coloured backgrounds. Use bullet points starting with strong action verbs: Led, Built, Increased, Reduced, Managed." },
      { type:"h2", text:"The Keyword Strategy" },
      { type:"p", text:"Copy the job description into a word cloud tool. The biggest words are your keywords. Make sure each one appears naturally in your resume at least once — ideally two or three times across different sections. Don't keyword stuff — ATS systems are getting smarter and recruiters will notice." },
      { type:"h2", text:"Check Your ATS Score Before You Apply" },
      { type:"p", text:"Tools like Crafted Resume's ATS Score Checker analyse your resume against a job description and give you a match score. Anything above 80% is strong. Below 60% and you're likely getting filtered out before a human sees your application." },
      { type:"cta", text:"Check your ATS score free →", href:"/build" },
    ]
  },
  {
    slug: "linkedin-profile-tips-2025",
    title: "7 LinkedIn Profile Changes That Will Triple Your Recruiter Messages",
    description: "Most LinkedIn profiles are invisible to recruiters. These seven specific changes to your headline, about section and experience will dramatically increase how often you show up in recruiter searches.",
    date: "April 15, 2025",
    readTime: "5 min read",
    category: "LinkedIn",
    content: [
      { type:"p", text:"LinkedIn has over 900 million users. Recruiters search this database every day looking for candidates. If your profile isn't optimised, you're invisible — even if you're perfectly qualified for the roles they're filling." },
      { type:"h2", text:"1. Rewrite Your Headline (Most People Get This Wrong)" },
      { type:"p", text:"Most people use their job title as their headline. That's a waste of prime real estate. Your headline should include your role, your specialisation and a value statement. Instead of 'Software Engineer at Acme', try 'Software Engineer | Python & AWS | Building scalable backend systems'. Pack in keywords recruiters actually search for." },
      { type:"h2", text:"2. Turn On Open to Work (The Right Way)" },
      { type:"p", text:"Don't just toggle it on. Configure it properly — specify job titles, locations and job types. The more specific you are, the better LinkedIn's algorithm matches you to relevant recruiters. You can choose to show this only to recruiters (not your network) if you're currently employed." },
      { type:"h2", text:"3. Rewrite Your About Section as a Story" },
      { type:"p", text:"Your About section should answer three questions: What do you do? What makes you different? What are you looking for? Write in first person. Start with a hook. End with a call to action. Aim for 200-300 words. Use line breaks — walls of text get skipped." },
      { type:"h2", text:"4. Add Skills Strategically" },
      { type:"p", text:"LinkedIn lets you add up to 50 skills. Use them all. Prioritise skills that match your target roles. Ask former colleagues to endorse your top 5 — endorsements boost your profile in search results. Skills with 10+ endorsements show social proof that matters to recruiters." },
      { type:"h2", text:"5. Get a Custom URL" },
      { type:"p", text:"Change your LinkedIn URL from the default gibberish to linkedin.com/in/yourname. It looks professional on your resume, in your email signature and on business cards. Takes 30 seconds." },
      { type:"h2", text:"6. Add Media to Your Experience" },
      { type:"p", text:"Each experience entry lets you attach media — presentations, case studies, portfolio links, published articles. This turns your profile from a text CV into a visual portfolio. Profiles with media get 2x more profile views according to LinkedIn's own data." },
      { type:"h2", text:"7. Post One Piece of Content Per Week" },
      { type:"p", text:"The fastest way to grow your LinkedIn reach is to post consistently. Share a lesson from your work, a project you completed, an industry insight. Even 3-4 sentences is enough. Profiles that post regularly appear higher in recruiter searches because LinkedIn's algorithm rewards activity." },
      { type:"cta", text:"Optimise your LinkedIn with AI →", href:"/linkedin" },
    ]
  },
  {
    slug: "ai-resume-builder-guide",
    title: "The Complete Guide to Using AI to Write Your Resume in 2025",
    description: "AI resume builders have gone from gimmick to genuinely useful. Here's how to use them effectively — and what to watch out for — to create a resume that actually gets you hired.",
    date: "April 10, 2025",
    readTime: "7 min read",
    category: "AI Tools",
    content: [
      { type:"p", text:"Two years ago, AI resume builders were a novelty. They produced generic, stilted text that obviously wasn't written by a human. Today, with models like Claude and GPT-4 powering them, the output is genuinely impressive — and job seekers who know how to use them have a real advantage." },
      { type:"h2", text:"What AI Resume Builders Are Good At" },
      { type:"list", items:[
        "Translating your experience into clear, impactful bullet points",
        "Matching your language to specific job descriptions",
        "Identifying gaps in your resume you might not notice",
        "Generating multiple versions quickly for different roles",
        "Formatting consistently and cleanly",
        "Suggesting stronger action verbs and quantified achievements",
      ]},
      { type:"h2", text:"What They're Not Good At" },
      { type:"p", text:"AI tools don't know what you actually accomplished. If you give them vague input, you'll get vague output. They also can't verify claims — so you need to fact-check everything. And they can't replace the human judgement needed to decide what to include or leave out based on context." },
      { type:"h2", text:"The Right Way to Use an AI Resume Builder" },
      { type:"p", text:"Start with a brain dump. Write down everything — every role, project, achievement, skill and responsibility you can think of. Don't edit yourself. Then paste this raw material into the AI tool along with the job description you're targeting. The AI's job is to shape and polish, not to invent." },
      { type:"p", text:"After the AI generates a draft, read every line critically. Ask yourself: Is this accurate? Is this specific enough? Does this sound like me? Edit anything that feels off. The best AI-assisted resumes are the ones where you can't tell what was AI and what was human — because the human has reviewed and refined everything." },
      { type:"h2", text:"Tailoring vs. Building" },
      { type:"p", text:"There are two distinct use cases. Building is creating a resume from scratch — useful when you're starting out or making a career change. Tailoring is adjusting an existing resume for a specific role — this is what most job seekers need most often. Tailoring for each application typically increases your match score by 20-40 points, which can be the difference between getting an interview or not." },
      { type:"h2", text:"The ATS Problem" },
      { type:"p", text:"Even the best AI-written resume can fail if it's not ATS-optimised. Make sure the tool you use checks your resume against the job description and gives you a match score. Anything below 70% and you're likely getting filtered before a recruiter sees it." },
      { type:"h2", text:"Which AI Resume Builder Should You Use?" },
      { type:"p", text:"Look for tools powered by the latest models (Claude or GPT-4 class), that offer job-specific tailoring, ATS scoring and clean PDF export. Crafted Resume does all of this — and also includes LinkedIn optimisation, interview prep and smart job search in one platform." },
      { type:"cta", text:"Build your resume with AI →", href:"/build" },
    ]
  }
];

function PostCard({ post, navigate }) {
  return (
    <div
      onClick={() => navigate(`/blog/${post.slug}`)}
      style={{ background:"var(--mist)", border:"1px solid var(--ghost-border)", borderRadius:14, padding:24, cursor:"pointer", transition:"all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-border)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--ghost-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:11, fontWeight:600, color:"var(--gold)", background:"rgba(201,168,76,0.1)", border:"1px solid var(--gold-border)", borderRadius:20, padding:"2px 10px" }}>{post.category}</span>
        <span style={{ fontSize:11, color:"var(--ash)" }}>{post.readTime}</span>
      </div>
      <div style={{ fontSize:18, fontWeight:500, color:"var(--text-primary)", marginBottom:8, lineHeight:1.4 }}>{post.title}</div>
      <div style={{ fontSize:13, color:"var(--ash)", lineHeight:1.7, marginBottom:12 }}>{post.description}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"var(--ash)" }}>{post.date}</span>
        <span style={{ fontSize:13, color:"var(--gold)" }}>Read more →</span>
      </div>
    </div>
  );
}

function PostContent({ post, navigate }) {
  useEffect(() => {
    document.title = `${post.title} | Crafted Resume Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.description);
    return () => { document.title = "Crafted Resume — AI Resume Builder"; };
  }, [post]);

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px" }}>
      <button onClick={() => navigate("/blog")} className="ghost-btn" style={{ fontSize:12, padding:"7px 14px", marginBottom:24 }}>← Back to Blog</button>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:11, fontWeight:600, color:"var(--gold)", background:"rgba(201,168,76,0.1)", border:"1px solid var(--gold-border)", borderRadius:20, padding:"2px 10px" }}>{post.category}</span>
        <span style={{ fontSize:11, color:"var(--ash)" }}>{post.date} · {post.readTime}</span>
      </div>
      <h1 style={{ fontSize:28, fontWeight:600, color:"var(--text-primary)", lineHeight:1.3, marginBottom:16 }}>{post.title}</h1>
      <p style={{ fontSize:15, color:"var(--ash)", lineHeight:1.8, marginBottom:32, borderBottom:"1px solid var(--ghost-border)", paddingBottom:24 }}>{post.description}</p>
      <div style={{ fontSize:15, color:"var(--text-primary)", lineHeight:1.9 }}>
        {post.content.map((block, i) => {
          if (block.type === "p") return <p key={i} style={{ marginBottom:18, color:"rgba(255,255,255,0.75)" }}>{block.text}</p>;
          if (block.type === "h2") return <h2 key={i} style={{ fontSize:20, fontWeight:600, color:"var(--text-primary)", marginTop:32, marginBottom:12 }}>{block.text}</h2>;
          if (block.type === "list") return (
            <ul key={i} style={{ marginBottom:18, paddingLeft:20 }}>
              {block.items.map((item, j) => <li key={j} style={{ marginBottom:8, color:"rgba(255,255,255,0.75)" }}>{item}</li>)}
            </ul>
          );
          if (block.type === "cta") return (
            <div key={i} style={{ margin:"32px 0", padding:24, background:"rgba(201,168,76,0.06)", border:"1px solid var(--gold-border)", borderRadius:12, textAlign:"center" }}>
              <button className="gold-btn" style={{ fontSize:14, padding:"12px 28px" }} onClick={() => navigate(block.href)}>{block.text}</button>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}

export default function Blog({ navigate }) {
  const nav = useNavigate();
  const navFn = navigate || nav;

  // Check if we're on a specific post
  const path = window.location.pathname;
  const slug = path.startsWith("/blog/") ? path.replace("/blog/", "") : null;
  const post = slug ? POSTS.find(p => p.slug === slug) : null;

  useEffect(() => {
    if (!post) {
      document.title = "Blog — Resume Tips, LinkedIn & Career Advice | Crafted Resume";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", "Expert career advice, resume tips, LinkedIn optimisation guides and AI tool tutorials from the Crafted Resume team.");
    }
  }, [post]);

  if (post) return <PostContent post={post} navigate={navFn} />;

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"40px 24px" }}>
      <button onClick={() => navFn("/dashboard")} className="ghost-btn" style={{ fontSize:12, padding:"7px 14px", marginBottom:32 }}>← Back to Dashboard</button>
      <div style={{ marginBottom:40 }}>
        <div style={{ fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>Crafted Resume Blog</div>
        <h1 style={{ fontSize:32, fontWeight:300, color:"var(--text-primary)", marginBottom:12, letterSpacing:"-0.5px" }}>Resume Tips, Career Advice & AI Tools</h1>
        <p style={{ fontSize:15, color:"var(--ash)", lineHeight:1.7 }}>Practical guides to help you land more interviews, write better resumes and use AI tools effectively in your job search.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
        {POSTS.map(p => <PostCard key={p.slug} post={p} navigate={navFn} />)}
      </div>
    </div>
  );
}
