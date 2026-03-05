# Contxt — Master Frontend Prompt for Claude Code

> Paste this entire prompt into Claude Code to scaffold the complete frontend.

---

## 🧠 PROJECT OVERVIEW

You are building **Contxt** — a SaaS platform where developers create structured "Context Packs" for AI coding agents (Claude Code, Cursor, Windsurf, etc.) so they can load their full project context into any AI in 30 seconds instead of re-explaining it every session.

**Tagline:** *Load your brain into any AI agent in 30 seconds.*

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · Supabase Auth · Framer Motion

---

## 🎨 DESIGN SYSTEM & AESTHETIC

Model the aesthetic after **suprseo.com** — dark, editorial, brutalist-refined. Here are the precise rules:

### Color Palette (CSS Variables in `globals.css`)

```css
:root {
  /* Backgrounds */
  --bg-base: #080808;           /* true near-black page background */
  --bg-surface: #0f0f0f;        /* cards, modals */
  --bg-elevated: #161616;       /* hover states, secondary cards */
  --bg-border: #242424;         /* subtle borders */

  /* Typography */
  --text-primary: #f2f2f2;      /* headings */
  --text-secondary: #888888;    /* body, subtext */
  --text-muted: #444444;        /* placeholder, metadata */

  /* Accent — Electric Lime (not blue, not purple) */
  --accent: #c8f135;            /* primary CTA, highlights */
  --accent-dim: #9dbf2a;        /* hover on accent */
  --accent-glow: rgba(200, 241, 53, 0.12); /* glow bg for accent badges */

  /* Utility */
  --radius: 6px;
  --radius-lg: 12px;
}
```

### Typography

```css
/* In layout.tsx — import from Google Fonts */
/* Display: DM Serif Display — for all hero headings (H1, H2) */
/* Body: JetBrains Mono — for labels, tags, metadata, nav items, badges */
/* UI: Geist Sans — for body copy, descriptions, buttons */
```

Use these exact font assignments:
- `font-display` → `DM Serif Display` — hero titles, section headings
- `font-mono` → `JetBrains Mono` — labels in parentheses `( LIKE THIS )`, tags, metadata, code
- `font-sans` → `Geist` — all body text, descriptions, CTAs

### Design Principles (enforce these everywhere)

1. **Section labels in parentheses** — every section starts with a muted mono label like `( FEATURES )` or `( HOW IT WORKS )` in uppercase small text, exactly like suprseo.com
2. **Heavy uppercase headings** — H1/H2 use DM Serif Display, large (80–120px on desktop), tight letter-spacing (`-0.03em`)
3. **Accent lime sparingly** — only on primary CTAs, key highlights, and hover states. Never overuse.
4. **Card borders** — `border: 1px solid var(--bg-border)` — subtle, never glowing
5. **No gradients on backgrounds** — flat dark surfaces only. Gradients only as text effects on headings.
6. **Generous whitespace** — section padding `py-32` minimum
7. **Thin dividers** — `<hr>` elements between sections styled as `border-t border-[#1a1a1a]`
8. **Hover reveals** — cards show a `border-[var(--accent)]` border on hover with `transition-colors duration-200`
9. **Noise texture overlay** — apply a subtle SVG noise texture as a `::before` pseudo on `body` at 3–4% opacity to add grain
10. **Monospace metadata** — all small text (dates, tags, counts) uses `font-mono text-xs text-[var(--text-muted)]`

---

## 📁 PROJECT STRUCTURE

Scaffold this exact file structure:

```
contxt/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx           # Marketing layout with Navbar + Footer
│   │   ├── page.tsx             # Landing page (home)
│   │   └── pricing/
│   │       └── page.tsx         # Pricing page
│   ├── (app)/
│   │   ├── layout.tsx           # App layout (sidebar + topbar, auth required)
│   │   ├── dashboard/
│   │   │   └── page.tsx         # User's pack dashboard
│   │   ├── packs/
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # New pack wizard
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Edit/view single pack
│   │   └── community/
│   │       └── page.tsx         # Community library feed
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts         # Supabase OAuth callback
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Design tokens + base styles
├── components/
│   ├── marketing/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PricingSection.tsx
│   │   └── CTASection.tsx
│   ├── app/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── PackCard.tsx
│   │   ├── PackWizard.tsx
│   │   ├── OutputModal.tsx
│   │   └── CommunityFeed.tsx
│   └── ui/                      # shadcn/ui components live here
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── middleware.ts
└── tailwind.config.ts
```

