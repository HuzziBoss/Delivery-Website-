import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedMenu } from "@/components/featured-menu"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedMenu />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
