ReelWork — Developer Build Specification (MVP)

Project Overview
ReelWork is a video-based hiring platform for the hospitality industry. Venues (employers) browse short candidate videos to quickly identify energy, communication, and role fit.
Goal: Launch a fast, mobile-first web app (PWA) MVP with a TikTok-style feed, simple onboarding, and Stripe-based employer subscriptions.
Phase: Web PWA only (native iOS/Android planned post-MVP).
Core Tech Stack
• Frontend — React (Next.js): PWA installable; mobile-first; virtualized vertical video feed
• Backend — Supabase: Auth (OTP), Postgres DB, Row-Level Security (RLS), edge functions
• Video — Cloudflare Stream: Upload → transcode → adaptive HLS → CDN edge delivery
• Payments — Stripe: Subscriptions + one-off unlocks, webhooks
• Deployment — Vercel / Cloudflare Pages: CI/CD from GitHub, preview builds
• Analytics — PostHog or Mixpanel: Lightweight event funnels
• Email — Postmark (or SendGrid): Transactional + verified domain (SPF/DKIM/DMARC)
• Error Monitoring — Sentry: Frontend + workers
• Logs — Logflare / Supabase Logs: Correlated request/job logging
Performance Requirements (Non-Negotiable)
Video Feed & Playback
• First frame ≤ 500 ms on 4G; PWA load < 2 s (LCP).
• Adaptive HLS (360–1080p bitrate ladder, 2 s keyframes), HTTP/3 + QUIC via Cloudflare.
• Virtualized list: only 3–5 <video> elements mounted at any time.
• Preload next 1–2 HLS segments only; auto-pause off-screen videos (IntersectionObserver).
• iOS: playsInline + muted for autoplay; snap scroll (one card per swipe).
• Release off-screen buffers immediately; requestAnimationFrame for animation.
Backend / Data
• Employer feed query supports role, experience, distance, availability filters.
• Stripe webhooks update subscription status idempotently.
• All endpoints: P95 latency ≤ 300 ms (API edge) under normal load.
AI Video Moderation — MVP
Purpose: Auto-screen each candidate video for safety/appropriateness before it’s visible in feed.
Flow
• Upload & Encode: Candidate uploads to Cloudflare Stream → Stream webhook → POST /api/webhooks/stream.
• AI Checks (Hybrid): Frame Scan (1 frame/2 s with NSFW classifier; flag if any frame > 0.85). Audio Check (Whisper-small transcription; scan profanity/hate list).
• Decision: Live (no flags) | Pending Review (low-confidence single flag) | Rejected (multiple or high-confidence flags).
• Persist JSON per video: nsfw_score, profanity, status, checkedAt.
• Admin UI: filter by status; show flagged frame + transcript snippet; Approve / Reject / Request changes.
• Targets: Decision within 5–15 s for 30–45 s clips. Acceptance: No video appears until status='live'; audit log stored.
Video Enhancement (MVP)
Intent: Subtle, authentic improvements to lighting/clarity — no face morphing or makeup effects.
Client Recording Constraints
• Aspect 9:16; cap 720×1280 (accept 1080p, downscale to 720p for feed).
• 30 fps; target output 2.5–3.5 Mbps H.264 + AAC 96–128 kbps; max duration 45 s (hard stop 60 s).
• Recorder tips: Face a window, hold phone vertical, arm’s length, smile 😊; show live audio meter.
Server Pipeline
• Normalize: 720p, 30 fps, yuv420p, keyint ≈ 60.
• Auto-enhance: micro exposure/contrast/saturation lift; mild denoise; slight unsharp (no halos).
• Brand LUT: neutral daylight; warm +200–300 K feel; +8% saturation (skin clamp), preserve highlights.
• Audio polish: −16 LUFS loudness, peak −1 dBTP; high-pass @ 80 Hz; gentle 3:1 compression; optional light denoise.
• Optional captions: ASR → VTT; editable by candidate.
FFmpeg Reference
ffmpeg -y -i in.mp4 \
 -vf "scale=720:-2:flags=lanczos,fps=30,format=yuv420p,\
 eq=brightness=0.03:contrast=1.05:saturation=1.08:gamma=0.98,\
 hqdn3d=1.5:1.5:6:6,\
 unsharp=3:3:0.3:3:3:0.0" \
 -af "highpass=f=80,compand=attacks=0:decays=0.2:points=-60/-60|-40/-40|-20/-18|-10/-12|0/-6,alimiter=limit=-1.0dB" \
 -c:v libx264 -profile:v high -level 4.1 -preset veryfast -crf 21 -pix_fmt yuv420p \
 -c:a aac -b:a 128k -movflags +faststart out.mp4
