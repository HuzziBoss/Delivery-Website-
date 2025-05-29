"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const subtotal = getTotalPrice()
  const discount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0
  const deliveryFee = subtotal > 25 ? 0 : 3.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + deliveryFee + tax

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const validCoupons = {
      SAVE10: 10,
      WELCOME20: 20,
      PIZZA15: 15,
    }

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons],
      })
      toast({
        title: "Coupon applied!",
        description: `You saved ${validCoupons[couponCode as keyof typeof validCoupons]}% on your order.`,
      })
      setCouponCode("")
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid. Try SAVE10, WELCOME20, or PIZZA15.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some delicious pizzas to your cart first!",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <div className="text-center space-y-6">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any delicious pizzas to your cart yet.
              </p>
            </div>
            <Button size="lg" onClick={() => router.push("/menu")}>
              Browse Menu
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={`${item.id}-${item.customizations.size}-${index}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id, item.customizations)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 mb-3">
                        <Badge variant="outline">Size: {item.customizations.size}</Badge>
                        {item.customizations.toppings.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.customizations.toppings.map((topping) => (
                              <Badge key={topping} variant="secondary" className="text-xs">
                                {topping}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.customizations, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.customizations, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={clearCart} className="w-full">
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Coupon Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">
                      {appliedCoupon.code} (-{appliedCoupon.discount}%)
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setAppliedCoupon(null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode}>
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">Try: SAVE10, WELCOME20, or PIZZA15</p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 25 && (
                  <p className="text-sm text-muted-foreground">
                    Add ${(25 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
