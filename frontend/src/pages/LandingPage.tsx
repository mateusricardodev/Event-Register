import { LandingNavbar } from '../components/LandingNavbar'
import { Hero } from '../components/Hero'
import { BeforeAfter } from '../components/BeforeAfter'
import { FeaturesGrid } from '../components/FeaturesGrid'
import { PublicFormPreview } from '../components/PublicFormPreview'
import { TrustBadges } from '../components/TrustBadges'
import { Testimonials } from '../components/Testimonials'
import { FAQ } from '../components/FAQ'
import { LandingCTA } from '../components/LandingCTA'
import { Footer } from '../components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <BeforeAfter />
        <FeaturesGrid />
        <PublicFormPreview />
        <TrustBadges />
        <Testimonials />
        <FAQ />
        <LandingCTA />
      </main>
      <Footer />
    </div>
  )
}
