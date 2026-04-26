/**
 * pages/LandingPage.tsx
 * Hero + services + stats + CTA landing page for EcoMonitor.
 */

import { Link } from "react-router-dom";
import {
  Zap, BarChart3, Leaf, Shield, ArrowRight,
  Wind, Sun, Droplets, Battery,
} from "lucide-react";

const STATS = [
  { value: "2.4 GW", label: "Capacity Monitored" },
  { value: "340+", label: "Industrial Sites" },
  { value: "18%", label: "Avg. Energy Saved" },
  { value: "99.9%", label: "Platform Uptime" },
];

const SERVICES = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live dashboards tracking consumption, generation, and grid imports across your industrial estate.",
  },
  {
    icon: Leaf,
    title: "Carbon Accounting",
    desc: "Automated Scope 1, 2, and 3 emissions reporting aligned with GHG Protocol standards.",
  },
  {
    icon: Shield,
    title: "Demand Response",
    desc: "AI-driven load shifting to reduce peak demand charges and participate in grid flexibility markets.",
  },
  {
    icon: Zap,
    title: "Asset Optimisation",
    desc: "Maximise ROI on solar, storage, and EV charging assets through intelligent dispatch algorithms.",
  },
];

const SECTORS = [
  { icon: Wind, label: "Wind" },
  { icon: Sun, label: "Solar" },
  { icon: Droplets, label: "Hydrogen" },
  { icon: Battery, label: "Storage" },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#2dd4bf 1px, transparent 1px), linear-gradient(90deg, #2dd4bf 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2dd4bf 0%, transparent 70%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 border border-teal-border bg-teal-muted rounded-full px-4 py-1.5 mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-xs font-mono text-teal">
                Industrial Energy Intelligence — v2.0
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 leading-[1.05] mb-6 animate-fade-up animate-delay-100">
              Monitor. Optimise.{" "}
              <span className="text-teal">Decarbonise.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-xl animate-fade-up animate-delay-200">
              EcoMonitor gives industrial operators a single pane of glass for
              energy consumption, generation assets, and carbon emissions — in
              real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
              <Link to="/resources" className="btn-primary text-sm py-3 px-6">
                View Energy Reports <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline text-sm py-3 px-6">
                Request a Demo
              </Link>
            </div>

            {/* Sector chips */}
            <div className="flex flex-wrap items-center gap-3 mt-12 animate-fade-up animate-delay-400">
              <span className="text-xs text-slate-600 font-mono uppercase tracking-wider">Covers:</span>
              {SECTORS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-gray-800 text-xs text-slate-400"
                >
                  <Icon size={13} className="text-teal" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-800 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-teal mb-1">
                  {value}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-teal text-xs font-mono uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100">
            Energy Optimisation Services
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            From metering to dispatch — a complete stack for industrial energy management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-navy-900 border border-gray-800 rounded-xl p-6 hover:border-teal-border transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-muted border border-teal-border flex items-center justify-center mb-4 group-hover:bg-teal group-hover:border-teal transition-colors">
                <Icon size={18} className="text-teal group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="font-display font-bold text-slate-200 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Ready to cut your energy costs?
          </h2>
          <p className="text-slate-500 mb-8">
            Our analysts can identify quick-win efficiency measures within 30 days.
          </p>
          <Link to="/contact" className="btn-primary text-sm py-3 px-8">
            Get Started Today <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
