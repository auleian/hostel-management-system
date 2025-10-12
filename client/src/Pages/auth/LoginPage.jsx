import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api"



  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.message || (body.errors && body.errors[0]?.msg) || "Login failed");
        setLoading(false);
        return;
      }
      const token = body.token;
      if (!token) {
        setError("No token returned");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", token);
      // redirect to dashboard/admin
      navigate("/admin");
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="container mx-auto p-6 max-w-5xl shadow-md bg-white rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: image */}
          <div className="md:w-1/2">
            <img
              src="/images/hostel-login-img.jpg" 
              alt="Students in a hostel"
              className="object-cover w-full h-96 md:h-full"
            />
          </div>

          {/* Right: form */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <div>
              <Link to="/" className="text-sm text-muted-foreground hover:underline"><u>Back to Home</u></Link>
            </div>
            <br/>
            <br/>
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2><br/>
            <p className="text-sm text-muted-foreground mb-6">
              New here? {""} 
              <Link to="/register" className="text-primary font-medium">
                Create an account
              </Link>
              .
            </p>

            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="student@hostel.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <input id="remember" type="checkbox" className="mr-2" />
                  <label htmlFor="remember" className="text-sm">Remember me</label>
                </div>
                <Link to="/forgot" className="text-sm text-primary">Forgot?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded px-4 py-2"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}