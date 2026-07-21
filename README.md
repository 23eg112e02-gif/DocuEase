<div align="center">
  <h1>📄 DocuEase</h1>
  <p><strong>A Production-Grade MERN Document Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  </p>
  <p>
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/TipTap-FF6B6B?style=for-the-badge&logo=tiptap&logoColor=white" alt="TipTap">
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </p>
  <hr>
</div>

## 🚀 Overview

DocuEase is a **production-oriented document platform** built with the MERN stack (MongoDB, Express, React, Node.js). It offers a **hybrid architecture** with two isolated editing experiences:

- **👤 Guest Mode** — Instant editor access with browser-local content only (no sign-up required)
- **🔐 Account Mode** — Secure authentication with persistent MongoDB documents, file uploads, version history, and PDF/DOCX export

> Designed for scalability, security, and a seamless user experience across both casual and power users.

---

## ✨ Why It Stands Out

| Feature | Description |
|---------|-------------|
| 🏗️ **Hybrid Flow Architecture** | Strict separation between guest (ephemeral) and account (persistent) data paths |
| ✍️ **Rich Text Editing** | TipTap-powered editor (ProseMirror-based) with extensible node and mark support |
| 🔒 **Security-First Auth** | JWT access + refresh tokens stored in httpOnly cookies; route protection, rate limiting, and helmet headers |
| 📤 **Multi-Format Export** | Server-side PDF and DOCX generation for both guest and authenticated users |
| 📂 **File Upload & Parsing** | Upload PDF, DOCX, and TXT files with automatic content extraction |
| 📦 **Modular Monorepo** | Workspace-based architecture (`client` + `server`) designed for independent deployment |
| ⚡ **Performance Optimized** | Route-level lazy loading, Vite chunk splitting, compression enabled |
| 🚢 **Deployment Ready** | Configured for Vercel (client) + Render (server) with health checks and env-based configuration |

---

## 🧰 Tech Stack

### Frontend
- **React 18** — UI library with functional components and hooks
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **React Router v6** — Client-side routing with lazy loading
- **TipTap (ProseMirror)** — Headless rich text editor framework
- **Context API** — State management for auth, editor, and theme

### Backend
- **Node.js + Express** — RESTful API server
- **MongoDB + Mongoose** — NoSQL database with ODM
- **JWT (jsonwebtoken)** — Access + refresh token authentication
- **Multer** — File upload handling with type/size restrictions
- **PDFKit / docx** — Server-side PDF and DOCX generation

### Security
- Helmet (security headers)
- Rate limiting (express-rate-limit)
- CORS with origin controls
- httpOnly cookies (secure, sameSite)
- Request validation middleware
- ObjectId route validation

---

## 📁 Project Structure

```
DocuEase/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── editor/            # TipTap rich text editor
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route-level page components
│   │   ├── routes/            # App routing & guards
│   │   ├── services/          # API service layer
│   │   └── utils/             # Constants, validators, helpers
│   └── ...config files
├── server/                    # Express API backend
│   ├── config/                # DB, CORS, Cloudinary config
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, error, upload, rate-limit
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic (auth, export, parse)
│   └── utils/                 # Response helpers, logger, validators
├── docs/                      # Architecture & API documentation
└── tests/                     # API test collections & results
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm (comes with Node.js)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/DocuEase.git
cd DocuEase
npm install
```

### 2. Configure Environment

```bash
# Server env (edit with your values)
cp server/.env.example server/.env

# Client env
cp client/.env.example client/.env
```

### 3. Set Environment Variables

**`server/.env`**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/docuease
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development

```bash
npm run dev
```

This starts both the client (port 5173) and server (port 5000) concurrently.

---

## 🏗️ Build & Production

```bash
# Build both client and server
npm run build

# Start production server
npm run start
```

---

## 🌐 Deployment

DocuEase is configured for a split deployment strategy:

| Service | Platform | Root Directory |
|---------|----------|---------------|
| **Client** | [Vercel](https://vercel.com) | `client/` |
| **Server** | [Render](https://render.com) | `server/` |

### Vercel (Client)
1. Create a new project from your repository
2. Set **Root Directory** to `client`
3. Add env: `VITE_API_URL=https://your-render-service.onrender.com/api`
4. Build command: `npm run build` → Output: `dist`

### Render (Server)
1. Create a **Web Service** from your repository
2. Set **Root Directory** to `server`
3. Build: `npm install` → Start: `npm run start`
4. Health check: `/api/health`
5. Add all required env variables (secrets synced from Render dashboard)

---

## 📋 API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | ❌ |
| `POST` | `/api/auth/register` | Create account | ❌ |
| `POST` | `/api/auth/login` | Sign in | ❌ |
| `GET` | `/api/auth/me` | Current user | ✅ |
| `POST` | `/api/auth/logout` | Sign out | ✅ |
| `GET/POST` | `/api/documents` | List / Create documents | ✅ |
| `GET/PUT/DELETE` | `/api/documents/:id` | CRUD single document | ✅ |
| `POST` | `/api/export/pdf` | Export to PDF | ❌* |
| `POST` | `/api/export/docx` | Export to DOCX | ❌* |
| `POST` | `/api/uploads` | Upload file | ✅ |
| `GET` | `/api/uploads` | List uploads | ✅ |
| `GET` | `/api/dashboard` | Dashboard overview | ✅ |

> *Guest exports work without auth (stateless payload); authenticated users can export saved documents by ID.

---

## 🛡️ Security Highlights

- ✅ **httpOnly Cookies** — Prevents XSS token theft
- ✅ **JWT Rotation** — Short-lived access tokens + long-lived refresh tokens
- ✅ **Helmet Middleware** — Sets secure HTTP headers
- ✅ **Rate Limiting** — Protects API and auth endpoints from abuse
- ✅ **Input Validation** — Request body validation middleware
- ✅ **File Restrictions** — Type and size limits on uploads
- ✅ **Graceful Shutdown** — SIGINT/SIGTERM handlers for clean exit

---

## ⚙️ Performance Optimizations

- 🔄 **Route-level lazy loading** with React Suspense fallback
- 📦 **Vite manual chunk splitting** for React and TipTap bundles
- 🗜️ **Compression** enabled on Express server
- 🚦 **Concurrent dev server** via concurrently

---

## 📚 Documentation

Additional documentation is available in the [`docs/`](docs/) directory:

- [API Documentation](docs/API.md) — Full API reference with request/response examples
- [Architecture Overview](docs/Architecture.md) — System design and data flow
- [Database Schema](docs/Database.md) — MongoDB models and relationships

---

## 📄 License

This project is for demonstration and portfolio purposes.

---

<div align="center">
  <p>Built with ❤️ using the MERN stack</p>
  <p>
    <a href="https://github.com/yourusername/DocuEase">GitHub</a> •
    <a href="#-overview">Overview</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#%EF%B8%8F-deployment">Deployment</a>
  </p>
</div>

