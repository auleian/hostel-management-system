import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { AdminLayout } from "@/components/AdminLayout"
import api from "@/lib/api"
import { useHostelStore, useRoomStore } from "@/stores"
import { LoadingState } from "@/components/ui/loading-spinner"
import Breadcrumb from "@/components/Breadcrumb"

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

export default function EditRoomPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hostels, fetchHostels } = useHostelStore()
  const { fetchRoomById, getRoomById } = useRoomStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
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
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Fetch room data on mount
  useEffect(() => {
    const loadRoom = async () => {
      if (!id) return
      try {
        setLoading(true)
        await fetchRoomById(id)
        await fetchHostels()
      } catch (error) {
        console.error("Error loading room:", error)
        toast.error("Failed to load room details")
      } finally {
        setLoading(false)
      }
    }
    loadRoom()
  }, [id, fetchRoomById, fetchHostels])

  // Populate form when room data is loaded
  useEffect(() => {
    if (id) {
      const room = getRoomById(id)
      if (room) {
        setFormData({
          hostel: typeof room.hostel === 'string' ? room.hostel : room.hostel._id,
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          price: String(room.price),
          description: room.moreInfo || "",
          selfContained: room.isSelfContained,
          available: room.isAvailable,
          amenities: room.amenities || [],
        })
        setExistingImages(room.images || [])
      }
    }
  }, [id, getRoomById])

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
    const remainingSlots = 5 - existingImages.length
    const limited = files.slice(0, remainingSlots)
    
    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more image(s) can be added`)
    }
    
    // cleanup previous previews
    previews.forEach(url => URL.revokeObjectURL(url))
    setImages(limited)
    setPreviews(limited.map(f => URL.createObjectURL(f)))
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
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
      form.append("hostel", formData.hostel)
      form.append("roomNumber", formData.roomNumber)
      form.append("roomType", formData.roomType)
      form.append("price", String(Number(formData.price) || 0))
      if (formData.description) form.append("moreInfo", formData.description)
      form.append("isSelfContained", String(formData.selfContained))
      form.append("isAvailable", String(formData.available))
      formData.amenities.forEach(a => form.append("amenities", a))
      
      // Add existing images that weren't removed
      existingImages.forEach(img => form.append("existingImages", img))
      
      // Add new images
      images.forEach(img => form.append("images", img))

      const response = await api.put(`/rooms/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Room updated successfully!", {
        description: `${response.data.roomNumber} has been updated.`,
      })
      setTimeout(() => {
        navigate("/admin/rooms")
      }, 1500)
    } catch (error: any) {
      console.error("Error updating room:", error)
      toast.error("Failed to update room", {
        description: error.response?.data?.message || "An error occurred while updating the room.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingState title="Loading Room" description="Fetching room details..." />
      </AdminLayout>
    )
  }

  const room = id ? getRoomById(id) : null

  if (!room) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">Room Not Found</h2>
          <p className="text-muted-foreground">The room you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/admin/rooms">Back to Rooms</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="space-y-8 max-w-4xl w-full">
          {/* Header */}
          <div>
            <Breadcrumb
              items={[
                { label: "Rooms", to: "/admin/rooms" },
                { label: `Edit Room ${room.roomNumber}` },
              ]}
            />
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-balance">Edit Room {room.roomNumber}</h1>
              <p className="text-muted-foreground mt-2">Update room details and availability</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <CardDescription>Update the details about the room</CardDescription>
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
                      {hostels.map((hostel) => (
                        <SelectItem key={hostel._id} value={hostel._id}>
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
                <CardDescription>Upload up to 5 photos of the room (total)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Current Images</Label>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/media/rooms/${img}`}
                            alt={`Room ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                {existingImages.length < 5 && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <label htmlFor="images-upload" className="cursor-pointer block">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload additional images</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each, max {5 - existingImages.length} more image(s)
                      </p>
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
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Room"}
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
