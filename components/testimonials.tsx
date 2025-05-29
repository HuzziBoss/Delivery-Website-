import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Best pizza in town! The delivery is always fast and the pizza arrives hot. Highly recommend the Margherita Classic!",
    location: "Downtown",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment:
      "Amazing quality and great customer service. The online ordering system is so easy to use. Will definitely order again!",
    location: "Westside",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment:
      "Love the variety of toppings and the ability to customize my order. The BBQ Chicken pizza is absolutely delicious!",
    location: "Northside",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
