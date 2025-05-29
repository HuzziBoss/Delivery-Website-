"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

const featuredItems = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil, olive oil",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    category: "Classic",
    isVegetarian: true,
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella, tomato sauce, oregano",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    category: "Meat",
    isVegetarian: false,
  },
  {
    id: 3,
    name: "BBQ Chicken",
    description: "Grilled chicken, BBQ sauce, red onions, cilantro",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    category: "Specialty",
    isVegetarian: false,
  },
  {
    id: 4,
    name: "Veggie Deluxe",
    description: "Bell peppers, mushrooms, olives, onions, tomatoes",
    price: 20.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    category: "Vegetarian",
    isVegetarian: true,
  },
]

export function FeaturedMenu() {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: (typeof featuredItems)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      customizations: {
        size: "Medium",
        toppings: [],
      },
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">Featured Pizzas</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular pizzas, crafted with premium ingredients and authentic recipes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">${item.price}</span>
                  <div className="flex space-x-1">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.isVegetarian && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Veggie
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleAddToCart(item)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
