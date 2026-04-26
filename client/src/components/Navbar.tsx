/**
 * components/Navbar.tsx
 * Sticky top navigation.
 * - Shows "Sign Up" and "Login" when logged out
 * - Shows user name + logout when logged in as viewer
 * - Shows admin link only when user.role === "admin"
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X, ShieldCheck, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/resources", label: "Reports" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
            <Zap size={16} className="text-navy-900" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-lg text-slate-100 group-hover:text-teal transition-colors">
            EcoMonitor
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "text-teal bg-teal-muted"
                  : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Admin link — only visible to admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                pathname === "/admin"
                  ? "text-teal bg-teal-muted"
                  : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
              }`}
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UserCircle size={16} className="text-teal" />
                <span className="text-sm text-slate-300 font-medium">{user.name}</span>
                {user.role === "admin" && (
                  <span className="text-xs bg-teal-muted text-teal border border-teal-border px-2 py-0.5 rounded-full font-mono">
                    admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signup" className="btn-primary text-xs py-2 px-4">Sign Up</Link>
              <Link to="/login" className="btn-outline text-xs py-2 px-4">Login</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-slate-200 p-1"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-navy-900 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "text-teal bg-teal-muted"
                  : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-navy-800"
            >
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-800 pt-2 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <UserCircle size={14} className="text-teal" />
                  <span className="text-sm text-slate-300">{user.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full text-left flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-navy-800"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-teal bg-teal-muted mb-1">Sign Up</Link>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-navy-800">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}