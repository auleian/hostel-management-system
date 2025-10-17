import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, MapPin, Users, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"
import { useState, useEffect, useCallback } from "react"
import { Hostel } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"



export default function HostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user, token } = useAuth()
  const navigate = useNavigate()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL


    const fetchHostels = useCallback(
    async (query = "") => {
      try {
        setLoading(true)
        setError(null)

        const url = new URL(`${apiBaseUrl}/hostels`, window.location.origin)
        if (query) url.searchParams.set("name", query)

        const res = await fetch(url.toString(), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error("Failed to load hostels")

        const data: Hostel[] = await res.json()
        setHostels(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    },
    [apiBaseUrl, token],
  )

    useEffect(() => {
    if (!user) return
    if (user.role !== "admin") {
      navigate("/dashboard")
      return
    }
    fetchHostels() 
    
  }, [user, navigate, fetchHostels])

  // search
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchHostels()
      return
    }
    const id = window.setTimeout(() => fetchHostels(searchTerm.trim()), 400)
    return () => window.clearTimeout(id)
  }, [searchTerm, fetchHostels])

  // clear search
  const handleClearSearch = () => {
    setSearchTerm("")
    fetchHostels()
  }

  // delete hostel handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this hostel?")
    if (!confirmed) return

    try {
      const res = await fetch(`${apiBaseUrl}/hostels/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error("Failed to delete hostel")
      setHostels(prev => prev.filter(hostel => hostel._id !== id))
    } catch (err) {
      setError((err as Error).message)
    }
  }
  
  
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
            <Input
              placeholder="Search hostels..."
              className="pl-10"
              value={searchTerm} 
              onChange={event => setSearchTerm(event.target.value)}
            />
            {searchTerm && ( 
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Loading hostels…</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && hostels.length === 0 && !error && (
          <p className="text-muted-foreground">No hostels found.</p>
        )}

        {/* Hostels Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {hostels.map(hostel => (
            <Card key={hostel._id}>
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
                  <Badge variant={hostel.genderPolicy === "mixed" ? "default" : "secondary"}>
                    {hostel.genderPolicy}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{hostel.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-semibold text-primary">
                        {hostel.availableRooms ?? 0}
                      </span>{" "}
                      rooms available
                    </span>
                  </div>
                  <div className="font-semibold">
                    {hostel.priceRange?.min != null && hostel.priceRange?.max != null ? (
                      <>
                        UGX {(hostel.priceRange.min / 1000).toFixed(0)}K -{" "}
                        {(hostel.priceRange.max / 1000).toFixed(0)}K
                      </>
                    ) : (
                      <span>Price not available</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link to={`/admin/hostels/${hostel._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => handleDelete(hostel._id)} // NEW: wire up delete
                  >
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
