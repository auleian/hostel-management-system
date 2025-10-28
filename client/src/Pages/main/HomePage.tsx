import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { HostelCard } from "@/components/hostel-card"
import { mockHostels } from "../../lib/mock-data"
import { Search, Shield, Clock, Star } from "lucide-react"
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
// @ts-ignore: importing an untyped JSX module (FeatureSection.jsx)
import FeatureSection from "@/components/FeatureSection"
import useInView from "@/hooks/useInView"

export default function HomePage() {
  const { toast } = useToast()
  const [hostels, setHostels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const sectionRef = useInView()
  const featuredHeaderRef = useInView()
  const ctaSectionRef = useInView()

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
      <section className="relative bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
         <img src="/background.jpg"
          alt="Student Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none" 
          style={{ filter: 'none' }}
          />
          <div className="banner-fadeBottom-blur" />         
          <div ref={sectionRef as any} className="max-w-3xl mx-auto text-center space-y-6 observe-on-scroll in-view">
            <h1
              className="text-4xl md:text-6xl font-bold text-balance fade-up">
              <span className="text-green-600 inline-block pop">Home</span>
              {" "}away from{" "}
              <span className="text-green-600 inline-block pop delay-150">Home</span>
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground text-pretty fade-up delay-200 will-change-transform">
              Browse hundreds of verified hostels near your campus. Book your room in minutes and focus on what matters
              - your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-base">
                <Link className="text-white hover:text-white pop delay-150" to="/search">
                  <Search className="mr-2 h-5 w-5 fade-up" />
                  Browse Hostels
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent pop delay-150">
                <Link className="text-black hover:text-white fade-up" to="/admin">Admin Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />
      {/* Featured Hostels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div ref={featuredHeaderRef as any} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-balance  pop delay-150">Featured Hostels</h2>
              <p className="text-muted-foreground mt-2 fade-up delay-200 will-change-transform">Popular choices among students</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/search" className="fade-up">View All</Link>
            </Button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading hostels...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {featuredHostels.map((hostel:any) => (
                <HostelCard key={hostel._id} hostelId={hostel._id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div ref={ctaSectionRef as any}  className="container mx-auto px-4 text-center space-y-6 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-balance pop delay-150">Are You a Hostel Owner?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty fade-up delay-200 will-change-transform">
            List your hostel on HostelHub and reach thousands of students looking for accommodation. Manage bookings,
            rooms, and payments all in one place.
          </p>
          <Button className="pop delay-150" asChild size="lg" variant="secondary">
            <Link className="text-white hover:text-white fade-up" to="/admin">Get Started as Admin</Link>
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