---

## 🏠 PAGE: LANDING PAGE (`app/(marketing)/page.tsx`)

Build all sections in order. Each section is a separate component imported into `page.tsx`.

---

### Section 1: Navbar (`components/marketing/Navbar.tsx`)

```
Layout: full-width, sticky top, backdrop-blur-sm, border-b border-[#1a1a1a]
Background: bg-[#080808]/90

Left: Logo — "CONTXT" in JetBrains Mono, font-bold, text-[var(--text-primary)], 
      with a small lime square (8x8px, bg-[var(--accent)]) before the text

Center: Nav links — Features · How It Works · Community · Pricing
        Style: font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        transition-colors duration-150

Right: 
  - "Log in" → ghost button, mono font, text-secondary
  - "Get Started" → filled button, bg-[var(--accent)] text-black font-mono font-bold 
    text-sm px-4 py-2 rounded-[var(--radius)] hover:bg-[var(--accent-dim)]
```

---

### Section 2: Hero (`components/marketing/HeroSection.tsx`)

```
Layout: min-h-screen flex flex-col items-center justify-center text-center
        pt-32 pb-24 px-6

Top label: 
  ( AI CONTEXT MANAGEMENT )
  font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase mb-8

Main heading (2 lines, massive):
  Line 1: "LOAD YOUR BRAIN"
  Line 2: "INTO ANY AI AGENT"
  
  Style: font-display text-[clamp(56px,9vw,120px)] leading-[0.92] 
         tracking-[-0.03em] text-[var(--text-primary)] uppercase
  
  Line 2 should have a text gradient:
  background: linear-gradient(135deg, #c8f135 0%, #f2f2f2 60%)
  -webkit-background-clip: text; -webkit-text-fill-color: transparent

Subheading (below, centered, max-w-xl):
  "Stop re-explaining your project to AI agents every session. 
   Build a Context Pack once. Load it anywhere in 30 seconds."
  
  Style: text-[var(--text-secondary)] text-lg font-sans leading-relaxed mt-6

CTA buttons (row, gap-3, mt-10):
  Primary: "Build Your First Pack →"
    bg-[var(--accent)] text-black font-mono font-bold text-sm 
    px-6 py-3 rounded-[var(--radius)] hover:bg-[var(--accent-dim)]
  
  Secondary: "Browse Community Packs"
    border border-[var(--bg-border)] text-[var(--text-secondary)] 
    font-mono text-sm px-6 py-3 rounded-[var(--radius)]
    hover:border-[var(--accent)] hover:text-[var(--text-primary)]

Social proof line (below CTAs, mt-8):
  "( NO CREDIT CARD · FREE TO START · 500+ DEVS ONBOARDED )"
  font-mono text-xs text-[var(--text-muted)]

Scrolling tech ticker (below, mt-16):
  Label: "( WORKS WITH YOUR AI AGENT )"
  Infinite horizontal scroll strip with logos/names:
  Claude Code · Cursor · Windsurf · Replit Agent · GitHub Copilot · ChatGPT · Gemini · Cody
  
  Style: Each item is a pill — border border-[#242424] bg-[#0f0f0f] 
         font-mono text-xs text-[var(--text-muted)] px-3 py-1.5 rounded-full
  Use CSS animation: @keyframes scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
  animation: scroll 20s linear infinite
```

---

### Section 3: Features (`components/marketing/FeaturesSection.tsx`)

