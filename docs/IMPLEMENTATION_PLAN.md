# ContextDrop — Technical Implementation Plan

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Stripe · Vercel
**Target:** Full MVP in 3 days (5 phases)

---

## Directory Structure (Target)

```
contextdrop/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── packs/
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── profile/page.tsx
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing page
│   │   ├── community/page.tsx
│   │   ├── community/[slug]/page.tsx   # Pack detail
│   │   └── u/[username]/page.tsx       # Creator profile
│   ├── api/
│   │   ├── auth/callback/route.ts
│   │   ├── packs/route.ts
│   │   ├── packs/[id]/route.ts
│   │   ├── packs/[id]/upvote/route.ts
│   │   ├── packs/[id]/fork/route.ts
│   │   └── stripe/webhook/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   ├── auth/
│   │   └── AuthButton.tsx
│   ├── pack/
│   │   ├── WizardForm.tsx
│   │   ├── WizardStep.tsx
│   │   ├── OutputModal.tsx
│   │   ├── CopyButton.tsx
│   │   ├── PackCard.tsx
│   │   └── PackActions.tsx
│   ├── community/
│   │   ├── PackFeed.tsx
│   │   ├── PackFilters.tsx
│   │   └── UpvoteButton.tsx
│   ├── dashboard/
│   │   ├── PackList.tsx
│   │   └── EmptyState.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── PlanGate.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   ├── server.ts                   # Server client (cookies)
│   │   └── middleware.ts
│   ├── pack/
│   │   ├── generator.ts                # Output format generation
│   │   └── schema.ts                   # Zod schemas for pack fields
│   ├── stripe/
│   │   └── client.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── usePacks.ts
│   └── useUpvote.ts
├── types/
│   └── index.ts                        # Shared TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── middleware.ts
├── next.config.ts
└── .env.local.example
```

---

## Phase 1 — Project Setup & Auth (Day 1 AM)

### 1.1 Scaffold

```bash
npx create-next-app@latest contextdrop \
  --typescript --tailwind --app --src-dir=false \
  --import-alias "@/*"

cd contextdrop

# shadcn/ui init (dark theme)
npx shadcn-ui@latest init

# Core shadcn components
npx shadcn-ui@latest add button card input label textarea
npx shadcn-ui@latest add select badge tabs separator
npx shadcn-ui@latest add dialog dropdown-menu toast
npx shadcn-ui@latest add progress avatar

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Stripe
npm install stripe @stripe/stripe-js

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Icons
npm install lucide-react
```

### 1.2 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_TEAM_PRICE_ID=

RESEND_API_KEY=
```

### 1.3 Database Schema (Supabase SQL Migration)

```sql
-- 001_initial_schema.sql

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Users (extended from auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  github_id text unique,
  email text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz default now()
);

-- Packs
create table public.packs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  slug text unique not null,
  is_public boolean default false,
  framework_tag text,
  language_tag text,
  fork_count integer default 0,
  upvote_count integer default 0,
  forked_from uuid references public.packs(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pack fields (each wizard step is a field)
create table public.pack_fields (
  id uuid default uuid_generate_v4() primary key,
  pack_id uuid references public.packs(id) on delete cascade not null,
  field_key text not null check (field_key in (
    'project_basics', 'tech_stack', 'architecture',
    'conventions', 'ai_rules', 'gotchas'
  )),
  field_value text,
  sort_order integer default 0
);

-- Pack version snapshots
create table public.pack_versions (
  id uuid default uuid_generate_v4() primary key,
  pack_id uuid references public.packs(id) on delete cascade not null,
  snapshot jsonb not null,
  version_number integer not null,
  created_at timestamptz default now()
);

-- Upvotes
create table public.upvotes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  pack_id uuid references public.packs(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, pack_id)
);

-- Forks
create table public.forks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  source_pack_id uuid references public.packs(id) on delete set null,
  forked_pack_id uuid references public.packs(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Team members (Pro/Team tier)
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_owner_id uuid references public.users(id) on delete cascade not null,
  member_id uuid references public.users(id) on delete cascade not null,
  role text not null default 'viewer' check (role in ('owner', 'editor', 'viewer')),
  invited_at timestamptz default now(),
  joined_at timestamptz,
  unique(team_owner_id, member_id)
);

