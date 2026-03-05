# Contxt — Feature Expansion Roadmap
### Thinking as a Product Manager: From MVP Tool to Developer Platform

> **Philosophy:** Every feature must answer one question — *does this make a developer's AI coding session meaningfully better?* No bloat. No vanity features. Only things that create real daily habit.

---

## 🗂️ Table of Contents

1. [The Gap Analysis](#1-the-gap-analysis)
2. [Tier 1 — High Impact, Low Effort (Ship in Week 2)](#2-tier-1--high-impact-low-effort)
3. [Tier 2 — High Impact, Medium Effort (Month 1–2)](#3-tier-2--high-impact-medium-effort)
4. [Tier 3 — Platform Features (Month 3–6)](#4-tier-3--platform-features)
5. [Tier 4 — Moat Features (Month 6–12)](#5-tier-4--moat-features)
6. [Feature Priority Matrix](#6-feature-priority-matrix)

---

## 1. The Gap Analysis

The MVP ships with: wizard → output → copy → community library. That's a **one-time-use** product. Someone builds their pack, copies it, and has no reason to come back tomorrow.

**The real problem:** There's no *daily pull*. No reason to open Contxt again once you've made your pack.

Every feature in this roadmap is designed to answer: **why would a developer open Contxt tomorrow?**

The three retention loops we need to build:

- **Update Loop** — packs need to change as projects evolve, and Contxt should make that easy and rewarding
- **Discovery Loop** — community library becomes a daily destination, not a one-time browse
- **Team Loop** — individual value becomes team infrastructure, making it sticky at the org level

---

## 2. Tier 1 — High Impact, Low Effort
### Ship in Week 2 (right after MVP)

---

### 2.1 Smart Pack Templates

**What:** Pre-filled pack templates for popular stacks. When a user hits "New Pack", instead of a blank wizard, they choose from a template gallery first.

**Templates to build:**
- Next.js 14 App Router + TypeScript + Tailwind + Supabase
- MERN Stack (MongoDB + Express + React + Node)
- T3 Stack (Next.js + tRPC + Prisma + Tailwind)
- Django + React + PostgreSQL
- Laravel + Inertia.js + MySQL
- FastAPI + React + PostgreSQL
- React Native + Expo + TypeScript
- NestJS + TypeScript + Prisma
- Ruby on Rails + Hotwire
- SvelteKit + TypeScript

**Why this matters:** Cold-start friction is the #1 reason someone closes the wizard. A template means 80% of the pack is pre-filled — user only tweaks 3–4 fields. Pack creation time drops from 10 minutes to 90 seconds.

**Template card anatomy:**
- Stack name + logo icons
- "Used by X devs" count
- Preview of what fields are pre-filled
- "Use Template" CTA + "Start from Scratch" link

**PM insight:** Templates also drive community pack contributions — users start from a template, customize it, and are far more likely to publish it because it's already well-structured.

---

### 2.2 Pack Health Score

**What:** Every pack gets a 0–100 "Context Score" that measures how complete and useful the pack is for an AI agent. Displayed prominently on the pack card and dashboard.

**Scoring algorithm (transparent to user):**
- Project Basics filled: +15 pts
- Stack section has ≥ 3 items: +15 pts
- Architecture section has ≥ 100 words: +20 pts
- Conventions section has ≥ 5 rules: +15 pts
- AI Rules section has ≥ 3 rules: +20 pts
- Known Gotchas filled: +15 pts

**Score bands:**
- 0–40: 🔴 "Weak Context" — AI will still ask lots of questions
- 41–70: 🟡 "Good Context" — solid starting point
- 71–90: 🟢 "Strong Context" — AI will hit the ground running
- 91–100: ⚡ "Expert Pack" — maximum AI productivity

**UI treatment:**
- Score ring on pack card (like a progress circle)
- "Improve your score" button with specific suggestions: *"Add 2 more AI rules to get to Strong Context"*
- Dashboard shows average score across all packs

**Why this matters:** Gamification done right. The score creates a feedback loop that makes users *want* to fill out packs more completely — which directly improves their AI output quality. This is the single best retention mechanic for the wizard.

---

### 2.3 Quick Edit Mode

**What:** Instead of going through the 6-step wizard to update one thing, a "Quick Edit" mode lets users edit any individual section inline on the pack view page — like editing a Notion doc.

**Behaviour:**
- Pack view page shows all 6 sections in read mode (formatted, readable)
- Hovering any section reveals an "Edit" pencil icon
- Clicking opens that section inline as a textarea — no modal, no page navigation
- Auto-save with a 1-second debounce
- Small "Saved" toast confirmation

**Why this matters:** Projects evolve. You add a new library, change your DB, switch from REST to tRPC. The current wizard makes updating feel like a chore. Quick Edit makes it feel like editing a document — natural and instant. This is the #1 driver of pack freshness and return visits.

---

### 2.4 Pack Last Updated Freshness Indicator

**What:** Show how recently a pack was updated, and nudge users when their pack might be stale.

**UI:**
- Pack cards show "Updated 2 days ago" in green, "Updated 3 months ago" in yellow, "Updated 6+ months ago" in red
- Dashboard shows a "Stale Packs" section if any packs haven't been updated in 60+ days
- Email nudge (weekly digest) that says: *"3 of your packs haven't been updated in 90 days. Your project probably changed — refresh them in 2 minutes."*

**Why this matters:** An outdated context pack is worse than no pack — it actively misleads the AI. Freshness indicators create a "digital hygiene" habit that drives weekly active usage.

---

### 2.5 One-Click Import from GitHub README

**What:** Paste a GitHub repo URL. Contxt fetches the README, parses it, and pre-fills the pack wizard with extracted information.

**What gets extracted:**
- Project name and description (from H1 and intro paragraph)
- Tech stack (from "Built with" / "Tech stack" sections or badge images)
- Installation steps (hint at architecture)
- Contributing guidelines (hint at conventions)

**UI flow:**
1. "New Pack" → "Import from GitHub" option
2. Paste GitHub URL → "Analyze Repo" button
3. Progress state: "Fetching README... Extracting stack... Pre-filling fields..."
4. Wizard opens pre-filled with a banner: "Pre-filled from GitHub — review and customize each section"
5. Empty/unclear fields highlighted with "Couldn't auto-detect — fill in manually"

**Why this matters:** Reduces pack creation from 10 minutes to 3 minutes for any existing project. Also a powerful top-of-funnel hook — "paste your GitHub URL and get a context pack" is an incredibly shareable demo moment for Product Hunt.

---

### 2.6 Keyboard Shortcut: Instant Copy

**What:** Global keyboard shortcut `⌘K` (or `Ctrl+K`) opens a command palette where you can fuzzy-search your packs and copy to clipboard in 2 keystrokes.

**Command palette flow:**
1. Press `⌘K` from anywhere in the app
2. Palette opens with search input + list of recent packs
3. Type to fuzzy-filter pack names
4. Press `Enter` to copy the default format (CLAUDE.md)
5. Press `Tab` to switch format before copying
6. Palette closes, clipboard is loaded

**Secondary commands in palette:**
- "New Pack" → opens wizard
- "Browse Community" → jumps to community feed
- Recent packs shown with last-copied timestamp

**Why this matters:** Power users — the ones who will evangelize your product — live in keyboard shortcuts. This makes Contxt feel like a *pro tool*, not a web form. It also dramatically reduces the time-to-copy from 4 clicks to 2 keystrokes. If you build one delight feature this week, make it this.

---

### 2.7 Pack Usage Counter

**What:** Every time a user copies a pack (any format), increment a "used X times" counter on that pack. Show it on the pack card.

**Displays:**
- "Used 47 times" on the pack card
- Personal dashboard stat: "Total copies across all packs: 312"
- Community packs show copy count alongside upvote count

**Why this matters:** Usage counter creates proof of value — a pack with 47 copies is obviously useful. It also creates pride of ownership ("my Next.js pack has been copied 200 times by other devs") which drives community publishing.

---

## 3. Tier 2 — High Impact, Medium Effort
### Month 1–2

---

### 3.1 AI Pack Optimizer

**What:** An AI-powered feature that analyzes your completed pack and suggests specific improvements to make the AI context more effective.

**How it works:**
1. User clicks "Optimize with AI" on any pack
2. We send the pack content to Claude API with a specialized prompt
3. Claude analyzes and returns structured suggestions in 3 categories:
   - **Missing Information** — things that should be in the pack but aren't
   - **Clarity Issues** — things that are vague and could confuse the AI agent
   - **Power Tips** — specific additions that dramatically improve AI output for this stack

**UI for suggestions:**
- Each suggestion shows as a card with: category badge + description + "Apply Suggestion" button
- "Apply" opens quick-edit mode for that specific section with the suggestion pre-filled as draft text
- User can accept/edit/reject each suggestion
- Re-run optimizer after applying to see score improvement

**Example suggestions the AI might give:**
- *"Your conventions section doesn't mention error handling patterns. Add your preferred approach (try/catch, Result types, etc.)"*
- *"You mention Next.js App Router but don't specify which data fetching patterns you use (Server Components vs client fetch). This causes inconsistent AI output."*
- *"Add a section about your preferred state management approach — are you using Zustand, Context API, or server state only?"*

**Why this matters:** This is the feature that makes Contxt feel like a *product*, not a form. It creates an "aha moment" — the AI reads your pack and tells you how to make your AI sessions better. This is also an upsell vector: limit to 3 optimizations/month on free, unlimited on Pro.

---

### 3.2 Pack Diff & Changelog

**What:** When a user updates a pack, show a visual diff of what changed between versions — like a Git diff, but for context packs.

**UI:**
- Pack page has a "History" tab
- Each version shows: timestamp, what sections were changed, diff view
- Diff style: red background for removed lines, green for added lines (same as GitHub)
- "Restore this version" button on any historical version
- Optional: add a manual changelog note when saving ("Added Prisma conventions, removed Redis section")

**Version comparison view:**
- Side-by-side or inline diff toggle
- Section-by-section navigation
- "What's different" summary: "3 lines added in Conventions, 2 lines removed in Stack"

**Why this matters:** Makes pack evolution visible and intentional. Also creates confidence — you can update your pack aggressively knowing you can always roll back. For teams, the changelog becomes a shared record of how the project's AI context evolved.

---

### 3.3 Multi-Pack Projects

**What:** Group multiple packs under a single "Project" umbrella. A project represents a codebase; packs within it represent different contexts (frontend, backend, mobile, DevOps).

**Use case:** A full-stack team has:
- `my-startup / frontend` — Next.js context
- `my-startup / backend` — NestJS + Prisma context
- `my-startup / mobile` — React Native context
- `my-startup / devops` — Docker + GitHub Actions context

**Project view:**
- Project card shows all child packs in a grid
- "Copy All" button generates a merged context pack combining all sub-packs
- Project-level stats: total copies, team members with access, last updated
- Shareable project page (public or private)

**Why this matters:** Real-world projects are not monolithic. Developers need different context for different parts of the codebase. Multi-Pack Projects also dramatically increases the number of packs per user (from 1–2 to 5–10), which makes the free tier limit more meaningful and drives Pro upgrades.

---

### 3.4 Pack Collections (Public Curated Lists)

**What:** Users can create named collections of community packs — like GitHub Stars lists or a curated playlist. Collections are shareable.

**Examples:**
- "Best Next.js 14 Packs 2026" — curated by a popular dev
- "MERN Stack Essentials" — 5 packs that work together
- "Starter Packs for Indie Hackers" — lean, fast, ship-first context

**Collection anatomy:**
- Title + description
- Ordered list of packs with curator's note on each ("Use this one if you're on Vercel", "Better for monorepos")
- Follow count + fork count
- Curator's profile link

**Discovery:**
- Featured collections on community homepage
- "Part of 3 collections" shown on individual pack pages
- Collections tab in community feed

**Why this matters:** Collections are the editorial layer on top of the raw community feed. They solve the discovery problem ("there are 500 packs — which ones are actually good?") and give power users a new form of contribution and status beyond just pack creation.

---

### 3.5 Contextual Pack Snippets

**What:** Break the monolithic 6-section pack into reusable "snippets" — small, focused pieces of context that can be mixed and matched across packs.

**Snippet types:**
- **Stack Snippet** — "I use Tailwind CSS with these specific config settings..."
- **Convention Snippet** — "Always use this folder structure for components..."
- **Rule Snippet** — "Never use useState for server-fetchable data..."
- **Gotcha Snippet** — "When using Prisma with Next.js, always disconnect in API routes..."

**How it works:**
- Users can create standalone snippets
- When building/editing a pack, they can "Insert Snippet" from their library
- Community snippet library (searchable by framework/topic)
- "Used in X packs" shown on each snippet

**Why this matters:** Most developers reuse the same conventions across projects. Today they re-type them every time. Snippets make context reuse first-class. A developer might have 1 pack per project but 15–20 snippets they reuse everywhere — massive increase in platform value and stickiness.

---

### 3.6 Pack Embed Widget

**What:** A shareable embed that lets developers display their Contxt pack on their GitHub README, personal site, or portfolio.

**Embed types:**
1. **Badge** — `[![Contxt Pack](badge-url)](pack-url)` — shows pack score + framework
2. **Card embed** — iframe embed showing pack title, description, framework tags, and a "Fork this pack" CTA
3. **README section** — auto-generated markdown block: "## AI Context — This project has a Contxt pack. Fork it here: [link]"

**Generation flow:**
- Pack page has "Share & Embed" button
- Opens modal with 3 embed types, live preview, copy code button

**Why this matters:** Every GitHub README with a Contxt badge is a free marketing impression for developers browsing repos. This is the low-effort distribution loop — developers who care about AI tooling will click the badge. It also signals "this project is AI-agent-ready" which becomes a quality signal in the dev community.

---

### 3.7 Team Pack Inheritance

**What:** Team admins can create a "Base Pack" with company-wide conventions. Individual developers can create their own packs that *extend* the base pack — inheriting all base fields and adding their own on top.

**How it works:**
- Team admin creates `[Company] Base Context` — company coding standards, architecture overview, shared conventions
- Dev creates their feature-specific pack: `[Company] Payments Service`
- The payments pack automatically includes all base pack content + its own additions
- When base pack updates, all child packs auto-update (with review step)
- Output includes merged content: base context first, then specific context

**Inheritance UI:**
- Pack shows "Extends: Company Base Context" badge
- Diff view shows "inherited" vs "custom" sections in different colors
- Admin can lock certain base sections (read-only for team members)

**Why this matters:** This is the feature that makes Contxt indispensable for teams. Without this, each developer maintains their own redundant copy of company conventions. With this, the team lead updates one pack and everyone's AI context improves simultaneously. This is the stickiest enterprise feature you can build.

---

### 3.8 Pack Request Board

**What:** A public board where developers request context packs they wish existed. Community members can upvote requests and claim them to build.

**Request format:**
- "I need a context pack for: [stack/scenario]"
- Upvotes show demand
- "Claim" button lets a dev say "I'm building this"
- When published, the request is marked "Fulfilled by @username" with a link

**Examples of requests:**
- "Next.js 14 + Drizzle ORM + Neon DB" — 47 upvotes
- "Supabase + React Native + Expo Router" — 38 upvotes
- "Astro + Content Layer API" — 29 upvotes

**Why this matters:** Turns the community from passive consumers to active contributors. Also gives you a real-time signal on which tech stacks to build first-party templates for. The request board is also excellent Product Hunt / Twitter content — "most requested Contxt packs this week" is a weekly tweet that writes itself.

---

## 4. Tier 3 — Platform Features
### Month 3–6

---

### 4.1 Contxt CLI

**What:** A terminal CLI tool that lets developers interact with their Contxt packs without opening the browser.

**Core commands:**

```bash
# Install
npm install -g contxt-cli

# Auth
contxt login              # opens browser for OAuth, saves token

# Copy pack to clipboard
contxt copy               # fuzzy-picker if multiple packs
contxt copy my-nextjs-app # copy by pack name
contxt copy --format cursor  # specify output format

# Manage packs
contxt list               # show all your packs
contxt create             # opens interactive wizard in terminal
contxt push               # push local CLAUDE.md to Contxt as a pack
contxt pull <pack-name>   # pull pack content to local file

# Community
contxt search "next.js tailwind"  # search community packs
contxt fork <pack-id>             # fork a community pack

# Team
contxt sync               # pull latest team base pack
```

**Why this matters:** CLI is the single biggest signal that Contxt is a serious developer tool, not a web toy. It dramatically reduces friction for power users — `contxt copy` from terminal is 10x faster than browser tab switching. It also opens up automation (adding Contxt to dotfiles, shell aliases, CI scripts).

---

### 4.2 VS Code Extension

**What:** A VS Code extension that shows your Contxt pack in a sidebar panel and lets you copy context without leaving the editor.

**Features:**
- Sidebar panel listing all your packs
- Click any pack → copies to clipboard instantly
- "Smart Copy" — detects which files are open and automatically selects the most relevant pack
- "Update Pack" shortcut — opens a quick-input form to add a note to your pack's gotchas section without leaving VS Code
- Status bar item showing active pack name + score

**Smart Copy logic:**
- If `package.json` contains `next` → suggest Next.js packs
- If open file is in `/mobile/` or `/app/` → suggest React Native packs
- If `prisma/schema.prisma` exists → prioritize packs with Prisma in their stack

**Why this matters:** Meeting developers in their IDE is the highest-value distribution channel in developer tooling. Every VS Code user who installs the extension becomes a daily active user by default — they see Contxt in their sidebar every time they open VS Code.

---

### 4.3 Live Pack Sync (Real-time Collaboration)

**What:** Multiple team members can edit a shared pack simultaneously — like Google Docs, but for AI context.

**Features:**
- Presence avatars showing who's currently viewing/editing the pack
- Real-time cursor positions in text areas
- Live updates as teammates type (no page refresh needed)
- Change attribution: each edit shows who made it (color-coded by user)
- Conflict resolution: last-write-wins with optional "review conflicts" mode

**Technical approach:** Supabase Realtime for presence + updates. Each field is a separate subscription channel.

**Why this matters:** For teams actively onboarding a new project or doing a major refactor, the ability to collaboratively update the AI context pack is genuinely useful. It also makes the Team tier feel meaningfully different from Pro — collaboration is the core team value prop.

---

### 4.4 Pack Analytics Dashboard

**What:** For each pack, a detailed analytics view showing how it's being used.

**Metrics tracked:**
- Copies over time (daily/weekly chart)
- Format breakdown: how many times each output format was copied
- Community stats: upvotes, forks, views, profile visits from pack
- Fork tree: a visual tree showing which packs forked yours and who's using them
- Geographic breakdown: where your pack's users are located (country level)
- Trending score: how your pack is performing vs. last week

**For community packs:**
- "People who use this pack also use..." (collaborative filtering)
- Comments/feedback from forkers
- Weekly email report for popular packs (100+ copies)

**Why this matters:** Analytics creates investment. When a developer can see their Next.js pack has been copied 340 times this month, they care about keeping it updated. Analytics transforms pack creators from casual contributors into invested maintainers. This is the Pro/Team upsell moment — free tier gets basic counts, paid gets the full dashboard.

---

### 4.5 Context Pack Marketplace (Paid Packs)

**What:** Allow expert developers to sell premium context packs. Contxt takes 20% revenue share.

**Use cases:**
- "Production-grade Next.js 14 context pack" by a well-known dev blogger — $5
- "Enterprise React conventions pack" by a staff engineer at a major company — $15
- "Supabase expert pack with RLS patterns" by an official Supabase community expert — $8

**Marketplace mechanics:**
- Verified creator badge (applied for, reviewed by Contxt team)
- Free preview of 20% of the pack content
- Secure checkout via Stripe, unlocked in dashboard immediately
- Purchased packs can be forked (buyer's fork is private)
- Creator earnings dashboard with monthly payouts

**Discovery:**
- "Premium Packs" section in community feed
- Featured on landing page: "Built by experts"
- Searchable, sortable by price / framework / rating

**Why this matters:** The marketplace transforms Contxt from a tool into a platform. It attracts high-profile developers to create content (they earn money, you get credibility), creates a new revenue stream, and gives serious developers a reason to spend hours crafting truly exceptional packs. This is the Figma Community / Notion Template Gallery moment for Contxt.

---

### 4.6 AI Agent Session History

**What:** A browser extension (Chrome/Arc/Brave) that detects when you use a Contxt pack in an AI coding session and tracks outcomes.

**What it captures (with user consent):**
- Which pack was used
- Which AI tool (detected from URL: claude.ai, cursor.sh, etc.)
- Session duration
- User-rated session quality: 1–5 stars with optional note

**Dashboard shows:**
- "Sessions using Pack A average 4.2/5 stars vs. Pack B at 3.1/5"
- "Your most productive AI sessions use this context pack"
- "Sessions with fresh packs (updated <30 days) rate 18% higher"

**Why this matters:** This closes the feedback loop that no other context tool has attempted — actually measuring whether your context pack improves AI session quality. Even basic data on this is genuinely novel and gives you an incredible "prove it" narrative for marketing.

---

### 4.7 Contxt for Organizations (Enterprise Tier)

**What:** A white-labeled, organization-wide context management system for companies with 10+ developers.

**Features beyond Team tier:**
- Unlimited team members
- SSO (SAML/OIDC) integration
- Organization-wide pack governance: admins can approve/reject pack changes before they go live
- Compliance mode: all pack content is logged and auditable
- Custom AI rules library: organization-level rules that auto-inject into every developer's pack
- Onboarding packs: new dev joins → assigned a set of packs for their role automatically
- Priority support + dedicated Slack channel
- Custom subdomain: `yourcompany.contxt.dev`

**Pricing:** $199/month flat for unlimited seats (annual contract).

**Why this matters:** One enterprise customer at $199/month is worth 28 Pro subscribers. Enterprise is not where you start, but building toward it from Month 3 means the architecture (RLS, audit logs, team roles) is designed for it. One good LinkedIn post from an engineering manager at a mid-size company can drive 20–30 enterprise leads.

---

## 5. Tier 4 — Moat Features
### Month 6–12 (the features that make Contxt unbeatable)

---

### 5.1 Contxt MCP Server

**What:** A Model Context Protocol (MCP) server that lets Claude Desktop, Cursor, and any MCP-compatible AI agent fetch your Contxt pack automatically at session start — no manual copy-paste ever again.

**How it works:**
1. User installs the Contxt MCP server (one-time, 2-minute setup)
2. Connects their Contxt account via API key
3. In Claude Desktop config or Cursor settings, adds `contxt` as an MCP server
4. Now, at the start of every AI session, the agent automatically fetches the relevant context pack from Contxt

**MCP tools exposed:**
- `get_context_pack(project_name)` — fetch a specific pack
- `list_packs()` — see all available packs
- `get_active_pack()` — smart detection based on current working directory
- `update_pack(section, content)` — let the AI agent itself update the pack during a session

**The killer use case:** Developer opens a new Claude Code session, types `help me add Stripe webhooks`, and Claude *automatically* already knows the entire project context — no copy-paste, no prompt engineering, no re-explanation. Ever.

**Why this matters:** This is the feature that makes Contxt infrastructure, not a tool. Once the MCP server is set up, Contxt becomes invisible — it just works. Invisible infrastructure that works is unkillable. This is the moat.

---

### 5.2 Auto-Pack Generation from Codebase

**What:** Connect your GitHub repo (or run a local CLI command) and Contxt automatically generates a context pack by analyzing your actual codebase.

**What it analyzes:**
- `package.json` / `requirements.txt` / `go.mod` — extract the tech stack
- Folder structure (top 2 levels) — infer architecture
- Key config files: `tsconfig.json`, `tailwind.config.ts`, `.eslintrc`, `prisma/schema.prisma`
- README.md — extract conventions and description
- Top 10 most-edited files (via git log) — identify the core modules
- Code patterns in sample files — infer naming conventions, component patterns

**Output:** A pre-filled pack with confidence scores per field ("Stack detected with 95% confidence", "Conventions inferred — please review")

**GitHub App flow:**
1. Install Contxt GitHub App on repo
2. Initial pack generated in 30 seconds
3. Pack auto-updates on every merge to main (analyzes the diff)
4. Developer reviews and approves changes before they go live

**CLI flow:**
```bash
cd my-project
contxt analyze         # analyzes current directory
contxt analyze --push  # analyze and push to Contxt account
```

**Why this matters:** This eliminates the creation step entirely for existing projects. It also solves the freshness problem permanently — the pack updates itself as the codebase changes. This is the "set it and forget it" version of Contxt that turns a habit into automation.

---

### 5.3 Context Pack as Code (CaC)

**What:** Store your Contxt pack as a `contxt.yaml` file in your repository. The pack is version-controlled alongside your code, auto-synced with Contxt, and can be edited in any text editor.

**`contxt.yaml` format:**

```yaml
version: 1
pack:
  name: "My Next.js App"
  framework: nextjs
  language: typescript

stack:
  frontend: Next.js 14, React 19, TypeScript, Tailwind CSS, shadcn/ui
  backend: Next.js API Routes, Prisma, PostgreSQL
  hosting: Vercel
  auth: Supabase Auth

conventions:
  components: "PascalCase, one component per file in /components"
  api_routes: "REST, camelCase, always return { data, error }"
  commits: "conventional commits: feat/fix/chore/docs"
  
ai_rules:
  - "Always use TypeScript strict mode"
  - "Prefer Server Components, use 'use client' only when necessary"
  - "Always validate with Zod before database operations"
  
gotchas:
  - "Prisma client must be singleton — use lib/prisma.ts"
  - "Never import server-only code in client components"
```

**Sync behaviour:**
- `contxt push` — push local yaml to cloud
- `contxt pull` — pull cloud pack to local yaml
- GitHub App auto-syncs on every commit that touches `contxt.yaml`

**Why this matters:** Developers trust files in their repo more than cloud-only tools. A `contxt.yaml` that lives in the repo is documentation, onboarding guide, and AI context all in one. New developers joining the team run `contxt sync` and their AI agent is immediately aware of the entire project. This is the `.cursor/rules` pattern but done properly — structured, versioned, and cloud-synced.

---

### 5.4 Cross-Pack Intelligence

**What:** AI-powered analysis that looks across your entire pack library (and team's packs) to find inconsistencies, conflicts, and opportunities.

**Insights it surfaces:**
- **Conflicts:** "Your 'Frontend' and 'Mobile' packs both define different error handling patterns — this may cause inconsistent AI output across your codebase"
- **Redundancy:** "The Prisma gotcha in your Backend pack appears in 3 other packs — extract it to a shared snippet"
- **Gaps:** "Your Frontend pack doesn't mention testing conventions — your Backend pack does. Consider adding to both"
- **Drift:** "Your Team Base Pack and your personal pack disagree on state management approach"

**Weekly digest email:**
- "Contxt Intelligence: 3 issues found across your pack library"
- Each issue with a one-click "Fix in Editor" link

**Why this matters:** As a team's pack library grows, maintaining consistency becomes a real problem. This feature makes Contxt an *active* tool that proactively improves your AI context quality, not a passive storage system. It's the difference between a dead document repository and a living knowledge system.

---

## 6. Feature Priority Matrix

| Feature | User Value | Business Value | Effort | Ship Priority |
|---|---|---|---|---|
| Smart Pack Templates | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low | Week 2 |
| Pack Health Score | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Low | Week 2 |
| Quick Edit Mode | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Low | Week 2 |
| ⌘K Command Palette | ⭐⭐⭐⭐ | ⭐⭐⭐ | Low | Week 2 |
| GitHub README Import | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Month 1 |
| AI Pack Optimizer | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Month 1 |
| Pack Diff & Changelog | ⭐⭐⭐⭐ | ⭐⭐⭐ | Medium | Month 1 |
| Context Snippets | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | Month 2 |
| Pack Collections | ⭐⭐⭐ | ⭐⭐⭐⭐ | Low | Month 2 |
| Pack Request Board | ⭐⭐⭐ | ⭐⭐⭐⭐ | Low | Month 2 |
| Team Pack Inheritance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | Month 2 |
| Pack Embed Widget | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Low | Month 2 |
| CLI Tool | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High | Month 3 |
| VS Code Extension | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | Month 3–4 |
| Pack Analytics | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Month 3 |
| Live Collaboration | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High | Month 4 |
| Pack Marketplace | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | Month 5 |
| Enterprise Tier | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | Month 5–6 |
| MCP Server | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | Month 6 |
| Auto-Pack from GitHub | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Very High | Month 7–9 |
| Context Pack as Code | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High | Month 8 |
| Cross-Pack Intelligence | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Very High | Month 10–12 |

---

## The Product Narrative Arc

**Month 1 (MVP):** "I build a pack and copy it to Claude Code"
→ *One-time use tool*

**Month 2 (After Tier 1):** "I update my pack every week and check my score"
→ *Weekly habit*

**Month 3 (After Tier 2):** "My team shares packs and the AI optimizer keeps them sharp"
→ *Team infrastructure*

**Month 6 (After Tier 3):** "Our company's entire AI context lives in Contxt, with a marketplace of expert packs"
→ *Platform*

**Month 12 (After Tier 4):** "Our AI agents auto-load context from Contxt via MCP — we never think about it"
→ *Invisible infrastructure — the strongest possible moat*

---

*Contxt Feature Roadmap v1.0 — Product Strategy · March 2026*