```
Section label: ( FEATURES & CAPABILITIES )

Heading: "Everything You Need to\nContext-Load Your AI"
Style: font-display text-[clamp(36px,5vw,64px)] text-[var(--text-primary)]

Layout: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3), gap-px
        Wrap in a container with border border-[#1a1a1a] — grid gap-px creates
        a "window-pane" effect with border lines between cards

6 feature cards:

1. "Context Pack Builder"
   Icon area: a small terminal window mockup showing the 6-step wizard fields
   Description: "6-step wizard captures your stack, conventions, rules, and gotchas 
                 into a structured pack."

2. "Multi-Format Output"  
   Icon area: code block showing CLAUDE.md / .cursorrules / markdown tabs
   Description: "Generate output formatted for Claude Code, Cursor, Windsurf, 
                 or any AI tool — one click to copy."

3. "Community Library"
   Icon area: grid of pack cards with upvote counts
   Description: "Browse 500+ community packs for Next.js, MERN, Laravel, Django, 
                 and more. Fork and customize instantly."

4. "Version History"
   Icon area: timeline of pack versions
   Description: "Track changes to your context packs over time. Roll back to any 
                 previous version."

5. "Team Workspace"
   Icon area: avatar stack + shared pack
   Description: "Share context packs with your team. Everyone gets identical AI 
                 context, consistent output."

6. "One-Click Copy"
   Icon area: copy button with tool selector dropdown
   Description: "Select your AI agent, hit copy. Your full project context is on 
                 your clipboard in 1 second."

Card style:
  bg-[var(--bg-surface)] p-8
  border-none (gap-px + wrapper border creates the grid lines)
  hover:bg-[var(--bg-elevated)] transition-colors duration-200
  
  Top of card: a small mono label in accent color — e.g., "01 /" font-mono text-xs text-[var(--accent)]
  Title: font-sans font-semibold text-[var(--text-primary)] text-lg mt-3
  Description: font-sans text-[var(--text-secondary)] text-sm mt-2 leading-relaxed
```

---

### Section 4: How It Works (`components/marketing/HowItWorksSection.tsx`)

```
Section label: ( HOW IT WORKS )

Heading: "From Zero to Context-Loaded\nin 3 Steps"

Layout: 3 columns, each with a large step number, title, bullets, and a 
        mini UI mockup illustration (build with divs/spans — no images needed)

Step 01 — "Build Your Pack"
  Illustration: a simplified wizard form mockup using divs
    - Show 6 labeled input rows: Stack / Conventions / Rules / Gotchas / etc.
    - Filled fields have bg-[#1a1a1a] with mono text
    - Active field has accent border
  Bullets:
    - Fill in 6 structured fields about your project
    - AI behaviour rules, coding conventions, known gotchas
    - Takes 5 minutes once, saves hours every week

Step 02 — "Generate & Copy"
  Illustration: output code block mockup
    - Tab selector: CLAUDE.md | .cursorrules | Markdown | JSON
    - Code preview in monospace showing a sample prompt
    - "Copy for Claude Code" button in accent color at bottom
  Bullets:
    - Pick your AI tool from the selector
    - Generated prompt is perfectly formatted for that agent
    - One click copies it to clipboard

Step 03 — "Share with Community"
  Illustration: community pack card
    - Pack title, framework tag, upvote count
    - Fork button + avatar of creator
    - "Next.js 14 · TypeScript · Tailwind" tags
  Bullets:
    - Publish your pack to the community library
    - Other devs can find, upvote, and fork your pack
    - Browse 500+ existing packs by framework

Step number style: 
  "01" / "02" / "03" — font-display text-[120px] leading-none 
  text-[#1a1a1a] absolute top-0 right-0 select-none (decorative background number)
  
Connector: thin horizontal dashed line between steps on desktop
  border-t border-dashed border-[#242424]
```

---

### Section 5: Stats Bar

```
Full-width dark bar: bg-[#0f0f0f] border-y border-[#1a1a1a] py-12

4 stats in a row (grid-cols-2 md:grid-cols-4):

  "500+"     → "Developers Onboarded"
  "2,400+"   → "Context Packs Created"
  "12"       → "AI Tools Supported"
  "30 sec"   → "Average Load Time"

Stat number style: font-display text-5xl text-[var(--text-primary)]
Label style: font-mono text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider
```

