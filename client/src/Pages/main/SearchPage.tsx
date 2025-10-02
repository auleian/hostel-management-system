"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { HostelCard } from "@/components/hostel-card"
import { SearchFilters, type FilterState } from "@/components/search-filters"
import { mockHostels } from "@/lib/mock-data"

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    genderPolicy: "all",
    roomType: "all",
    priceRange: { min: 0, max: 500000 },
    amenities: [],
    isSelfContained: null,
  })

  const filteredHostels = useMemo(() => {
    return mockHostels.filter((hostel) => {
      // Search filter
      if (
        filters.search &&
        !hostel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !hostel.location.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Location filter
      if (filters.location && filters.location !== "all" && !hostel.location.toLowerCase().includes(filters.location)) {
        return false
      }

      // Gender policy filter
      if (filters.genderPolicy !== "all" && hostel.genderPolicy !== filters.genderPolicy) {
        return false
      }

      // Price range filter
      if (hostel.priceRange.min > filters.priceRange.max || hostel.priceRange.max < filters.priceRange.min) {
        return false
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) => hostel.amenities.includes(amenity))
        if (!hasAllAmenities) return false
      }

      return true
    })
  }, [filters])

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
                    <HostelCard key={hostel.id} hostel={hostel} />
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
