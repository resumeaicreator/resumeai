/**
 * Crafted Resume — Secure Backend (server.js)
 *
 * INSTALL:
 *   npm install express cors helmet express-rate-limit dotenv
 *             cookie-parser passport passport-google-oauth20
 *             bcrypt jsonwebtoken pg stripe morgan nodemailer
 */

require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const passport     = require("passport");
const morgan       = require("morgan");
const fs           = require("fs");
const path         = require("path");

const { router: authRouter, requireAuth, requirePaid, handleStripeWebhook } = require("./auth");

const app     = express();
const PORT    = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY is not set in .env\n");
  process.exit(1);
}

// ─── Logging ─────────────────────────────────────────────────────────
if (IS_PROD) {
  const logDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });
  app.use(morgan("combined", { stream: logStream }));
} else {
  app.use(morgan("dev"));
}

// !! Stripe webhook MUST be mounted before express.json() !!
// Stripe requires raw body for signature verification.
app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

// ─── Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(passport.initialize());

// ─── CORS ────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,                          // e.g. https://craftedresume.io
  process.env.FRONTEND_URL?.replace("://", "://www."), // e.g. https://www.craftedresume.io
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods:        ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials:    true,
}));

// ─── General rate limit ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please wait 15 minutes before trying again." },
});

// ─── Auth routes (no subscription needed) ───────────────────────────
app.use("/api/auth", authRouter);

// ─── Resume prompts ──────────────────────────────────────────────────
function buildResumePrompt({ name, email, phone, location, linkedin, targetRole, targetIndustry, expBlob, eduBlob, skills, certifications }) {
  return `You are an elite executive resume writer with 20 years of experience placing C-suite and senior professionals at Fortune 500 companies.

Your task: craft a powerful, ATS-optimised resume for the candidate below.

TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}

CANDIDATE:
Name: ${name}
Contact: ${email} | ${phone} | ${location} | ${linkedin}

EXPERIENCE:
${expBlob}

EDUCATION:
${eduBlob}

SKILLS: ${skills}
CERTIFICATIONS: ${certifications}

WRITING RULES:
1. Open with a 3-sentence executive summary. Confident, first-person-omitted prose. No "I" statements.
2. Rewrite every experience entry as 4–6 tight bullet points. Start each with a strong past-tense action verb (Led, Scaled, Architected, Drove, Delivered, etc.). Quantify wherever implied.
3. Include ATS keywords naturally — mirror language from the target role/industry.
4. Tone: authoritative, precise, zero fluff.
5. For skills, format as: Category: skill, skill | Category: skill, skill

Return ONLY a raw JSON object — absolutely no markdown fences, no preamble, no explanation:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "linkedin": "...",
  "targetRole": "...",
  "summary": "...",
  "experience": "formatted with • bullets and blank lines between roles",
  "education": "formatted education text",
  "skills": "...",
  "certifications": "..."
}`;
}

// ─── Input validation helper ─────────────────
function sanitize(str, maxLen = 2000) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

function validateBody(body) {
  const errors = [];
  if (!body.name)       errors.push("name is required");
  if (!body.targetRole) errors.push("targetRole is required");
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("valid email is required");
  if (!body.experiences || !Array.isArray(body.experiences) || body.experiences.length === 0)
    errors.push("at least one experience is required");
  return errors;
}

