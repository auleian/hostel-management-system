import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Star, Users, Building2, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        {/* Use same width pattern as SearchPage (full container) */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">About HostelHub</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Making student accommodation simple, safe, and accessible
            </p>
          </div>

          <div className="space-y-12 ">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                HostelHub was created to solve one of the biggest challenges students face: finding safe, affordable,
                and convenient accommodation near their campus. We connect students with verified hostels and provide
                hostel owners with a platform to reach their target audience efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Why Choose HostelHub?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Verified Listings</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Every hostel on our platform is verified and inspected to ensure quality standards.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Quick Booking</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Book your room in minutes with our streamlined process. No paperwork hassle.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Best Prices</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Compare prices across multiple hostels and find the best deal for your budget.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Student Community</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Join a vibrant community of students and find accommodation that fits your lifestyle.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">For Hostel Owners</h2>
              <p className="text-muted-foreground text-pretty leading-relaxed mb-6">
                Are you a hostel owner looking to reach more students? HostelHub provides you with the tools to manage
                your property, track bookings, and grow your business. Our platform makes it easy to showcase your
                hostel and connect with students actively searching for accommodation.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage all your hostels and rooms from one dashboard
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reach More Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with thousands of students looking for accommodation
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
              <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
                Whether you're a student looking for accommodation or a hostel owner wanting to list your property,
                HostelHub is here to help. Join our growing community today!
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
