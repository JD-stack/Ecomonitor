/**
 * server.js — EcoMonitor Express API
 *
 * Public routes:    GET  /api/posts, GET /api/posts/:id, POST /api/contact
 * Auth routes:      POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me
 * Protected routes: POST /api/posts, DELETE /api/posts/:id (admin JWT required)
 *
 * Start: node server.js  (or npm run dev for nodemon auto-reload)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Post, Contact, User } = require("./models/index");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "ecomonitor-dev-secret";

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" })); // Allow HTML content in post body

// ─── MongoDB Atlas Connection ──────────────────────────────────────────────────
// Mongoose automatically handles connection pooling and reconnection.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Compass connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   → Check your MONGODB_URI in .env");
    process.exit(1);
  });

// ─── Auth Middleware ───────────────────────────────────────────────────────────
/**
 * requireAuth — Verifies the Bearer JWT token in the Authorization header.
 * The React frontend sends this token (stored in localStorage) on protected calls.
 * Flow: Client sends "Authorization: Bearer <token>" → middleware verifies →
 *       attaches decoded user to req.user → route handler proceeds.
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Admin-only guard — must follow requireAuth
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Accepts { email, password } → returns a signed JWT on success.
 * The JWT is stored in React localStorage and sent as Bearer token on
 * subsequent admin API calls.
 */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    // Sign a JWT valid for 8 hours — payload includes role for RBAC
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

/**
 * POST /api/auth/signup
 * Registers a new user with role "viewer".
 * Viewers can browse and read reports but cannot create or delete.
 */
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email and password are required." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "viewer", // Regular signups are always viewers — admin must be seeded
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

/**
 * GET /api/auth/me
 * Verifies the current token and returns the logged-in user.
 * Called on React app mount to restore session from localStorage.
 */
app.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// ─── POST ROUTES ──────────────────────────────────────────────────────────────

/**
 * GET /api/posts
 * Returns all published posts sorted newest-first.
 * React BlogPage calls this inside useEffect on component mount.
 * Data flow: React mounts → useEffect → fetch("/api/posts") →
 *            Mongoose finds published posts → returns sorted array → React renders cards
 */
app.get("/api/posts", async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const filter = { published: true };
    if (category && category !== "All") filter.category = category;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("-__v"); // Exclude Mongoose version key from response

    res.json({ posts, total: posts.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

/**
 * GET /api/posts/:id
 * Returns a single post by its MongoDB ObjectId.
 * Called by the SinglePost page when a user clicks an article card.
 */
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("-__v");
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

/**
 * POST /api/posts  [PROTECTED — Admin only]
 * Creates a new energy report. Requires a valid admin JWT.
 * React Admin panel calls this after form submission.
 * Data flow: Admin submits form → React sends POST with Bearer token →
 *            requireAuth validates JWT → requireAdmin checks role →
 *            Mongoose creates document → _id returned → React updates list
 */
app.post("/api/posts", requireAuth, requireAdmin, async (req, res) => {
  const { title, summary, content, author, category, thumbnail, readTime } =
    req.body;
  if (!title || !summary || !content) {
    return res
      .status(400)
      .json({ error: "title, summary, and content are required." });
  }
  try {
    const post = await Post.create({
      title,
      summary,
      content,
      author: author || req.user.name,
      category,
      thumbnail,
      readTime,
    });
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ error: "Failed to create post." });
  }
});

/**
 * PUT /api/posts/:id  [PROTECTED — Admin only]
 * Updates an existing post.
 */
app.put("/api/posts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: "Failed to update post." });
  }
});

/**
 * DELETE /api/posts/:id  [PROTECTED — Admin only]
 * Permanently removes a post from MongoDB.
 * Data flow: Admin clicks Delete → React sends DELETE with Bearer token →
 *            requireAuth + requireAdmin validate access →
 *            Mongoose removes document → React filters card from state
 */
app.delete("/api/posts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json({ success: true, message: `Post "${post.title}" deleted.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// ─── CONTACT ROUTES ────────────────────────────────────────────────────────────

/**
 * POST /api/contact
 * Saves a contact form submission to MongoDB.
 * Test with: curl -X POST http://localhost:4000/api/contact \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"Test","email":"t@t.com","message":"Hello"}'
 */
app.post("/api/contact", async (req, res) => {
  console.log("📩 Contact form received:", req.body); // Log every submission
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required." });
  }

  try {
    const contact = await Contact.create({ name, email, company: company || "", message });
    console.log("✅ Contact saved to MongoDB with id:", contact._id);
    res.status(201).json({ success: true, id: contact._id });
  } catch (err) {
    console.error("❌ Contact save failed:", err.message);
    res.status(500).json({ error: "Failed to save contact: " + err.message });
  }
});

/**
 * GET /api/admin/contacts  [PROTECTED — Admin only]
 * Returns all contact form submissions for the admin dashboard.
 */
app.get("/api/admin/contacts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌿 EcoMonitor API running → http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});