// ─── Generate endpoint ───────────────────────
app.post("/api/generate", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    // 1. Validate
    const errors = validateBody(req.body);
    if (errors.length) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    // 2. Sanitize all inputs
    const safe = {
      name:           sanitize(req.body.name, 120),
      email:          sanitize(req.body.email, 120),
      phone:          sanitize(req.body.phone, 40),
      location:       sanitize(req.body.location, 120),
      linkedin:       sanitize(req.body.linkedin, 200),
      targetRole:     sanitize(req.body.targetRole, 200),
      targetIndustry: sanitize(req.body.targetIndustry, 200),
      skills:         sanitize(req.body.skills, 1000),
      certifications: sanitize(req.body.certifications, 500),
    };

    // 3. Format experience & education blobs
    const experiences = (req.body.experiences || []).slice(0, 8); // max 8 jobs
    safe.expBlob = experiences.map(e => {
      const role    = sanitize(e.role, 100);
      const company = sanitize(e.company, 100);
      const start   = sanitize(e.startDate, 30);
      const end     = e.current ? "Present" : sanitize(e.endDate, 30);
      const bullets = sanitize(e.bullets, 1000);
      return `${role} at ${company} (${start}–${end})\n${bullets}`;
    }).join("\n\n");

    const education = (req.body.education || []).slice(0, 5);
    safe.eduBlob = education.map(e => {
      const deg    = sanitize(e.degree, 100);
      const field  = sanitize(e.field, 100);
      const school = sanitize(e.school, 150);
      const year   = sanitize(e.year, 10);
      return `${deg} in ${field}, ${school} (${year})`;
    }).join("\n");

    // 4. Build prompt (your prompt lives in buildResumePrompt above)
    const prompt = buildResumePrompt(safe);

    // 5. Call Anthropic — API key is ONLY on the server
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-api-key":       ANTHROPIC_API_KEY,          // ← from .env, never exposed
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}));
      console.error("Anthropic API error:", errBody);
      return res.status(502).json({ error: "AI service error — please try again." });
    }

    const aiData = await anthropicRes.json();

    // 6. Parse and validate Claude's JSON response
    const rawText = (aiData.content || []).map(b => b.text || "").join("");
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let resume;
    try {
      resume = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw response:", rawText.slice(0, 500));
      return res.status(502).json({ error: "AI returned malformed data — please try again." });
    }

    // 7. Allowlist the fields we return to the client (no extra data leaks)
    const safeResume = {
      name:          String(resume.name          || ""),
      email:         String(resume.email         || ""),
      phone:         String(resume.phone         || ""),
      location:      String(resume.location      || ""),
      linkedin:      String(resume.linkedin      || ""),
      targetRole:    String(resume.targetRole    || ""),
      summary:       String(resume.summary       || ""),
      experience:    String(resume.experience    || ""),
      education:     String(resume.education     || ""),
      skills:        String(resume.skills        || ""),
      certifications:String(resume.certifications|| ""),
    };

    return res.json(safeResume);

  } catch (err) {
    console.error("Unhandled server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Tailor endpoint (PDF upload + job description) ──
app.post("/api/tailor", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    const { pdfBase64, jobDescription, template } = req.body;
    if (!pdfBase64)       return res.status(400).json({ error: "PDF is required." });
    if (!jobDescription?.trim()) return res.status(400).json({ error: "Job description is required." });

    const safeJob = sanitize(jobDescription, 2000);

    // ═══════════════════════════════════════════════════
    //  ✦ TAILOR PROMPT — Edit this to change how Claude
    //    rewrites an uploaded resume for a new job.
    // ═══════════════════════════════════════════════════
    const TAILOR_PROMPT = `You are an expert career coach and resume writer.

The user has uploaded their existing resume (provided as a PDF document) and wants to apply for a different role.

TARGET JOB DESCRIPTION:
${safeJob}

Your task:
1. Read the uploaded resume carefully — extract their real name, contact details, all work experience, education, and skills.
2. Rewrite the resume so it is tailored specifically for the target job above.
3. Reframe existing experience to highlight transferable skills relevant to the new role.
4. If the roles are very different (e.g. cybersecurity → café cashier), focus on universal transferable skills: reliability, attention to detail, working under pressure, following procedures, communication, teamwork.
5. Keep all facts true — do not invent experience. Reframe, not fabricate.
6. Use strong ATS-friendly action verbs. Keep bullets concise and impactful.
7. Write a fresh professional summary tailored to the target role.

Return ONLY a raw JSON object with no markdown, no preamble:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "linkedin": "...",
  "targetRole": "extracted or inferred target role title",
  "summary": "tailored 3-sentence professional summary",
  "experience": "reformatted experience with • bullets",
  "education": "formatted education",
  "skills": "relevant skills for the new role",
  "certifications": "..."
}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: TAILOR_PROMPT }
          ]
        }]
      }),
    });

    if (!anthropicRes.ok) {
      const e = await anthropicRes.json().catch(() => ({}));
      console.error("Anthropic error (tailor):", e);
      return res.status(502).json({ error: "AI service error — please try again." });
    }

    const aiData = await anthropicRes.json();
    const rawText = (aiData.content || []).map(b => b.text || "").join("");
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let resume;
    try { resume = JSON.parse(cleaned); }
    catch { return res.status(502).json({ error: "AI returned malformed data — please try again." }); }

    const safeResume = {
      name: String(resume.name || ""), email: String(resume.email || ""), phone: String(resume.phone || ""),
      location: String(resume.location || ""), linkedin: String(resume.linkedin || ""),
      targetRole: String(resume.targetRole || ""), summary: String(resume.summary || ""),
      experience: String(resume.experience || ""), education: String(resume.education || ""),
      skills: String(resume.skills || ""), certifications: String(resume.certifications || ""),
    };
    return res.json(safeResume);

  } catch (err) {
    console.error("Tailor error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── LinkedIn optimizer endpoint ──────────────
app.post("/api/linkedin", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    const { name, targetRole, headline, about, experience, skills } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Name is required." });

    const safe = {
      name:       sanitize(name, 120),
      targetRole: sanitize(targetRole || "", 200),
      headline:   sanitize(headline || "", 300),
      about:      sanitize(about || "", 2500),
      experience: sanitize(experience || "", 3000),
      skills:     sanitize(skills || "", 1000),
    };

    // ═══════════════════════════════════════════════════
    //  ✦ LINKEDIN PROMPT — Edit this to change how Claude
    //    analyses and scores LinkedIn profiles.
    // ═══════════════════════════════════════════════════
    const LINKEDIN_PROMPT = `You are a LinkedIn profile expert and personal branding coach with deep knowledge of recruiter behaviour and LinkedIn's search algorithm.

Analyse the following LinkedIn profile and provide specific, actionable optimisation suggestions.

NAME: ${safe.name}
TARGET ROLE / INDUSTRY: ${safe.targetRole}
CURRENT HEADLINE: ${safe.headline}
ABOUT SECTION: ${safe.about}
EXPERIENCE: ${safe.experience}
SKILLS: ${safe.skills}

Provide a thorough analysis covering:
1. Headline effectiveness (keyword-rich, role-clear, compelling?)
2. About section (engaging opening, keywords, call to action?)
3. Experience descriptions (results-focused, action verbs, quantified?)
4. Skills section (relevant, complete, endorsed-worthy?)
5. Overall profile completeness and recruiter appeal

Return ONLY a raw JSON object with no markdown, no preamble:
{
  "overallScore": 72,
  "headline": "A better suggested headline",
  "summary": "A rewritten About section (2-3 paragraphs)",
  "suggestions": [
    {
      "section": "Headline",
      "priority": "high",
      "issue": "Brief description of what is wrong or missing",
      "suggestion": "Specific actionable fix with example wording"
    },
    {
      "section": "About",
      "priority": "high",
      "issue": "...",
      "suggestion": "..."
    },
    {
      "section": "Experience",
      "priority": "medium",
      "issue": "...",
      "suggestion": "..."
    },
    {
      "section": "Skills",
      "priority": "low",
      "issue": "...",
      "suggestion": "..."
    }
  ]
}

Priority must be exactly one of: "high", "medium", "low".
Provide 4-6 suggestions total. Be specific — generic advice is not helpful.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: LINKEDIN_PROMPT }],
      }),
    });

    if (!anthropicRes.ok) {
      const e = await anthropicRes.json().catch(() => ({}));
      console.error("Anthropic error (linkedin):", e);
      return res.status(502).json({ error: "AI service error — please try again." });
    }

    const aiData = await anthropicRes.json();
    const rawText = (aiData.content || []).map(b => b.text || "").join("");
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let report;
    try { report = JSON.parse(cleaned); }
    catch { return res.status(502).json({ error: "AI returned malformed data — please try again." }); }

    return res.json({
      overallScore: Math.min(100, Math.max(0, Number(report.overallScore) || 50)),
      headline:     String(report.headline || ""),
      summary:      String(report.summary || ""),
      suggestions:  (report.suggestions || []).slice(0, 8).map(s => ({
        section:    String(s.section || ""),
        priority:   ["high","medium","low"].includes(s.priority) ? s.priority : "medium",
        issue:      String(s.issue || ""),
        suggestion: String(s.suggestion || ""),
      })),
    });

  } catch (err) {
    console.error("LinkedIn error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Job recommendations endpoint ─────────────
app.post("/api/jobs", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    const role     = sanitize(req.body.role || "", 200);
    const skills   = (req.body.skills || []).slice(0, 8).map(s => sanitize(s, 60));
    const location = sanitize(req.body.location || "", 120);

    if (!role) return res.status(400).json({ error: "Role is required." });

    // ═══════════════════════════════════════════════════
    //  ✦ JOB RECOMMENDATIONS PROMPT — Edit this to change
    //    how Claude suggests roles and search strategies.
    // ═══════════════════════════════════════════════════
    const JOBS_PROMPT = `You are a career advisor helping someone find jobs after creating their resume.

Their target role: ${role}
Their skills: ${skills.join(", ")}
Their location: ${location || "not specified"}

Suggest 4 specific job titles they should search for. These should include:
- 1 exact match for their target role
- 1 slightly more senior version
- 1 adjacent role that uses similar skills
- 1 creative alternative they may not have considered

Return ONLY a raw JSON object, no markdown:
{
  "suggestions": [
    {
      "title": "Exact job title to search",
      "match": 95,
      "reason": "One sentence explaining why this is a good fit",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ]
}

Match is a percentage 0-100 of how well this fits their profile. Keep reasons concise and specific.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "x-api-key":ANTHROPIC_API_KEY, "anthropic-version":"2023-06-01" },
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, messages:[{ role:"user", content:JOBS_PROMPT }] }),
    });

    if (!anthropicRes.ok) return res.status(502).json({ error: "AI service error." });

    const aiData  = await anthropicRes.json();
    const rawText = (aiData.content||[]).map(b=>b.text||"").join("");
    const cleaned = rawText.replace(/```json|```/g,"").trim();

    let data;
    try { data = JSON.parse(cleaned); } catch { return res.status(502).json({ error:"Malformed response." }); }

    return res.json({
      suggestions: (data.suggestions||[]).slice(0,4).map(j=>({
        title:  String(j.title||""),
        match:  Math.min(100, Math.max(0, Number(j.match)||80)),
        reason: String(j.reason||""),
        skills: (j.skills||[]).slice(0,4).map(s=>String(s)),
      }))
    });

  } catch(err) {
    console.error("Jobs error:", err);
    return res.status(500).json({ error:"Internal server error." });
  }
});

// ─── Apply Mode endpoint ───────────────────────
app.post("/api/apply", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    const { jobUrl, jobText, pdfBase64, template } = req.body;
    if (!pdfBase64) return res.status(400).json({ error:"Resume PDF is required." });
    if (!jobUrl?.trim() && !jobText?.trim()) return res.status(400).json({ error:"Job URL or description is required." });

    const safeUrl  = sanitize(jobUrl  || "", 500);
    const safeText = sanitize(jobText || "", 5000);

    // Fetch job URL content if provided
    let fetchedJobContent = "";
    if (safeUrl) {
      try {
        const r = await fetch(safeUrl, { headers:{ "User-Agent":"Mozilla/5.0" }, signal:AbortSignal.timeout(8000) });
        if (r.ok) {
          const html = await r.text();
          // Strip HTML tags, collapse whitespace
          fetchedJobContent = html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,6000);
        }
      } catch(e) { console.log("URL fetch failed, continuing with text only"); }
    }

    const jobContent = [fetchedJobContent, safeText].filter(Boolean).join("\n\n").trim();

    // ═══════════════════════════════════════════════════
    //  ✦ APPLY MODE PROMPT — Edit this to change how
    //    Claude generates the full apply package.
    // ═══════════════════════════════════════════════════
    const APPLY_PROMPT = `You are an elite career coach, resume writer, and interview strategist. You are helping a job seeker apply for a specific role.

JOB POSTING:
${jobContent}

Your tasks — using the candidate's resume (provided as a PDF) and the job posting above:

1. TAILORED RESUME: Rewrite their resume specifically for this job. Mirror the job's language, emphasise matching experience, reorder bullet points by relevance. Keep facts true.

2. COVER LETTER: Write a compelling, human-sounding cover letter (3 short paragraphs). Opening: hook with genuine enthusiasm and a specific thing about the company. Middle: connect 2-3 of their strongest achievements directly to the role's key requirements. Close: confident call to action. Tone should match the company culture inferred from the posting. No generic fluff.

3. INTERVIEW PREP: Generate the 6 most likely interview questions for this specific role and company. For each, give specific guidance on how to answer based on the candidate's actual background.

4. FIT ANALYSIS: Score how well their background matches this job (0-100) and identify any missing keywords.

Return ONLY a raw JSON object, no markdown:
{
  "jobTitle": "exact job title from posting",
  "company": "company name from posting",
  "fitScore": 78,
  "missingKeywords": ["keyword1", "keyword2"],
  "resume": {
    "name": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "...",
    "targetRole": "...", "summary": "...", "experience": "...", "education": "...",
    "skills": "...", "certifications": "..."
  },
  "coverLetter": "Full cover letter text with line breaks. Include date and sign-off.",
  "interviewPrep": [
    {
      "question": "Tell me about yourself.",
      "guidance": "Specific 2-3 sentence guidance on how this candidate should answer based on their background and this role.",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  ]
}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type":"application/json", "x-api-key":ANTHROPIC_API_KEY, "anthropic-version":"2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: [
            { type:"document", source:{ type:"base64", media_type:"application/pdf", data:pdfBase64 } },
            { type:"text", text:APPLY_PROMPT }
          ]
        }]
      }),
    });

    if (!anthropicRes.ok) {
      const e = await anthropicRes.json().catch(()=>({}));
      console.error("Anthropic error (apply):", e);
      return res.status(502).json({ error:"AI service error — please try again." });
    }

    const aiData  = await anthropicRes.json();
    const rawText = (aiData.content||[]).map(b=>b.text||"").join("");
    const cleaned = rawText.replace(/```json|```/g,"").trim();

    let data;
    try { data = JSON.parse(cleaned); }
    catch { return res.status(502).json({ error:"AI returned malformed data — please try again." }); }

    // Sanitise and return
    return res.json({
      jobTitle:        String(data.jobTitle        || ""),
      company:         String(data.company         || ""),
      fitScore:        Math.min(100, Math.max(0, Number(data.fitScore) || 70)),
      missingKeywords: (data.missingKeywords||[]).slice(0,8).map(k=>String(k)),
      coverLetter:     String(data.coverLetter     || ""),
      resume: {
        name:           String(data.resume?.name           || ""),
        email:          String(data.resume?.email          || ""),
        phone:          String(data.resume?.phone          || ""),
        location:       String(data.resume?.location       || ""),
        linkedin:       String(data.resume?.linkedin       || ""),
        targetRole:     String(data.resume?.targetRole     || ""),
        summary:        String(data.resume?.summary        || ""),
        experience:     String(data.resume?.experience     || ""),
        education:      String(data.resume?.education      || ""),
        skills:         String(data.resume?.skills         || ""),
        certifications: String(data.resume?.certifications || ""),
      },
      interviewPrep: (data.interviewPrep||[]).slice(0,8).map(q=>({
        question:  String(q.question  || ""),
        guidance:  String(q.guidance  || ""),
        keyPoints: (q.keyPoints||[]).slice(0,4).map(k=>String(k)),
      })),
    });

  } catch(err) {
    console.error("Apply Mode error:", err);
    return res.status(500).json({ error:"Internal server error." });
  }
});

