import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import api from "@/lib/api";
import { LoadingState } from "@/components/ui/loading-spinner";

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    variant: "default" as const,
    icon: CheckCircle,
  },
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  cancelled: {
    label: "Cancelled",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

export default function BookingsPage() {
  type BookingType = {
    _id: string;
    room?:
    | {
      _id: string;
      roomNumber: string;
      roomType: string;
      price: number;
      hostel?: {
        _id: string;
        name: string;
        location?: string;
      };
    }
    | string;

    checkInDate: string;
    checkOutDate?: string;

    bookedby?:
    | {
      _id: string;
      name: string;
      contact?: string;
      email?: string;
    }
    | string;

    createdAt: string;
    status: "pending" | "confirmed" | "cancelled";
  };

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ADD THIS: Calculate stats from the bookings array
  const bookingStats = useMemo(() => {
    // This .reduce() is a clean way to count all statuses in one loop
    const stats = bookings.reduce(
      (acc, booking) => {
        const status = booking.status || "pending"; // Default to pending if undefined

        if (status === "confirmed") {
          acc.confirmed += 1;
        } else if (status === "pending") {
          acc.pending += 1;
        } else if (status === "cancelled") {
          acc.cancelled += 1;
        }
        return acc;
      },
      { confirmed: 0, pending: 0, cancelled: 0 }
    ); // Initial counts

    return {
      total: bookings.length,
      ...stats,
    };
  }, [bookings]);

  // Update booking status
  const handleStatusChange = async (
    id: string,
    newStatus: BookingType["status"]
  ) => {
    try {
      await api.patch(`/bookings/${id}`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return (
    <LoadingState
      title="Loading Dashboard"
      description="Fetching hostels, rooms, and bookings data..."
      size="xl"
    />
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-balance">Bookings</h1>
          <p className="text-muted-foreground mt-2">
            Manage student reservations and bookings
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Total Bookings Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : bookingStats.total}
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {loading ? "..." : bookingStats.confirmed}
              </div>
            </CardContent>
          </Card>

          {/* Pending Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : bookingStats.pending}
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {loading ? "..." : bookingStats.cancelled}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or room..."
              className="pl-10"
            />
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
              {bookings.map((booking) => {
                const StatusIcon =
                  statusConfig[booking.status as keyof typeof statusConfig]
                    .icon;
                const bookedby =
                  typeof booking.bookedby === "object"
                    ? booking.bookedby
                    : null;
                const room =
                  typeof booking.room === "object" ? booking.room : null;
                return (
                  <div
                    key={booking._id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">
                          {bookedby?.name || "Guest"}
                        </h3>
                        <Badge
                          variant={
                            statusConfig[
                              booking.status as keyof typeof statusConfig
                            ]?.variant || "secondary"
                          }
                          className="gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[
                            booking.status as keyof typeof statusConfig
                          ]?.label || "Pending"}
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Room:</span>{" "}
                          {room?.roomNumber || "N/A"} ({room?.roomType || "N/A"}
                          )
                        </div>
                        <div>
                          <span className="font-medium">Hostel:</span>{" "}
                          {room?.hostel?.name || "N/A"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Move-in:</span>{" "}
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span>{" "}
                          {bookedby?.contact || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          UGX {(room?.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per semester
                        </p>
                      </div>
                      <Select
                        value={booking.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            booking._id,
                            value as BookingType["status"]
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
