// ─── Domain Types ──────────────────────────────────────────────────────────────

export type Category =
  | "Wind"
  | "Solar"
  | "Hydrogen"
  | "Storage"
  | "Policy"
  | "Analysis"
  | "All";

export interface Post {
  _id: string;
  title: string;
  summary: string;
  content: string; // HTML string
  author: string;
  category: Category;
  thumbnail: string;
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
  name: string;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export interface PostResponse {
  post: Post;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ContactResponse {
  success: boolean;
  id: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ─── Form Types ────────────────────────────────────────────────────────────────

export interface NewPostForm {
  title: string;
  summary: string;
  content: string;
  author: string;
  category: Category;
  thumbnail: string;
  readTime: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}
