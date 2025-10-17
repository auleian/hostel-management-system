import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.message || (body.errors && body.errors[0]?.msg) || "Registration failed");
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
      navigate("/admin");
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        
        <div className="container mx-auto p-6 max-w-6xl shadow-md bg-white rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Left: image */}
                <div className="md:w-1/2">
                    <img
                    src="/images/hostel-login-img.jpg"
                    alt="Hostel life"
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
                    <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                    Welcome to HostelHub. Already have an account?{" "}
                    <Link to="/login" className="text-primary font-medium">
                        Sign in
                    </Link>
                    .
                    </p>

                    {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full name</label>
                            <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border rounded px-3 py-2"
                            placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            className="w-full border rounded px-3 py-2"
                            placeholder="you@example.com"
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

                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm password</label>
                            <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            required
                            className="w-full border rounded px-3 py-2"
                            placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white rounded px-4 py-2"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-xs text-muted-foreground mt-6">
                    By creating an account you agree to our terms.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}