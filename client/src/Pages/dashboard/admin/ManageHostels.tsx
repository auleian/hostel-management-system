import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockHostels } from "@/lib/mock-data"
import { Building2, MapPin, Users, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"



export default function HostelsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Hostels</h1>
          <p className="text-muted-foreground mt-2">Manage your hostel listings</p>
        </div>
        <Button asChild>
          <Link to="/admin/hostels/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Hostel
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search hostels..." className="pl-10" />
        </div>
      </div>

      {/* Hostels Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockHostels.map((hostel) => (
          <Card key={hostel.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{hostel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {hostel.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={hostel.genderPolicy === "mixed" ? "default" : "secondary"}>{hostel.genderPolicy}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{hostel.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-semibold text-primary">{hostel.availableRooms}</span> rooms available
                  </span>
                </div>
                <div className="font-semibold">
                  UGX {(hostel.priceRange.min / 1000).toFixed(0)}K - {(hostel.priceRange.max / 1000).toFixed(0)}K
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link to={`/admin/hostels/${hostel.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </AdminLayout>
  )
}