---

### Section 6: Testimonials (`components/marketing/TestimonialsSection.tsx`)

```
Section label: ( WHAT DEVS SAY )

Heading: "Don't Take Our Word For It*"
Subheading (italic, small, muted): "*Take theirs"

Layout: infinite horizontal scroll — two rows of cards, 
        row 1 scrolls left, row 2 scrolls right (opposite direction)
        Same CSS animation as ticker but: row2 uses animation-direction: reverse

8 testimonial cards per row (duplicate for seamless loop):

Card style:
  bg-[var(--bg-surface)] border border-[#1a1a1a]
  p-6 rounded-[var(--radius-lg)] w-[320px] flex-shrink-0
  
  Quote: font-sans text-sm text-[var(--text-secondary)] leading-relaxed
  
  Author row (mt-4):
    Avatar: 32px circle, bg gradient from accent to accent-dim, 
            initials in black font-mono text-xs font-bold
    Name: font-sans text-sm font-medium text-[var(--text-primary)]
    Role + Company: font-mono text-xs text-[var(--text-muted)]

Sample testimonials:
  1. "I used to spend 15 minutes at the start of every Claude Code session re-explaining my Next.js setup. Now I paste my Contxt pack and I'm coding in 30 seconds." — Rohan M., Indie Hacker
  2. "Our team of 5 devs all use the same context pack. The AI output is finally consistent across PRs." — Divya S., Tech Lead @ Startup
  3. "The community library alone is worth it. Found a perfect Next.js 14 pack, forked it, tweaked 3 fields, done." — Alex K., Freelance Dev
  4. "Switched from Cursor to Claude Code and my context pack just worked. That portability is everything." — Marcus T., Full Stack Dev
  5. "Fork a community pack → edit 10% → ship. That's my entire onboarding flow for new projects now." — Priya N., Engineering Manager
  6. "I maintain 3 OSS repos. Published a context pack for each. Contributors now get consistent AI output." — Chen W., OSS Maintainer
```

---

### Section 7: Pricing (`components/marketing/PricingSection.tsx`)

```
Section label: ( PRICING )

Heading: "Simple, Transparent Pricing"

Layout: 3 cards side by side (grid-cols-1 md:grid-cols-3), gap-4

FREE card:
  bg-[var(--bg-surface)] border border-[#242424]
  
PRO card (FEATURED):
  bg-[var(--bg-surface)] border border-[var(--accent)]
  Add a "MOST POPULAR" badge — font-mono text-xs bg-[var(--accent)] text-black 
  px-2 py-0.5 rounded-sm absolute -top-3 left-1/2 -translate-x-1/2
  
TEAM card:
  bg-[var(--bg-surface)] border border-[#242424]

Card anatomy:
  Plan name: font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest
  Price: font-display text-5xl text-[var(--text-primary)] 
         + "/mo" in font-mono text-sm text-[var(--text-muted)]
  Tagline: font-sans text-sm text-[var(--text-secondary)] mt-2
  
  Divider: border-t border-[#1a1a1a] my-6
  
  Feature list: each item has a "→" prefix in accent color, font-mono text-xs
  
  CTA button:
    Free: ghost border button
    Pro: bg-[var(--accent)] text-black font-mono font-bold — full width
    Team: ghost border button

Plan details:
  FREE — $0/mo — "For solo devs getting started"
    → 3 Context Packs
    → Generic markdown output
    → 1 Private Pack
    → Community library (browse + upvote)
  
  PRO — $7/mo — "For serious indie developers"
    → Unlimited Context Packs
    → All 4 output formats (CLAUDE.md, .cursorrules, Markdown, JSON)
    → Unlimited Private Packs
    → Version history (last 5)
    → Community library (browse + fork)
    → Email support
  
  TEAM — $29/mo — "For dev teams"
    → Everything in Pro
    → Team workspace (up to 10 members)
    → Shared pack library
    → Role-based editing
    → Full version history
    → Slack + Email support
```

