"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreHorizontal, Search, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
  isVegetarian: boolean
  rating: number
  sizes: string[]
  toppings: string[]
}

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil, olive oil",
    price: 18.99,
    category: "Classic",
    image: "/placeholder.svg?height=300&width=300",
    isAvailable: true,
    isVegetarian: true,
    rating: 4.8,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Cheese", "Basil", "Olives"],
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella, tomato sauce, oregano",
    price: 22.99,
    category: "Meat Lovers",
    image: "/placeholder.svg?height=300&width=300",
    isAvailable: true,
    isVegetarian: false,
    rating: 4.9,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Pepperoni", "Extra Cheese", "Mushrooms"],
  },
  {
    id: 3,
    name: "BBQ Chicken",
    description: "Grilled chicken, BBQ sauce, red onions, cilantro",
    price: 24.99,
    category: "Specialty",
    image: "/placeholder.svg?height=300&width=300",
    isAvailable: true,
    isVegetarian: false,
    rating: 4.7,
    sizes: ["Small", "Medium", "Large"],
    toppings: ["Extra Chicken", "Red Onions", "Bell Peppers"],
  },
]

const categories = ["Classic", "Specialty", "Vegetarian", "Meat Lovers", "Desserts", "Drinks"]

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
    isVegetarian: false,
    sizes: ["Small", "Medium", "Large"],
    toppings: [] as string[],
  })

  useEffect(() => {
    let filtered = menuItems

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [menuItems, searchTerm, categoryFilter])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      image: "/placeholder.svg?height=300&width=300",
      isAvailable: formData.isAvailable,
      isVegetarian: formData.isVegetarian,
      rating: editingItem ? editingItem.rating : 4.5,
      sizes: formData.sizes,
      toppings: formData.toppings,
    }

    if (editingItem) {
      setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? newItem : item)))
      toast({
        title: "Menu item updated",
        description: `${newItem.name} has been updated successfully.`,
      })
    } else {
      setMenuItems([...menuItems, newItem])
      toast({
        title: "Menu item added",
        description: `${newItem.name} has been added to the menu.`,
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
      isVegetarian: false,
      sizes: ["Small", "Medium", "Large"],
      toppings: [],
    })
    setEditingItem(null)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      sizes: item.sizes,
      toppings: item.toppings,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
    toast({
      title: "Menu item deleted",
      description: "The menu item has been removed successfully.",
    })
  }

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your restaurant's menu items.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the menu item details below." : "Fill in the details for the new menu item."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Pizza name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the pizza ingredients and flavors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="vegetarian"
                    checked={formData.isVegetarian}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                  />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update Item" : "Add Item"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
          <CardDescription>Manage your restaurant's menu items and their availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
                        <div className="flex gap-1 mt-1">
                          {item.isVegetarian && (
                            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                              Veggie
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleAvailability(item.id)}
                        size="sm"
                      />
                      <span className="text-sm">{item.isAvailable ? "Available" : "Unavailable"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No menu items found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
