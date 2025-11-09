
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
import { UserPlus } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"


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
    contact: "",
    university: "",
    nextOfKin: {
      name: "",
      contact: "",
    },
    password: "",
    confirmPassword: "",
    userType: "student",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match. Please try again."
      })
      return
    }

    api.post('/auth/register', formData)
      .then(response => {
        console.log("Signup successful:", response.data)
        toast.success("Account created successfully!", {
          description: "Welcome to HostelHub. You can now log in with your credentials."
        })
        handleOpenChange(false)
      })
      .catch(error => {
        console.error("Signup failed:", error)
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred during signup"
        toast.error("Signup failed", {
          description: errorMessage
        })
      })
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>Join HostelHub to find and book your perfect student accommodation.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@students.mak.ac.ug"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-contact">Phone Number</Label>
              <Input
                id="signup-contact"
                type="tel"
                placeholder="+256 700 000 000"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-university">University</Label>
              <Input
                id="signup-university"
                placeholder="e.g., Makerere University"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-nextofkin-name">Next of Kin Name</Label>
              <Input
                id="signup-nextofkin-name"
                placeholder="Emergency contact name"
                value={formData.nextOfKin.name}
                onChange={(e) => setFormData({ ...formData, nextOfKin: { ...formData.nextOfKin, name: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-nextofkin-contact">Next of Kin Contact</Label>
              <Input
                id="signup-nextofkin-contact"
                type="tel"
                placeholder="+256 700 000 000"
                value={formData.nextOfKin.contact}
                onChange={(e) => setFormData({ ...formData, nextOfKin: { ...formData.nextOfKin, contact: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