---

### Section 8: CTA Section (`components/marketing/CTASection.tsx`)

```
Full-width section, bg-[#080808], large centered text

Section label: ( START TODAY )

Big heading:
  "READY TO SHIP"
  "FASTER WITH AI?"
  font-display text-[clamp(48px,8vw,100px)] uppercase 
  Line 2: apply the same lime gradient text effect as hero

Sub-copy:
  "Free forever. No credit card. Your first pack in 5 minutes."
  font-mono text-sm text-[var(--text-muted)]

CTA: "Build Your First Pack →"
  Same accent button style, large: px-8 py-4 text-base

Below CTA: small mono text
  "( CLAUDE CODE · CURSOR · WINDSURF · REPLIT · COPILOT )"
  font-mono text-xs text-[var(--text-muted)] tracking-widest mt-6
```

---

### Section 9: Footer (`components/marketing/Footer.tsx`)

```
bg-[#080808] border-t border-[#1a1a1a] py-16 px-6

Top row:
  Left: Logo "CONTXT" + tagline "Load your brain into any AI agent in 30 seconds."
        font-sans text-sm text-[var(--text-secondary)]
  
  Right: 4 columns of links
    Product: Features · How It Works · Community · Pricing
    Resources: Documentation · Blog · Changelog
    Company: About · Privacy · Terms
    Connect: GitHub · Twitter/X · Discord

Link style: font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]

Bottom row (border-t border-[#1a1a1a] mt-12 pt-8):
  Left: "© 2026 Contxt. All rights reserved."
  Right: "Made for developers, by developers."
  Both: font-mono text-xs text-[var(--text-muted)]
```

---

## 📱 APP LAYOUT & DASHBOARD

### App Sidebar (`components/app/Sidebar.tsx`)

```
Width: w-56 fixed left-0 top-0 h-screen
Background: bg-[#080808] border-r border-[#1a1a1a]

Top: Logo "CONTXT" with lime square, px-4 py-5

Nav items (mt-8):
  - Dashboard
  - My Packs
  - Community
  - Settings

Item style: 
  font-mono text-xs text-[var(--text-muted)] px-4 py-2.5
  flex items-center gap-3 rounded-[var(--radius)]
  hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]
  
Active item:
  bg-[var(--bg-elevated)] text-[var(--text-primary)]
  border-l-2 border-[var(--accent)]

Bottom: user avatar + email + plan badge
  Plan badge: font-mono text-[10px] 
    FREE → border border-[#242424] text-[var(--text-muted)]
    PRO  → bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/30
```

### Dashboard Page (`app/(app)/dashboard/page.tsx`)

```
Header row:
  Left: "MY PACKS" — font-display text-3xl text-[var(--text-primary)]
  Right: "+ New Pack" button — accent style

Stats row (4 mini stat cards):
  Packs Created / Community Packs / Total Upvotes / Forks Received
  Card: bg-[var(--bg-surface)] border border-[#1a1a1a] p-4 rounded-[var(--radius)]
  Number: font-display text-2xl; Label: font-mono text-xs text-[var(--text-muted)]

Pack grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-4, mt-8)

PackCard component style:
  bg-[var(--bg-surface)] border border-[#1a1a1a] p-5 rounded-[var(--radius-lg)]
  hover:border-[var(--accent)]/40 transition-all duration-200
  
  Top row: Pack title (font-sans font-medium text-[var(--text-primary)]) 
           + visibility badge (PUBLIC/PRIVATE) in mono text-xs
  
  Middle: framework tag pill + language tag pill
    font-mono text-xs border border-[#242424] px-2 py-0.5 rounded-full 
    text-[var(--text-muted)]
  
  Footer row (border-t border-[#1a1a1a] pt-3 mt-4):
    Left: "Updated 2d ago" — font-mono text-xs text-[var(--text-muted)]
    Right: Copy button (icon) + Edit button (icon) + ⋯ menu
```

---

