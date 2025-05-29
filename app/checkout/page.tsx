"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Truck, Clock, MapPin } from "lucide-react"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getTotalPrice()
  const deliveryFee = deliveryMethod === "delivery" ? (subtotal > 25 ? 0 : 3.99) : 0
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (deliveryMethod === "delivery" && (!deliveryAddress.street || !deliveryAddress.city)) {
      toast({
        title: "Delivery address required",
        description: "Please provide a complete delivery address.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create order
    const order = {
      id: Date.now().toString(),
      items,
      total,
      deliveryMethod,
      paymentMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : null,
      specialInstructions,
      status: "confirmed",
      estimatedTime: deliveryMethod === "delivery" ? "30-45 minutes" : "15-20 minutes",
      createdAt: new Date().toISOString(),
    }

    // Store order in localStorage (in real app, this would be sent to your API)
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]))

    clearCart()
    setIsProcessing(false)

    toast({
      title: "Order placed successfully!",
      description: `Your order #${order.id} has been confirmed.`,
    })

    router.push(`/orders/${order.id}`)
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Delivery</div>
                          <div className="text-sm text-muted-foreground">30-45 minutes</div>
                        </div>
                        <div className="text-sm">{subtotal > 25 ? "FREE" : "$3.99"}</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Pickup</div>
                          <div className="text-sm text-muted-foreground">15-20 minutes</div>
                        </div>
                        <div className="text-sm">FREE</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {deliveryMethod === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={deliveryAddress.zipCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                      placeholder="12345"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This is a demo. No real payment will be processed.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special requests for your order? (e.g., extra crispy, no onions, etc.)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">
                          {item.customizations.size} • Qty: {item.quantity}
                        </div>
                        {item.customizations.toppings.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            + {item.customizations.toppings.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

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

                {/* Estimated Time */}
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Estimated {deliveryMethod}: {deliveryMethod === "delivery" ? "30-45" : "15-20"} minutes
                  </span>
                </div>

                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
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
