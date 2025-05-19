"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  isGuest: boolean
  queriesRemaining: number
  maxQueries: number
}

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  registerGuest: () => void
  decrementQueries: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("synaptiq-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Register as guest by default
      registerGuest()
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("synaptiq-user", JSON.stringify(user))
    }
  }, [user])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll just create a mock user
    const mockUser: User = {
      id: "user-123",
      name: "Researcher",
      email,
      isGuest: false,
      queriesRemaining: 10,
      maxQueries: 10,
    }
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem("synaptiq-user")
    setUser(null)
    registerGuest()
  }

  const registerGuest = () => {
    const guestUser: User = {
      id: `guest-${Math.random().toString(36).substring(2, 9)}`,
      name: "Guest",
      email: "",
      isGuest: true,
      queriesRemaining: 3,
      maxQueries: 3,
    }
    setUser(guestUser)
  }

  const decrementQueries = () => {
    if (user && user.queriesRemaining > 0) {
      setUser({
        ...user,
        queriesRemaining: user.queriesRemaining - 1,
      })
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, registerGuest, decrementQueries }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
