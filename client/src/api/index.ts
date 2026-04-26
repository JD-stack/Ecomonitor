/**
 * api/index.ts — EcoMonitor API Module
 * ─────────────────────────────────────────────────────────────────────────────
 * All HTTP requests to the Express backend are made here.
 * Components NEVER call fetch() directly — they import from this module.
 * This separation makes it trivial to swap the backend without touching UI code.
 *
 * Auth: JWT token is read from localStorage and attached as a Bearer header
 *       on all protected (admin) requests.
 */

import type {
  PostsResponse,
  PostResponse,
  AuthResponse,
  ContactForm,
  ContactResponse,
  DeleteResponse,
  NewPostForm,
} from "../types";

const BASE = "/api"; // Vite proxies this to http://localhost:4000

/** Read JWT from localStorage — set after successful login */
const getToken = (): string | null => localStorage.getItem("eco_token");

/** Build headers, attaching Bearer token for admin routes */
const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/** Generic fetch wrapper — throws Error with server message on failure */
async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

// ─── Posts ─────────────────────────────────────────────────────────────────────

/** Fetch all published posts, optionally filtered by category */
export const getPosts = (category?: string): Promise<PostsResponse> =>
  req(`/posts${category && category !== "All" ? `?category=${category}` : ""}`);

/** Fetch a single post by MongoDB _id */
export const getPost = (id: string): Promise<PostResponse> =>
  req(`/posts/${id}`);

/** Create a new post — requires admin JWT */
export const createPost = (form: NewPostForm): Promise<PostResponse> =>
  req("/posts", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(form),
  });

/** Delete a post by id — requires admin JWT */
export const deletePost = (id: string): Promise<DeleteResponse> =>
  req(`/posts/${id}`, { method: "DELETE", headers: authHeaders() });

/** Update a post — requires admin JWT */
export const updatePost = (
  id: string,
  form: Partial<NewPostForm>
): Promise<PostResponse> =>
  req(`/posts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(form),
  });

// ─── Auth ──────────────────────────────────────────────────────────────────────

/** Register a new viewer account */
export const signup = (name: string, email: string, password: string): Promise<AuthResponse> =>
  req("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

/** Authenticate with email + password → returns JWT */
export const login = (email: string, password: string): Promise<AuthResponse> =>
  req("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

/** Verify the stored JWT and return the user — called on app mount */
export const getMe = () =>
  req<{ user: AuthResponse["user"] }>("/auth/me", { headers: authHeaders() });

// ─── Contact ───────────────────────────────────────────────────────────────────

/** Submit the contact/inquiry form */
export const submitContact = (form: ContactForm): Promise<ContactResponse> =>
  req("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });