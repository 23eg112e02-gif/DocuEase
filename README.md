<div align="center">
  <h1>📄 DocuEase</h1>
  <p><strong>Production-Ready Google Docs Clone with Hybrid Guest & Account Architecture</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  </p>
  <p>
    <img src="https://img.shields.io/badge/TipTap-FF6B6B?style=for-the-badge&logo=tiptap&logoColor=white" alt="TipTap">
    <img src="https://img.shields.io/badge/Yjs-Realtime_CRDT-orange?style=for-the-badge" alt="Yjs">
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </p>
  <hr>
</div>

## 🚀 Overview

DocuEase is a **production-ready Google Docs clone** built with the MERN stack (MongoDB, Express, React, Node.js) and Yjs CRDT real-time collaboration. It provides a unique **hybrid workflow**:

- **👤 Guest Mode** — Immediate editor access with 100% browser-local persistence (no sign-up required, zero backend storage). Guests can migrate their local draft to a permanent cloud account anytime with one click.
- **🔐 User Mode (Account Mode)** — Persistent document library backed by MongoDB, real-time multi-cursor WebSocket collaboration, file imports (PDF, Word, TXT), versioning, dashboard management, and multi-format exports.

---

## ✨ Core Features & Google Docs Parity

| Feature | Description |
|---------|-------------|
| 📝 **Google Docs Editor Suite** | Headings, font sizes, text & highlight color pickers, checklists, subscript/superscript, blockquotes, code blocks, and horizontal dividers. |
| 📊 **Interactive Tables & Media** | Insert, customize, and manage multi-column tables and embed web images or device file uploads directly into the document canvas. |
| 👥 **Real-Time Collaboration** | Yjs + WebSockets engine with multi-user cursor tracking, presence avatars, and heartbeat keep-alives configured for cloud runtimes. |
| 📄 **Paginated Paper Canvas** | Google Docs A4 sheet layout with live word/character counters, reading time estimates, zoom controls, and print-ready CSS styles. |
| 🔍 **Find & Replace & Word Count** | In-editor find & replace dialog (Ctrl+F) and comprehensive document statistics modal (Ctrl+Shift+C). |
| 📑 **Document Templates** | Pre-built templates for Meeting Notes, Project Proposals, Resumes, Weekly Status Reports, and Blank Documents. |
| 📥 **Multi-Format Exports** | Export any document (guest or authenticated) to styled **PDF**, Word (**DOCX**), **TXT**, **Markdown**, and **HTML**. |
| 📂 **File Parser & Import Hub** | Upload PDF, DOCX, and TXT files with automatic text extraction into editable rich-text documents. |
| 🛡️ **Cross-Domain Auth Resilience** | Dual-mode authentication (httpOnly cookies + JWT Bearer token fallback + auto-refresh interceptors) designed for independent Vercel + Render deployments. |

---

## 🧰 Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS, TipTap 2 (ProseMirror), Yjs, `y-websocket`, `lucide-react`, React Router v6.
- **Backend:** Node.js, Express 5, MongoDB + Mongoose 8, WebSockets (`ws`), `pdfkit`, `docx`, `mammoth`, `pdf-parse`, `jsonwebtoken`, `bcryptjs`.
- **Security & Infrastructure:** Helmet security headers, rate limiters, CORS origin controls, httpOnly cookie rotation, WebSocket ping/pong heartbeats.

---

## ⚡ Local Quick Start

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas connection string)
- npm (or npm.cmd on Windows)

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/DocuEase.git
cd DocuEase
npm install
```

### 3. Configure Environment

**Server Configuration (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/docuease
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your-access-secret-key-12345
JWT_REFRESH_SECRET=your-refresh-secret-key-12345
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

**Client Configuration (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_COLLAB_WS_URL=ws://localhost:5000
```

### 4. Run Development Servers
```bash
npm run dev
```
- Client running at: `http://localhost:5173`
- Backend API & Collaboration Server at: `http://localhost:5000`

---

## 🌐 Production Deployment Guide

