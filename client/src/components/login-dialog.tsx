import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Loader2 } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import api from "@/lib/api"
import { toast } from "sonner"

type LoginDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOpenSignup?: () => void
  showTrigger?: boolean
}

export default function LoginDialog({ open, onOpenChange, onOpenSignup, showTrigger = true }: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(open ?? false)
  const { setAuth } = useAuthContext()

  useEffect(() => {
    if (open !== undefined) setInternalOpen(open)
  }, [open])

  const handleOpenChange = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    else setInternalOpen(v)
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      
      setAuth({ user, token })
      toast.success(`Welcome back, ${user.name}!`)
      handleOpenChange(false)
    } catch (err: any) {
        console.error('Login error:', err)
        // server returns { msg } for validation/auth errors; prefer that, then fallback to message
        const serverMsg = err.response?.data?.msg || err.response?.data?.message
        setError(serverMsg || 'Failed to login. Please try again.')
        toast.error(serverMsg || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open ?? internalOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 fade-in">Welcome Back</DialogTitle>
          <DialogDescription>
            Login to your account to manage bookings and access exclusive features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="name@students.mak.ac.ug"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="text-primary hover:underline p-0 h-auto font-normal"
              onClick={() => {
                handleOpenChange(false)
                onOpenSignup?.()
              }}
            >
              Sign up
            </Button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}