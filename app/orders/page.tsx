"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Clock, Package, Truck, CheckCircle, Eye } from "lucide-react"

interface Order {
  id: string
  items: any[]
  total: number
  deliveryMethod: string
  status: string
  estimatedTime: string
  createdAt: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(storedOrders)
    }
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <Package className="h-4 w-4" />
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Please Sign In</h1>
            <p className="text-muted-foreground">You need to sign in to view your orders.</p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
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
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center space-y-4">
            <Package className="mx-auto h-24 w-24 text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">No orders yet</h2>
              <p className="text-muted-foreground">When you place your first order, it will appear here.</p>
            </div>
            <Button asChild>
              <Link href="/menu">Start Ordering</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {formatStatus(order.status)}
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"} • {order.estimatedTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">${order.total.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}/review`}>Leave Review</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