-- Indexes
create index packs_user_id_idx on public.packs(user_id);
create index packs_is_public_idx on public.packs(is_public);
create index packs_framework_tag_idx on public.packs(framework_tag);
create index pack_fields_pack_id_idx on public.pack_fields(pack_id);
create index upvotes_pack_id_idx on public.upvotes(pack_id);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger packs_updated_at
  before update on public.packs
  for each row execute function update_updated_at();

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username, avatar_url, github_id)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'provider_id'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

### 1.4 Row Level Security Policies

```sql
-- RLS: users
alter table public.users enable row level security;
create policy "Users can view all profiles" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- RLS: packs
alter table public.packs enable row level security;
create policy "Anyone can view public packs" on public.packs
  for select using (is_public = true or auth.uid() = user_id);
create policy "Users can create packs" on public.packs
  for insert with check (auth.uid() = user_id);
create policy "Users can update own packs" on public.packs
  for update using (auth.uid() = user_id);
create policy "Users can delete own packs" on public.packs
  for delete using (auth.uid() = user_id);

-- RLS: pack_fields
alter table public.pack_fields enable row level security;
create policy "Pack fields visible if pack is visible" on public.pack_fields
  for select using (
    exists (
      select 1 from public.packs
      where id = pack_id and (is_public = true or user_id = auth.uid())
    )
  );
create policy "Owner can manage pack fields" on public.pack_fields
  for all using (
    exists (
      select 1 from public.packs where id = pack_id and user_id = auth.uid()
    )
  );

-- RLS: upvotes
alter table public.upvotes enable row level security;
create policy "Anyone can view upvotes" on public.upvotes for select using (true);
create policy "Auth users can upvote" on public.upvotes
  for insert with check (auth.uid() = user_id);
create policy "Users can remove own upvote" on public.upvotes
  for delete using (auth.uid() = user_id);

-- RLS: pack_versions
alter table public.pack_versions enable row level security;
create policy "Owner can view own pack versions" on public.pack_versions
  for select using (
    exists (select 1 from public.packs where id = pack_id and user_id = auth.uid())
  );
create policy "Owner can insert versions" on public.pack_versions
  for insert with check (
    exists (select 1 from public.packs where id = pack_id and user_id = auth.uid())
  );
```

### 1.5 Supabase Client Setup

**`lib/supabase/client.ts`** — Browser client (use in client components)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** — Server client (use in server components / API routes)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**`middleware.ts`** — Session refresh on every request
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 1.6 Auth Flow

**`app/api/auth/callback/route.ts`**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

**Login page** uses `supabase.auth.signInWithOAuth({ provider: 'github' })` and Google.

### 1.7 Landing Page Structure

Sections (all server-rendered):
1. **Hero** — headline, sub-headline, CTA buttons (Get Started free / View community packs), demo GIF
2. **Problem bar** — 3 pain points in icon+text cards
3. **Feature grid** — 6 features with icons (Pack Builder, One-Click Copy, Community Library, Team Sync, Version History, Format Support)
4. **How it works** — 3-step visual (Create → Generate → Copy)
5. **Pricing table** — Free / Pro $7 / Team $29 with Stripe checkout links
6. **Social proof** — placeholder for PH badge + testimonial quotes
7. **Footer** — links, GitHub, Twitter

---

## Phase 2 — Pack Builder Core (Day 1 PM)

### 2.1 TypeScript Types

```typescript
// types/index.ts

export type Plan = 'free' | 'pro' | 'team'

export interface User {
  id: string
  email: string
  username: string
  avatar_url: string | null
  bio: string | null
  plan: Plan
  stripe_customer_id: string | null
  created_at: string
}

export type FieldKey =
  | 'project_basics'
  | 'tech_stack'
  | 'architecture'
  | 'conventions'
  | 'ai_rules'
  | 'gotchas'

export interface PackField {
  field_key: FieldKey
  field_value: string
}

export interface Pack {
  id: string
  user_id: string
  title: string
  description: string | null
  slug: string
  is_public: boolean
  framework_tag: string | null
  language_tag: string | null
  fork_count: number
  upvote_count: number
  forked_from: string | null
  created_at: string
  updated_at: string
  pack_fields?: PackField[]
  users?: Pick<User, 'username' | 'avatar_url'>
}

export type OutputFormat = 'claude' | 'cursor' | 'windsurf' | 'generic' | 'json'

export interface WizardFormData {
  title: string
  description: string
  is_public: boolean
  framework_tag: string
  language_tag: string
  fields: Record<FieldKey, string>
}
```