// ─── LinkedIn profile import endpoint ─────────
// Accepts a LinkedIn profile URL, fetches the public page, extracts text,
// and asks Claude to parse it into structured form fields.
app.post("/api/linkedin-import", limiter, requireAuth, requirePaid, async (req, res) => {
  try {
    const url = sanitize(req.body.url || "", 300);
    if (!url || !url.includes("linkedin.com/in/")) {
      return res.status(400).json({ error: "Please provide a valid LinkedIn profile URL (linkedin.com/in/...)." });
    }

    // Fetch the public LinkedIn page
    let pageText = "";
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) {
        const html = await r.text();
        pageText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
      }
    } catch(e) {
      console.log("LinkedIn fetch failed:", e.message);
    }

    if (!pageText || pageText.length < 100) {
      return res.status(422).json({
        error: "Couldn't read that LinkedIn page — it may be private or blocked. Try pasting your profile text manually instead."
      });
    }

    const IMPORT_PROMPT = `You are a resume data extractor. Extract structured information from this LinkedIn profile page text.

PAGE TEXT:
${pageText}

Extract whatever you can find. Return ONLY a raw JSON object, no markdown:
{
  "name": "Full name",
  "targetRole": "Most recent job title or target role",
  "headline": "LinkedIn headline if present",
  "about": "About/summary section text",
  "experience": "All work experience formatted as: Role at Company (Start–End)\\n– bullet\\n– bullet\\n\\nRole at Company...",
  "skills": "comma-separated list of skills",
  "education": "Degree, Field, School (Year)"
}
If a field is not found, return an empty string for it.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: IMPORT_PROMPT }],
      }),
    });

    if (!anthropicRes.ok) return res.status(502).json({ error: "AI service error — please try again." });

    const aiData  = await anthropicRes.json();
    const rawText = (aiData.content || []).map(b => b.text || "").join("");
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let data;
    try { data = JSON.parse(cleaned); }
    catch { return res.status(502).json({ error: "Couldn't parse profile data — try pasting manually." }); }

    return res.json({
      name:       String(data.name       || ""),
      targetRole: String(data.targetRole || ""),
      headline:   String(data.headline   || ""),
      about:      String(data.about      || ""),
      experience: String(data.experience || ""),
      skills:     String(data.skills     || ""),
      education:  String(data.education  || ""),
    });

  } catch(err) {
    console.error("LinkedIn import error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Health check ─────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({
  status: "ok",
  env:    process.env.NODE_ENV || "development",
  time:   new Date().toISOString(),
}));

// ─── 404 handler ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Not found." }));

// ─── Global error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`\n✦  Crafted Resume backend running`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   CORS origin: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log(`   Logging:     ${IS_PROD ? "file (logs/access.log)" : "console"}\n`);
});
