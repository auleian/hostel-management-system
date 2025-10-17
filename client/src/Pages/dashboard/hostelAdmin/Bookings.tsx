import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { AdminLayout } from "@/components/AdminLayout"



const mockBookings = [
  {
    id: "1",
    studentName: "John Doe",
    studentEmail: "john.doe@student.ac.ug",
    studentPhone: "+256 700 111 222",
    hostelName: "Green Valley Hostel",
    roomNumber: "A101",
    roomType: "single",
    price: 200000,
    bookingDate: "2025-01-15",
    moveInDate: "2025-02-01",
    status: "confirmed",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@student.ac.ug",
    studentPhone: "+256 700 222 333",
    hostelName: "Sunrise Student Lodge",
    roomNumber: "C105",
    roomType: "single",
    price: 180000,
    bookingDate: "2025-01-14",
    moveInDate: "2025-02-01",
    status: "pending",
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    studentEmail: "mike.j@student.ac.ug",
    studentPhone: "+256 700 333 444",
    hostelName: "Campus View Residence",
    roomNumber: "B201",
    roomType: "suite",
    price: 350000,
    bookingDate: "2025-01-13",
    moveInDate: "2025-02-01",
    status: "confirmed",
  },
  {
    id: "4",
    studentName: "Sarah Williams",
    studentEmail: "sarah.w@student.ac.ug",
    studentPhone: "+256 700 444 555",
    hostelName: "Unity Hostel",
    roomNumber: "D102",
    roomType: "double",
    price: 120000,
    bookingDate: "2025-01-12",
    moveInDate: "2025-02-01",
    status: "cancelled",
  },
]

const statusConfig = {
  confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle },
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
}

export default function BookingsPage() {
  return (
    <AdminLayout>
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage student reservations and bookings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">35</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by student name or room..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest student reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBookings.map((booking) => {
              const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig].icon
              return (
                <div
                  key={booking.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold">{booking.studentName}</h3>
                      <Badge
                        variant={statusConfig[booking.status as keyof typeof statusConfig].variant}
                        className="gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[booking.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Room:</span> {booking.roomNumber} ({booking.roomType})
                      </div>
                      <div>
                        <span className="font-medium">Hostel:</span> {booking.hostelName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Move-in:</span> {booking.moveInDate}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {booking.studentPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                    <div className="text-right">
                      <p className="font-bold text-lg">UGX {(booking.price / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">per semester</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  )
}
