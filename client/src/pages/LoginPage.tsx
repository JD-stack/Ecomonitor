/**
 * pages/LoginPage.tsx
 * Single login page for both Users and Admins.
 * A tab switcher lets the user choose their login type.
 * Both use the same POST /api/auth/login endpoint —
 * the JWT role in the response determines where they land:
 *   admin  → /admin
 *   viewer → /resources
 */

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Zap, Eye, EyeOff, ShieldCheck, UserCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type Tab = "user" | "admin";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Redirect based on selected tab — admin goes to dashboard, user goes to reports
      if (from) {
        navigate(from, { replace: true });
      } else if (tab === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/resources", { replace: true });
      }
    } catch (err) {
      setError((err as Error).message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setEmail("");
    setPassword("");
    setError("");
  };

  const isAdmin = tab === "admin";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-colors duration-300 ${
            isAdmin
              ? "bg-teal-muted border-teal-border"
              : "bg-navy-800 border-gray-700"
          }`}>
            {isAdmin
              ? <ShieldCheck size={24} className="text-teal" />
              : <UserCircle size={24} className="text-slate-300" />
            }
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100 mb-1">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to EcoMonitor
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-navy-900 border border-gray-800 p-1 mb-6">
          <button
            onClick={() => switchTab("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isAdmin
                ? "bg-navy-800 text-slate-100 shadow-sm border border-gray-700"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <UserCircle size={15} />
            User Login
          </button>
          <button
            onClick={() => switchTab("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isAdmin
                ? "bg-teal-muted text-teal shadow-sm border border-teal-border"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <ShieldCheck size={15} />
            Admin Login
          </button>
        </div>

        {/* Card */}
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-8">

          {/* Context label */}
          <p className="text-xs text-slate-600 mb-5">
            {isAdmin
              ? "Admin credentials grant access to the dashboard, post management, and user submissions."
              : "Sign in to browse and read all published energy intelligence reports."}
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950 border border-red-900 text-red-400 text-sm">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder={isAdmin ? "admin@ecomonitor.io" : "you@example.com"}
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
                  autoComplete="current-password"
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full justify-center py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg font-semibold text-sm transition-colors ${
                isAdmin
                  ? "btn-primary"
                  : "bg-navy-800 border border-gray-700 text-slate-200 hover:bg-navy-700 hover:border-gray-600"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={14} />
                  {isAdmin ? "Sign in as Admin" : "Sign in"}
                </>
              )}
            </button>
          </form>

          {/* Admin hint */}
          {isAdmin && (
            <div className="mt-5 p-3 rounded-lg bg-navy-800 border border-gray-800">
              <p className="text-xs text-slate-600 font-mono mb-0.5">Default after seeding:</p>
              <p className="text-xs text-slate-500 font-mono">admin@ecomonitor.io / Admin@123</p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal hover:text-teal-light transition-colors">
            Create one free
          </Link>
        </p>
        <p className="text-center text-xs text-slate-600 mt-2">
          <Link to="/" className="hover:text-teal transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}