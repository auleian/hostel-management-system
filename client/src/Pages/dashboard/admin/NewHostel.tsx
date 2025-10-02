import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"

const amenities = [
  { id: "wifi", label: "WiFi" },
  { id: "security", label: "24/7 Security" },
  { id: "parking", label: "Parking" },
  { id: "library", label: "Study Library" },
  { id: "shuttle", label: "Hostel Shuttle" },
  { id: "laundry", label: "Laundry Service" },
]

export default function NewHostelPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin/hostels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hostels
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-balance">Add New Hostel</h1>
        <p className="text-muted-foreground mt-2">Fill in the details to list your hostel</p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the main details about your hostel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hostel Name *</Label>
              <Input id="name" placeholder="e.g., Green Valley Hostel" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., University District, Campus Road" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information *</Label>
              <Input id="contact" type="tel" placeholder="+256 700 123 456" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your hostel, its features, and what makes it special..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Hostel Rules</Label>
              <Textarea
                id="rules"
                placeholder="e.g., No smoking, Quiet hours 10PM-7AM, Visitors allowed until 9PM"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hostel Details</CardTitle>
            <CardDescription>Additional information about your hostel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender Policy *</Label>
              <Select required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male Only</SelectItem>
                  <SelectItem value="female">Female Only</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox id={amenity.id} />
                    <Label htmlFor={amenity.id} className="font-normal cursor-pointer">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload photos of your hostel</CardDescription>
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
            Create Hostel
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link to="/admin/hostels">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
    </AdminLayout>
  )
}
