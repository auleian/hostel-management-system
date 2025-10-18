import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn, getImageUrl } from "@/lib/utils";
import { Hostel } from "@/lib/types";

// Add only the form-specific fields that aren't in the Hostel type
// Use `newImages` for File[] so it doesn't conflict with Hostel.images (string[])
type FormFields = {
  newImages: File[];
  existingImages?: string[];
  rules: string;
  contactInfo: string;
}

const EditHostel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [hostelData, setHostelData] = useState<Hostel & FormFields>({
    _id: '',
    name: '',
    description: '',
    location: '',
    genderPolicy: 'mixed',
    rules: '',
    availableRooms: 0,
    contactInfo: '',
    priceRange: {
      min: 0,
      max: 0
    },
    // newImages holds File objects for uploads; Hostel.images remains string[] for existing urls
    newImages: [],
    amenities: [],
    existingImages: []
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  
  // Fetch hostel details when component mounts
  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching from URL:', `${apiBaseUrl}/hostels/${id}`);
        const response = await axios.get(`${apiBaseUrl}/hostels/${id}`);
        const hostel = response.data;
        
        setHostelData({
          ...hostel,
          rules: hostel.rules || '',
          contactInfo: hostel.contactInfo || '',
          priceRange: hostel.priceRange || { min: 0, max: 0 },
          newImages: [], // For new file uploads
          existingImages: hostel.images || [],
          amenities: hostel.amenities || []
        });
        
        // Set preview for existing images
        if (hostel.images && hostel.images.length) {
          setImagePreviewUrls(hostel.images.map((img: string) => 
            img.startsWith('http') ? img : getImageUrl(img)
          ));
        }
      } catch (error) {
        console.error("Error fetching hostel details:", error);
        toast({
          title: "Error",
          description: "Failed to load hostel details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHostelDetails();
    }
  }, [id, toast, apiBaseUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'minPrice') {
      setHostelData(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          min: parseFloat(value) || 0
        }
      }));
    } else if (name === 'maxPrice') {
      setHostelData(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          max: parseFloat(value) || 0
        }
      }));
    } else if (name === 'availableRooms') {
      setHostelData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setHostelData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setHostelData((prev) => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Update form data with new files
      setHostelData(prev => ({
        ...prev,
        newImages: [...(prev.newImages || []), ...filesArray]
      }));
      
      // Create preview URLs for new images
      const newImagePreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newImagePreviews]);
    }
  };
  
  const removeImage = (index: number) => {
    // Check if it's an existing image or a new one
    const existingCount = hostelData.existingImages?.length || 0;
    const isExistingImage = index < existingCount;
    
    if (isExistingImage) {
      // Remove from existing images
      const updatedExistingImages = [...(hostelData.existingImages || [])];
      updatedExistingImages.splice(index, 1);
      
      setHostelData(prev => ({
        ...prev,
        existingImages: updatedExistingImages
      }));
    } else {
      // Adjust index for new images array
      const newImagesIndex = index - existingCount;
      const updatedNewImages = [...(hostelData.newImages || [])];
      updatedNewImages.splice(newImagesIndex, 1);
      
      setHostelData(prev => ({
        ...prev,
        newImages: updatedNewImages
      }));
    }
    
    // Update preview URLs
    const updatedPreviews = [...imagePreviewUrls];
    updatedPreviews.splice(index, 1);
    setImagePreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Create form data to handle file uploads
      const formData = new FormData();
      formData.append('name', hostelData.name);
      formData.append('description', hostelData.description);
      formData.append('location', hostelData.location);
      formData.append('genderPolicy', hostelData.genderPolicy);
      formData.append('rules', hostelData.rules);
      formData.append('availableRooms', hostelData.availableRooms.toString());
      formData.append('contactInfo', hostelData.contactInfo);
      
      // Add price range
      formData.append('priceRange[min]', hostelData.priceRange.min.toString());
      formData.append('priceRange[max]', hostelData.priceRange.max.toString());
      
      // Add amenities
      formData.append('amenities', JSON.stringify(hostelData.amenities));
      
      // Add existing images that weren't removed
      if (hostelData.existingImages && hostelData.existingImages.length) {
        formData.append('existingImages', JSON.stringify(hostelData.existingImages));
      }
      
      // Add new images (files)
      (hostelData.newImages || []).forEach(image => {
        formData.append('images', image);
      });

    const url = apiBaseUrl.includes('/api') 
      ? `${apiBaseUrl}/hostels/${id}`
      : `${apiBaseUrl}/api/hostels/${id}`;
    
    console.log('Updating hostel at URL:', url);
    await axios.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

      toast({
        title: "Success",
        description: "Hostel updated successfully!",
      });
      
      navigate('/dashboard/admin/manage-hostels');
    } catch (error) {
      console.error("Error updating hostel:", error);
          if (axios.isAxiosError(error)) {
      console.error("API Response:", error.response?.data);
      console.error("Status code:", error.response?.status);
    }
      toast({
        title: "Error",
        description: "Failed to update hostel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading hostel details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Hostel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Hostel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={hostelData.name}
                  onChange={handleInputChange}
                  placeholder="Enter hostel name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={hostelData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableRooms">Available Rooms</Label>
                <Input
                  id="availableRooms"
                  name="availableRooms"
                  type="number"
                  value={hostelData.availableRooms}
                  onChange={handleInputChange}
                  placeholder="Number of available rooms"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={hostelData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Contact phone, email, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minPrice">Minimum Price</Label>
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  value={hostelData.priceRange.min}
                  onChange={handleInputChange}
                  placeholder="Minimum price"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Maximum Price</Label>
                <Input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  value={hostelData.priceRange.max}
                  onChange={handleInputChange}
                  placeholder="Maximum price"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genderPolicy">Gender Policy</Label>
                <select
                  id="genderPolicy"
                  name="genderPolicy"
                  value={hostelData.genderPolicy}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={hostelData.description}
                  onChange={handleInputChange}
                  placeholder="Enter hostel description"
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rules">Hostel Rules</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  value={hostelData.rules}
                  onChange={handleInputChange}
                  placeholder="Enter hostel rules"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['hostel shuttle', 'wifi', 'security', 'parking', 'library'].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`amenity-${amenity}`} 
                        checked={hostelData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityChange(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="capitalize">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 md:col-span-2">
                <Label>Hostel Images</Label>
                
                {/* Display image previews */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative h-32 border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Hostel preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Image upload input */}
                <Input
                  id="images"
                  name="images"
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">You can select multiple images (up to 5)</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/admin/manage-hostels')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Hostel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditHostel;