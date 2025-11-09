import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { HostelCard } from "@/components/hostel-card"
import { Search } from "lucide-react"
import { useHostelStore } from '@/stores/hostelStore'
// @ts-ignore: importing an untyped JSX module (FeatureSection.jsx)
import FeatureSection from "@/components/FeatureSection"
import useInView from "@/hooks/useInView"
import LoginDialog from "@/components/login-dialog"
import { SignupDialog } from "@/components/signup-dialog"
import { useAdminAuth } from "@/hooks/useAdminAuth"

export default function HomePage() {
  const { hostels, loading, fetchHostels } = useHostelStore()

  const sectionRef = useInView()
  const featuredHeaderRef = useInView()
  const ctaSectionRef = useInView()

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSignupDialog, setShowSignupDialog] = useState(false)
  const { checkingAdmin, checkAdminAccess } = useAdminAuth()

  const handleAdminClick = () => {
    checkAdminAccess(() => setShowLoginDialog(true))
  }

  useEffect(() => {
    fetchHostels()
  }, [fetchHostels])

  const featuredHostels = hostels.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <LoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog}
          onOpenSignup={() => {
            setShowLoginDialog(false)
            setShowSignupDialog(true)
          }}
          showTrigger={false}
        />
        <SignupDialog 
          open={showSignupDialog} 
          onOpenChange={setShowSignupDialog}
          showTrigger={false}
        />


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
              <span className="text-green-600 inline-block pop delay-500">Home</span>
              {" "}away from{" "}
              <span className="text-green-600 inline-block pop delay-500">Home</span>
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground text-pretty fade-up delay-600 will-change-transform">
              Browse hundreds of verified hostels near your campus. Book your room in minutes and focus on what matters
              - your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-base">
                <Link className="text-white hover:text-white pop delay-600" to="/search">
                  <Search className="mr-2 h-5 w-5 fade-up" />
                  Browse Hostels
                </Link>
              </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base bg-transparent pop delay-600 text-black hover:text-white fade-up"
              onClick={handleAdminClick}
              type="button"
              aria-busy={checkingAdmin}
            >
              {checkingAdmin ? 'Checking...' : 'Admin Portal'}
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />
      {/* Featured Hostels */}
      <section className="py-16 observe-on-scroll" ref={featuredHeaderRef as any}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-balance pop delay-600">Featured Hostels</h2>
              <p className="text-muted-foreground mt-2 fade-up delay-400 will-change-transform">Popular choices among students</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/search" className="fade-up delay-600">View All</Link>
            </Button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground fade-up delay-800">Loading hostels...</div>
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
        <div ref={ctaSectionRef as any}  className="container mx-auto px-4 text-center space-y-6 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-balance pop delay-600">Are You a Hostel Owner?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty fade-up delay-200 will-change-transform">
            List your hostel on HostelHub and reach thousands of students looking for accommodation. Manage bookings,
            rooms, and payments all in one place.
          </p>
          <Button className="pop delay-600" asChild size="lg" variant="secondary">
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
