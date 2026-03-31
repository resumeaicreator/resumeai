"use strict";
/**
 * ResuméAI — Auth + Payments Module (auth.js)
 * Drop this file next to server.js
 */

const express        = require("express");
const bcrypt         = require("bcrypt");
const jwt            = require("jsonwebtoken");
const crypto         = require("crypto");
const passport       = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Pool }       = require("pg");
const Stripe         = require("stripe");
const rateLimit      = require("express-rate-limit");

const router   = require("express").Router();

// ─── Email via Resend API ────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] Email skipped (no RESEND_API_KEY): ${subject} → ${to}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Crafted Resume <noreply@craftedresume.io>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Resend error:", err);
    throw new Error(`Email failed: ${err.message || res.status}`);
  }
}

const REQUIRED = [
  "JWT_SECRET","JWT_REFRESH_SECRET","DATABASE_URL",
  "GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY","STRIPE_PRICE_ID","STRIPE_WEBHOOK_SECRET",
  "FRONTEND_URL",
];
for (const k of REQUIRED) {
  if (!process.env[k]) { console.error(`Missing env var: ${k}`); process.exit(1); }
}

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function initDB() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      google_id TEXT UNIQUE,
      name TEXT,
      stripe_customer_id TEXT UNIQUE,
      subscription_status TEXT NOT NULL DEFAULT 'inactive',
      subscription_end TIMESTAMPTZ,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      verify_token TEXT,
      verify_token_exp TIMESTAMPTZ,
      reset_token TEXT,
      reset_token_exp TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_rt_user    ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_usr_email  ON users(email);
    CREATE INDEX IF NOT EXISTS idx_usr_google ON users(google_id);
    CREATE INDEX IF NOT EXISTS idx_usr_stripe ON users(stripe_customer_id);

    -- Add columns to existing tables if upgrading from older version
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_token TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_token_exp TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_exp TIMESTAMPTZ;
  `);
  console.log("DB schema ready");
}
initDB().catch(e => { console.error("DB init failed:", e); process.exit(1); });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
const IS_PROD = process.env.NODE_ENV === "production";

function signAccess(id)  { return jwt.sign({ sub: id, type: "access"  }, process.env.JWT_SECRET,         { expiresIn: "15m" }); }
function signRefresh(id) { return jwt.sign({ sub: id, type: "refresh" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" }); }
function hashToken(t)    { return crypto.createHash("sha256").update(t).digest("hex"); }

function setAuthCookies(res, access, refresh) {
  res.cookie("access_token",  access,  { httpOnly:true, sameSite:"strict", secure:IS_PROD, maxAge: 15*60*1000 });
  res.cookie("refresh_token", refresh, { httpOnly:true, sameSite:"strict", secure:IS_PROD, path:"/api/auth/refresh", maxAge: 30*24*60*60*1000 });
}
function clearAuthCookies(res) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token", { path:"/api/auth/refresh" });
}

async function storeRefreshToken(userId, token) {
  const expires = new Date(Date.now() + 30*24*60*60*1000);
  await db.query("INSERT INTO refresh_tokens (user_id,token_hash,expires_at) VALUES ($1,$2,$3)", [userId, hashToken(token), expires]);
}

async function rotateRefreshToken(userId, oldToken, newToken) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const del = await client.query(
      "DELETE FROM refresh_tokens WHERE user_id=$1 AND token_hash=$2 AND expires_at > NOW() RETURNING id",
      [userId, hashToken(oldToken)]
    );
    if (del.rowCount === 0) {
      await client.query("DELETE FROM refresh_tokens WHERE user_id=$1", [userId]);
      await client.query("ROLLBACK");
      return false;
    }
    const expires = new Date(Date.now() + 30*24*60*60*1000);
    await client.query("INSERT INTO refresh_tokens (user_id,token_hash,expires_at) VALUES ($1,$2,$3)", [userId, hashToken(newToken), expires]);
    await client.query("COMMIT");
    return true;
  } catch(e) { await client.query("ROLLBACK"); throw e; }
  finally { client.release(); }
}

async function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Authentication required." });
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET);
    if (p.type !== "access") throw new Error();
    req.userId = p.sub;
    next();
  } catch { return res.status(401).json({ error: "Session expired. Please log in again." }); }
}

async function requirePaid(req, res, next) {
  try {
    const { rows } = await db.query("SELECT subscription_status, email FROM users WHERE id=$1", [req.userId]);
    if (!rows.length) return res.status(401).json({ error: "User not found." });

    // ── Admin bypass ──────────────────────────────────────────────
    const ADMIN_EMAILS = ["rockyshores99@gmail.com"];
    if (ADMIN_EMAILS.includes(rows[0].email)) return next();
    // ─────────────────────────────────────────────────────────────

    if (rows[0].subscription_status !== "active") {
      return res.status(402).json({ error: "Active subscription required.", code: "SUBSCRIPTION_REQUIRED" });
    }
    next();
  } catch(e) { return res.status(500).json({ error: "Internal server error." }); }
}

const loginLimiter    = rateLimit({ windowMs:15*60*1000, max:10, standardHeaders:true, legacyHeaders:false, message:{ error:"Too many login attempts." } });
const registerLimiter = rateLimit({ windowMs:60*60*1000, max:5,  standardHeaders:true, legacyHeaders:false, message:{ error:"Too many registrations." } });

const validEmail = e => typeof e==="string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length<254;
const validPw    = p => typeof p==="string" && p.length>=8 && p.length<=128;
const safeName   = n => typeof n==="string" ? n.trim().slice(0,120) : "";

// REGISTER
router.post("/register", registerLimiter, async (req, res) => {
  const { email, password, name } = req.body;
  if (!validEmail(email)) return res.status(400).json({ error: "Valid email required." });
  if (!validPw(password)) return res.status(400).json({ error: "Password must be 8-128 characters." });
  try {
    if ((await db.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()])).rowCount > 0)
      return res.status(409).json({ error: "An account with this email already exists." });
    const hash     = await bcrypt.hash(password, 12);
    const dispName = safeName(name) || email.split("@")[0];
    const customer = await stripe.customers.create({ email: email.toLowerCase(), name: dispName });
    const { rows } = await db.query(
      "INSERT INTO users (email,password_hash,name,stripe_customer_id) VALUES ($1,$2,$3,$4) RETURNING id",
      [email.toLowerCase(), hash, dispName, customer.id]
    );
    const userId = rows[0].id;
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExp   = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await db.query("UPDATE users SET verify_token=$1, verify_token_exp=$2 WHERE id=$3", [verifyToken, verifyExp, userId]);

    const verifyUrl = `${process.env.FRONTEND_URL}/?verify=${verifyToken}`;
    await sendMail({
      to: email.toLowerCase(),
      subject: "Verify your Crafted Resume email",
      html: `<p>Hi ${dispName},</p><p>Click below to verify your email:</p><a href="${verifyUrl}" style="background:#c9a84c;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Verify Email</a><p>This link expires in 24 hours.</p><p>If you didn't create this account, ignore this email.</p>`
    });

    const access = signAccess(userId), refresh = signRefresh(userId);
    await storeRefreshToken(userId, refresh);
    setAuthCookies(res, access, refresh);
    return res.status(201).json({ user: { id:userId, email:email.toLowerCase(), name:dispName, subscriptionStatus:"inactive", emailVerified:false } });
  } catch(e) { console.error("Register error:", e); return res.status(500).json({ error: "Registration failed." }); }
});

