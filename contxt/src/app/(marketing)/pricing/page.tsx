import PricingSection from '@/components/marketing/PricingSection'
import CTASection from '@/components/marketing/CTASection'

export const metadata = {
  title: 'Pricing — Contxt',
  description: 'Simple, transparent pricing for individuals and teams.',
}

export default function PricingPage() {
  return (
    <>
      <div className="pt-28 pb-0 text-center px-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)] mb-3">
          Pricing
        </p>
        <h1
          className="font-display text-[var(--text-primary)]"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
        >
          Pay for what you need
        </h1>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm text-[var(--text-secondary)]">
          Start free. Upgrade when you need more packs, formats, or team features.
        </p>
      </div>
      <PricingSection />
      <CTASection />
    </>
  )
}
