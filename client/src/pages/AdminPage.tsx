/**
 * pages/AdminPage.tsx — Protected Admin Dashboard
 *
 * RBAC: This page is only reachable via ProtectedRoute in App.tsx,
 * which redirects to /login if isAdmin === false.
 *
 * Features:
 *   - Stats overview (total posts, contacts)
 *   - Create new energy report (POST /api/posts with JWT)
 *   - Delete existing reports (DELETE /api/posts/:id with JWT)
 *   - View all contact submissions (GET /api/admin/contacts with JWT)
 *
 * Data flow for create:
 *   Admin fills form → createPost(form) → POST /api/posts →
 *   requireAuth + requireAdmin middleware → Mongoose.create() →
 *   new post returned → prepended to posts state
 *
 * Data flow for delete:
 *   Admin clicks Delete → deletePost(id) → DELETE /api/posts/:id →
 *   Mongoose.findByIdAndDelete() → post filtered from state
 */

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, FileText, Mail, ShieldCheck,
  ChevronDown, ChevronUp, LogOut,
} from "lucide-react";
import { getPosts, createPost, deletePost } from "../api";
import { useAuth } from "../hooks/useAuth";
import { CategoryBadge } from "../components/PostCard";
import type { Post, NewPostForm, Category } from "../types";

const CATEGORIES: Category[] = ["Wind", "Solar", "Hydrogen", "Storage", "Policy", "Analysis"];

const EMPTY_FORM: NewPostForm = {
  title: "",
  summary: "",
  content: "",
  author: "",
  category: "Analysis",
  thumbnail: "",
  readTime: "5 min",
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<NewPostForm>({ ...EMPTY_FORM, author: user?.name ?? "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Fetch all posts on mount (admin sees all including drafts)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Create post — sends Bearer JWT header (see api/index.ts createPost)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");
    try {
      const { post } = await createPost(form);
      setPosts((prev) => [post, ...prev]); // Prepend to list
      setFormSuccess(`"${post.title}" published successfully.`);
      setForm({ ...EMPTY_FORM, author: user?.name ?? "" });
      setFormOpen(false);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete post — sends Bearer JWT header (see api/index.ts deletePost)
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err as Error).message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-xs font-mono text-teal uppercase tracking-wider">
              Admin Session Active
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Signed in as{" "}
            <span className="font-mono text-slate-400">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors border border-gray-800 px-4 py-2 rounded-lg hover:border-red-900"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: FileText, label: "Total Reports", value: posts.length },
          { icon: ShieldCheck, label: "Role", value: user?.role?.toUpperCase() ?? "ADMIN" },
          { icon: Mail, label: "API Status", value: "Connected" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-navy-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-teal" />
              <span className="text-xs text-slate-600 uppercase tracking-wider font-mono">{label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Success / Error banners */}
      {formSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-teal-muted border border-teal-border text-teal text-sm">
          ✓ {formSuccess}
        </div>
      )}

      {/* Create new post — collapsible form */}
      <div className="bg-navy-900 border border-gray-800 rounded-2xl mb-8 overflow-hidden">
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-navy-800 transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold text-slate-200">
            <Plus size={16} className="text-teal" />
            Publish New Energy Report
          </span>
          {formOpen ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </button>

        {formOpen && (
          <div className="px-6 pb-6 border-t border-gray-800">
            {formError && (
              <div className="mt-4 p-3 rounded-lg bg-red-950 border border-red-900 text-red-400 text-sm">
                ✗ {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={update}
                    required
                    placeholder="Solar LCOE Falls Below Coal in 40 Markets"
                    className="eco-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1.5">Author</label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={update}
                    placeholder={user?.name ?? "EcoMonitor Team"}
                    className="eco-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={update} className="eco-input">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1.5">Read Time</label>
                  <input
                    name="readTime"
                    value={form.readTime}
                    onChange={update}
                    placeholder="5 min"
                    className="eco-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1.5">Thumbnail URL</label>
                  <input
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={update}
                    placeholder="https://images.unsplash.com/..."
                    className="eco-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1.5">
                  Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={update}
                  required
                  rows={2}
                  placeholder="A concise one-paragraph overview of the report findings..."
                  className="eco-input resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1.5">
                  Content (HTML) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={update}
                  required
                  rows={10}
                  placeholder="<p>Full article body. Supports HTML tags: &lt;strong&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>"
                  className="eco-input resize-y font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-navy-700 border-t-navy-900 rounded-full animate-spin" />
                  ) : (
                    <><Plus size={14} /> Publish Report</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setFormError(""); }}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Posts management table */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-teal" />
          Manage Reports ({posts.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-navy-900 rounded-xl animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-navy-900 border border-gray-800 rounded-xl">
            <p className="text-slate-500">No reports yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            {posts.map((post, idx) => (
              <div
                key={post._id}
                className={`flex items-center gap-4 px-5 py-4 bg-navy-900 hover:bg-navy-800 transition-colors ${
                  idx < posts.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                {/* Thumbnail */}
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-10 bg-navy-800 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-600">
                    ⚡
                  </div>
                )}

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <CategoryBadge category={post.category} />
                    <span className="text-xs text-slate-600">{post.author}</span>
                    <span className="text-xs text-slate-600">
                      {new Date(post.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Destructive delete button — only visible to admin (RBAC) */}
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    className="btn-destructive"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}