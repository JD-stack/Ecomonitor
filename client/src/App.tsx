/**
 * App.tsx — EcoMonitor Root Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Routing architecture (React Router v6):
 *
 *   /                → LandingPage   (public)
 *   /resources        → BlogPage      (public — lists all reports)
 *   /resources/:id    → SinglePost    (public — article detail view)
 *   /contact          → ContactPage   (public — inquiry form)
 *   /login            → LoginPage     (public — admin login)
 *   /admin            → AdminPage     (PROTECTED — requires admin role)
 *
 * ProtectedRoute:
 *   Wraps the /admin route. If isAdmin is false, redirects to /login.
 *   isAdmin is derived from the JWT payload stored in localStorage via AuthContext.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import BlogPage from "./pages/BlogPage";
import SinglePost from "./pages/SinglePost";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";

// ─── Protected Route Guard ─────────────────────────────────────────────────────
/**
 * ProtectedRoute wraps admin-only pages.
 * If the user is not authenticated as admin, redirects to /login.
 * isLoading state prevents a flash-of-redirect while the token is being verified.
 *
 * RBAC (Role-Based Access Control) flow:
 *   User navigates to /admin
 *   → ProtectedRoute checks useAuth().isAdmin
 *   → isAdmin = (user?.role === "admin") — derived from JWT payload
 *   → If false: redirect to /login with `from` state for post-login redirect
 *   → If true: render AdminPage
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to login, preserving the attempted URL for post-login redirect
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  return <>{children}</>;
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 font-body">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/resources" element={<BlogPage />} />
          <Route path="/resources/:id" element={<SinglePost />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected admin route — ProtectedRoute enforces RBAC */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}