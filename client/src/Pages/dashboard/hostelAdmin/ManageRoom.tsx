import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bed, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useRoomStore, useHostelStore } from "@/stores"
import { LoadingState } from "@/components/ui/loading-spinner"
import { AdminLayout } from "@/components/AdminLayout"

export default function RoomsPage() {
  const { rooms, loading, fetchRooms } = useRoomStore()
  const { hostels, fetchHostels } = useHostelStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHostel, setSelectedHostel] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    fetchRooms()
    fetchHostels()
  }, [fetchRooms, fetchHostels])

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesHostel = selectedHostel === "all" || 
      (typeof room.hostel === 'string' ? room.hostel === selectedHostel : room.hostel._id === selectedHostel)
    const matchesType = selectedType === "all" || room.roomType === selectedType
    return matchesSearch && matchesHostel && matchesType
  })

  // Clear search handler
  const handleClearSearch = () => {
    setSearchQuery("")
  }

  if (loading && rooms.length === 0) {
    return (
      <AdminLayout>
        <LoadingState title="Loading Rooms" description="Fetching room data from the server..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search rooms..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <Select value={selectedHostel} onValueChange={setSelectedHostel}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Hostels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            {hostels.map((hostel) => (
              <SelectItem key={hostel._id} value={hostel._id}>
                {hostel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
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
          <CardDescription>Total of {filteredRooms.length} rooms {selectedHostel !== "all" || selectedType !== "all" || searchQuery ? "found" : "registered"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bed className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No rooms found matching your criteria.</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room._id}
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
                        <span>{typeof room.hostel === 'string' ? 'Hostel' : room.hostel?.name || 'Unknown Hostel'}</span>
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
                        <Link to={`/admin/rooms/${room._id}`}>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  )
}
