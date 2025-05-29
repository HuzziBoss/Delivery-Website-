import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Truck, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-orange-50 py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Fresh Pizza
                <span className="text-red-600"> Delivered</span>
                <br />
                to Your Door
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Authentic Italian flavors made with the finest ingredients. Order online and enjoy hot, delicious pizza
                in 30 minutes or less.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/menu">
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/menu">View Menu</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-sm font-medium">30 Min Delivery</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Truck className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-sm font-medium">Free Delivery</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-sm font-medium">5 Star Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-orange-100">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Delicious pizza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">4.9</span>
                </div>
                <div>
                  <div className="font-semibold">Excellent Rating</div>
                  <div className="text-sm text-muted-foreground">Based on 1000+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
