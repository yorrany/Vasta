import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"
import { HowItWorks } from "../components/HowItWorks"
import { Pricing } from "../components/Pricing"
import { Testimonials } from "../components/Testimonials"
import { FAQ } from "../components/FAQ"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-vasta-bg text-vasta-text">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <footer className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-vasta-muted">
          <span>© {new Date().getFullYear()} Vasta. Todos os direitos reservados.</span>
          <span>Brasil-first • Stripe • Multi-tenant</span>
        </div>
      </footer>
    </div>
  )
}

