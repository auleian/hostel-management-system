
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SlidersHorizontal } from "lucide-react"

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  location: string
  genderPolicy: string
  roomType: string
  priceRange: { min: number; max: number }
  amenities: string[]
  isSelfContained: boolean | null
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    genderPolicy: "all",
    roomType: "all",
    priceRange: { min: 0, max: 2500000 },
    amenities: [],
    isSelfContained: null,
  })

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    handleFilterChange("amenities", newAmenities)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filter Hostels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search hostels..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="north">North Campus</SelectItem>
              <SelectItem value="south">South Campus</SelectItem>
              <SelectItem value="east">East Campus</SelectItem>
              <SelectItem value="west">West Campus</SelectItem>
              <SelectItem value="central">Central Campus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Policy */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender Policy</Label>
          <Select value={filters.genderPolicy} onValueChange={(value) => handleFilterChange("genderPolicy", value)}>
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male Only</SelectItem>
              <SelectItem value="female">Female Only</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <Label htmlFor="roomType">Room Type</Label>
          <Select value={filters.roomType} onValueChange={(value) => handleFilterChange("roomType", value)}>
            <SelectTrigger id="roomType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (UGX per semester)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.priceRange.min === 0 ? "" : filters.priceRange.min}
              onChange={(e) =>
                handleFilterChange("priceRange", {
                  ...filters.priceRange,
                  min: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
            <Input
              type="number"
              inputMode="numeric"            
              placeholder="Max"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.priceRange.max === 2500000 ? "" : filters.priceRange.max}
              onChange={(e) =>
                handleFilterChange("priceRange", {
                  ...filters.priceRange,
                  max: e.target.value === "" ? 2500000 : Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label>Amenities</Label>
          <div className="space-y-2">
            {["wifi", "security", "parking", "library", "hostel shuttle"].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <label
                  htmlFor={amenity}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

      
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => {
            const resetFilters: FilterState = {
              search: "",
              location: "",
              genderPolicy: "all",
              roomType: "all",
              priceRange: { min: 0, max: 2500000 },
              amenities: [],
              isSelfContained: null,
            }
            setFilters(resetFilters)
            onFilterChange?.(resetFilters)
          }}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
