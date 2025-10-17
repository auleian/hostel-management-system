import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react"
import { User } from "@/lib/types"

type AuthValue = {
  user: User | null
  token: string | null
  setAuth: (payload: { user: User | null; token: string | null }) => void
}

const AuthContext = createContext<AuthValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("auth")
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
  }, [])

  const setAuth = ({ user: nextUser, token: nextToken }: { user: User | null; token: string | null }) => {
    setUser(nextUser)
    setToken(nextToken)
    if (nextUser && nextToken) {
      localStorage.setItem("auth", JSON.stringify({ user: nextUser, token: nextToken }))
    } else {
      localStorage.removeItem("auth")
    }
  }

  const value = useMemo(() => ({ user, token, setAuth }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider")
  return ctx
}