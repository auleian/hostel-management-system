import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockRooms, mockHostels } from "@/lib/mock-data"
import { Bed, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"
import {Link} from "react-router-dom"

export default function RoomsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Rooms</h1>
          <p className="text-muted-foreground mt-2">Manage room listings across all hostels</p>
        </div>
        <Button asChild>
          <Link to="/admin/rooms/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search rooms..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Hostels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            {mockHostels.map((hostel) => (
              <SelectItem key={hostel.id} value={hostel.id}>
                {hostel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
          <CardDescription>Total of {mockRooms.length} rooms registered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">Room {room.roomNumber}</h3>
                      <Badge variant="outline" className="capitalize">
                        {room.roomType}
                      </Badge>
                      {room.isSelfContained && <Badge variant="secondary">Self-Contained</Badge>}
                      <Badge variant={room.isAvailable ? "default" : "destructive"}>
                        {room.isAvailable ? "Available" : "Occupied"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>{room.hostelName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{room.moreInfo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="font-bold text-lg">UGX {(room.price / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">per semester</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/rooms/${room.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
