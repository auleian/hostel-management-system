import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Bed, Users, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"
import api from "@/lib/api"
import { LoadingState } from "@/components/ui/loading-spinner"

export default function AdminDashboard() {
  const [hostels, setHostels] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [hostelsRes, roomsRes, bookingsRes] = await Promise.all([
          api.get('/hostels'),
          api.get('/rooms'),
          api.get('/bookings')
        ])
        setHostels(hostelsRes.data || [])
        setRooms(roomsRes.data || [])
        setBookings(bookingsRes.data || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

   const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalHostels = hostels.length
    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter((room: any) => !room.isAvailable).length
    const availableRooms = totalRooms - occupiedRooms
    
    // Active bookings (confirmed status)
    const activeBookings = bookings.filter((booking: any) => booking.status === 'confirmed').length
    
    // Monthly revenue (confirmed bookings from current month)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthlyRevenue = bookings
      .filter((booking: any) => {
        if (booking.status !== 'confirmed') return false
        const bookingDate = new Date(booking.createdAt || booking.bookingDate)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      })
      .reduce((sum: number, booking: any) => {
        const room = rooms.find((r: any) => r._id === booking.room?._id || r._id === booking.room)
        return sum + (room?.price || 0)
      }, 0)

    // Format revenue
    const formatRevenue = (amount: number) => {
      if (amount >= 1000000) {
        return `UGX ${(amount / 1000000).toFixed(1)}M`
      } else if (amount >= 1000) {
        return `UGX ${(amount / 1000).toFixed(1)}K`
      }
      return `UGX ${amount.toLocaleString()}`
    }

    return {
      totalHostels,
      totalRooms,
      occupiedRooms,
      availableRooms,
      activeBookings,
      monthlyRevenue: formatRevenue(monthlyRevenue)
    }
  }, [hostels, rooms, bookings])

  // Calculate occupancy by hostel
  const occupancyByHostel = useMemo(() => {
    const hostelMap = new Map()
    
    hostels.forEach((hostel: any) => {
      const hostelRooms = rooms.filter((room: any) => 
        room.hostel?._id === hostel._id || room.hostel === hostel._id
      )
      const occupied = hostelRooms.filter((r: any) => !r.isAvailable).length
      const total = hostelRooms.length
      const rate = total > 0 ? Math.round((occupied / total) * 100) : 0
      
      hostelMap.set(hostel._id, {
        name: hostel.name,
        occupied,
        total,
        rate
      })
    })
    
    return Array.from(hostelMap.values())
  }, [hostels, rooms])

  // Recent bookings
  const recentBookings = useMemo(() => {
    return bookings
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.bookingDate || 0)
        const dateB = new Date(b.createdAt || b.bookingDate || 0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 3)
      .map((booking: any) => {
        const room = rooms.find((r: any) => r._id === booking.room?._id || r._id === booking.room)
        const hostel = room?.hostel || {}
        const timeAgo = getTimeAgo(new Date(booking.createdAt || booking.bookingDate))
        
        return {
          student: booking.bookedby?.name || booking.bookedby?.username || 'Unknown',
          room: room?.roomNumber || 'N/A',
          hostel: hostel.name || 'Unknown',
          date: timeAgo
        }
      })
  }, [bookings, rooms])

 

  if (loading) {
    return (
      <AdminLayout>
        <LoadingState 
          title="Loading Dashboard" 
          description="Fetching hostels, rooms, and bookings data..." 
          size="xl"
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your hostels</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 fade-in">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHostels}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">Active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 fade-in">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.occupiedRooms} occupied, {stats.availableRooms} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 fade-in">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">Confirmed</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">This month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your hostels and rooms efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild className="h-auto py-6 flex-col gap-2">
              <Link to="/admin/hostels/new">
                <Building2 className="h-6 w-6" />
                <span>Add New Hostel</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
              <Link to="/admin/rooms/new">
                <Bed className="h-6 w-6" />
                <span>Register Room</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
              <Link to="/admin/bookings">
                <Users className="h-6 w-6" />
                <span>View Bookings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest student reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{booking.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.room} - {booking.hostel}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{booking.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>Room availability by hostel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {occupancyByHostel.length > 0 ? (
                occupancyByHostel.map((hostel, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{hostel.name}</span>
                      <span className="text-muted-foreground">
                        {hostel.occupied}/{hostel.total} rooms
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${hostel.rate}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No hostels with rooms yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  )
}
