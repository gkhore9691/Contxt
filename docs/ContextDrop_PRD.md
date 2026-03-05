# ContextDrop — Product Requirements Document

> **Load your brain into any AI agent in 30 seconds.**

| Field | Details |
|---|---|
| **Product** | ContextDrop |
| **Version** | 1.0 — MVP |
| **Author** | Gopala · Thoughtwin IT Solutions |
| **Date** | March 2026 |
| **Stack** | Next.js 14, TypeScript, Supabase, shadcn/ui, Tailwind CSS |
| **Target Ship** | 3 days (Claude Code accelerated) |
| **Status** | Draft — Ready for Development |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Feature Specifications](#5-feature-specifications)
6. [Technical Architecture](#6-technical-architecture)
7. [Build Plan](#7-build-plan-claude-code-accelerated)
8. [Monetisation Strategy](#8-monetisation-strategy)
9. [Product Hunt Launch Strategy](#9-product-hunt-launch-strategy)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Out of Scope (MVP)](#11-out-of-scope-mvp)
12. [Appendix — Claude Code Starter Prompt](#12-appendix--claude-code-starter-prompt)

---

## 1. Executive Summary

ContextDrop is a SaaS web application that solves one of the most overlooked friction points in modern AI-assisted development: the **cold-start problem**. Every time a developer opens a new session with Claude Code, Cursor, Windsurf, or any AI coding agent, they spend 10–20 minutes re-explaining their project — the tech stack, conventions, architecture, and constraints — before getting useful output.

ContextDrop allows developers to create structured **"Context Packs"** for their projects, generate optimized one-click prompts compatible with any AI agent, and share those packs with teammates or the broader community. Think of it as a **`.env` file for your AI's brain.**

### Core Value Proposition

| Without ContextDrop | With ContextDrop |
|---|---|
| 10–20 min re-explaining project each session | 30-second context load for any AI agent |
| Inconsistent AI output across teammates | Team shares identical context packs |
| No standard format for AI context | Community library of framework packs |
| Context lost when switching AI tools | Portable context across all AI tools |

---

## 2. Problem Statement

### 2.1 Background

The AI coding agent market has exploded in 2025–2026. Tools like Claude Code, Cursor, Windsurf, and Replit Agent have become daily drivers for developers. However, all of these tools share a fundamental limitation: **they have no persistent memory of your project between sessions.**

Each new session is a blank slate. The developer must manually re-provide context — and most do so haphazardly, leading to worse AI output, frustration, and significant wasted time.

### 2.2 Problem Breakdown

- **Cold Start Tax:** Developers waste 10–20 minutes per session establishing project context
- **Context Inconsistency:** Teammates describe the same project differently, getting wildly different AI outputs
- **Tool Lock-in Friction:** Context written for Cursor doesn't easily transfer to Claude Code or Windsurf
- **No Standard Format:** There is no community-agreed structure for AI project context
- **Onboarding Bottleneck:** New devs joining a team have no way to onboard their AI agent to the project quickly

### 2.3 Validation Signals

The PH community is already deeply aware of this problem. Related products that ranked highly in March 2026 include **"Personal AI Memory"** and **"Claude Import Memory"** — both in the AI top-10. The gap is a tool focused specifically on **developer project context for AI coding agents.**

---

## 3. Goals & Success Metrics

### 3.1 Product Goals

1. **Speed** — Ship a working MVP within 3 days using Claude Code
2. **Launch** — Rank on Product Hunt top charts (target: #1–5 in Developer Tools or AI categories)
3. **Growth** — Acquire 500 registered users within 30 days of launch
4. **Retention** — Achieve a 40%+ Day-7 retention rate among active users
5. **Revenue** — Convert 5% of free users to paid within 60 days

### 3.2 Success Metrics (KPIs)

| Metric | Target (30d) | Target (90d) | Measurement |
|---|---|---|---|
| Product Hunt Upvotes | 500+ | — | PH launch day |
| Registered Users | 500 | 2,000 | Supabase Auth |
| Context Packs Created | 1,000 | 5,000 | DB count |
| Community Packs Shared | 100 | 500 | Public packs |
| Day-7 Retention | 40% | 50% | Cohort analysis |
| Paid Conversion Rate | — | 5% | Stripe events |
| MRR | — | $500 | Stripe dashboard |

---

## 4. Target Users & Personas

### 4.1 Primary Persona — The Vibe Coder

| | |
|---|---|
| **Name** | Arjun, 26 |
| **Role** | Indie developer / freelancer |
| **Tools** | Claude Code, Cursor, Next.js, TypeScript |
| **Pain** | Starts 3–5 AI sessions daily, re-explains context every single time |
| **Goal** | Get AI agents productive in under a minute |
| **Motivation** | Reduce cognitive overhead, ship faster |

### 4.2 Secondary Persona — The Team Lead

| | |
|---|---|
| **Name** | Priya, 32 |
| **Role** | Senior dev / tech lead at a startup |
| **Tools** | Cursor, GitHub Copilot, team of 4 devs |
| **Pain** | Every team member prompts AI differently — inconsistent code quality |
| **Goal** | Standardize AI context across the team |
| **Motivation** | Code consistency, faster onboarding of new devs |

### 4.3 Tertiary Persona — The OSS Maintainer

| | |
|---|---|
| **Name** | Alex, 29 |
| **Role** | OSS maintainer, active on GitHub |
| **Tools** | Claude Code, various contributors using different AI agents |
| **Pain** | Contributor PRs are inconsistent in style; no standard AI context for the project |
| **Goal** | Publish a shareable context pack in the community library |
| **Motivation** | Better contributions, less review time |

---

## 5. Feature Specifications

### 5.1 Context Pack Builder (Core)

A multi-step wizard that walks the developer through filling out a structured template. Each field maps to a specific section of the generated prompt.

**Wizard Steps:**

1. **Project Basics** — name, description, one-liner summary
2. **Tech Stack** — framework, language, UI library, database, hosting, CI/CD
3. **Architecture Notes** — folder structure, key modules, data flow
4. **Coding Conventions** — naming, component patterns, linting rules, commit style
5. **AI Behaviour Rules** — what the AI should and should not do (e.g. "never use class components", "always use Zod for validation")
6. **Known Gotchas** — environment quirks, legacy decisions, things that always trip up the AI

**Output Formats:**

- `CLAUDE.md` format (optimized for Claude Code)
- `.cursorrules` format (Cursor compatible)
- Generic markdown (works with any AI tool)
- JSON export (for programmatic use / team sync)

### 5.2 One-Click Copy

After pack generation, a prominent **"Copy for [Tool]"** button copies the full formatted prompt to clipboard. Tool selector includes: Claude Code, Cursor, Windsurf, Replit Agent, GitHub Copilot, ChatGPT, Generic.

### 5.3 Pack Management (Dashboard)

- Create, edit, duplicate, delete packs
- Version history for each pack (last 5 versions on free plan)
- Tag packs by framework, language, or project type
- Private / Public toggle per pack

### 5.4 Community Library

A browsable, searchable feed of public context packs submitted by the community. This is the **primary viral loop** and Product Hunt hook.

- Browse by category: Next.js, MERN, Laravel, Django, FastAPI, React Native, etc.
- Sort by: Most upvoted, Most forked, Newest
- Upvote / fork packs (forking creates a private copy to edit)
- Pack detail page with preview of generated prompt
- Creator profile page with all their public packs

### 5.5 Team Workspace *(Pro / Team tier)*

- Invite teammates via email
- Shared pack library visible to all team members
- Role-based editing: Owner, Editor, Viewer
- Team pack sync — when a pack updates, all team members get notified

### 5.6 Auth & Accounts

- GitHub OAuth (primary — best fit for dev audience)
- Google OAuth (secondary)
- Email magic link (fallback)
- User profile: avatar from OAuth, username, bio, public pack count

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 App Router + TypeScript | Server components, RSC streaming |
| UI Components | shadcn/ui + Tailwind CSS | Dark editorial aesthetic |
| Auth | Supabase Auth (GitHub OAuth) | Row-level security |
| Database | Supabase PostgreSQL | Packs, users, forks, upvotes |
| ORM | Prisma or Supabase client | Type-safe queries |
| Payments | Stripe (Checkout + Webhooks) | Subscription billing |
| Analytics | Vercel Analytics + PostHog | Event tracking |
| Hosting | Vercel | Edge functions, instant deploy |
| Email | Resend | Transactional emails |

### 6.2 Database Schema

#### `users`
```sql
id, github_id, email, username, avatar_url, bio,
plan (free | pro | team), created_at
```

#### `packs`
```sql
id, user_id, title, description, slug, is_public,
framework_tag, language_tag, fork_count, upvote_count,
created_at, updated_at
```

#### `pack_fields`
```sql
id, pack_id, field_key (stack | conventions | rules | gotchas | ...),
field_value (text), order
```

#### `pack_versions`
```sql
id, pack_id, snapshot (JSONB), version_number, created_at
```

#### `upvotes`
```sql
id, user_id, pack_id, created_at
UNIQUE(user_id, pack_id)
```

#### `forks`
```sql
id, user_id, source_pack_id, forked_pack_id, created_at
```

#### `team_members`
```sql
id, team_owner_id, member_id, role (owner | editor | viewer),
invited_at, joined_at
```

---

## 7. Build Plan (Claude Code Accelerated)

Target: **full MVP in 3 days**, solo development with Claude Code.

| Phase | Focus | Timeline | Key Deliverables |
|---|---|---|---|
| **Phase 1** | Project Setup & Auth | Day 1 AM | Next.js 14 + Tailwind + shadcn/ui init, Supabase project + GitHub OAuth, User table + RLS policies, Landing page (hero, CTA, feature grid) |
| **Phase 2** | Pack Builder Core | Day 1 PM | Multi-step wizard form (6 steps), Pack schema + Supabase insert, Output generation engine (3 formats), Copy-to-clipboard per tool |
| **Phase 3** | Dashboard & Pack Management | Day 2 AM | User dashboard with pack list, Edit / duplicate / delete flows, Public / Private toggle, Pack version history |
| **Phase 4** | Community Library | Day 2 PM | Public packs feed with filters, Upvote system (optimistic UI), Fork functionality, Pack detail page, Creator profile page |
| **Phase 5** | Monetisation & Launch Prep | Day 3 | Stripe subscription setup (Pro/Team), Feature gating (3 packs on free), SEO meta tags + og:image, Product Hunt assets, Final QA + deploy to Vercel |

---

## 8. Monetisation Strategy

### 8.1 Pricing Tiers

| Feature | Free | Pro ($7/mo) | Team ($29/mo) |
|---|---|---|---|
| Context Packs | 3 packs | Unlimited | Unlimited |
| Output Formats | Generic only | All 4 formats | All 4 formats |
| Version History | — | Last 5 versions | Full history |
| Private Packs | 1 | Unlimited | Unlimited |
| Community Library | Browse + upvote | Browse + fork | Browse + fork |
| Team Workspace | — | — | Up to 10 members |
| Shared Pack Library | — | — | Yes |
| Priority Support | — | Email | Slack + Email |

### 8.2 Revenue Projections (Conservative)

| Period | Free Users | Pro Users | Team Users | MRR |
|---|---|---|---|---|
| Month 1 | 500 | 10 | 2 | $130 |
| Month 3 | 1,500 | 50 | 8 | $582 |
| Month 6 | 4,000 | 150 | 25 | $1,775 |
| Month 12 | 10,000 | 400 | 80 | $5,120 |

---

## 9. Product Hunt Launch Strategy

### 9.1 Why This Will Rank

- **AI + Developer Tools** are currently the #1 and #3 categories on PH with 56 and 25 products respectively in March 2026
- Solves a **universal daily pain point** for PH's core demographic — AI-using developers
- **Viral loop built-in** — community library drives sharing and return visits
- Relatable tagline that lands instantly with the target audience
- Launches during the peak of the vibe-coding / AI agent wave

### 9.2 Launch Assets Checklist

1. **Tagline:** Load your brain into any AI agent in 30 seconds
2. **Thumbnail:** Dark bg, ContextDrop logo, tagline in clean type
3. **Gallery:** 4 screenshots — wizard, output modal, community library, dashboard
4. **Demo GIF:** 20-second flow from zero to copied prompt
5. **Launch post:** Founder story about wasting time re-explaining context every session
6. **First comment:** Share a real Next.js context pack from the community library on day 1
7. **Hunter:** Self-hunt or find a top hunter with 1k+ followers

### 9.3 Pre-Launch (Day Before)

- Post teaser on Twitter/X: *"Shipping something for every dev who uses AI agents tomorrow"*
- LinkedIn post: frame as a dev story / problem-solution narrative
- Seed 10–15 community packs before launch (Next.js, MERN, Laravel, Django, FastAPI)
- Invite 20+ dev friends to check it out on launch day

---

## 10. Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | AI tools add native context memory features | High | Double down on community library — the social/sharing layer is defensible |
| 2 | Low Day-1 PH traction | Medium | Seed 15 packs, prep community outreach, launch Tuesday–Thursday for best visibility |
| 3 | Users don't return after first use | Medium | Email sequences, pack version notifications, team features embed it in daily workflow |
| 4 | Scope creep delays launch | Medium | Strict 3-day scope. Ship MVP. Defer team features to v1.1 if needed |
| 5 | Supabase RLS misconfiguration leaks private packs | Low | RLS policies reviewed, E2E test private pack visibility before launch |

---

## 11. Out of Scope (MVP)

The following are explicitly excluded to maintain the 3-day ship timeline. All are candidates for v1.1+.

- VS Code / IDE extension
- CLI tool for context pack injection
- Native Cursor / Claude Code deep integration (depends on API availability)
- AI-assisted pack generation (auto-detect stack from a GitHub repo URL)
- Multi-language support (English only for MVP)
- Mobile-optimised experience (responsive but not mobile-first)
- Pack commenting / discussion threads
- Advanced analytics dashboard for Pro users

---

## 12. Appendix — Claude Code Starter Prompt

Copy and paste this directly into Claude Code to bootstrap the project:

```
Build "ContextDrop" — a Next.js 14 App Router SaaS where developers create 
structured Context Packs for AI coding agents.

Stack: Next.js 14 + TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth + DB), 
Stripe, Vercel. Use a dark editorial aesthetic (inspired by suprseo.com).

Core features:
- 6-step wizard to build a context pack (stack, conventions, rules, gotchas, etc.)
- Output formatted for Claude Code (CLAUDE.md), Cursor (.cursorrules), and generic markdown
- One-click copy per AI tool
- User dashboard to manage packs (create, edit, duplicate, delete, public/private toggle)
- Community library: browse public packs, upvote, fork
- Supabase RLS on all tables — users can only edit their own packs
- Stripe subscriptions: Free (3 packs), Pro $7/mo (unlimited), Team $29/mo (shared workspace)

Start with:
1. Project scaffold with the above stack
2. Supabase schema (users, packs, pack_fields, pack_versions, upvotes, forks, team_members)
3. GitHub OAuth via Supabase Auth
4. Landing page with hero, feature grid, and pricing section
```

---

*ContextDrop PRD v1.0 · Gopala · Thoughtwin IT Solutions · March 2026*
