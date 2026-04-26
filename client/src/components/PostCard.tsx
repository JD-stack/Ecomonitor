/**
 * components/PostCard.tsx
 * Shared card component used in BlogPage and AdminPage.
 */

import { Link } from "react-router-dom";
import { Clock, User, Trash2 } from "lucide-react";
import type { Post, Category } from "../types";

// ─── Category Badge ────────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, string> = {
  Wind:     "bg-blue-950 text-blue-400 border-blue-900",
  Solar:    "bg-amber-950 text-amber-400 border-amber-900",
  Hydrogen: "bg-orange-950 text-orange-400 border-orange-900",
  Storage:  "bg-purple-950 text-purple-400 border-purple-900",
  Policy:   "bg-slate-800 text-slate-400 border-slate-700",
  Analysis: "bg-teal-muted text-teal border-teal-border",
};

export function CategoryBadge({ category }: { category: Category | string }) {
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Analysis;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${styles}`}
    >
      {category}
    </span>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────
interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, isAdmin, onDelete }: PostCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to article
    if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      onDelete?.(post._id);
    }
  };

  return (
    <article className="eco-card group flex flex-col">
      {/* Contained thumbnail — fixed 200px height, object-cover */}
      <div className="relative h-[200px] overflow-hidden bg-navy-800">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl">
            ⚡
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/resources/${post._id}`} className="group/title flex-1">
          <h2 className="font-display font-bold text-lg text-slate-100 leading-snug mb-2 group-hover/title:text-teal transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
            {post.summary}
          </p>
        </Link>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <User size={12} /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Delete button — only rendered when isAdmin === true (RBAC) */}
            {isAdmin && (
              <button onClick={handleDelete} className="btn-destructive py-1.5 px-3 text-xs">
                <Trash2 size={12} />
                Delete
              </button>
            )}
            <Link
              to={`/resources/${post._id}`}
              className="text-xs text-teal hover:text-teal-light font-medium transition-colors"
            >
              Read →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