### 2.2 Zod Schema

```typescript
// lib/pack/schema.ts
import { z } from 'zod'

export const packSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(80),
  description: z.string().max(300).optional(),
  is_public: z.boolean().default(false),
  framework_tag: z.string().max(50).optional(),
  language_tag: z.string().max(50).optional(),
  fields: z.object({
    project_basics: z.string().max(2000).optional(),
    tech_stack: z.string().max(2000).optional(),
    architecture: z.string().max(3000).optional(),
    conventions: z.string().max(3000).optional(),
    ai_rules: z.string().max(3000).optional(),
    gotchas: z.string().max(2000).optional(),
  }),
})

export type PackFormData = z.infer<typeof packSchema>
```

### 2.3 Output Generation Engine

```typescript
// lib/pack/generator.ts

import type { PackField, OutputFormat } from '@/types'

const FIELD_LABELS: Record<string, string> = {
  project_basics: 'Project Overview',
  tech_stack: 'Tech Stack',
  architecture: 'Architecture & Structure',
  conventions: 'Coding Conventions',
  ai_rules: 'AI Behaviour Rules',
  gotchas: 'Known Gotchas & Quirks',
}

function buildMarkdownBody(fields: PackField[], title: string): string {
  const sections = fields
    .filter((f) => f.field_value?.trim())
    .map((f) => `## ${FIELD_LABELS[f.field_key] ?? f.field_key}\n\n${f.field_value.trim()}`)
    .join('\n\n---\n\n')

  return sections
}

