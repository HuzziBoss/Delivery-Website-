"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Star, Download } from "lucide-react"

// Mock data for analytics
const revenueData = [
  { month: "Jan", revenue: 8400, orders: 120 },
  { month: "Feb", revenue: 9200, orders: 135 },
  { month: "Mar", revenue: 10100, orders: 148 },
  { month: "Apr", revenue: 11300, orders: 162 },
  { month: "May", revenue: 12450, orders: 178 },
  { month: "Jun", revenue: 13200, orders: 195 },
]

const ordersByHour = [
  { hour: "9AM", orders: 5 },
  { hour: "10AM", orders: 12 },
  { hour: "11AM", orders: 18 },
  { hour: "12PM", orders: 35 },
  { hour: "1PM", orders: 42 },
  { hour: "2PM", orders: 28 },
  { hour: "3PM", orders: 15 },
  { hour: "4PM", orders: 8 },
  { hour: "5PM", orders: 22 },
  { hour: "6PM", orders: 38 },
  { hour: "7PM", orders: 45 },
  { hour: "8PM", orders: 32 },
  { hour: "9PM", orders: 18 },
  { hour: "10PM", orders: 8 },
]

const categoryData = [
  { name: "Classic", value: 35, color: "#ef4444" },
  { name: "Specialty", value: 28, color: "#f97316" },
  { name: "Meat Lovers", value: 22, color: "#eab308" },
  { name: "Vegetarian", value: 15, color: "#22c55e" },
]

const topCustomers = [
  { name: "John Doe", orders: 24, spent: 567.8, lastOrder: "2 days ago" },
  { name: "Jane Smith", orders: 18, spent: 432.5, lastOrder: "1 day ago" },
  { name: "Mike Johnson", orders: 15, spent: 389.25, lastOrder: "3 days ago" },
  { name: "Sarah Wilson", orders: 12, spent: 298.75, lastOrder: "1 day ago" },
  { name: "Tom Brown", orders: 10, spent: 245.6, lastOrder: "4 days ago" },
]

const performanceMetrics = [
  { metric: "Average Order Value", value: "$79.81", change: "+5.2%", trend: "up" },
  { metric: "Customer Retention", value: "68%", change: "+12%", trend: "up" },
  { metric: "Average Delivery Time", value: "28 min", change: "-3 min", trend: "up" },
  { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your restaurant's performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span> from
                last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>Monthly revenue and order count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="right" dataKey="orders" fill="#ef4444" opacity={0.3} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Hour</CardTitle>
            <CardDescription>Peak ordering times throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of orders across pizza categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm font-medium ml-auto">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Your most valuable customers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer, index) => (
                  <TableRow key={customer.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-medium text-red-600">
                          {index + 1}
                        </div>
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell className="font-medium">${customer.spent.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Busiest times for orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Lunch Rush (12-2 PM)</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-16" />
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dinner Rush (6-8 PM)</span>
              <div className="flex items-center gap-2">
                <Progress value={92} className="w-16" />
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Late Night (9-11 PM)</span>
              <div className="flex items-center gap-2">
                <Progress value={45} className="w-16" />
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>Average delivery metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. Delivery Time</span>
              </div>
              <span className="font-medium">28 min</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">On-Time Rate</span>
              </div>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Delivery Rating</span>
              </div>
              <span className="font-medium">4.7/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Goals</CardTitle>
            <CardDescription>Monthly targets and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Monthly Target</span>
                <span className="text-sm font-medium">$15,000</span>
              </div>
              <Progress value={83} className="h-2" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Current: $12,450</span>
                <span className="text-xs text-muted-foreground">83%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Orders Target</span>
                <span className="text-sm font-medium">200</span>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Current: 156</span>
                <span className="text-xs text-muted-foreground">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