UX
• Default Auto-enhance: ON; copy: “Improves lighting and clarity — no face filters.” Keep original; allow Re-record/Replace.
Edge Handling
• Enhancement > 60 s → publish original and retry async; toast for quiet/missing audio prior to submit.
Emails & Data Collection
• Store email, phone, account_type, and consent flags in Supabase.
• Email via Postmark (verified domain with SPF/DKIM/DMARC).
• Transactional: signup verification, video approved, unlock notifications, receipts.
• Marketing sync: Supabase → Klaviyo; admin CSV export by segment (verified/consent/role).
• Optional audit table for email sends/exports.
• Acceptance: verified flow works; inbox deliverability; one-click unsubscribe on marketing.
Candidate Email Requirement
• Email is required for all candidates (verification, notifications, unlock approvals, recovery).
Flow
• Enter email → send verification email (Postmark).
• User can continue to profile/video while email_verification_status = pending (optional).
• Before profile becomes Live (visible to employers), is_email_verified must be true.
DB Updates
• users: email (text, not null), is_email_verified (bool, default false), email_verified_at (timestamptz null). Unique index on lower(email).
Acceptance
• Email validated (format + disposable domains blocked).
• Verification arrives within 60 s; “Resend” with 60 s cooldown.
• Profiles cannot be Live unless verified.
Analytics (Phase 1)
• Candidate events: signup_started, signup_completed, video_uploaded, video_submitted, video_played.
• Employer events: signup_started, signup_completed, video_play_started, unlock_initiated, unlock_completed.
• Payments: checkout_started, checkout_completed, checkout_failed.
• Include UTM on acquisition; use lightweight SDK (PostHog/Mixpanel).
Security / Ownership
• All services under Nick’s orgs: GitHub (private), Supabase, Stripe, Cloudflare. Devs as collaborators only.
• Enforce 2FA on all vendor accounts; rotate API keys quarterly.
MVP Scope Summary
Candidate
• OTP login → profile (suburb, roles, experience, availability).
• Record/upload 30–45 s video.
• Status: Pending / Live / Needs changes. Profile view; empty/error states.
Employer
• Email/Google sign-in → business setup (ABN, address, radius).
• Vertical video feed (card + slide-up details). Filters/sort; shortlist; unlock contact (Stripe).
• Subscription screen + billing history.
Admin
• Moderate videos (approve / request changes / reject); view flags; user search; basic analytics.
• Email export; user management.
Unlock & Contact Workflow (MVP)
Summary: Employer must unlock candidate (subscription or checkout). Candidate must approve unless “Always share” is ON (auto-approve).
Steps
• Unlock initiation: subscribed → pending unlock; not subscribed → Stripe checkout → pending unlock on success.
• Candidate option: profile toggle “Always share my contact details with verified employers.” If ON, auto-approve on unlock.
• Activity filter: show only candidates active within 60 days (later 30).
• Notify candidate (if manual): email with approve/decline token links.
• Decision: approve → reveal; decline → unavailable (14-day cooldown); no response → expire after 7 days.
• Notify both parties: candidate confirmation; employer success/declined/expired.
• Employer UI — Approved Contacts: list photo/name/role/suburb/email/phone/date; filters; CSV export.
• Analytics: unlock_initiated, unlock_checkout_completed, unlock_approved, unlock_declined, unlock_expired, auto_approved, approved_contacts_viewed.
Data Model (Minimum)
• unlock_requests(id, employer_id, candidate_id, status enum, created_at, resolved_at, initiated_via, cooldown_until).
• candidate_profiles(contact_email, contact_phone, share_contact boolean).
• employers(business_name, abn, billing_status).
Webhooks
• Stripe success → create pending unlock + candidate email.
• Approve/Decline endpoint → set status + timestamps → notify.
Acceptance
• No contact visible before approval (unless Always share ON).
• Emails dispatched < 60 s; CSV export works; events tracked.
Architecture & Scalability
• Designed to scale from MVP to 100k+ active users with minimal refactor.
• Edge-first rendering & caching (Vercel/Cloudflare Pages).
• Supabase (Sydney) with RLS for candidate/employer/admin.
• Cloudflare Stream video + CDN; webhooks for encode/moderation/enhance.
• Asynchronous jobs via Cloudflare Workers or Supabase Edge Functions with retry queue (3 attempts; 30 s → 2 m → 10 m).
• Caching: Cloudflare CDN (dynamic TTL 30 m; static 24 h).
• Targets: 10k concurrent video views; 100 uploads/hour.
• Monitoring: Sentry for FE + Workers; Logflare/Supabase Logs with correlation IDs; UptimeRobot checks.
API Structure & Key Endpoints
• POST /api/upload-url — signed Stream URL for upload (Candidate).
• GET /api/video/:id — metadata (status, moderation, URLs) (Public/Employer).
• POST /api/moderate/:id — trigger moderation/enhancement (Admin).
• POST /api/unlock — create unlock request (Employer).
• POST /api/unlock/:id/respond — Approve/Decline (Candidate).
• GET/PUT /api/profile — get/update candidate profile (Candidate).
• GET/PUT /api/employer — get/update employer info (Employer).
• POST /api/analytics/events — log events (Authenticated).
• POST /api/webhooks/stripe — Stripe events (System).
• POST /api/webhooks/stream — Stream encode events (System).
• Response shape: { success: boolean, data?: T, error?: { code: string, message: string } }
Data Model (ERD Overview)