// VERIFY EMAIL
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect(`${process.env.FRONTEND_URL}/?error=invalid_token`);
  try {
    const { rows } = await db.query(
      "UPDATE users SET email_verified=TRUE, verify_token=NULL, verify_token_exp=NULL WHERE verify_token=$1 AND verify_token_exp > NOW() RETURNING id",
      [token]
    );
    if (!rows.length) return res.redirect(`${process.env.FRONTEND_URL}/?error=token_expired`);
    res.redirect(`${process.env.FRONTEND_URL}/?verified=true`);
  } catch(e) {
    console.error("Verify email error:", e);
    res.redirect(`${process.env.FRONTEND_URL}/?error=server`);
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!validEmail(email)) return res.status(400).json({ error: "Valid email required." });
  try {
    const { rows } = await db.query("SELECT id, name FROM users WHERE email=$1", [email.toLowerCase()]);
    // Always return success to prevent email enumeration
    if (rows.length) {
      const token  = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await db.query("UPDATE users SET reset_token=$1, reset_token_exp=$2 WHERE id=$3", [token, expiry, rows[0].id]);
      const resetUrl = `${process.env.FRONTEND_URL}/?token=${token}`;
      await sendMail({
        to: email.toLowerCase(),
        subject: "Reset your Crafted Resume password",
        html: `<p>Hi ${rows[0].name},</p><p>Click below to reset your password:</p><a href="${resetUrl}" style="background:#c9a84c;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Reset Password</a><p>This link expires in 1 hour.</p><p>If you didn't request this, ignore this email.</p>`
      });
    }
    return res.json({ ok: true, message: "If that email exists, a reset link has been sent." });
  } catch(e) {
    console.error("Forgot password error:", e);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token)          return res.status(400).json({ error: "Token is required." });
  if (!validPw(password)) return res.status(400).json({ error: "Password must be 8-128 characters." });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_exp=NULL WHERE reset_token=$2 AND reset_token_exp > NOW() RETURNING id",
      [hash, token]
    );
    if (!rows.length) return res.status(400).json({ error: "Reset link is invalid or has expired." });
    // Invalidate all existing sessions on password reset
    await db.query("DELETE FROM refresh_tokens WHERE user_id=$1", [rows[0].id]);
    return res.json({ ok: true });
  } catch(e) {
    console.error("Reset password error:", e);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!validEmail(email) || !password) return res.status(400).json({ error: "Email and password required." });
  try {
    const { rows } = await db.query("SELECT id,password_hash,name,subscription_status FROM users WHERE email=$1", [email.toLowerCase()]);
    const dummyHash = "$2b$12$invalidhashfortimingattackprevention0000000000000000000";
    const valid = await bcrypt.compare(password, rows[0]?.password_hash || dummyHash);
    if (!rows.length || !valid || !rows[0].password_hash) return res.status(401).json({ error: "Invalid email or password." });
    const u = rows[0];
    const access = signAccess(u.id), refresh = signRefresh(u.id);
    await storeRefreshToken(u.id, refresh);
    setAuthCookies(res, access, refresh);
    return res.json({ user: { id:u.id, email:email.toLowerCase(), name:u.name, subscriptionStatus:u.subscription_status } });
  } catch(e) { console.error("Login error:", e); return res.status(500).json({ error: "Login failed." }); }
});

