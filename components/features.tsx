import { Shield, Clock, Truck, Star, Phone, CreditCard } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Hot pizza delivered to your door in 30 minutes or less, guaranteed.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Premium ingredients and authentic recipes for the perfect pizza every time.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Enjoy free delivery on all orders over $25 within our delivery zone.",
  },
  {
    icon: Star,
    title: "5-Star Service",
    description: "Rated #1 pizza delivery service with thousands of satisfied customers.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Our customer service team is available around the clock to help you.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Safe and secure online payments with multiple payment options available.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">Why Choose North King Pizza?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering the best pizza experience with exceptional service and quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
