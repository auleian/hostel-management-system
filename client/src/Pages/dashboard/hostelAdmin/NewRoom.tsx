"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { mockHostels } from "@/lib/mock-data"
import { ArrowLeft, Upload } from "lucide-react"
import {Link} from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"


const roomAmenities = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "fridge", label: "Mini Fridge" },
  { id: "tv", label: "TV" },
  { id: "desk", label: "Study Desk" },
]

export default function NewRoomPage() {
  return (
    <AdminLayout>
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin/rooms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-balance">Register New Room</h1>
        <p className="text-muted-foreground mt-2">Add a room to your hostel listing</p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>Enter the details about the room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostel">Select Hostel *</Label>
              <Select required>
                <SelectTrigger id="hostel">
                  <SelectValue placeholder="Choose a hostel" />
                </SelectTrigger>
                <SelectContent>
                  {mockHostels.map((hostel) => (
                    <SelectItem key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number *</Label>
                <Input id="roomNumber" placeholder="e.g., A101" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select required>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Semester (UGX) *</Label>
              <Input id="price" type="number" placeholder="e.g., 200000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Room Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the room features, size, and any special characteristics..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="selfContained" />
              <Label htmlFor="selfContained" className="font-normal cursor-pointer">
                Self-Contained (has private bathroom)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="available" defaultChecked />
              <Label htmlFor="available" className="font-normal cursor-pointer">
                Available for booking
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Amenities</CardTitle>
            <CardDescription>Select the amenities available in this room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {roomAmenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox id={amenity.id} />
                  <Label htmlFor={amenity.id} className="font-normal cursor-pointer">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Images</CardTitle>
            <CardDescription>Upload photos of the room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg">
            Register Room
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link to="/admin/rooms">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
    </AdminLayout>
  )
}
