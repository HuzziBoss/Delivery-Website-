"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication - in real app, this would call your API
        if (email === "demo@example.com" && password === "password") {
          const user: User = {
            id: "1",
            name: "Demo User",
            email: "demo@example.com",
            phone: "(555) 123-4567",
            address: {
              street: "123 Main St",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
            },
          }
          set({ user, isLoading: false })
          return true
        } else if (email === "admin@northking.com" && password === "admin123") {
          const user: User = {
            id: "admin",
            name: "Admin User",
            email: "admin@northking.com",
            phone: "(555) 987-6543",
            address: {
              street: "456 Admin Ave",
              city: "Admin City",
              state: "CA",
              zipCode: "54321",
            },
          }
          set({ user, isLoading: false })
          return true
        }

        set({ isLoading: false })
        return false
      },

      signup: async (userData) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock signup - in real app, this would call your API
        const user: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        }

        set({ user, isLoading: false })
        return true
      },

      logout: () => {
        set({ user: null })
      },

      updateProfile: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
