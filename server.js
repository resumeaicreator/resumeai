/**
 * ═══════════════════════════════════════════════════════════════════
 *  ResuméAI — Secure Backend  (Node.js + Express)
 *  File: server.js
 *
 *  SETUP:
 *    1. npm install express cors helmet express-rate-limit dotenv
 *    2. Create a .env file (see .env.example below)
 *    3. node server.js   (or: npx nodemon server.js for dev)
 * ═══════════════════════════════════════════════════════════════════
 */

require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");

const app  = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────
//  ✦ YOUR API KEY — set in .env, NEVER hardcode
//    ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
// ─────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY is not set in .env — server cannot start.\n");
  process.exit(1);
}

// ═══════════════════════════════════════════
//  ✦ YOUR RESUME PROMPT — edit this section
//    to control how Claude writes resumes.
//    The {PLACEHOLDERS} are filled at runtime
//    from the user's form data.
// ═══════════════════════════════════════════
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

// ─── Security middleware ─────────────────────
app.use(helmet());                    // Sets secure HTTP headers
app.use(express.json({ limit: "16kb" }));  // Body size limit

// CORS — restrict to your frontend domain in production
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],   // Note: NO x-api-key header here — key lives in .env
}));

// Rate limiting — prevents abuse / runaway API costs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // max 10 resume generations per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please wait 15 minutes before trying again." },
});

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
app.post("/api/generate", limiter, async (req, res) => {
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
app.post("/api/tailor", limiter, async (req, res) => {
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
app.post("/api/linkedin", limiter, async (req, res) => {
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

// ─── Health check ─────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Frontend is hosted separately on Netlify — no static files needed here

app.listen(PORT, () => {
  console.log(`\n✦  ResuméAI backend running on http://localhost:${PORT}`);
  console.log(`   API key loaded: ${ANTHROPIC_API_KEY.slice(0,18)}…`);
  console.log(`   CORS origin:    ${process.env.FRONTEND_URL || "http://localhost:3000"}\n`);
});
