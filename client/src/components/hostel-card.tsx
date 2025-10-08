import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Wifi, Shield, Car, BookOpen, Bus } from "lucide-react"
import type { Hostel } from "../lib/types"

const amenityIcons = {
  wifi: Wifi,
  security: Shield,
  parking: Car,
  library: BookOpen,
  "hostel shuttle": Bus,
}

interface HostelCardProps {
  hostel: Hostel
}

export function HostelCard({ hostel }: HostelCardProps) {
  const resolvedmediaBaseURL = `${import.meta.env.VITE_API_BASE_URL?.split('api')[0]}media/`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={`${resolvedmediaBaseURL}${hostel.images?.[0]}` || "luxury-hostel-suite.jpg"}
          alt={hostel.name}
          onError={(e) => { (e.target as HTMLImageElement).src = "/luxury-hostel-suite.jpg" }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
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