// REFRESH
router.post("/refresh", async (req, res) => {
  const old = req.cookies?.refresh_token;
  if (!old) return res.status(401).json({ error: "No refresh token." });
  try {
    const p = jwt.verify(old, process.env.JWT_REFRESH_SECRET);
    if (p.type !== "refresh") throw new Error();
    const newAccess = signAccess(p.sub), newRefresh = signRefresh(p.sub);
    if (!(await rotateRefreshToken(p.sub, old, newRefresh))) {
      clearAuthCookies(res);
      return res.status(401).json({ error: "Session invalidated. Please log in again." });
    }
    setAuthCookies(res, newAccess, newRefresh);
    return res.json({ ok: true });
  } catch { clearAuthCookies(res); return res.status(401).json({ error: "Invalid session." }); }
});

// LOGOUT
router.post("/logout", requireAuth, async (req, res) => {
  try {
    await db.query("DELETE FROM refresh_tokens WHERE user_id=$1", [req.userId]);
    clearAuthCookies(res);
    return res.json({ ok: true });
  } catch { return res.status(500).json({ error: "Logout failed." }); }
});

// GET ME
router.get("/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query("SELECT id,email,name,subscription_status,subscription_end FROM users WHERE id=$1", [req.userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    const u = rows[0];
    return res.json({ user: { id:u.id, email:u.email, name:u.name, subscriptionStatus:u.subscription_status, subscriptionEnd:u.subscription_end } });
  } catch { return res.status(500).json({ error: "Internal server error." }); }
});

// GOOGLE OAUTH
passport.use(new GoogleStrategy(
  { clientID:process.env.GOOGLE_CLIENT_ID, clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:`${process.env.BACKEND_URL||"http://localhost:3001"}/api/auth/google/callback` },
  async (at, rt, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      const name  = profile.displayName || email?.split("@")[0] || "User";
      if (!email) return done(new Error("No email from Google"));
      let user = (await db.query("SELECT * FROM users WHERE google_id=$1", [profile.id])).rows[0];
      if (!user) {
        user = (await db.query("SELECT * FROM users WHERE email=$1", [email])).rows[0];
        if (user) {
          await db.query("UPDATE users SET google_id=$1 WHERE id=$2", [profile.id, user.id]);
        } else {
          const c = await stripe.customers.create({ email, name });
          user = (await db.query("INSERT INTO users (email,google_id,name,stripe_customer_id) VALUES ($1,$2,$3,$4) RETURNING *", [email, profile.id, name, c.id])).rows[0];
        }
      }
      return done(null, user);
    } catch(e) { return done(e); }
  }
));