export function generateOutput(
  format: OutputFormat,
  title: string,
  fields: PackField[]
): string {
  const body = buildMarkdownBody(fields, title)

  switch (format) {
    case 'claude':
      return `# ${title}\n\n` +
        `> This CLAUDE.md file was generated by ContextDrop.\n` +
        `> Place it in your project root for Claude Code to auto-load.\n\n` +
        body

    case 'cursor':
      return `# Cursor Rules — ${title}\n\n` +
        `# Generated by ContextDrop — contextdrop.app\n\n` +
        body

    case 'windsurf':
      return `# Windsurf Rules — ${title}\n\n` +
        `# Generated by ContextDrop — contextdrop.app\n\n` +
        body

    case 'generic':
      return `# AI Context Pack — ${title}\n\n` +
        `_Generated by ContextDrop — contextdrop.app_\n\n` +
        body

    case 'json':
      return JSON.stringify(
        {
          title,
          generated_by: 'ContextDrop',
          fields: fields.reduce((acc, f) => {
            acc[f.field_key] = f.field_value
            return acc
          }, {} as Record<string, string>),
        },
        null,
        2
      )

    default:
      return body
  }
}
```

### 2.4 Wizard Form Component Architecture

The wizard is a **client component** with `useForm` (react-hook-form + zod resolver).

**State machine:**
```
Step 1: Project Basics (title, description, framework_tag, language_tag, is_public)
Step 2: Tech Stack (textarea — framework, language, UI lib, DB, hosting, CI/CD)
Step 3: Architecture Notes (textarea — folder structure, key modules, data flow)
Step 4: Coding Conventions (textarea — naming, patterns, lint, commit style)
Step 5: AI Behaviour Rules (textarea — dos and don'ts for the AI)
Step 6: Known Gotchas (textarea — environment quirks, legacy decisions)
```

**Key components:**
- `WizardForm.tsx` — orchestrates step state, form context, submit handler
- `WizardStep.tsx` — individual step wrapper with back/next/submit buttons
- `StepIndicator.tsx` — progress dots / numbered steps
- `OutputModal.tsx` — dialog shown after save with format tabs + CopyButton
- `CopyButton.tsx` — clipboard copy with toast confirmation

**Submit flow:**
1. `POST /api/packs` — creates pack + pack_fields in a Supabase transaction
2. On success → open `OutputModal` with generated content
3. Modal shows tabs: CLAUDE.md | .cursorrules | Windsurf | Generic | JSON
4. Each tab has a "Copy" button that copies to clipboard

### 2.5 Pack API Route

```typescript
// app/api/packs/route.ts (POST)
// 1. Verify auth (createClient, getUser)
// 2. Check plan limits: free users max 3 packs
// 3. Generate slug from title (nanoid suffix for uniqueness)
// 4. Insert into packs table
// 5. Insert all non-empty pack_fields
// 6. Create initial pack_version snapshot
// 7. Return created pack with fields
```

**Plan limit check:**
```typescript
const packCount = await supabase
  .from('packs')
  .select('id', { count: 'exact', head: true })
  .eq('user_id', user.id)

if (user.plan === 'free' && (packCount.count ?? 0) >= 3) {
  return NextResponse.json({ error: 'Pack limit reached' }, { status: 403 })
}
```

---

## Phase 3 — Dashboard & Pack Management (Day 2 AM)

### 3.1 Dashboard Page

**`app/(dashboard)/dashboard/page.tsx`** — Server component
- Fetch user's packs from Supabase (server client)
- Pass to `PackList` client component

**Dashboard layout:**
- Header: "My Context Packs" + "New Pack" button
- Stats bar: total packs / public packs / total upvotes received
- Pack grid: `PackCard` components (title, description, tags, is_public badge, upvote_count, fork_count, actions menu)
- Empty state with CTA to create first pack

### 3.2 Pack Card Actions

Dropdown menu on each card:
- **Edit** → navigate to `/packs/[id]/edit` (pre-populates wizard with existing data)
- **Duplicate** → `POST /api/packs/[id]/duplicate` (copies pack + fields with new title)
- **Toggle Public/Private** → `PATCH /api/packs/[id]` with `{ is_public: !current }`
- **View history** → sheet/drawer showing version list (Pro only — gate with `PlanGate`)
- **Delete** → confirmation dialog → `DELETE /api/packs/[id]`

### 3.3 Version History

On every pack save (create or edit):
1. Count existing versions for this pack
2. If count >= 5 and user is free tier: delete oldest
3. If user is Pro/Team: no limit
4. Insert new snapshot: `{ title, fields: [...] }` as JSONB

Version history drawer (Pro gate):
- Shows last N versions with timestamps
- "Restore" button → populates edit form with that snapshot

### 3.4 Edit Flow

`app/(dashboard)/packs/[id]/edit/page.tsx`:
1. Server component fetches pack + pack_fields
2. Passes to `WizardForm` with `defaultValues` populated
3. Submit calls `PATCH /api/packs/[id]` (upserts fields, saves version)
4. Show OutputModal on success

### 3.5 Plan Gating Component

```typescript
// components/shared/PlanGate.tsx
interface PlanGateProps {
  requiredPlan: 'pro' | 'team'
  userPlan: Plan
  children: React.ReactNode
  fallback?: React.ReactNode
}

// If userPlan < requiredPlan, render fallback (upgrade CTA) instead of children
```

---

## Phase 4 — Community Library (Day 2 PM)

### 4.1 Community Feed Page

**`app/(public)/community/page.tsx`** — Server component with searchParams
- URL: `/community?framework=nextjs&sort=upvotes&q=searchterm`
- Fetch public packs with joins to `users` (username, avatar_url)
- Pagination: 18 packs per page (cursor-based using `created_at`)

**Database query:**
```sql
SELECT p.*, u.username, u.avatar_url
FROM packs p
JOIN users u ON p.user_id = u.id
WHERE p.is_public = true
  AND ($framework = '' OR p.framework_tag = $framework)
ORDER BY
  CASE WHEN $sort = 'upvotes' THEN p.upvote_count END DESC,
  CASE WHEN $sort = 'forks' THEN p.fork_count END DESC,
  p.created_at DESC
LIMIT 18 OFFSET $offset;
```

### 4.2 Filter Bar Component

`PackFilters.tsx` — client component
- Framework chips: All / Next.js / MERN / Laravel / Django / FastAPI / React Native / Other
- Sort tabs: Most Upvoted / Most Forked / Newest
- Search input (debounced, updates URL param)
- Updates URL via `router.push` → triggers server-side re-render

### 4.3 Upvote System

**Optimistic UI approach:**
```typescript
// hooks/useUpvote.ts
// 1. Immediately toggle local state
// 2. Update upvote_count display
// 3. Call API in background
// 4. Revert on error

// POST /api/packs/[id]/upvote — add upvote
// DELETE /api/packs/[id]/upvote — remove upvote
// Atomic counter: use Supabase RPC to increment/decrement upvote_count
```

**Supabase RPC for atomic upvote:**
```sql
create or replace function toggle_upvote(p_pack_id uuid, p_user_id uuid)
returns json as $$
declare
  existing_id uuid;
  new_count integer;
begin
  select id into existing_id from upvotes
  where pack_id = p_pack_id and user_id = p_user_id;

  if existing_id is not null then
    delete from upvotes where id = existing_id;
    update packs set upvote_count = upvote_count - 1 where id = p_pack_id
    returning upvote_count into new_count;
    return json_build_object('action', 'removed', 'count', new_count);
  else
    insert into upvotes (pack_id, user_id) values (p_pack_id, p_user_id);
    update packs set upvote_count = upvote_count + 1 where id = p_pack_id
    returning upvote_count into new_count;
    return json_build_object('action', 'added', 'count', new_count);
  end if;
end;
$$ language plpgsql security definer;
```

### 4.4 Fork Functionality

`POST /api/packs/[id]/fork`:
1. Fetch source pack + fields
2. Create new pack with `forked_from = source_id`, title = "Fork of {title}", `is_public = false`
3. Copy all pack_fields
4. Insert into `forks` table
5. Increment `fork_count` on source pack (atomic RPC)
6. Redirect to new pack's edit page

### 4.5 Pack Detail Page

`app/(public)/community/[slug]/page.tsx` — Server component
- Hero: title, description, creator avatar + username, tags, upvote count, fork count, created date
- **Output preview tabs**: shows generated content for each format (read-only)
- CTA buttons: "Fork this Pack" (auth required) | "Copy [format]" (public copy, no auth)
- Author's other public packs (sidebar or below)

### 4.6 Creator Profile Page

`app/(public)/u/[username]/page.tsx` — Server component
- Avatar, username, bio, join date, pack stats
- Grid of public packs sorted by upvotes

---

## Phase 5 — Monetisation & Launch Prep (Day 3)

### 5.1 Stripe Integration

**Products to create in Stripe dashboard:**
- Pro: $7/month recurring (`price_xxx_pro`)
- Team: $29/month recurring (`price_xxx_team`)

**Checkout flow:**
```typescript
// app/api/stripe/checkout/route.ts (POST)
// 1. Get authenticated user
// 2. Get or create Stripe customer (store in users.stripe_customer_id)
// 3. Create checkout session with:
//    - price_id from query param
//    - success_url: /dashboard?upgraded=true
//    - cancel_url: /pricing
//    - metadata: { user_id }
// 4. Return session URL
```

**Webhook handler (`app/api/stripe/webhook/route.ts`):**
```typescript
// Events to handle:
// checkout.session.completed → update users.plan + stripe_subscription_id
// customer.subscription.updated → update plan
// customer.subscription.deleted → downgrade to 'free'
// Verify stripe signature from STRIPE_WEBHOOK_SECRET
```

**Customer portal:**
```typescript
// app/api/stripe/portal/route.ts (POST)
// Create billing portal session → redirect to Stripe portal
// Allows users to cancel, update card, view invoices
```

### 5.2 Feature Gating

All plan-gated features are enforced at both API and UI levels:

| Feature | Free | Pro | Team |
|---|---|---|---|
| Pack creation | 3 max | unlimited | unlimited |
| Output formats | generic only | all 4 | all 4 |
| Private packs | 1 | unlimited | unlimited |
| Version history | none | last 5 | full |
| Fork packs | view only | yes | yes |
| Team workspace | no | no | yes |

**API enforcement:** Check `user.plan` before operations
**UI enforcement:** `<PlanGate>` wrapper that shows upgrade modal

**Upgrade modal:**
- Triggered by clicking locked features
- Shows plan comparison table
- "Upgrade to Pro" → calls checkout API

### 5.3 SEO & Metadata

**`app/layout.tsx`** — Root metadata:
```typescript
export const metadata: Metadata = {
  title: 'ContextDrop — Load your brain into any AI agent in 30 seconds',
  description: 'Create structured Context Packs for AI coding agents. One-click copy for Claude Code, Cursor, Windsurf, and more.',
  openGraph: {
    title: 'ContextDrop',
    description: 'Load your brain into any AI agent in 30 seconds.',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
}
```

**Pack detail page** — Dynamic OG with pack title + creator:
```typescript
// app/(public)/community/[slug]/opengraph-image.tsx
// Use Next.js ImageResponse to generate OG image dynamically
```

**Sitemap:**
```typescript
// app/sitemap.ts
// Static: /, /community, /pricing
// Dynamic: /community/[slug] for all public packs
```

### 5.4 Analytics Events

PostHog events to track:
```typescript
// Key events:
posthog.capture('pack_created', { format_count, is_public, framework_tag })
posthog.capture('pack_copied', { format, pack_id })
posthog.capture('pack_upvoted', { pack_id })
posthog.capture('pack_forked', { source_pack_id })
posthog.capture('upgrade_clicked', { from_plan, to_plan, trigger })
posthog.capture('checkout_completed', { plan })
```

### 5.5 Pre-Launch: Seed Community Packs

Create 10–15 seeder packs via a script (`scripts/seed-packs.ts`):
- Next.js 14 App Router Pack
- MERN Stack Pack
- Laravel + Inertia Pack
- Django + DRF Pack
- FastAPI + SQLModel Pack
- React Native + Expo Pack
- SvelteKit Pack
- Remix Pack
- Nuxt 3 Pack
- Python Data Science Pack

Each seeder pack should be high quality, demonstrating all 6 wizard fields.

### 5.6 Deployment Checklist

```
Vercel Setup:
[ ] Connect GitHub repo
[ ] Set all env vars in Vercel dashboard
[ ] Set NEXT_PUBLIC_APP_URL to production URL
[ ] Configure Stripe webhook endpoint to Vercel URL

Supabase:
[ ] Run all migrations
[ ] Enable GitHub OAuth in Auth providers
[ ] Set redirect URL to https://yourdomain.com/api/auth/callback
[ ] Test RLS policies for private pack isolation
[ ] Enable PITR (Point-in-Time Recovery)

Pre-launch:
[ ] E2E test: signup → create pack → copy output
[ ] E2E test: make pack public → visible in community
[ ] E2E test: fork a pack → appears in dashboard
[ ] E2E test: upgrade to Pro → feature gates unlock
[ ] Test on mobile (responsive check)
[ ] Run Lighthouse audit (target 90+ performance)
[ ] Verify OG images render in opengraph.xyz
```

---

## Key Implementation Decisions

### Why App Router over Pages Router
- Server components reduce client JS for community/landing pages
- Route groups `(auth)`, `(dashboard)`, `(public)` for clean layout separation
- Native streaming for community feed

### Why Supabase over Prisma ORM
- Supabase client handles RLS automatically with user sessions
- Real-time subscriptions available for future team notifications
- Built-in storage if pack attachments are added later

### Why react-hook-form over controlled state
- 6-step wizard with validation per step
- No re-renders between keystrokes in textarea fields
- Zod resolver gives type-safe validation

### Slug generation
```typescript
import { nanoid } from 'nanoid'
const slug = `${slugify(title)}-${nanoid(6)}`
// e.g., "my-nextjs-project-k3x9ab"
```

### Private pack limit (free: 1 private)
Track `private_pack_count` at query time; enforce in API before insert/update.

---

## Risk Mitigations

| Risk | Mitigation |
|---|---|
| Supabase RLS leaking private packs | Write RLS test queries before launch; check both `user_id` and `is_public` in every policy |
| Stripe webhook missing events | Idempotency keys on webhook handler; log all events to a `stripe_events` table |
| Duplicate slugs on fork | Use `uuid_generate_v4()` suffix on forked pack slugs |
| Wizard losing state on refresh | Store wizard progress in `localStorage` keyed by pack id |
| Pack limit bypass on race condition | Use DB-level check in a Postgres function, not just app-level count |

---

*Implementation Plan v1.0 — ContextDrop — March 2026*