users
 ├─ id (uuid, pk)
 ├─ email, phone
 ├─ role (candidate|employer|admin)
 └─ created_at, updated_at

candidate_profiles
 ├─ id (uuid, pk)
 ├─ user_id (fk -> users.id)
 ├─ suburb, availability, bio
 ├─ video_id (fk -> videos.id)
 └─ status (pending|approved|rejected)

videos
 ├─ id (uuid, pk)
 ├─ user_id (fk)
 ├─ stream_uid (Cloudflare)
 ├─ moderation_status, enhancement_status
 └─ created_at

employers
 ├─ id (uuid, pk)
 ├─ user_id (fk)
 ├─ business_name, abn
 ├─ stripe_customer_id, plan_tier
 └─ created_at

unlock_requests
 ├─ id (uuid, pk)
 ├─ employer_id (fk), candidate_id (fk)
 ├─ status (pending|approved|declined|expired)
 ├─ initiated_via (subscription|one_off)
 └─ created_at, resolved_at
Indexes: videos.user_id; unlock_requests.candidate_id; unlock_requests.employer_id; (status, created_at) composite for dashboards.


Row-Level Security (Examples)
candidate_profiles
-- Candidates read/write own profile
create policy candidate_rw on candidate_profiles
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Employers read approved profiles only
create policy employer_read on candidate_profiles
for select using (
  current_setting('request.jwt.claims', true)::jsonb->>'role' = 'employer'
  and status = 'approved'
);
unlock_requests
-- Employer can read/write own unlock requests
create policy employer_unlocks on unlock_requests
for all using (auth.uid() = employer_id);

