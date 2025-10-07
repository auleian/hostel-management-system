import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { mockHostels } from "@/lib/mock-data"
import { ArrowLeft, Upload } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AdminLayout } from "@/components/AdminLayout"
import api from "@/lib/api"

interface RoomFormData {
  hostel: string
  roomNumber: string
  roomType: string
  price: string
  description: string
  selfContained: boolean
  available: boolean
  amenities: string[]
}

const roomAmenities = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "fridge", label: "Mini Fridge" },
  { id: "tv", label: "TV" },
  { id: "desk", label: "Study Desk" },
]

export default function NewRoomPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RoomFormData>({
    hostel: "",
    roomNumber: "",
    roomType: "",
    price: "",
    description: "",
    selfContained: false,
    available: true,
    amenities: [],
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const { id } = target
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked
      setFormData(prev => ({ ...prev, [id]: checked }))
    } else {
      const value = target.value
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
      return { ...prev, amenities }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const limited = files.slice(0, 5)
    // cleanup previous previews
    previews.forEach(url => URL.revokeObjectURL(url))
    setImages(limited)
    setPreviews(limited.map(f => URL.createObjectURL(f)))
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Basic validation
      if (!formData.hostel || !formData.roomNumber || !formData.roomType || !formData.price) {
        toast.error("Missing required fields", { description: "Please fill all required inputs." })
        setIsSubmitting(false)
        return
      }

      const form = new FormData()
      form.append("hostel", "68e4bef6198828336a68b01b")
      form.append("roomNumber", formData.roomNumber)
      form.append("roomType", formData.roomType)
      form.append("price", String(Number(formData.price) || 0))
      if (formData.description) form.append("moreInfo", formData.description)
      form.append("isSelfContained", String(formData.selfContained))
      form.append("isAvailable", String(formData.available))
      formData.amenities.forEach(a => form.append("amenities", a))
      images.forEach(img => form.append("images", img))

      const response = await api.post("/rooms", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Room created successfully!", {
        description: `${response.data.roomNumber} has been added to your hostel.`,
      })
      setTimeout(() => {
        navigate("/admin/rooms")
      }, 1500)
    } catch (error: any) {
      console.error("Error creating room:", error)
      toast.error("Failed to create room", {
        description: error.response?.data?.message || "An error occurred while creating the room.",
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
              <Link to="/admin/rooms">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Rooms
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-balance">Register New Room</h1>
            <p className="text-muted-foreground mt-2">Add a room to your hostel listing</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <CardDescription>Enter the details about the room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hostel">Select Hostel *</Label>
                  <Select
                    required
                    value={formData.hostel}
                    onValueChange={(value) => handleSelectChange("hostel", value)}
                  >
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
                    <Input
                      id="roomNumber"
                      placeholder="e.g., A101"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type *</Label>
                    <Select
                      required
                      value={formData.roomType}
                      onValueChange={(value) => handleSelectChange("roomType", value)}
                    >
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
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 200000"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Room Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the room features, size, and any special characteristics..."
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selfContained"
                    checked={formData.selfContained}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, selfContained: Boolean(checked) }))}
                  />
                  <Label htmlFor="selfContained" className="font-normal cursor-pointer">
                    Self-Contained (has private bathroom)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: Boolean(checked) }))}
                  />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Images</CardTitle>
                <CardDescription>Upload up to 5 photos of the room</CardDescription>
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
                  {previews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {previews.map((url, idx) => (
                        <div key={url} className="flex flex-col items-center">
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            className="w-20 h-20 object-cover rounded border mb-1"
                            style={{ aspectRatio: '1/1' }}
                          />
                          <span className="text-xs bg-muted px-2 py-1 rounded max-w-[80px] truncate" title={images[idx]?.name}>
                            {images[idx]?.name}
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
                {isSubmitting ? "Registering..." : "Register Room"}
              </Button>
              <Button type="button" variant="outline" size="lg" asChild disabled={isSubmitting}>
                <Link to="/admin/rooms">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
