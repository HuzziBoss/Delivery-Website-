import { Header } from "@/components/header"
import { MenuContent } from "@/components/menu-content"
import { Footer } from "@/components/footer"

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MenuContent />
      </main>
      <Footer />
    </div>
  )
}