-- Candidate can read/act on requests addressed to them
create policy candidate_unlocks on unlock_requests
for select using (auth.uid() = candidate_id);
Error Handling & Fallbacks
• Async jobs (moderation/enhancement/email): 3 retries (30 s → 2 m → 10 m).
• On Stream outage: queue uploads for reprocess within 1 h; show “processing” badge in UI.
• Stripe webhooks: rely on Stripe retries; ensure idempotency keys.
• Auth failures: HTTP 401 + “Session expired—please log in again.”
• Generic 5xx: user-friendly message; log correlation ID. Central errors table for ops triage.
File Storage & Retention
• Originals stored in Stream; enhanced derivative used for playback.
• Retention: rejected videos deleted after 30 days; approved retained until user deletion.
• Monthly bandwidth/storage alerts at 80% of budget.
Privacy & Compliance
• Users consent to employer visibility of their videos for hiring.
• Compliant with Australia Privacy Act 1988 (APPs) and CCPA/CPRA (California).
• Data region: Supabase Sydney; Cloudflare edge globally distributed.
• Users can delete profile/media anytime; DSRs (access/delete) via support.
• Disclaimer: “Videos are reviewed automatically for safety and appropriateness.”
QA, Monitoring & SLOs
Tools: Sentry (FE + Workers), Logflare/Supabase Logs, PostHog/Mixpanel, UptimeRobot.
Release QA Checklist:
• Upload on Chrome/Safari mobile (iOS/Android).
• Auto-enhance < 60 s; fallback OK.
• Stripe checkout & webhooks pass (success/cancel).
• Feed scroll ~60 fps (≥ 20 swipes).
• Admin moderation filters/approves correctly.
• Emails deliver to inbox (verified sender).
• Analytics events capture with correct properties.
SLOs:
• Availability 99.9% monthly.
• P95 API ≤ 300 ms.
• First frame ≤ 500 ms (4G).
• Stripe webhook success ≥ 99.5% within retries.
Incident Response:
• Auto-alert Slack/Email on error spike > 5/min or P95 latency > 1 s.
• Post-mortem in 48 h for Sev-1 incidents.
Design & UX Guidelines
• Colours: Primary #19C5C5 (Turquoise), Text #1E1E1E (Charcoal), Background #F7F8FA (Off-White), Success #3CCB7A, Error #FF5B5B, Divider #EAEAEA.
• Typography: Inter / DM Sans; Headings 700; Body 400–500; Buttons Semi-Bold.
• Voice: Friendly, plain-English, confident. Examples: “Record your intro.” “Looks great—ready to upload?” “Employers can now view your video.”
• Accessibility: WCAG AA contrast; captions supported; keyboard/screen-reader navigable; tap targets ≥ 44 px.
Environments, Config & CI/CD
• ENV Vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLOUDFLARE_STREAM_TOKEN, CLOUDFLARE_STREAM_ACCOUNT_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, POSTMARK_API_KEY, POSTHOG_API_KEY.
• CI/CD: PR preview builds; automated lint, typecheck, unit tests; protected main; code owners; required reviews.
• Data Seeding (staging): 20 candidate profiles + 10 videos (stub) + 5 employers; Stripe test products/plans/webhooks.
Scalability Plan (Post-MVP)
• Background job queue (Supabase Edge Jobs/Cloudflare Queues).
• Multi-region read replicas (Sydney + Singapore).
• Dedicated CDN bucket for thumbnails.
• Lighthouse mobile score 90+ (preload critical assets).
• Partition employer tables by region after 10k+ records.
Native App (Future Integration Plan)
• Framework: React Native / Expo (reuse design tokens + components).
• Auth: Supabase Auth SDK (email/phone OTP).
• Video: native camera → signed URL upload to Cloudflare Stream (same as web).
• Push: FCM + APNs (unlock requests, approvals).
• Payments: Stripe Mobile SDK (or platform IAP where required).
• Analytics: PostHog RN SDK (mirror web).
• Design tokens: single JSON theme (colours, spacing, typography) shared across web & native.
• Testing: iOS TestFlight + Android internal tracks; same Supabase project/keys; Stream tokens device-agnostic.
• Acceptance: All APIs consumed from native without backend changes; deep links /record, /feed, /profile consistent across clients.
Suggested Milestones (6 Weeks)


