import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import StatsBar from '@/components/marketing/StatsBar'
import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import PricingSection from '@/components/marketing/PricingSection'
import CTASection from '@/components/marketing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsBar />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