## 🧙 PACK WIZARD (`components/app/PackWizard.tsx`)

```
Layout: full-page centered, max-w-2xl mx-auto

Progress bar at top:
  6 steps shown as numbered circles connected by lines
  Active: bg-[var(--accent)] text-black
  Completed: bg-[var(--accent)]/20 text-[var(--accent)] with checkmark
  Inactive: bg-[var(--bg-elevated)] text-[var(--text-muted)]
  
Step titles shown below: font-mono text-xs text-[var(--text-muted)]

Each step card:
  bg-[var(--bg-surface)] border border-[#1a1a1a] rounded-[var(--radius-lg)] p-8

Step labels (above each input):
  font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-1

Input style:
  bg-[var(--bg-base)] border border-[#242424] rounded-[var(--radius)]
  text-[var(--text-primary)] font-mono text-sm p-3
  focus:border-[var(--accent)]/60 focus:outline-none
  placeholder:text-[var(--text-muted)]

Multi-select tags (for stack choices):
  Pill buttons: border border-[#242424] font-mono text-xs px-3 py-1.5 rounded-full
  Selected: bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)]

Navigation buttons (bottom row):
  Left: "← Back" ghost button
  Right: "Continue →" accent button
  Step 6: "Generate Pack →" accent button (larger)

The 6 steps:
  1. Project Basics — name, one-liner, description textarea
  2. Tech Stack — framework picker (Next.js, React, Vue, etc.), language, UI lib, DB, hosting
  3. Architecture — textarea: folder structure, key modules, data flow
  4. Conventions — textarea: naming conventions, component patterns, linting, commit style
  5. AI Rules — textarea: what AI should/shouldn't do. Pre-filled examples:
     "Always use TypeScript strict mode"
     "Never use class components"  
     "Always use Zod for validation"
  6. Gotchas — textarea: known issues, quirks, legacy decisions
```

---

## 📤 OUTPUT MODAL (`components/app/OutputModal.tsx`)

```
Full-screen modal overlay: bg-black/80 backdrop-blur-sm

Modal: bg-[var(--bg-surface)] border border-[#1a1a1a] rounded-[var(--radius-lg)]
       max-w-2xl w-full mx-auto max-h-[80vh] overflow-hidden

Header:
  "YOUR CONTEXT PACK IS READY" — font-mono text-xs text-[var(--accent)] uppercase
  Pack title — font-display text-2xl text-[var(--text-primary)]

Tool selector tabs (horizontal, below header):
  "CLAUDE.md" | ".cursorrules" | "Markdown" | "JSON"
  Active tab: border-b-2 border-[var(--accent)] text-[var(--text-primary)]
  Inactive: text-[var(--text-muted)]
  All: font-mono text-xs uppercase px-4 py-3

Code preview area:
  bg-[var(--bg-base)] rounded-[var(--radius)] p-5 font-mono text-xs 
  text-[var(--text-secondary)] leading-relaxed overflow-y-auto max-h-[360px]
  border border-[#242424]
  
  Show first 20 lines of the generated prompt with syntax-like coloring:
  Section headers (# Project Context): text-[var(--accent)]
  Keys (Stack:): text-[#7dd3fc] (soft blue)
  Values: text-[var(--text-primary)]

Footer action row:
  Left: character count — font-mono text-xs text-[var(--text-muted)]
        "~1,240 characters · fits in any context window"
  
  Right:
    "Copy to Clipboard" → accent button with copy icon
    After copy: button text changes to "Copied! ✓" for 2 seconds

Bottom link: "Make this pack public →" — font-mono text-xs text-[var(--accent)]
```

---

## 🌐 COMMUNITY FEED (`components/app/CommunityFeed.tsx`)

