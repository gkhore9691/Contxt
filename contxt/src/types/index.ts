export type Plan = 'FREE' | 'PRO' | 'TEAM'

export type OutputFormat = 'CLAUDE.md' | '.cursorrules' | 'Markdown' | 'JSON'

export interface User {
  id: string
  email: string
  name: string
  plan: Plan
  avatar?: string
}

export interface Pack {
  id: string
  title: string
  description: string
  framework: string
  language: string
  uiLib?: string
  db?: string
  hosting?: string
  architecture: string
  conventions: string
  aiRules: string
  gotchas: string
  isPublic: boolean
  upvotes: number
  forks: number
  authorId: string
  authorName: string
  authorHandle: string
  createdAt: string
  updatedAt: string
}

export interface PackFormData {
  // Step 1 — Project Basics
  name: string
  tagline: string
  description: string
  // Step 2 — Tech Stack
  framework: string
  language: string
  uiLib: string
  db: string
  hosting: string
  // Step 3 — Architecture
  architecture: string
  // Step 4 — Conventions
  conventions: string
  // Step 5 — AI Rules
  aiRules: string
  // Step 6 — Gotchas
  gotchas: string
}

export interface WizardStep {
  number: number
  title: string
  description: string
}

export const WIZARD_STEPS: WizardStep[] = [
  { number: 1, title: 'Basics', description: 'Project name and overview' },
  { number: 2, title: 'Stack', description: 'Tech stack and tools' },
  { number: 3, title: 'Architecture', description: 'Structure and data flow' },
  { number: 4, title: 'Conventions', description: 'Coding style and patterns' },
  { number: 5, title: 'AI Rules', description: 'Agent behaviour rules' },
  { number: 6, title: 'Gotchas', description: 'Known quirks and issues' },
]

export const FRAMEWORKS = [
  'Next.js', 'React', 'Vue', 'Nuxt', 'SvelteKit', 'Remix',
  'Angular', 'Astro', 'Laravel', 'Django', 'FastAPI',
  'Express', 'NestJS', 'Ruby on Rails', 'React Native', 'Flutter',
]

export const LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Ruby', 'PHP', 'Java']

export const UI_LIBS = ['shadcn/ui', 'Tailwind CSS', 'Chakra UI', 'MUI', 'Ant Design', 'Radix UI', 'None']

export const DATABASES = ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Supabase', 'PlanetScale', 'Prisma', 'Drizzle', 'None']

export const HOSTING = ['Vercel', 'Netlify', 'Railway', 'Render', 'AWS', 'GCP', 'Fly.io', 'DigitalOcean', 'Self-hosted']

// Mock data
export const MOCK_USER: User = {
  id: '1',
  email: 'dev@example.com',
  name: 'Alex Dev',
  plan: 'PRO',
}

export const MOCK_PACKS: Pack[] = [
  {
    id: '1',
    title: 'Next.js 14 SaaS Starter',
    description: 'Full-stack SaaS with App Router, Supabase auth, Stripe billing, and shadcn/ui.',
    framework: 'Next.js',
    language: 'TypeScript',
    uiLib: 'shadcn/ui',
    db: 'PostgreSQL',
    hosting: 'Vercel',
    architecture: '',
    conventions: '',
    aiRules: '',
    gotchas: '',
    isPublic: true,
    upvotes: 142,
    forks: 38,
    authorId: '1',
    authorName: 'Alex Dev',
    authorHandle: 'alexdev',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-04T14:22:00Z',
  },
  {
    id: '2',
    title: 'React Native Expo App',
    description: 'Cross-platform mobile app with Expo Router, Zustand, and NativeWind.',
    framework: 'React Native',
    language: 'TypeScript',
    uiLib: 'NativeWind',
    db: 'SQLite',
    hosting: 'Expo EAS',
    architecture: '',
    conventions: '',
    aiRules: '',
    gotchas: '',
    isPublic: false,
    upvotes: 0,
    forks: 0,
    authorId: '1',
    authorName: 'Alex Dev',
    authorHandle: 'alexdev',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z',
  },
  {
    id: '3',
    title: 'FastAPI + Postgres API',
    description: 'REST API with FastAPI, SQLAlchemy, Alembic migrations, and JWT auth.',
    framework: 'FastAPI',
    language: 'Python',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'Railway',
    architecture: '',
    conventions: '',
    aiRules: '',
    gotchas: '',
    isPublic: true,
    upvotes: 89,
    forks: 21,
    authorId: '1',
    authorName: 'Alex Dev',
    authorHandle: 'alexdev',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
]

export const MOCK_COMMUNITY_PACKS: Pack[] = [
  {
    id: 'c1',
    title: 'Next.js 14 SaaS Starter',
    description: 'Full-stack SaaS template with App Router, auth, billing, and dark mode built-in.',
    framework: 'Next.js',
    language: 'TypeScript',
    uiLib: 'shadcn/ui',
    db: 'PostgreSQL',
    hosting: 'Vercel',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 312, forks: 87,
    authorId: 'u1', authorName: 'Rohan M.', authorHandle: 'rohanm',
    createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'c2',
    title: 'MERN Stack E-commerce',
    description: 'MongoDB, Express, React, Node.js e-commerce with cart, auth, and admin panel.',
    framework: 'React',
    language: 'JavaScript',
    uiLib: 'Tailwind CSS',
    db: 'MongoDB',
    hosting: 'Render',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 245, forks: 62,
    authorId: 'u2', authorName: 'Divya S.', authorHandle: 'divyas',
    createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-02-25T00:00:00Z',
  },
  {
    id: 'c3',
    title: 'Django REST API',
    description: 'Django + DRF with JWT auth, Celery tasks, Redis caching, and Docker setup.',
    framework: 'Django',
    language: 'Python',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'AWS',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 198, forks: 45,
    authorId: 'u3', authorName: 'Marcus T.', authorHandle: 'marcust',
    createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'c4',
    title: 'Laravel Breeze SaaS',
    description: 'Laravel 11 with Breeze, Spatie roles, Livewire components, and Cashier billing.',
    framework: 'Laravel',
    language: 'PHP',
    uiLib: 'None',
    db: 'MySQL',
    hosting: 'Fly.io',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 176, forks: 41,
    authorId: 'u4', authorName: 'Priya N.', authorHandle: 'priyan',
    createdAt: '2026-02-05T00:00:00Z', updatedAt: '2026-02-28T00:00:00Z',
  },
  {
    id: 'c5',
    title: 'FastAPI Microservice',
    description: 'Async FastAPI with SQLAlchemy 2.0, Pydantic v2, background tasks, and OpenAPI docs.',
    framework: 'FastAPI',
    language: 'Python',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'Railway',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 163, forks: 38,
    authorId: 'u5', authorName: 'Chen W.', authorHandle: 'chenw',
    createdAt: '2026-02-08T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'c6',
    title: 'SvelteKit Blog Platform',
    description: 'SvelteKit with MDsveX, Prisma, edge functions, and RSS feed generation.',
    framework: 'SvelteKit',
    language: 'TypeScript',
    uiLib: 'Tailwind CSS',
    db: 'SQLite',
    hosting: 'Vercel',
    architecture: '', conventions: '', aiRules: '', gotchas: '',
    isPublic: true, upvotes: 144, forks: 29,
    authorId: 'u6', authorName: 'Alex K.', authorHandle: 'alexk',
    createdAt: '2026-02-12T00:00:00Z', updatedAt: '2026-02-27T00:00:00Z',
  },
]
