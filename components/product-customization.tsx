"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface ProductCustomizationProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    image: string
    rating: number
    category: string
    isVegetarian: boolean
    sizes: string[]
    toppings: string[]
  }
  isOpen: boolean
  onClose: () => void
}

const sizePrices = {
  Small: 0,
  Medium: 3,
  Large: 6,
}

const toppingPrices = {
  "Extra Cheese": 2.5,
  "Extra Pepperoni": 3.0,
  "Extra Chicken": 3.5,
  "Extra Meat": 4.0,
  Mushrooms: 1.5,
  "Bell Peppers": 1.5,
  "Red Onions": 1.5,
  Olives: 2.0,
  Basil: 1.0,
  Jalapeños: 1.5,
  Pineapple: 2.0,
  Bacon: 3.0,
  Ham: 3.0,
  Spinach: 1.5,
  "Feta Cheese": 2.5,
  "Extra Veggies": 2.0,
}

export function ProductCustomization({ product, isOpen, onClose }: ProductCustomizationProps) {
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const basePrice = product.price + (sizePrices[selectedSize as keyof typeof sizePrices] || 0)
  const toppingsPrice = selectedToppings.reduce((sum, topping) => {
    return sum + (toppingPrices[topping as keyof typeof toppingPrices] || 0)
  }, 0)
  const totalPrice = (basePrice + toppingsPrice) * quantity

  const handleToppingChange = (topping: string, checked: boolean) => {
    if (checked) {
      setSelectedToppings([...selectedToppings, topping])
    } else {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping))
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: basePrice + toppingsPrice,
      quantity,
      image: product.image,
      customizations: {
        size: selectedSize,
        toppings: selectedToppings,
      },
    })

    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} (${selectedSize}) has been added to your cart.`,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Pizza</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">{product.description}</p>
              <div className="flex space-x-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.isVegetarian && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Veggie
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h4 className="font-semibold mb-3">Choose Size</h4>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              {product.sizes.map((size) => (
                <div key={size} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={size} />
                    <Label htmlFor={size}>{size}</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +${sizePrices[size as keyof typeof sizePrices] || 0}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Toppings */}
          <div>
            <h4 className="font-semibold mb-3">Add Toppings</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(toppingPrices).map((topping) => (
                <div key={topping} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={topping}
                      checked={selectedToppings.includes(topping)}
                      onCheckedChange={(checked) => handleToppingChange(topping, checked as boolean)}
                    />
                    <Label htmlFor={topping} className="text-sm">
                      {topping}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +${toppingPrices[topping as keyof typeof toppingPrices]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h4 className="font-semibold mb-3">Quantity</h4>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Price ({selectedSize})</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {selectedToppings.length > 0 && (
                <div className="flex justify-between">
                  <span>Toppings ({selectedToppings.length})</span>
                  <span>${toppingsPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>×{quantity}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Add to Cart - ${totalPrice.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
