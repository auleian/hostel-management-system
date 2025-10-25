"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { HostelCard } from "@/components/hostel-card"
import { SearchFilters, type FilterState } from "@/components/search-filters"
//import { mockHostels } from "@/lib/mock-data"`
import axios from "axios"

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    genderPolicy: "all",
    roomType: "all",
    priceRange: { min: null, max: null },
    amenities: [],
    isSelfContained: null,
  })

  const [hostels, setHostels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHostels() {
      setLoading(true)
      setError(null)
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const res = await axios.get(`${apiBaseUrl}/hostels`)
        console.log("Fetched hostels:", res.data)
        setHostels(res.data)
      } catch (error) {
        setError("Failed to load hostels.")
      } 
    }
    fetchHostels()
  }, [])

  const filteredHostels = useMemo(() => {
    console.log("Current filters:", filters)
    return hostels.filter((hostel) => {
      // Search filter
      if (
        filters.search &&
        !hostel.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !hostel.location?.toLowerCase().includes(filters.search.toLowerCase())
        
      ) {
        return false
      }

      // Location filter
      if (filters.location && 
        filters.location !== "all" && 
        !hostel.location?.toLowerCase().includes(filters.location)) {
        return false
      }

      // Gender policy filter
      if (filters.genderPolicy !== "all" &&
         hostel.genderPolicy && 
         hostel.genderPolicy !== filters.genderPolicy) {
      return false;
     }

      // Price range filter
      const filterMin = filters.priceRange?.min ?? null
      const filterMax = filters.priceRange?.max ?? null
      const hostelMinPrice = hostel.priceRange?.min ?? null
      const hostelMaxPrice = hostel.priceRange?.max ?? null

      if (
        (filterMin != null && (hostelMinPrice == null || hostelMinPrice < filterMin)) ||
        (filterMax != null && (hostelMaxPrice == null || hostelMaxPrice > filterMax))
      ) {
        console.log(`Hostel ${hostel.name} filtered out by price range`)
        return false
      }
 

    // Amenities filter (skip if missing)
    if (filters.amenities.length > 0 && hostel.amenities) {
      const hasAllAmenities = filters.amenities.every((amenity) => hostel.amenities.includes(amenity));
      if (!hasAllAmenities) return false;

      // Self-contained filter
    if (
      filters.isSelfContained === true &&
      hostel.isSelfContained !== true
    ) {
      return false
    }
    }

      return true
    })
  }, [filters, hostels])
  console.log("Filtered hostels:", filteredHostels)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Search Hostels</h1>
            <p className="text-muted-foreground mt-2">Find the perfect accommodation for your needs</p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <SearchFilters onFilterChange={setFilters} />
            </aside>

            {/* Results */}
            <div>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {filteredHostels.length} {filteredHostels.length === 1 ? "hostel" : "hostels"} found
                </p>
              </div>

              {filteredHostels.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredHostels.map((hostel) => (
                    <HostelCard key={hostel._id} hostelId={hostel._id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hostels found matching your criteria. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