DocuEase is designed for independent split deployment:
- **Frontend** on [Vercel](https://vercel.com)
- **Backend & WebSockets** on [Render](https://render.com)

```
┌─────────────────────────┐          REST API & JWT          ┌─────────────────────────┐
│     Vercel (Client)     │ ───────────────────────────────> │     Render (Server)     │
│  https://<app>.vercel   │ <─────────────────────────────── │  https://<api>.onrender │
└─────────────────────────┘      WebSockets (wss://) CRDT     └─────────────────────────┘
                                                                           │
                                                                           ▼
                                                                 ┌───────────────────┐
                                                                 │   MongoDB Atlas   │
                                                                 └───────────────────┘
```

---

### Step 1: Deploy Backend to Render

1. Create a free account at [Render.com](https://render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Name**: `docuease-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster0.mongodb.net/docuease?retryWrites=true&w=majority`
   - `CLIENT_URL` = `https://<your-app-name>.vercel.app` *(update once Vercel is created)*
   - `JWT_ACCESS_SECRET` = `<generate-strong-random-string>`
   - `JWT_REFRESH_SECRET` = `<generate-strong-random-string>`
   - `COOKIE_SAME_SITE` = `none`
   - `COOKIE_SECURE` = `true`
   - `TRUST_PROXY_HOPS` = `1`
6. Click **Create Web Service**. Note your Render URL (e.g. `https://docuease-api.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel

1. Create a free account at [Vercel.com](https://vercel.com).
2. Click **Add New...** &rarr; **Project** and import your GitHub repository.
3. In project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` *(or leave root if using root `vercel.json`)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://docuease-api.onrender.com/api`
   - `VITE_COLLAB_WS_URL` = `wss://docuease-api.onrender.com`
5. Click **Deploy**.
6. Once deployed, copy your production domain (e.g., `https://docuease.vercel.app`) and update the `CLIENT_URL` environment variable on your Render service dashboard.

---

## 📋 API Reference

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/health` | Health check endpoint | Public |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Log in and receive access token + cookies | Public |
| `POST` | `/api/auth/refresh` | Refresh expired access token | Public (Cookie / Refresh Token) |
| `GET` | `/api/auth/me` | Get current authenticated user | Required |
| `PUT` | `/api/auth/profile` | Update profile name and email | Required |
| `PUT` | `/api/auth/password` | Change password | Required |
| `POST` | `/api/auth/logout` | Sign out and clear credentials | Required |
| `GET` | `/api/documents` | List documents (supports `?search=`, `?status=`, `?sortBy=`) | Required |
| `POST` | `/api/documents` | Create document | Required |
| `GET` | `/api/documents/:id` | Get document by ID | Required |
| `PUT` | `/api/documents/:id` | Update document content and metadata | Required |
| `POST` | `/api/documents/:id/duplicate` | Duplicate an existing document | Required |
| `DELETE` | `/api/documents/:id` | Delete document | Required |
| `POST` | `/api/export/pdf` | Export document to PDF | Optional (Guest/Account) |
| `POST` | `/api/export/docx` | Export document to Word (.docx) | Optional (Guest/Account) |
| `POST` | `/api/export/txt` | Export document to Plain Text (.txt) | Optional (Guest/Account) |
| `POST` | `/api/export/md` | Export document to Markdown (.md) | Optional (Guest/Account) |
| `POST` | `/api/uploads` | Upload and optionally import file to doc | Required |
| `GET` | `/api/uploads` | List uploaded files | Required |
| `DELETE` | `/api/uploads/:id` | Delete uploaded file record | Required |
| `GET` | `/api/dashboard` | Get dashboard overview metrics | Required |
| `WS` | `/collaboration/:id` | Yjs real-time collaboration WebSocket | Cookie / Token Handshake |

---

## 🛡️ Security & Reliability Highlights

- **Anti-XSS & Cookie Security:** Protected cookies (`SameSite=None`, `Secure=true`, `httpOnly=true`).
- **Cross-Domain Token Interceptors:** Automatic Axios token attachment and 401 seamless retry refresh.
- **WebSocket Keep-Alives:** Render 55s timeout mitigation via 30s ping/pong server intervals.
- **Input Sanitization & Validation:** Zod schemas on all endpoints and rate limiting on auth routes.

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, TipTap, and Yjs</p>
</div>
