/**
 * pages/BlogPage.tsx — Energy Reports Resource Centre
 *
 * Data flow:
 *   Component mounts → useEffect fires → api.getPosts() called
 *   → GET /api/posts hits Express → Mongoose finds published posts
 *   → sorted array returned → cards rendered in responsive grid
 *
 * Category filter: updates query param → re-fetches with ?category=Wind etc.
 */

import { useState, useEffect, useCallback } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { getPosts } from "../api";
import { useAuth } from "../hooks/useAuth";
import PostCard from "../components/PostCard";
import { deletePost } from "../api";
import type { Post, Category } from "../types";

const CATEGORIES: Category[] = ["All", "Wind", "Solar", "Hydrogen", "Storage", "Policy", "Analysis"];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const { isAdmin } = useAuth();

  // Fetch posts whenever the selected category changes
  // useEffect dependency array: [category] means re-run whenever category updates
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(category);
      setPosts(data.posts);
    } catch {
      setError("Could not load reports. Ensure the Express server is running on port 4000.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      // Optimistic UI update — remove card without refetching
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err as Error).message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-teal text-xs font-mono uppercase tracking-widest mb-2">
          Resource Centre
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-100 mb-3">
          Energy Intelligence Reports
        </h1>
        <p className="text-slate-500 max-w-xl">
          Expert analysis on the global clean energy transition — covering technology breakthroughs,
          policy shifts, and market trends.
        </p>
      </div>

      {/* Category filter bar */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <Filter size={14} className="text-slate-600" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === cat
                ? "bg-teal text-navy-900 border-teal"
                : "border-gray-800 text-slate-500 hover:border-teal-border hover:text-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-8 p-4 rounded-lg bg-red-950 border border-red-900 text-red-400 text-sm flex items-center justify-between">
          <span>⚠ {error}</span>
          <button onClick={fetchPosts} className="flex items-center gap-1.5 text-xs hover:text-red-300">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="eco-card animate-pulse">
              <div className="h-[200px] bg-navy-800" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-navy-800 rounded w-20" />
                <div className="h-5 bg-navy-800 rounded w-full" />
                <div className="h-4 bg-navy-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post grid */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-display text-xl text-slate-400 mb-2">No reports found</h3>
          <p className="text-slate-600 text-sm">
            {category !== "All"
              ? `No ${category} reports published yet.`
              : "No reports published yet. Admins can add reports from the Admin panel."}
          </p>
        </div>
      )}
    </div>
  );
}
