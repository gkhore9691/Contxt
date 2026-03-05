export interface PackTemplate {
  id: string
  name: string
  description: string
  framework: string
  language: string
  uiLib: string
  db: string
  hosting: string
  architecture: string
  conventions: string
  aiRules: string
  gotchas: string
  usedCount: number
}

export const PACK_TEMPLATES: PackTemplate[] = [
  {
    id: 'nextjs-saas',
    name: 'Next.js 14 SaaS Starter',
    description: 'Full-stack SaaS with App Router, TypeScript, Tailwind, and Supabase',
    framework: 'Next.js',
    language: 'TypeScript',
    uiLib: 'shadcn/ui',
    db: 'PostgreSQL',
    hosting: 'Vercel',
    architecture: `App Router with route groups:
- (auth) — login, register, password reset
- (dashboard) — authenticated app pages
- (public) — landing, pricing, docs

Server Components for data fetching, Client Components only for interactivity.
API Routes in app/api/ for mutations.
Middleware for auth session refresh.`,
    conventions: `- camelCase for variables, PascalCase for components
- Named exports for components, default exports for pages
- Conventional commits: feat:, fix:, chore:, docs:
- ESLint + Prettier enforced
- One component per file in /components`,
    aiRules: `Always use TypeScript strict mode
Never use class components — functional components only
Always validate inputs with Zod before database operations
Prefer Server Components — use 'use client' only when interactivity is needed
Use next/image for all images
Never expose server-only env vars to client`,
    gotchas: `- Prisma client must be singleton — use lib/prisma.ts
- Server Actions need 'use server' at top of file
- Dynamic routes need generateStaticParams for static export
- middleware.ts only runs on Edge — no Node APIs`,
    usedCount: 2847,
  },
  {
    id: 'mern-stack',
    name: 'MERN Stack',
    description: 'MongoDB, Express, React, Node.js with REST API',
    framework: 'React',
    language: 'JavaScript',
    uiLib: 'Tailwind CSS',
    db: 'MongoDB',
    hosting: 'Render',
    architecture: `Monorepo structure:
- /client — React Vite app
- /server — Express API
- /shared — shared types and utils

REST API with Express Router.
MongoDB with Mongoose ODM.
JWT auth with httpOnly cookies.`,
    conventions: `- camelCase everywhere
- Controllers in /controllers, routes in /routes, models in /models
- Error handling via express-async-handler
- Consistent response format: { success, data, message }
- Commits: type(scope): message`,
    aiRules: `Always handle async errors with try/catch in controllers
Never store passwords in plain text — use bcrypt
Always validate request bodies before processing
Use environment variables for all secrets
Prefer async/await over .then() chains`,
    gotchas: `- MongoDB ObjectId must be validated before queries
- CORS must be configured for cross-origin requests
- Mongoose timestamps option auto-adds createdAt/updatedAt
- JWT tokens expire — handle refresh flow`,
    usedCount: 1923,
  },
  {
    id: 't3-stack',
    name: 'T3 Stack',
    description: 'Next.js, tRPC, Prisma, Tailwind — full type safety',
    framework: 'Next.js',
    language: 'TypeScript',
    uiLib: 'Tailwind CSS',
    db: 'PostgreSQL',
    hosting: 'Vercel',
    architecture: `T3 App bootstrapped with create-t3-app.
- tRPC for type-safe API layer (no REST)
- Prisma ORM with PostgreSQL
- NextAuth.js for authentication
- App Router with tRPC React Query integration`,
    conventions: `- Strict TypeScript — no 'any', no type assertions
- tRPC routers in /server/api/routers/
- Prisma schema as single source of truth for types
- Zod schemas for all tRPC inputs
- TanStack Query for client-side caching`,
    aiRules: `Always use tRPC procedures — never create REST API routes
Never import server code in client components
Use Prisma's type-safe queries — no raw SQL
Always define Zod input schemas for tRPC mutations
Prefer server-side data fetching with tRPC in Server Components`,
    gotchas: `- tRPC context must include session for protected routes
- Prisma migrate dev vs push — use push for prototyping
- NextAuth session callback must return user id
- Environment variables need NEXT_PUBLIC_ prefix for client`,
    usedCount: 1654,
  },
  {
    id: 'django-react',
    name: 'Django + React',
    description: 'Django REST Framework backend, React frontend',
    framework: 'Django',
    language: 'Python',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'Railway',
    architecture: `Separate frontend and backend:
- /backend — Django project with DRF
- /frontend — React Vite app

Django REST Framework for API.
Token-based auth with SimpleJWT.
PostgreSQL with Django ORM.
Celery + Redis for background tasks.`,
    conventions: `- snake_case for Python, camelCase for JavaScript
- Django apps in /backend/apps/
- Serializers mirror model structure
- ViewSets for CRUD, APIView for custom logic
- Black + isort for Python formatting`,
    aiRules: `Always use Django's ORM — no raw SQL
Use serializers for all request/response validation
Never put business logic in views — use service layer
Always add permissions classes to API views
Use select_related/prefetch_related for query optimization`,
    gotchas: `- Django CORS headers needed for React dev server
- Static files need collectstatic for production
- Celery workers need separate process/container
- Django admin is powerful — use it for debugging`,
    usedCount: 1287,
  },
  {
    id: 'laravel-inertia',
    name: 'Laravel + Inertia.js',
    description: 'Laravel backend with Inertia.js, Vue/React frontend',
    framework: 'Laravel',
    language: 'PHP',
    uiLib: 'Tailwind CSS',
    db: 'MySQL',
    hosting: 'Fly.io',
    architecture: `Laravel monolith with Inertia.js SPA.
- Controllers return Inertia responses, not Blade views
- Vue 3 components in /resources/js/Pages/
- Shared data via HandleInertiaRequests middleware
- Eloquent ORM with MySQL`,
    conventions: `- PSR-12 for PHP, ESLint for JavaScript
- Route-model binding everywhere
- Form Requests for validation
- Policies for authorization
- Migrations for all schema changes`,
    aiRules: `Always use Eloquent relationships — no raw queries
Use Form Requests for validation, not inline rules
Never put auth logic in controllers — use Policies
Use Inertia::render() for page responses
Always use named routes with route() helper`,
    gotchas: `- Inertia requires full page reload for auth state changes
- Laravel Mix vs Vite — this project uses Vite
- Queued jobs need queue worker running
- Storage links need php artisan storage:link`,
    usedCount: 986,
  },
  {
    id: 'fastapi-async',
    name: 'FastAPI Microservice',
    description: 'Async FastAPI with SQLAlchemy 2.0, Pydantic v2',
    framework: 'FastAPI',
    language: 'Python',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'Railway',
    architecture: `FastAPI async application:
- /app/api/ — route handlers
- /app/models/ — SQLAlchemy models
- /app/schemas/ — Pydantic v2 models
- /app/services/ — business logic
- /app/core/ — config, deps, security

Async SQLAlchemy 2.0 with asyncpg driver.
Alembic for migrations.`,
    conventions: `- snake_case for everything Python
- Pydantic models for request/response
- Dependency injection for DB sessions
- Type hints on all function signatures
- pytest + httpx for testing`,
    aiRules: `Always use async/await — this is an async app
Use Pydantic v2 models for all request/response schemas
Never create sessions manually — use Depends() injection
Always add response_model to route decorators
Use Alembic for all schema changes — never raw SQL`,
    gotchas: `- asyncpg pool needs proper cleanup on shutdown
- Background tasks run after response — don't await them
- Pydantic v2 uses model_validate, not parse_obj
- CORS middleware must be added before routes`,
    usedCount: 1432,
  },
  {
    id: 'react-native-expo',
    name: 'React Native + Expo',
    description: 'Cross-platform mobile app with Expo Router and TypeScript',
    framework: 'React Native',
    language: 'TypeScript',
    uiLib: 'None',
    db: 'SQLite',
    hosting: 'Self-hosted',
    architecture: `Expo managed workflow with Expo Router:
- /app/ — file-based routing (tabs, stacks)
- /components/ — reusable UI components
- /hooks/ — custom React hooks
- /store/ — Zustand state management
- /services/ — API client and business logic

NativeWind for styling (Tailwind on React Native).
AsyncStorage for local persistence.`,
    conventions: `- PascalCase for components, camelCase for functions
- Screen components in /app/ directory
- Shared components in /components/
- API calls through service layer
- Zustand stores one per domain`,
    aiRules: `Always use TypeScript strict mode
Use StyleSheet.create or NativeWind — no inline styles
Never import react-native-web directly
Always handle loading/error states in screens
Use expo-* packages over bare react-native equivalents`,
    gotchas: `- Expo Go has limited native module support
- EAS Build required for production builds
- Deep linking needs expo-linking configuration
- iOS simulator and Android emulator have different hot reload behaviour`,
    usedCount: 876,
  },
  {
    id: 'nestjs-prisma',
    name: 'NestJS + Prisma',
    description: 'Enterprise Node.js with NestJS, Prisma ORM, and TypeScript',
    framework: 'NestJS',
    language: 'TypeScript',
    uiLib: 'None',
    db: 'PostgreSQL',
    hosting: 'Railway',
    architecture: `NestJS modular architecture:
- /src/modules/ — feature modules (users, auth, posts...)
- Each module has: controller, service, module, dto, entity
- Prisma as ORM with /prisma/schema.prisma
- Guards for auth, Pipes for validation
- Swagger auto-generated from decorators`,
    conventions: `- Strict TypeScript with decorators
- DTOs with class-validator for input validation
- Services handle business logic, controllers handle HTTP
- Exception filters for consistent error responses
- Module-scoped providers`,
    aiRules: `Always use DTOs for request validation — never trust raw body
Use Guards for authentication and authorization
Never import modules circularly — use forwardRef() if needed
Always use Prisma transactions for multi-table operations
Use ConfigService for env vars — never process.env directly`,
    gotchas: `- Prisma client needs to be injected as a NestJS service
- Circular dependencies cause runtime errors — check module imports
- Guards run before interceptors and pipes
- WebSocket and REST share same NestJS instance`,
    usedCount: 1123,
  },
  {
    id: 'sveltekit-ts',
    name: 'SvelteKit + TypeScript',
    description: 'SvelteKit with TypeScript, Tailwind, and Prisma',
    framework: 'SvelteKit',
    language: 'TypeScript',
    uiLib: 'Tailwind CSS',
    db: 'PostgreSQL',
    hosting: 'Vercel',
    architecture: `SvelteKit file-based routing:
- /src/routes/ — pages and API endpoints
- /src/lib/ — shared utilities and components
- /src/lib/server/ — server-only code
- +page.svelte for pages, +page.server.ts for data loading
- +server.ts for API endpoints`,
    conventions: `- TypeScript strict mode
- $lib alias for /src/lib/
- Load functions for data fetching
- Form actions for mutations
- Svelte stores for shared state`,
    aiRules: `Always use load functions in +page.server.ts for data
Never access $env/static/private in client code
Use form actions for POST/PUT/DELETE — not fetch
Always type PageData and ActionData
Prefer server-side rendering — use ssr: true`,
    gotchas: `- $lib imports need explicit re-exports
- Environment variables split between static and dynamic
- Adapter selection matters for deployment target
- Hooks handle global middleware (auth, logging)`,
    usedCount: 743,
  },
  {
    id: 'ruby-rails',
    name: 'Ruby on Rails + Hotwire',
    description: 'Rails 7 with Hotwire Turbo, Stimulus, and PostgreSQL',
    framework: 'Ruby on Rails',
    language: 'Ruby',
    uiLib: 'Tailwind CSS',
    db: 'PostgreSQL',
    hosting: 'Fly.io',
    architecture: `Rails 7 with Hotwire:
- Standard MVC in app/ (models, views, controllers)
- Turbo Frames for partial page updates
- Stimulus controllers for JavaScript behaviour
- Active Record with PostgreSQL
- Sidekiq for background jobs`,
    conventions: `- snake_case for Ruby, kebab-case for CSS
- RESTful routes with resources
- Concerns for shared model logic
- Service objects for complex business logic
- RSpec for testing, FactoryBot for fixtures`,
    aiRules: `Always use Active Record callbacks judiciously — prefer service objects
Use Turbo Frames and Streams — avoid custom JavaScript
Never bypass validations with update_columns
Always use strong parameters in controllers
Prefer scopes over class methods for queries`,
    gotchas: `- Asset pipeline uses importmap by default in Rails 7
- Turbo Drive intercepts all links — use data-turbo-method for non-GET
- Credentials are encrypted — use rails credentials:edit
- Database migrations are irreversible in production — plan carefully`,
    usedCount: 654,
  },
]
