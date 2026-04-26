/**
 * pages/SignupPage.tsx — New user registration
 * Creates a "viewer" account — can browse and read reports, no admin access.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Leaf } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/resources"); // Send new users straight to the reports page
    } catch (err) {
      setError((err as Error).message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-muted border border-teal-border flex items-center justify-center mx-auto mb-4">
            <Leaf size={24} className="text-teal" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100 mb-2">
            Create an Account
          </h1>
          <p className="text-slate-500 text-sm">
            Sign up to access EcoMonitor's energy intelligence reports.
          </p>
        </div>

        {/* Card */}
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950 border border-red-900 text-red-400 text-sm">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Sarah Chen"
                className="eco-input"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="sarah@company.com"
                className="eco-input"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  className="eco-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="eco-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-navy-700 border-t-navy-900 rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={14} /> Create Account
                </>
              )}
            </button>
          </form>

          {/* Role info */}
          <div className="mt-5 p-3 rounded-lg bg-navy-800 border border-gray-800">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="text-teal font-semibold">Viewer account:</span> You'll
              be able to read all published energy reports. Admin access is
              granted separately by the platform team.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-teal hover:text-teal-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}