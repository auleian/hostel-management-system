
import { useState } from "react"
import { Link } from "react-router-dom"
import { Building2, Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center text-black gap-2 font-bold text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="hidden sm:inline-block">HostelHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-black hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-sm font-medium text-black hover:text-primary transition-colors">
              Search Hostels
            </Link>
            <Link to="/about" className="text-sm font-medium text-black hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/admin" className="text-sm font-medium text-black hover:text-primary transition-colors">
              Admin Portal
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="ml-auto flex items-center gap-3">
            <Link 
              to="/login"
              className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-95"
            > 
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search Hostels
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/admin"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Portal
              </Link>
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link
                to="/login"
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:opacity-95"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:opacity-95"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
