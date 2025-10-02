import { Link, useParams, useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockHostels, mockRooms } from "@/lib/mock-data"
import { MapPin, Phone, Users, Wifi, Shield, Car, BookOpen, Bus, ArrowLeft, Bed } from "lucide-react"

const amenityIcons = {
  wifi: Wifi,
  security: Shield,
  parking: Car,
  library: BookOpen,
  "hostel shuttle": Bus,
}

export default function HostelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const hostel = mockHostels.find((h) => h.id === id)

  if (!hostel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-3xl font-bold">Hostel Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The hostel you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
              <Button asChild>
                <Link to="/search" className="no-underline">Browse Hostels</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const hostelRooms = mockRooms.filter((room) => room.hostelId === hostel.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/search" className="no-underline flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Link>
          </Button>

          {/* Hostel Header */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img src={hostel.image || "/placeholder.svg"} alt={hostel.name} className="h-full w-full object-cover" />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">{hostel.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{hostel.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">{hostel.availableRooms} rooms available</Badge>
                <Badge variant="outline" className="capitalize">
                  <Users className="mr-1 h-3 w-3" />
                  {hostel.genderPolicy}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-pretty">{hostel.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hostel.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                    return (
                      <div key={amenity} className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-primary" />}
                        <span className="text-sm capitalize">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rules</h3>
                <p className="text-sm text-muted-foreground text-pretty">{hostel.rules}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">Contact:</span>
                <span className="text-muted-foreground">{hostel.contactInfo}</span>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Price range</p>
                <p className="text-2xl font-bold text-primary">
                  UGX {hostel.priceRange.min.toLocaleString()} - {hostel.priceRange.max.toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground">/semester</span>
                </p>
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Available Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hostelRooms.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hostelRooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <img
                          src={room.image || "/placeholder.svg"}
                          alt={`Room ${room.roomNumber}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold">Room {room.roomNumber}</h4>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {room.roomType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{room.moreInfo}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {room.isSelfContained && <Badge variant="secondary">Self-contained</Badge>}
                        </div>
                        <div className="pt-2 border-t">
                          <p className="font-bold text-lg text-primary">
                            UGX {room.price.toLocaleString()}
                            <span className="text-sm font-normal text-muted-foreground">/semester</span>
                          </p>
                        </div>
                        <Button asChild className="w-full" size="sm">
                          <Link to={`/booking/${room.id}`} className="no-underline">Book Now</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No rooms available at the moment. Please check back later.
                </p>
              )}
            </CardContent>
          </Card>
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