router.get("/google", passport.authenticate("google", { scope:["profile","email"], session:false }));
router.get("/google/callback",
  passport.authenticate("google", { session:false, failureRedirect:`${process.env.FRONTEND_URL}/?error=google_failed` }),
  async (req, res) => {
    try {
      const u       = req.user;
      const access  = signAccess(u.id);
      const refresh = signRefresh(u.id);
      await storeRefreshToken(u.id, refresh);

      // Cookies can't cross domains (onrender.com → craftedresume.io)
      // so pass tokens as short-lived URL params — frontend exchanges them for cookies
      const dest = u.subscription_status === "active" ? "/" : "/subscribe";
      const params = new URLSearchParams({
        _at: access,
        _rt: refresh,
        _dest: dest,
      });
      res.redirect(`${process.env.FRONTEND_URL}/?${params.toString()}`);
    } catch(e) {
      console.error("Google callback error:", e);
      res.redirect(`${process.env.FRONTEND_URL}/?error=server`);
    }
  }
);

// TOKEN EXCHANGE — used after Google OAuth cross-domain redirect
// Frontend posts the tokens it got from URL params, backend sets them as httpOnly cookies
router.post("/exchange", async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  if (!accessToken || !refreshToken) return res.status(400).json({ error: "Tokens required." });
  try {
    // Verify both tokens are valid before setting cookies
    const ap = jwt.verify(accessToken,  process.env.JWT_SECRET);
    const rp = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (ap.type !== "access" || rp.type !== "refresh") throw new Error("Invalid token type");
    if (ap.sub !== rp.sub) throw new Error("Token mismatch");

    // Confirm user exists
    const { rows } = await db.query(
      "SELECT id, email, name, subscription_status FROM users WHERE id=$1", [ap.sub]
    );
    if (!rows.length) return res.status(401).json({ error: "User not found." });

    setAuthCookies(res, accessToken, refreshToken);
    const u = rows[0];
    return res.json({
      user: { id:u.id, email:u.email, name:u.name, subscriptionStatus:u.subscription_status }
    });
  } catch(e) {
    console.error("Exchange error:", e.message);
    return res.status(401).json({ error: "Invalid tokens." });
  }
});

// STRIPE CHECKOUT
router.post("/billing/checkout", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query("SELECT stripe_customer_id,subscription_status FROM users WHERE id=$1", [req.userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    if (rows[0].subscription_status === "active") return res.status(400).json({ error: "Already subscribed." });
    const session = await stripe.checkout.sessions.create({
      customer: rows[0].stripe_customer_id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/?subscribed=true`,
      cancel_url:  `${process.env.FRONTEND_URL}/subscribe`,
      allow_promotion_codes: true,
    });
    return res.json({ url: session.url });
  } catch(e) { console.error("Checkout error:", e); return res.status(500).json({ error: "Could not create checkout session." }); }
});

// STRIPE BILLING PORTAL
router.post("/billing/portal", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query("SELECT stripe_customer_id FROM users WHERE id=$1", [req.userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    const session = await stripe.billingPortal.sessions.create({ customer: rows[0].stripe_customer_id, return_url:`${process.env.FRONTEND_URL}/account` });
    return res.json({ url: session.url });
  } catch(e) { return res.status(500).json({ error: "Could not open billing portal." }); }
});

// STRIPE WEBHOOK — raw body required, mount before express.json()
async function handleStripeWebhook(req, res) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch(e) { return res.status(400).send(`Webhook Error: ${e.message}`); }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        if (event.data.object.mode !== "subscription") break;
        const sub = await stripe.subscriptions.retrieve(event.data.object.subscription);
        await db.query("UPDATE users SET subscription_status='active',subscription_end=$1 WHERE stripe_customer_id=$2",
          [new Date(sub.current_period_end*1000), event.data.object.customer]);
        break;
      }
      case "invoice.paid": {
        const subs = await stripe.subscriptions.list({ customer:event.data.object.customer, limit:1 });
        if (subs.data[0]) await db.query("UPDATE users SET subscription_status='active',subscription_end=$1 WHERE stripe_customer_id=$2",
          [new Date(subs.data[0].current_period_end*1000), event.data.object.customer]);
        break;
      }
      case "invoice.payment_failed":
        await db.query("UPDATE users SET subscription_status='past_due' WHERE stripe_customer_id=$1", [event.data.object.customer]);
        break;
      case "customer.subscription.deleted":
        await db.query("UPDATE users SET subscription_status='inactive',subscription_end=NOW() WHERE stripe_customer_id=$1", [event.data.object.customer]);
        break;
      case "customer.subscription.updated": {
        const s = event.data.object;
        const status = s.status==="active"?"active":s.status==="past_due"?"past_due":"inactive";
        await db.query("UPDATE users SET subscription_status=$1,subscription_end=$2 WHERE stripe_customer_id=$3",
          [status, new Date(s.current_period_end*1000), s.customer]);
        break;
      }
    }
  } catch(e) { console.error("Webhook handler error:", e); }
  return res.json({ received: true });
}

module.exports = { router, requireAuth, requirePaid, handleStripeWebhook };
