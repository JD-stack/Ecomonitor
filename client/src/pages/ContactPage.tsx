/**
 * pages/ContactPage.tsx — Inquiry form
 *
 * Data flow:
 *   User fills form → handleSubmit → api.submitContact(form) →
 *   POST /api/contact → Express validates → Mongoose saves Contact doc →
 *   { success: true } returned → confirmation UI shown
 */

import { useState } from "react";
import { Mail, Building2, Send, CheckCircle } from "lucide-react";
import { submitContact } from "../api";
import type { ContactForm } from "../types";

const EMPTY: ContactForm = { name: "", email: "", company: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setErrMsg((err as Error).message || "Submission failed. Is the server running?");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-muted border border-teal-border flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-teal" />
        </div>
        <h2 className="font-display text-2xl text-slate-100 mb-3">Enquiry Received</h2>
        <p className="text-slate-500 mb-8">
          Our energy analysts will review your message and respond within 2 business days.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-outline text-sm">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left col — info */}
        <div>
          <p className="text-teal text-xs font-mono uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-100 mb-5 leading-tight">
            Talk to Our Energy Analysts
          </h1>
          <p className="text-slate-500 leading-relaxed mb-10">
            Whether you're evaluating EcoMonitor for your facility, need a custom
            data integration, or want to discuss an energy efficiency project —
            we'd love to hear from you.
          </p>

          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: "hello@ecomonitor.io" },
              { icon: Building2, label: "Office", value: "One Canada Square, London E14 5AB" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-muted border border-teal-border flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-teal" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-mono uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-slate-300 text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col — form */}
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="font-display text-xl font-bold text-slate-200 mb-6">Send an Enquiry</h2>

          {status === "error" && (
            <div className="mb-5 p-3 rounded-lg bg-red-950 border border-red-900 text-red-400 text-sm">
              ✗ {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  placeholder="Dr. Sarah Chen"
                  className="eco-input"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                  placeholder="s.chen@facility.com"
                  className="eco-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Company / Organisation
              </label>
              <input
                name="company"
                value={form.company}
                onChange={update}
                placeholder="Tata Steel Europe"
                className="eco-input"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={update}
                required
                rows={5}
                placeholder="We're looking to monitor energy consumption across our three manufacturing sites..."
                className="eco-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-700 border-t-navy-900 rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} /> Send Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
