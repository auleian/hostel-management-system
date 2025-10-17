import { Link, useParams, useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Users, Wifi, Shield, Car, BookOpen, Bus, ArrowLeft, Bed } from "lucide-react"
import { useState, useEffect } from "react"
import { Hostel, Room } from "@/lib/types"

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
  const [hostel, setHostel] = useState<Hostel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchHostelData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)

        // Fetch hostel details
        const hostelResponse = await fetch(`${apiBaseUrl}/hostels/${id}`)
        if (!hostelResponse.ok) {
          throw new Error('Failed to fetch hostel details')
        }
        const hostelData = await hostelResponse.json()
        setHostel(hostelData)

        // Fetch rooms for this hostel
        const roomsResponse = await fetch(`${apiBaseUrl}/rooms?hostel=${id}&isAvailable=true`)
        if (!roomsResponse.ok) {
          throw new Error('Failed to fetch rooms')
        }
        const roomsData = await roomsResponse.json()
        setRooms(roomsData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchHostelData()
  }, [id, apiBaseUrl])

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    const baseUrl = apiBaseUrl ?? "";
    return `${baseUrl.replace('/api', '')}/media/hostels/${imagePath}`
  }

  const getRoomImageUrl = (imagePath: string) => {
    const baseUrl = apiBaseUrl ?? "";
    return `${baseUrl.replace('/api', '')}/media/rooms/${imagePath}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-3xl font-bold">
              {error ? 'Error Loading Hostel' : 'Hostel Not Found'}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {error || "The hostel you're looking for doesn't exist or may have been removed."}
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
              <img 
                src={hostel.images && hostel.images.length > 0 
                  ? getImageUrl(hostel.images[0]) 
                  : hostel.image || "/placeholder.svg"
                } 
                alt={hostel.name} 
                className="h-full w-full object-cover" 
              />
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
                <Badge className="bg-primary text-primary-foreground">
                  {rooms.length} rooms available
                </Badge>
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

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Price range</p>
                <p className="text-2xl font-bold text-primary">
                  {hostel.priceRange ? (
                    <>
                      UGX {hostel.priceRange.min.toLocaleString()} - {hostel.priceRange.max.toLocaleString()}
                      <span className="text-base font-normal text-muted-foreground">/semester</span>
                    </>
                  ) : (
                    <span className="text-base text-muted-foreground">Price not available</span>
                  )}
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
              {rooms.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room._id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <img
                          src={room.images && room.images.length > 0 
                            ? getRoomImageUrl(room.images[0]) 
                            : "/placeholder.svg"
                          }
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
                          <Link to={`/booking/${room._id}`} className="no-underline">Book Now</Link>
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