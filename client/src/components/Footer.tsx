import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <Zap size={16} className="text-navy-900" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-lg text-slate-100">
                EcoMonitor
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Industrial energy consumption intelligence platform. Real-time
              monitoring, analytics, and reporting for the clean energy transition.
            </p>
            <div className="flex gap-3 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-slate-500 hover:text-teal hover:border-teal-border transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/resources", label: "Reports" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 hover:text-teal transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* API info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              API
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {[
                "GET /api/posts",
                "GET /api/posts/:id",
                "POST /api/contact",
                "DELETE /api/posts/:id",
              ].map((route) => (
                <li key={route} className="text-slate-600">
                  {route}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} EcoMonitor. Built with React + Express + MongoDB Atlas.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-xs text-slate-600 font-mono">API: localhost:4000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
