import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Star, Users, Building2, Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import useInView from "@/hooks/useInView"

export default function AboutPage() {
  const heroRef = useInView()
  const missionRef = useInView()
  const featuresRef = useInView()
  const ownersRef = useInView()
  const ctaRef = useInView()

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every hostel on our platform is verified and inspected to ensure quality standards.",
      color: "text-blue-600"
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book your room in minutes with our streamlined process. No paperwork hassle.",
      color: "text-green-600"
    },
    {
      icon: Star,
      title: "Best Prices",
      description: "Compare prices across multiple hostels and find the best deal for your budget.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Join a vibrant community of students and find accommodation that fits your lifestyle.",
      color: "text-purple-600"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef as any}
          className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-20 md:py-28 overflow-hidden"
        >
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center observe-on-scroll">
              <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 pop delay-150">
                About <span className="text-primary">HostelHub</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-pretty fade-up delay-300 max-w-2xl mx-auto">
                Making student accommodation simple, safe, and accessible
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Mission Section */}
          <section 
            ref={missionRef as any}
            className="py-16 observe-on-scroll"
          >
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border/50">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 pop delay-150">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed fade-up delay-300">
                HostelHub was created to solve one of the biggest challenges students face: finding safe, affordable,
                and convenient accommodation near their campus. We connect students with verified hostels and provide
                hostel owners with a platform to reach their target audience efficiently.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section 
            ref={featuresRef as any}
            className="py-16 observe-on-scroll"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 pop delay-150">
                Why Choose HostelHub?
              </h2>
              <p className="text-muted-foreground fade-up delay-300">
                Everything you need for the perfect student accommodation experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
                >
                  <CardContent className="p-6 space-y-4 fade-up-smooth" style={{ '--anim-delay': `${400 + (index * 150)}ms` } as React.CSSProperties}>
                    <div className={`h-14 w-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300 ${feature.color}`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* For Hostel Owners Section */}
          <section 
            ref={ownersRef as any}
            className="py-16 observe-on-scroll"
          >
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 pop delay-150">
                For Hostel Owners
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8 fade-up delay-300">
                Are you a hostel owner looking to reach more students? HostelHub provides you with the tools to manage
                your property, track bookings, and grow your business. Our platform makes it easy to showcase your
                hostel and connect with students actively searching for accommodation.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-6 bg-background/50 rounded-xl hover:bg-background/80 transition-colors fade-up delay-400">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Easy Management</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Manage all your hostels and rooms from one intuitive dashboard
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-background/50 rounded-xl hover:bg-background/80 transition-colors fade-up delay-500">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Reach More Students</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Connect with thousands of students looking for accommodation
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="fade-up delay-600">
                  <Link to="/admin">
                    Get Started as Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section 
          ref={ctaRef as any}
          className="py-16 bg-primary text-primary-foreground observe-on-scroll"
        >
          <div className="container mx-auto px-4 text-center space-y-6 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-balance pop delay-150">
              Are You a Hostel Owner?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty fade-up delay-200 will-change-transform">
              List your hostel on HostelHub and reach thousands of students looking for accommodation. Manage bookings,
              rooms, and payments all in one place.
            </p>
            <Button className="pop delay-150" asChild size="lg" variant="secondary">
              <Link className="text-white hover:text-white fade-up" to="/admin">Get Started as Admin</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
