import CommunityFeed from '@/components/app/CommunityFeed'

export const metadata = {
  title: 'Community — Contxt',
}

export default function CommunityPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[var(--text-primary)]">COMMUNITY PACKS</h1>
        <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">
          500+ context packs built by developers, for developers.
        </p>
      </div>

      <CommunityFeed />
    </div>
  )
}
