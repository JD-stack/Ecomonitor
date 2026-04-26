/**
 * models/index.js
 * Mongoose schemas for the EcoMonitor application.
 * Each schema maps to a MongoDB Atlas collection.
 */

const mongoose = require("mongoose");

// ─── Post Schema ───────────────────────────────────────────────────────────────
// Represents an energy report/article published by an admin.
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // Stored as HTML string
    author: { type: String, required: true, default: "EcoMonitor Team" },
    category: {
      type: String,
      enum: ["Wind", "Solar", "Hydrogen", "Storage", "Policy", "Analysis"],
      default: "Analysis",
    },
    thumbnail: { type: String, default: "" }, // URL to cover image
    readTime: { type: String, default: "5 min" },
    published: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Contact Schema ────────────────────────────────────────────────────────────
// Stores submissions from the Contact/Inquiry form.
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false }, // Admin can mark as resolved
  },
  { timestamps: true }
);

// ─── User Schema ───────────────────────────────────────────────────────────────
// Admin users. Passwords are hashed with bcrypt before saving.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Stored as bcrypt hash
    role: { type: String, enum: ["admin", "viewer"], default: "viewer" },
    name: { type: String, default: "Admin User" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
const Contact = mongoose.model("Contact", contactSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Post, Contact, User };
