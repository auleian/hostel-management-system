
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import LoginDialog from "./login-dialog"
import { SignupDialog } from "./signup-dialog"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const { checkingAdmin, checkAdminAccess } = useAdminAuth()
  const { user, token, setAuth } = useAuthContext()
  const navigate = useNavigate()

  const handleAdminClick = () => {
    //if the user is already authenticated, go straight to the admin dashboard.
    //otherwise, run the existing admin-check.. which will open the login dialog.
    if (user && token) {
      setMobileMenuOpen(false)
      navigate('/admin')
      return
    }
    checkAdminAccess(() => setLoginOpen(true))
  }

  const handleLogout = () => {
    setAuth({ user: null, token: null })
    setMobileMenuOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center text-black gap-2 font-bold text-xl pop delay-150">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                width="48"
                height="52"
                viewBox="0 0 48 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
              >
                <path
                  d="M42.3542 2.84554C40.8568 2.84554 39.4208 3.44491 38.362 4.5118C37.3032 5.57868 36.7084 7.02569 36.7084 8.53449V17.7828L22.5896 17.0722V7.11332C22.5896 5.22675 21.8459 3.41745 20.522 2.08344C19.1981 0.749437 17.4025 0 15.5302 0C13.658 0 11.8624 0.749437 10.5385 2.08344C9.21459 3.41745 8.47084 5.22675 8.47084 7.11332V44.1022C8.47084 48.0349 11.6283 51.2144 15.5292 51.2144C19.43 51.2144 22.5896 48.0328 22.5896 44.1022V32.72H36.7084V44.1022C36.7084 44.8493 36.8544 45.589 37.1381 46.2792C37.4219 46.9695 37.8377 47.5966 38.362 48.1249C38.8863 48.6531 39.5086 49.0722 40.1936 49.3581C40.8786 49.644 41.6128 49.7911 42.3542 49.7911C43.0956 49.7911 43.8298 49.644 44.5147 49.3581C45.1997 49.0722 45.8221 48.6531 46.3464 48.1249C46.8706 47.5966 47.2865 46.9695 47.5702 46.2792C47.854 45.589 48 44.8493 48 44.1022V8.53663C48 7.02782 47.4052 5.58082 46.3464 4.51393C45.2876 3.44705 43.8515 2.84768 42.3542 2.84768M7.05832 7.11332C7.05832 5.96529 7.28704 4.8706 7.69787 3.86981C6.64564 4.49409 5.77297 5.38383 5.16582 6.45136C4.55868 7.51889 4.23802 8.72739 4.23542 9.9578V42.681C4.23542 45.7367 6.1583 48.3209 8.84779 49.3259C7.68934 47.8356 7.05937 45.9974 7.05832 44.1043V7.11332ZM3.46245 6.71428C2.41037 7.33873 1.53781 8.2285 0.930684 9.296C0.32356 10.3635 0.00280621 11.5719 0 12.8023V39.8344C0 42.4335 1.39769 44.6826 3.46245 45.9224C3.03967 44.8941 2.82234 43.7919 2.82291 42.6789V9.9578C2.82291 8.80976 3.05162 7.71721 3.46245 6.71428ZM35.2959 8.53663C35.2959 7.04717 35.7554 5.66868 36.5326 4.52491C35.3643 4.86701 34.3373 5.58121 33.6055 6.56059C32.8737 7.53997 32.4763 8.73184 32.473 9.9578V16.1461L35.2959 16.289V8.53663ZM35.2959 34.1433H32.4708V42.6789C32.4708 45.263 34.1904 47.4204 36.5305 48.1139C35.7246 46.9337 35.2933 45.5347 35.2937 44.1022L35.2959 34.1433ZM28.2354 41.2556C28.2354 43.8397 29.9571 45.9971 32.3014 46.6906C31.492 45.5118 31.0583 44.1123 31.0583 42.6789V34.1433H28.2354V41.2556ZM31.0604 9.9578C31.0604 8.47047 31.52 7.08985 32.2972 5.94608C31.1285 6.28829 30.1013 7.00281 29.3694 7.98261C28.6376 8.96242 28.2405 10.1548 28.2375 11.3811V15.9327L31.0604 16.0757V9.9578Z"
                  fill="currentColor"
                  className="text-green-600"
                />
              </svg>
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
            <button
              onClick={handleAdminClick}
              className="text-sm font-medium text-black hover:text-primary transition-colors"
              disabled={checkingAdmin}
            >
              {checkingAdmin ? 'Checking...' : 'Admin Portal'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleAdminClick()
              }}
              className="text-sm font-medium text-black hover:text-primary transition-colors"
              disabled={checkingAdmin}
            >
              {checkingAdmin ? 'Checking...' : 'Admin Portal'}
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <LoginDialog 
                  open={loginOpen} 
                  onOpenChange={setLoginOpen}
                  onOpenSignup={() => {
                    setLoginOpen(false)
                    setSignupOpen(true)
                  }}
                />
                <SignupDialog 
                  open={signupOpen} 
                  onOpenChange={setSignupOpen}
                />
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleAdminClick()
                }}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
                disabled={checkingAdmin}
              >
                {checkingAdmin ? 'Checking...' : 'Admin Portal'}
              </button>
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t">
              {!user ? (
                <>
                  <LoginDialog 
                    open={loginOpen} 
                    onOpenChange={setLoginOpen}
                    onOpenSignup={() => {
                      setLoginOpen(false)
                      setSignupOpen(true)
                    }}
                  />
                  <SignupDialog 
                    open={signupOpen} 
                    onOpenChange={setSignupOpen}
                  />
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Mobile Menu Links */}
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-red-600 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
