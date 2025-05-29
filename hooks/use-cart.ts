"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  customizations: {
    size: string
    toppings: string[]
  }
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number, customizations: CartItem["customizations"]) => void
  updateQuantity: (id: number, customizations: CartItem["customizations"], quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.customizations.size === newItem.customizations.size &&
              JSON.stringify(item.customizations.toppings.sort()) ===
                JSON.stringify(newItem.customizations.toppings.sort()),
          )

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (id, customizations) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.customizations.size === customizations.size &&
                JSON.stringify(item.customizations.toppings.sort()) === JSON.stringify(customizations.toppings.sort())
              ),
          ),
        }))
      },

      updateQuantity: (id, customizations, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, customizations)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id &&
            item.customizations.size === customizations.size &&
            JSON.stringify(item.customizations.toppings.sort()) === JSON.stringify(customizations.toppings.sort())
              ? { ...item, quantity }
              : item,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
