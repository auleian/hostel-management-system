import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { HostelCard } from "@/components/hostel-card"
import { mockHostels } from "../../lib/mock-data"
import { Search, Shield, Clock, Star } from "lucide-react"
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function HomePage() {
  const { toast } = useToast()
  const [hostels, setHostels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const fetchHostels = async () => {
      try {
        setLoading(true)
        const res = await api.get('/hostels')
        const data = res.data || []
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) {
            setHostels(data)
          } else {
            setHostels(mockHostels)
            toast({
              title: 'Showing sample data',
              description: 'No hostels returned from server. Displaying mock listings.',
            })
          }
        }
      } catch (err:any) {
        if (!ignore) {
          setHostels(mockHostels)
          toast({
            title: 'Using mock data',
            description: err.response?.data?.message || 'Failed to load hostels from backend.',
            variant: 'destructive'
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchHostels()
    return () => { ignore = true }
  }, [toast])

  const featuredHostels = hostels.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Home away from Home</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Browse hundreds of verified hostels near your campus. Book your room in minutes and focus on what matters
              - your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-base">
                <Link className="text-white hover:text-white" to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Hostels
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
                <Link className="text-black hover:text-white" to="/admin">Admin Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg">Verified Hostels</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                All hostels are verified and inspected to ensure quality and safety standards.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg">Instant Booking</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Book your room instantly with our streamlined booking process. No waiting, no hassle.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg">Best Prices</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Compare prices across multiple hostels and find the best deal for your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-balance">Featured Hostels</h2>
              <p className="text-muted-foreground mt-2">Popular choices among students</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/search">View All</Link>
            </Button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading hostels...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHostels.map((hostel:any) => (
                <HostelCard key={hostel._id} hostelId={hostel._id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Are You a Hostel Owner?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            List your hostel on HostelHub and reach thousands of students looking for accommodation. Manage bookings,
            rooms, and payments all in one place.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link className="text-white hover:text-white" to="/admin">Get Started as Admin</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
