import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AdminLayout } from "@/components/AdminLayout"
import { toast } from "sonner"
import api from "@/lib/api"

const amenities = [
  { id: "wifi", label: "WiFi" },
  { id: "security", label: "24/7 Security" },
  { id: "parking", label: "Parking" },
  { id: "library", label: "Study Library" },
  { id: "shuttle", label: "Hostel Shuttle" },
  { id: "laundry", label: "Laundry Service" },
]

export default function NewHostelPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactInfo: "",
    description: "",
    rules: "",
    genderPolicy: "",
    amenities: [] as string[],
  })
  const [images, setImages] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, genderPolicy: value }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId]
      return { ...prev, amenities }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files.slice(0, 5)) // limit to 5 images
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => form.append(key, v))
        } else {
          form.append(key, value as any)
        }
      })
      images.forEach((img) => form.append("images", img))

      const response = await api.post("/hostels", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Hostel created successfully!", {
        description: `${response.data.name} has been added to your listings.`,
      })

      setTimeout(() => {
        navigate("/admin/hostels")
      }, 1500)
    } catch (error: any) {
      console.error("Error creating hostel:", error)
      toast.error("Failed to create hostel", {
        description: error.response?.data?.message || "An error occurred while creating the hostel.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="space-y-8 max-w-4xl w-full">
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the main details about your hostel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hostel Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Green Valley Hostel"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., University District, Campus Road"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information *</Label>
                  <Input
                    id="contactInfo"
                    type="tel"
                    placeholder="+256 700 123 456"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your hostel, its features, and what makes it special..."
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules">Hostel Rules</Label>
                  <Textarea
                    id="rules"
                    placeholder="e.g., No smoking, Quiet hours 10PM-7AM, Visitors allowed until 9PM"
                    rows={3}
                    value={formData.rules}
                    onChange={handleInputChange}
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
                  <Select value={formData.genderPolicy} onValueChange={handleSelectChange} required>
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
                        <Checkbox
                          id={amenity.id}
                          checked={formData.amenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        />
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
                <CardDescription>Upload up to 5 photos of your hostel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <label htmlFor="images-upload" className="cursor-pointer block">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each, max 5 images</p>
                    <input
                      id="images-upload"
                      type="file"
                      accept="image/png, image/jpeg"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </label>
                  {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {images.map((img, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={img.name}
                            className="w-20 h-20 object-cover rounded border mb-1"
                            style={{ aspectRatio: '1/1' }}
                          />
                          <span className="text-xs bg-muted px-2 py-1 rounded max-w-[80px] truncate" title={img.name}>
                            {img.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Hostel"}
              </Button>
              <Button type="button" variant="outline" size="lg" asChild disabled={isSubmitting}>
                <Link to="/admin/hostels">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
