"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { Package, Truck, CheckCircle, MapPin, Phone, ArrowLeft } from "lucide-react"

interface Order {
  id: string
  items: any[]
  total: number
  deliveryMethod: string
  paymentMethod: string
  deliveryAddress?: any
  specialInstructions?: string
  status: string
  estimatedTime: string
  createdAt: string
}

const orderStatuses = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Package },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
]

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user && params.id) {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = storedOrders.find((o: Order) => o.id === params.id)
      setOrder(foundOrder || null)
    }
  }, [user, params.id])

  const getCurrentStatusIndex = () => {
    if (!order) return 0
    return orderStatuses.findIndex((status) => status.key === order.status)
  }

  const getProgressValue = () => {
    const currentIndex = getCurrentStatusIndex()
    return ((currentIndex + 1) / orderStatuses.length) * 100
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Order Not Found</h1>
            <p className="text-muted-foreground">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
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
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Estimated {order.deliveryMethod}</span>
                    <span className="text-sm text-muted-foreground">{order.estimatedTime}</span>
                  </div>
                  <Progress value={getProgressValue()} className="h-2" />
                </div>

                <div className="space-y-4">
                  {orderStatuses.map((status, index) => {
                    const isCompleted = index <= getCurrentStatusIndex()
                    const isCurrent = index === getCurrentStatusIndex()
                    const StatusIcon = status.icon

                    return (
                      <div key={status.key} className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              isCurrent ? "text-green-600" : isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {status.label}
                          </div>
                          {isCurrent && <div className="text-sm text-muted-foreground">In progress...</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          Size: {item.customizations.size} • Qty: {item.quantity}
                        </div>
                        {item.customizations.toppings.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Toppings: {item.customizations.toppings.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.specialInstructions}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Details */}
            {order.deliveryMethod === "delivery" && order.deliveryAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>{order.deliveryAddress.street}</div>
                    <div>
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(order.total * 0.85).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryMethod === "delivery" ? "3.99" : "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(order.total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Payment Method: {order.paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
