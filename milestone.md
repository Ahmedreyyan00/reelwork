ReelWork — 10-Weeks MVP Development Plan (Updated & Aligned with Specification)
Week 1–2 — Foundations + UI Development
Goal: Establish the complete project skeleton, authentication, database, and base UI to enable early testing and CI/CD.
 Tasks
Initialize Next.js PWA project with Vercel deployment, folder layout, and mobile-first base design system.


Configure Supabase Auth (OTP login) and Row-Level Security policies for candidates, employers, and admins . .Supabase PITR enabled; daily logical backups.



Define all core database schemas: users, candidate_profiles, videos, employers, unlock_requests.


Apply Supabase policies (read/write isolation per role, RLS for approved profiles).


Scaffold reusable UI components (buttons, modals, forms, feed cards, dashboard layout).


Set up environment configuration for Supabase, Cloudflare Stream, Stripe, Postmark, and PostHog.


Implement email verification base flow (pending → verified).
 Deliverables


Working auth + DB foundation with RLS.


Responsive UI skeleton for both candidate & employer dashboards.


Deployed staging environment (Supabase + Vercel).



Week 3-4 — Candidate Onboarding + Video Upload
Goal: Complete the full candidate onboarding and recording pipeline integrated with Cloudflare Stream.
 Tasks
Build candidate profile flow (suburb, experience, availability, roles).


Integrate Cloudflare Stream for upload → encode → webhook update.


Implement recorder UI (mobile camera input, preview, re-record option).


Enforce recording constraints: 9:16 aspect, ≤ 45 s duration, ≤ 1080p → downscale 720p.


Add upload validations and visual recorder prompts (“face a window…”) per UX doc.


Handle video status transitions (Pending / Live / Needs Changes).


Persist metadata in Supabase (stream_uid, status, checkedAt).
 Deliverables


End-to-end candidate flow: record → upload → Stream encode → playback.


Verified data persisted in Supabase.


Polished onboarding UX for mobile PWA.



Week 5–6 — AI Video Moderation & Performance Enhancement Pipeline
Goal: Implement the complete automatic moderation and enhancement process aligned with performance targets.
 Tasks
Create webhook endpoint for Cloudflare Stream encode completion.


Build hybrid AI moderation:


Frame-scan every 2 s using NSFW classifier (flag > 0.85).


Audio check using Whisper-small → profanity/hate-speech filter.


Implement decision logic: Live | Pending Review | Rejected.


Design FFmpeg enhancement worker: exposure + contrast + saturation + denoise + LUT + audio polish (as spec).


Optimize FFmpeg pipeline for < 15 s processing of 30–45 s clips.


Store moderation/enhancement JSON in DB (scores + timestamps).


Build Admin UI for reviewing flagged frames + transcript snippets (Approve / Reject / Request Changes).


Introduce feature flags for moderation thresholds, LUT intensity, “Always Share” default, activity cutoff (60 → 30 days).
 Rationale: AI processing and performance tuning require iteration and test passes to ensure reliability (< 0.5 % false negatives).
 Deliverables


Fully automated moderation + enhancement pipeline.


Admin dashboard for review decisions and logs.



Week 7 — Employer Dashboard + Unlock Flow + Stripe
Goal: Build the full employer experience including subscription, video feed, and unlock logic.
 Tasks
Implement employer onboarding (ABN, address, radius).


Create vertical video feed with virtualization (3–5 videos mounted, preload next segments only).


Enable filters/sort by role, experience, availability, distance.


Integrate Stripe subscriptions + one-off unlocks, with webhooks for idempotent status updates.


Develop unlock workflow (manual approval / auto approve via Always Share toggle).


Configure Postmark emails: unlock approved, declined, expired, subscription receipts.


Maintain P95 latency ≤ 300 ms across endpoints.
 Deliverables


Functional employer dashboard with integrated payments.


Verified Stripe checkout + webhook flow.


Complete unlock approval workflow end-to-end.



Week 8 — Admin Tools + Legal & Compliance
Goal: Finalize moderation controls, admin utilities, and legal/compliance deliverables.
 Tasks
Build Admin panel actions: reprocess video, resend email, ban/unban users, override unlock, filter flags.


Create policy pages: Terms of Use, Privacy Policy, Cookie/Tracking Notice, Community Guidelines, Data Request.


Add age gate (16+), cookie/analytics consent banner, opt-out page.


Implement Employer KYC: ABN lookup (Australia Business Register) + MX domain check.


Apply security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy).


Add Cloudflare Turnstile bot protection on sign-up, upload, unlock + rate limits (5/min auth, 20/min search, 2/min unlock).


Document Data Processing & International Transfers section (Supabase AU + Cloudflare edge).
 Deliverables


Live admin dashboard + support tools.


Fully published legal + consent pages.


Security & abuse protection mechanisms active.


Set up Slack/email alerts for errors, high latency, moderation queue backlog
Integrate Intercom / Crisp / Supabase Chat or similar for admin + employer support.

Week 9 — QA, Performance Testing & Analytics
Goal: Validate performance, reliability, and analytics instrumentation before production.
 Tasks
Execute integration + E2E tests (Playwright): candidate upload → moderation → live; employer unlock → approval.


Run Lighthouse CI (mobile LCP < 2 s) + k6 load test (10 k viewers / 100 uploads per hour).


Implement PostHog/Mixpanel events: signup, upload, play, checkout, unlock, etc.


Integrate Sentry for frontend + edge functions.


Set up Logflare/Supabase Logs + correlation IDs for request tracking.


Configure UptimeRobot monitoring + alert on P95 > 1 s or error spike > 5/min.


Verify moderation accuracy + retry logic + queue backoff (30 s → 2 m → 10 m).
 Deliverables


Stable, QA-verified build meeting all performance targets.


Complete analytics + monitoring stack (PostHog + Sentry + Logs + Uptime).


Implement SEO metadata (title, description, OG tags, robots.txt, sitemap.xml, canonical URLs). Restrict sensitive endpoints via robots.txt and noindex headers

Week 10 — Final Polish, Staging Review & Launch Prep
Goal: Prepare the MVP for public release, finalize security, documentation, and handover.
 Tasks
Conduct UI/UX polish and accessibility audit (WCAG AA contrast, captions, keyboard navigation).


Finalize email verification and resend flows (Postmark).


Perform staging → production deployment under client’s orgs (GitHub, Supabase, Cloudflare, Stripe).



Validate backups (PITR) and cost monitoring (80 % budget alerts).


Compile launch runbook: Stream down, Stripe failure, queue backlog procedures.


Deliver handover documentation + admin credentials.
 Deliverables


Production-ready MVP deployed under client accounts.


All Go-Live Acceptance Criteria met:


PWA load < 2 s; first frame < 500 ms on 4G.


Smooth feed (~60 fps).


Stripe checkout + emails verified.


Analytics events tracked.


Code passes lint/audit.


