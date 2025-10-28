import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

export function SignupDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    university: "",
    password: "",
    confirmPassword: "",
    userType: "student",
  })

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.telephone || formData.telephone.trim() === "") {
      setError("Contact is required")
      return
    }

    if (!formData.university || formData.university.trim() === "") {
      setError("University is required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone,
          university: formData.university,
          password: formData.password,
          userType: formData.userType,
        }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg =
          body?.message ||
          (Array.isArray(body?.errors) && body.errors[0]?.msg) ||
          "Registration failed"
        setError(msg)
        setLoading(false)
        return
      }

      const token = body?.token
      if (!token) {
        setError("No token returned from server")
        setLoading(false)
        return
      }

      localStorage.setItem("token", token)

      setFormData({
        name: "",
        email: "",
        telephone: "",
        university: "",
        password: "",
        confirmPassword: "",
        userType: "student",
      })
      setOpen(false)
      navigate("/admin")
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </DialogTrigger>

      {/* constrained width and rounded dialog */}
      <DialogContent className="p-0 w-full max-w-3xl border-0 shadow-2xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 bg-white">
          <DialogHeader className="space-y-3 pb-2">
            <div className="mx-auto md:mx-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center md:text-left">Create Account</DialogTitle>
            <DialogDescription className="text-center md:text-left text-sm text-muted-foreground">
              Join HostelHub to find and book student accommodation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4">
            {/* two-column layout for fields on md+, single column on small */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-telephone" className="text-sm font-medium">Contact</Label>
                <Input
                  id="signup-telephone"
                  type="tel"
                  placeholder="Contact number (e.g. +256700000000)"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-university" className="text-sm font-medium">University</Label>
                <Input
                  id="signup-university"
                  placeholder="Your university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-usertype" className="text-sm font-medium">Account Type</Label>
                <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
                  <SelectTrigger id="signup-usertype" className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Hostel Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>

            <div className="mt-3 text-center text-sm text-muted-foreground">
              Already have an account? <a href="/login" className="text-emerald-600 hover:underline">Sign in</a>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}