• Week 1 — Auth + DB + Setup: Supabase auth, RLS policies, repo scaffold.
• Week 2 — Candidate Onboarding: Forms, recorder/upload to Stream.
• Week 3 — Video Feed + Playback: Virtualized scroll, autoplay logic.
• Week 4 — Employer Dashboard: Filters, shortlist, unlock flow UI.
• Week 5 — Stripe + Admin Tools: Subscriptions, moderation dashboard.
• Week 6 — QA + Analytics + Deployment: Staging + production, analytics wired.
Go-Live Acceptance Criteria
• PWA load < 2 s; first video < 500 ms on 4G.
• Smooth feed at ~60 fps (≥ 20 swipes).
• Stripe live checkout passes; emails verified; analytics events tracked.
• Code passes lint/audit; deployed under Nick’s accounts.


Final-mile addendum (paste under “Environments, QA or Architecture”)
A. Legal & policy deliverables
Pages: Terms of Use, Privacy Policy, Cookie/Tracking Notice, Community Guidelines (conduct & content), Age gate (16+ or local minimum), Data Request page (download/delete).
Regions: AU (APPs 1–13) + US (CPRA/CCPA) wording. Add a “Data Processing & International Transfers” subsection (Cloudflare global edge + Supabase AU region).
Consent: marketing consent flag already in DB; add cookie/analytics consent banner copy + link to opt-out page.
Employer KYC (lightweight): ABN lookup (Australia Business Register) + business email verification (MX check + approve list).
B. Security hardening (runtime + edge)
Bot & abuse: Cloudflare Turnstile on sign-up, upload, unlock; Cloudflare WAF rules for /api/*.
Rate limits: e.g., 5/min for auth, 20/min for search, 2/min for unlock.
Headers: CSP (media from Stream domains), HSTS, X-Frame-Options: DENY, Referrer-Policy: strict-origin.
Sessions: Supabase refresh rotation; idle timeout 30m; absolute session 30d.
Secrets: only in server runtime; no client exposure; quarterly rotation.
PII audit: log viewer_user_id, purpose when staff/admin access candidate contact.
C. Backups, DR & cost control
Supabase PITR on; daily logical backups; RPO ≤ 15 min, RTO ≤ 2 h.
Cloudflare Stream storage/bandwidth alerts at 80% budget; monthly cost dashboard.
Runbook: ops doc for “Stream down”, “Stripe webhook failing”, “Enhancement queue backlogged”.
D. Testing plan (automated + devices)
Unit/Integration: Vitest/Jest + Testing Library; mock Supabase; 80% line coverage on core flows.
E2E: Playwright scripts for candidate upload → moderation → live; employer unlock → approval; Stripe checkout success/cancel.
Performance: Lighthouse CI (mobile PWA) target LCP < 2 s; k6 load test: 10k concurrent viewers, 100 uploads/hour.
Device matrix: iOS (Safari) 15–17; Android (Chrome) 12–14; desktop Chrome/Safari; low-end Android with poor light.
E. Release & feature-flagging
Feature flags: config table for LUT intensity, denoise strength, “Always share” default, activity cutoff (60→30 days), moderation thresholds.
Staged rollout: enable moderation auto-approve only after manual backstop shows <0.5% false negatives.
F. Admin & support tooling
Admin actions: reprocess video, resend email, override unlock, ban employer, soft-delete candidate.
Support: Intercom/Zendesk widget; templated replies for unlock/approval outcomes; export audit trails for disputes.
G. Recorder UX (on-screen single prompt)
“Start with your name and suburb, then tell us in 30–45 seconds why you love hospitality and the roles you’re open to.”
(Pre-record tips card: face a window, hold phone vertical, arm’s length, smile 😊. Show live audio meter.)
H. Desktop responsiveness & SEO hygiene
Desktop: 2-up feed grid ≥ 1200px; left nav collapsed to icons; keyboard shortcuts (J/K next/prev).
OG/SEO: basic OpenGraph tags for brand pages; no indexing of candidate profiles (private/authorized).
I. Internationalization & formatting
Extract copy to JSON; AU date/phone formats; meters: km radius; time zone Australia/Melbourne for ops timestamps.

