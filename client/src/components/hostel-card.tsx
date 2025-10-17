import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Wifi, Shield, Car, BookOpen, Bus } from "lucide-react"
import type { Hostel } from "../lib/types"
import axios from "axios"
import { getImageUrl } from "@/lib/utils"

const amenityIcons = {
  wifi: Wifi,
  security: Shield,
  parking: Car,
  library: BookOpen,
  "hostel shuttle": Bus,
}

interface HostelCardProps {
  hostelId: string
}

export function HostelCard({ hostelId }: HostelCardProps) {
  const [hostel, setHostel] = useState<Hostel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL


  useEffect(() => {
    if (!hostelId) {
      setError("No hostel ID provided.")
      setLoading(false)
      return
    }
    async function fetchHostel() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${apiBaseUrl}/hostels/${hostelId}`)
        // Map _id to id for frontend consistency
        const hostelData = res.data
        setHostel({
          ...hostelData,
          id: hostelData._id,
        })
      } catch (err) {
        setError("Failed to load hostel.")
      } finally {
        setLoading(false)
      }
    }
    fetchHostel()
  }, [hostelId])

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !hostel) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p className="text-red-500">{error || "Hostel not found."}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        {hostel.images?.[0] && (
          <img
            src={getImageUrl(hostel.images[0])}
            alt={hostel.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground">{hostel.availableRooms} rooms available</Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-balance">{hostel.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{hostel.location}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{hostel.description}</p>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className="capitalize">
            {hostel.genderPolicy}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {hostel.amenities.slice(0, 4).map((amenity: string) => {
            const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
            return Icon ? (
              <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground" title={amenity}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            ) : null
          })}
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Price range</p>
          {
            hostel.priceRange && hostel.priceRange.max && hostel.priceRange.min && (
              <p className="font-bold text-lg text-primary">
                UGX {hostel.priceRange.min.toLocaleString()} - {hostel.priceRange.max.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/semester</span>
              </p>
            )
          }

        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link className="text-white hover:text-white" to={`/hostel/${hostel._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
