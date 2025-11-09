
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import api from "@/lib/api"

const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
  // Minimal fallback toast for environments without the UI toast utility.
  // For destructive messages we show a blocking alert so the user sees it;
  // otherwise we log to the console as a non-intrusive fallback.
  if (typeof window !== "undefined") {
    if (variant === "destructive") {
      window.alert(`${title ?? ""}\n\n${description ?? ""}`)
    } else {
      console.info("Toast:", title ?? "", description ?? "")
    }
  } else {
    console.info("Toast:", title ?? "", description ?? "")
  }
}

type SignupDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

export function SignupDialog({ open, onOpenChange, showTrigger = true }: SignupDialogProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(open ?? false)
  
  useEffect(() => {
    if (open !== undefined) setInternalOpen(open)
  }, [open])
  
  const handleOpenChange = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    else setInternalOpen(v)
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    userType: "student",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthContext()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.telephone) {
      newErrors.telephone = 'Phone number is required'
    }

    // university and next-of-kin are optional on the simplified server validation
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const { confirmPassword, telephone, ...rest } = formData
      const signupData = {
        ...rest,
        contact: telephone // server expects 'contact' field
      }

      const response = await api.post('/auth/register', signupData)
      
      const { user, token } = response.data
      setAuth({ user, token })
      
      toast({
        title: "Account created successfully",
        description: `Welcome to HostelHub, ${user.name}!`,
      })
      
      handleOpenChange(false)
    } catch (err: any) {
      console.error('Signup error:', err)
      // Prefer server `msg` then `message`, and surface validation errors if present
      const serverMsg = err.response?.data?.msg || err.response?.data?.message
      const errorMessage = serverMsg || 'Failed to create account. Please try again.'

      if (err.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = err.response.data.errors.reduce((acc: Record<string, string>, error: any) => {
          acc[error.path] = error.msg
          return acc
        }, {})
        setErrors(serverErrors)
      } else if (err.response?.status === 400 && serverMsg) {
        // common case: 'User already exists'
        setErrors({ email: serverMsg })
      } else {
        // Show general error
        toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open ?? internalOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>Join HostelHub to find and book your perfect student accommodation.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="name@students.mak.ac.ug"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-telephone">Phone Number</Label>
            <Input
              id="signup-telephone"
              type="tel"
              placeholder="+256 700 000 000"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className={errors.telephone ? 'border-red-500' : ''}
            />
            {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-usertype">Account Type</Label>
            <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
              <SelectTrigger id="signup-usertype">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="admin">Hostel Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'border-red-500' : ''}
              minLength={6}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={errors.confirmPassword ? 'border-red-500' : ''}
              minLength={6}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="text-primary hover:underline p-0 h-auto font-normal"
            onClick={() => {
              handleOpenChange(false)
              // This assumes the parent component handles showing the login dialog
              // You might need to adjust this based on your app's navigation
              const loginButton = document.querySelector('button[aria-label="Login"]') as HTMLButtonElement
              loginButton?.click()
            }}
          >
            Login
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
