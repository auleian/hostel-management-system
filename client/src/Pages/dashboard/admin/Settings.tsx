import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Lock, Bell, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { AdminLayout } from "@/components/AdminLayout"
import { useAuthContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuthContext()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Auto-fill form from user context
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(" ")
      setFirstName(nameParts[0] || "")
      setLastName(nameParts.slice(1).join(" ") || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
    }
  }, [user])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update API call
    toast.success("Profile updated successfully!")
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password update API call
    toast.success("Password updated successfully!")
  }

  return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="space-y-8 max-w-4xl w-full">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
          </div>

          {/* Profile Settings */}
          <form onSubmit={handleSaveProfile}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <Button type="button" variant="outline">Change Photo</Button>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>

                <Button type="submit">Save Changes</Button>
              </CardContent>
            </Card>
          </form>

          {/* Security Settings */}
          <form onSubmit={handleUpdatePassword}>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="currentPassword" type="password" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="newPassword" type="password" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" className="pl-10" />
                  </div>
                </div>

                <Button type="submit">Update Password</Button>
              </CardContent>
            </Card>
          </form>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="emailNotif" className="font-medium">
                      Email Notifications
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                </div>
                <Switch id="emailNotif" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="securityAlerts" className="font-medium">
                      Security Alerts
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified about security events</p>
                </div>
                <Switch id="securityAlerts" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bookingNotif" className="font-medium">
                    Booking Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Alerts for new bookings and cancellations</p>
                </div>
                <Switch id="bookingNotif" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
