"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Plus, Search, Filter } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { ProductCustomization } from "@/components/product-customization"

const categories = ["All", "Classic", "Specialty", "Vegetarian", "Meat Lovers", "Desserts", "Drinks"]

const menuItems = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil, olive oil",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    category: "Classic",
    isVegetarian: true,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Cheese", "Basil", "Olives"],
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella, tomato sauce, oregano",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    category: "Meat Lovers",
    isVegetarian: false,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Pepperoni", "Extra Cheese", "Mushrooms"],
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
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Chicken", "Red Onions", "Bell Peppers"],
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
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Veggies", "Feta Cheese", "Spinach"],
  },
  {
    id: 5,
    name: "Meat Lovers",
    description: "Pepperoni, sausage, ham, bacon, ground beef",
    price: 26.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    category: "Meat Lovers",
    isVegetarian: false,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Meat", "Jalapeños", "Extra Cheese"],
  },
  {
    id: 6,
    name: "Hawaiian Paradise",
    description: "Ham, pineapple, mozzarella, tomato sauce",
    price: 21.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    category: "Specialty",
    isVegetarian: false,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Ham", "Extra Pineapple", "Bacon"],
  },
]

export function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedProduct, setSelectedProduct] = useState<(typeof menuItems)[0] | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredItems = menuItems
    .filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleQuickAdd = (item: (typeof menuItems)[0]) => {
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
      description: `${item.name} (Medium) has been added to your cart.`,
    })
  }

  const handleCustomize = (item: (typeof menuItems)[0]) => {
    setSelectedProduct(item)
  }

  return (
    <>
      <section className="py-8 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold">Our Menu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our delicious selection of authentic pizzas, made fresh to order with premium ingredients.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search pizzas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
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
                  <div className="flex items-center justify-between mb-3">
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
                <CardFooter className="p-4 pt-0 space-y-2">
                  <Button className="w-full" onClick={() => handleQuickAdd(item)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add (Medium)
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleCustomize(item)}>
                    Customize
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pizzas found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductCustomization
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
