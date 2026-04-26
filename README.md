# EcoMonitor — Industrial Energy Intelligence Platform

Full-stack web application: React (Vite + TypeScript + Tailwind) frontend + Express + MongoDB Atlas backend.

---

## Directory Structure

```
ecomonitor/
├── server/                         ← Express API
│   ├── models/
│   │   └── index.js                ← Mongoose schemas (Post, Contact, User)
│   ├── server.js                   ← Main Express server + all routes
│   ├── seed.js                     ← Database seeder (run once)
│   ├── .env.example                ← Environment variable template
│   └── package.json
│
└── client/                         ← React (Vite + TypeScript) frontend
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── src/
        ├── main.tsx                 ← React entry point
        ├── App.tsx                  ← Router + ProtectedRoute
        ├── index.css                ← Tailwind + custom component styles
        ├── api/
        │   └── index.ts             ← All fetch() calls (centralised API module)
        ├── hooks/
        │   └── useAuth.tsx          ← Auth context + JWT localStorage management
        ├── types/
        │   └── index.ts             ← TypeScript interfaces
        ├── components/
        │   ├── Navbar.tsx           ← Sticky nav (admin link hidden from non-admins)
        │   ├── Footer.tsx           ← Footer with API route reference
        │   └── PostCard.tsx         ← Card + CategoryBadge components
        └── pages/
            ├── LandingPage.tsx      ← Hero + services + stats + CTA
            ├── BlogPage.tsx         ← Resource centre with category filter
            ├── SinglePost.tsx       ← Article detail with contained hero header
            ├── ContactPage.tsx      ← Inquiry form (POST /api/contact)
            ├── LoginPage.tsx        ← Admin JWT login
            └── AdminPage.tsx        ← Protected dashboard (CRUD operations)
```

---

## Setup Instructions

### 1. MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Copy the connection string (choose "Drivers" → Node.js)

### 2. Backend

```bash
cd server
npm install

# Configure environment
cp .env.example .env
# Edit .env and paste your MongoDB URI, set JWT_SECRET to a long random string

# Seed the database (creates admin user + 4 sample posts)
node seed.js

# Start the API server
npm run dev        # with nodemon auto-reload
# OR
npm start          # production
```

API will be available at: `http://localhost:4000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App will be available at: `http://localhost:5173`

> The Vite dev server proxies `/api/*` requests to `http://localhost:4000` automatically.

---

## API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Public | Returns JWT token |
| GET | `/api/auth/me` | JWT | Verify token, get user |
| GET | `/api/posts` | Public | All published posts |
| GET | `/api/posts/:id` | Public | Single post |
| POST | `/api/posts` | Admin JWT | Create post |
| PUT | `/api/posts/:id` | Admin JWT | Update post |
| DELETE | `/api/posts/:id` | Admin JWT | Delete post |
| POST | `/api/contact` | Public | Submit enquiry |
| GET | `/api/admin/contacts` | Admin JWT | View all enquiries |
| GET | `/api/health` | Public | Server health check |

---

## Authentication Flow (RBAC)

```
1. Admin navigates to /admin
2. ProtectedRoute checks useAuth().isAdmin
3. isAdmin = (user?.role === "admin") — from JWT payload in localStorage
4. If false → redirect to /login
5. Admin submits credentials → POST /api/auth/login
6. bcrypt.compare(password, hashedPassword) in MongoDB
7. JWT signed with { id, email, role, name } payload (8hr expiry)
8. Token stored: localStorage.setItem("eco_token", token)
9. All admin API calls attach: Authorization: Bearer <token>
10. Express requireAdmin middleware validates token + checks role
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Deep Midnight Navy | `#060d1a` | Page background |
| Navy 900 | `#0f172a` | Cards, nav |
| Navy 800 | `#1e293b` | Inputs, hover states |
| Electric Teal | `#2dd4bf` | Accents, buttons, links |
| Border | `border-gray-800` | Dividers between sections |

### Contained Hero Header
```tsx
// Fixed 400px height — image never bleeds into content below
<div className="relative h-[400px] overflow-hidden">
  <img className="absolute inset-0 w-full h-full object-cover object-center" />
  <div className="absolute inset-0" style={{ background: "gradient..." }} />
  {/* Title overlaid at bottom */}
</div>
```

---

## Default Admin Credentials (after seeding)

```
Email:    admin@ecomonitor.io
Password: Admin@123
```

Change these in `.env` before deploying.

