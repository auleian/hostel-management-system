import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Bed, Users, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"

export default function AdminDashboard() {
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71</div>
            <p className="text-xs text-muted-foreground mt-1">48 occupied, 23 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 9.6M</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-primary">+18%</span> from last month
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
              {[
                { student: "John Doe", room: "A101", hostel: "Green Valley", date: "2 hours ago" },
                { student: "Jane Smith", room: "C105", hostel: "Sunrise Lodge", date: "5 hours ago" },
                { student: "Mike Johnson", room: "B201", hostel: "Campus View", date: "1 day ago" },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{booking.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.room} - {booking.hostel}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{booking.date}</span>
                </div>
              ))}
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
              {[
                { name: "Green Valley Hostel", occupied: 8, total: 12, rate: 67 },
                { name: "Sunrise Student Lodge", occupied: 6, total: 8, rate: 75 },
                { name: "Campus View Residence", occupied: 12, total: 15, rate: 80 },
                { name: "Horizon Heights", occupied: 15, total: 20, rate: 75 },
              ].map((hostel, i) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  )
}