```
Header:
  "COMMUNITY PACKS" — font-display text-3xl
  Sub: "500+ context packs built by developers, for developers."

Filter row (sticky, bg-[#080808] border-b border-[#1a1a1a] py-3):
  Framework pills: All · Next.js · MERN · Laravel · Django · FastAPI · React Native · ...
  Sort: Most Upvoted | Most Forked | Newest
  All: font-mono text-xs

Pack list (single column, max-w-2xl mx-auto, space-y-3):

Community PackCard:
  bg-[var(--bg-surface)] border border-[#1a1a1a] p-5 rounded-[var(--radius-lg)]
  hover:border-[var(--bg-border)] transition-colors
  
  Layout: 
    Left: upvote button (vertical — count on top, ▲ arrow below)
      Count: font-display text-lg text-[var(--text-primary)]
      Arrow: text-[var(--text-muted)] hover:text-[var(--accent)]
      When upvoted: text-[var(--accent)]
    
    Right content:
      Title: font-sans font-medium text-[var(--text-primary)]
      Description: font-sans text-sm text-[var(--text-secondary)] mt-1
      Tags row: framework + language pills (mono text-xs)
      Footer: "by @username · 3 days ago · 12 forks"
               font-mono text-xs text-[var(--text-muted)]
      
      Action: "Fork Pack →" — ghost button, font-mono text-xs
               On hover: border-[var(--accent)] text-[var(--accent)]
```

---

## ⚙️ TAILWIND CONFIG (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#c8f135',
        'accent-dim': '#9dbf2a',
        bg: {
          base: '#080808',
          surface: '#0f0f0f',
          elevated: '#161616',
          border: '#242424',
        },
        text: {
          primary: '#f2f2f2',
          secondary: '#888888',
          muted: '#444444',
        }
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Geist', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '12px',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        scroll: 'scroll 25s linear infinite',
        'scroll-reverse': 'scroll 25s linear infinite reverse',
        'fade-up': 'fade-up 0.5s ease forwards',
      }
    }
  },
  plugins: [],
}

export default config
```

---

## 🌍 GLOBALS.CSS BASE

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --bg-base: #080808;
  --bg-surface: #0f0f0f;
  --bg-elevated: #161616;
  --bg-border: #242424;
  --text-primary: #f2f2f2;
  --text-secondary: #888888;
  --text-muted: #444444;
  --accent: #c8f135;
  --accent-dim: #9dbf2a;
  --accent-glow: rgba(200, 241, 53, 0.12);
  --radius: 6px;
  --radius-lg: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Geist', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

/* Noise grain overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 9999;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--bg-border); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Selection */
::selection { background: var(--accent-glow); color: var(--accent); }
```

---

## 📋 IMPLEMENTATION NOTES FOR CLAUDE CODE

1. **Install dependencies first:**
   ```bash
   npx create-next-app@latest contxt --typescript --tailwind --app --src-dir=false --import-alias="@/*"
   cd contxt
   npx shadcn@latest init
   npx shadcn@latest add button badge card dialog tabs input textarea separator
   npm install framer-motion @supabase/supabase-js @supabase/ssr
   npm install geist
   ```

2. **Font setup:** Import DM Serif Display and JetBrains Mono via `next/font/google` in `app/layout.tsx`. Apply as CSS variables `--font-display`, `--font-mono`.

3. **shadcn theme override:** After init, update `components.json` and override the shadcn default colors in `globals.css` to use the Contxt design tokens — do NOT use the default shadcn zinc/slate palette.

4. **Start with marketing pages** — full landing page first, then app layout, then wizard, then community feed.

5. **Framer Motion:** Use `motion.div` with `initial={{ opacity: 0, y: 20 }}` `whileInView={{ opacity: 1, y: 0 }}` on all sections for scroll-triggered reveals. Wrap in `<LazyMotion features={domAnimation}>`.

6. **No placeholder images** — build all UI mockups/illustrations using divs, spans, and CSS. No `<img>` tags with placeholder URLs anywhere.

7. **Mobile responsive** — every section must be responsive. Use `sm:`, `md:`, `lg:` breakpoints consistently. The ticker and testimonial scrollers should pause on mobile.

8. **TypeScript strict** — all components fully typed. Define all types in `types/index.ts`.

---

*Contxt Frontend Master Prompt v1.0 — Generated March 2026*
