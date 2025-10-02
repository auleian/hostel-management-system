import type React from "react"
import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { mockRooms } from "@/lib/mock-data"
import { ArrowLeft, Calendar, User, Mail, Phone, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const room = mockRooms.find((r) => r.id === id)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    checkInDate: "",
  })

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-3xl font-bold">Room Not Found</h1>
            <p className="text-muted-foreground">The room you are trying to book does not exist or is no longer available.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
              <Button asChild>
                <Link to="/search" className="no-underline">Browse Hostels</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement booking logic
    console.log("Booking:", { ...formData, roomId: room.id })

    toast({
      title: "Booking Submitted!",
      description: "Your booking request has been received. We will contact you shortly.",
    })

    // Redirect after successful booking
    setTimeout(() => {
      navigate("/")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to={`/hostel/${room.hostelId}`} className="no-underline flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hostel
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-8 text-balance">Complete Your Booking</h1>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      <User className="inline h-4 w-4 mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="username"
                      placeholder="John Doe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phonenumber">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phonenumber"
                      type="tel"
                      placeholder="+256 700 000 000"
                      value={formData.phonenumber}
                      onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Check-in Date
                    </Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="submit" className="w-full" size="lg">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={`Room ${room.roomNumber}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{room.hostelName}</h3>
                    <p className="text-sm text-muted-foreground">Room {room.roomNumber}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {room.roomType}
                    </Badge>
                    {room.isSelfContained && <Badge variant="secondary">Self-contained</Badge>}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room Type</span>
                      <span className="font-medium capitalize">{room.roomType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">1 Semester</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">UGX {room.price.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-pretty">
                    By confirming this booking, you agree to the hostel's terms and conditions. A confirmation email
                    will be sent to your provided email address.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
