/**
 * pages/SinglePost.tsx — Article detail view
 *
 * Implements the "Contained Hero Header":
 *   - Fixed h-[400px] container
 *   - img with object-cover + object-center
 *   - Gradient overlay for text legibility
 *   - Title/author overlaid at bottom of hero
 *
 * Data flow:
 *   URL param :id extracted → useEffect fires on mount →
 *   api.getPost(id) → GET /api/posts/:id → Mongoose findById →
 *   post returned → hero image + HTML content rendered
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, CalendarDays } from "lucide-react";
import { getPost } from "../api";
import { CategoryBadge } from "../components/PostCard";
import type { Post } from "../types";

export default function SinglePost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the specific post when the component mounts or the id URL param changes
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getPost(id);
        setPost(data.post);
      } catch {
        setError("Article not found or server is offline.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]); // ← Re-runs if user navigates directly to a different article

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="font-display text-2xl text-slate-300 mb-3">Article not found</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/resources" className="btn-outline">
          <ArrowLeft size={14} /> Back to Reports
        </Link>
      </div>
    );
  }

  const publishedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      {/* ── Contained Hero Header ────────────────────────────────────────────
           Fixed h-[400px] container. The img inside uses object-cover +
           object-center so any thumbnail aspect ratio looks professional.
           A gradient overlay fades the image into the page background color.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="relative h-[400px] overflow-hidden bg-navy-800">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20">
            ⚡
          </div>
        )}

        {/* Gradient overlay — bottom-heavy so title text is always readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #060d1a 25%, rgba(6,13,26,0.7) 60%, rgba(6,13,26,0.2) 100%)",
          }}
        />

        {/* Overlaid title block — positioned at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <CategoryBadge category={post.category} />
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mt-3 leading-tight max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Back link + metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
          <Link
            to="/resources"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal transition-colors"
          >
            <ArrowLeft size={14} /> All Reports
          </Link>

          <div className="flex items-center gap-5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <User size={12} className="text-teal" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-teal" />
              {post.readTime} read
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={12} className="text-teal" />
              {publishedDate}
            </span>
          </div>
        </div>

        {/* Summary pull-quote */}
        <p className="text-lg text-slate-300 leading-relaxed italic border-l-2 border-teal pl-4 mb-8">
          {post.summary}
        </p>

        {/* HTML content rendered from MongoDB
            dangerouslySetInnerHTML is safe here because content is
            created by authenticated admins only (not public user input) */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link to="/resources" className="btn-outline text-sm">
            <ArrowLeft size={14} /> Back to all reports
          </Link>
        </div>
      </div>
    </article>
  );
}
