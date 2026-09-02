<div align="center">

# DocuEase

**A full-stack Google Docs–style collaborative editor**

Real-time multi-user editing · Guest + Account modes · Share · Version history · Multi-format export

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-docu--ease--client.vercel.app-blue?style=for-the-badge&logo=vercel)](https://docu-ease-client.vercel.app/)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://docuease.onrender.com/api/health)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-FF6B00)
![TipTap](https://img.shields.io/badge/TipTap-Editor-FF6B6B)

</div>

---

## Live Demo

**Frontend:** [https://docu-ease-client.vercel.app](https://docu-ease-client.vercel.app/)  
**Backend health:** [https://docuease.onrender.com/api/health](https://docuease.onrender.com/api/health)

> **Tip:** Create two accounts in different browsers (or one normal + one incognito). Share a document from Account A to Account B’s email and watch real-time collaboration.

---

## Why this project

DocuEase is a production-deployed MERN application that solves a real product problem: **document editing that works for guests and authenticated users**, with true multi-user collaboration — not a toy CRDT demo.

It demonstrates:
- Full-stack ownership (frontend + API + WebSockets + DB + deploy)
- Cross-origin auth between independent hosts (Vercel + Render)
- CRDT-based realtime sync with access control
- Practical product features: share roles, version history, exports, templates

---

## Features

### Editing
- TipTap / ProseMirror rich-text editor
- Headings, bold/italic/underline, lists, checklists, tables, links, images
- Find & replace, word count, print layout
- Document templates (Meeting Notes, Proposal, Resume, Status Report, Blank)

### Guest & Account modes
- **Guest mode** — edit immediately, data stays in browser storage (no signup)
- **Account mode** — persistent MongoDB documents, dashboard, uploads
- One-click **guest → cloud account** migration

### Collaboration
- Real-time multi-user editing via **Yjs CRDT + WebSockets**
- Presence avatars and live cursors
- Share by email with **Editor** or **Viewer** roles
- Access-controlled collaboration rooms (owner + collaborators only)

### Version history
- Automatic snapshots on content/title change (last 30 versions)
- Restore any previous version from the editor

### Export & import
- Export: **PDF · DOCX · TXT · Markdown · HTML**
- Import: PDF, DOCX, TXT → editable document

### Auth & deployment
- JWT access + refresh tokens
- httpOnly cookies with `SameSite=None` + `Secure` for cross-site production
- Split deploy: Vercel (SPA) + Render (API + WS) + MongoDB Atlas

---

## Architecture

```
┌──────────────────────┐     REST + cookies      ┌──────────────────────┐
│  Vercel (React SPA)  │ ───────────────────────► │  Render (Node API)   │
│  docu-ease-client    │ ◄─────────────────────── │  docuease.onrender   │
└──────────────────────┘     WebSocket (Yjs)      └──────────┬───────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │  MongoDB Atlas  │
                                                    └─────────────────┘
```

| Layer | Technology |
|-------|------------|
| UI | React 18, Vite, Tailwind CSS, TipTap |
| State / realtime | Yjs, y-protocols, custom WebSocket provider |
| API | Express, Mongoose, JWT, Zod validation |
| Files | multer, mammoth, pdf-parse, pdfkit, docx |
| Hosting | Vercel + Render + MongoDB Atlas |

---

## Tech decisions (what recruiters usually ask)

| Decision | Why |
|----------|-----|
| **Yjs over operational transform** | CRDTs handle concurrent edits without a central transform server; simpler offline-friendly model |
| **Split Vercel + Render** | Free-tier friendly; keeps long-lived WebSockets on Render while SPA sits on CDN |
| **Cookie + Bearer fallback** | Cross-origin cookies need `SameSite=None`; Bearer fallback covers edge cases |
| **Guest-first UX** | Removes signup friction; still allows upgrade path to persistent storage |
| **Role-based share (editor/viewer)** | Real access control, not just “anyone with the link” |

---

## Local development

**Requirements:** Node.js ≥ 18, MongoDB

```bash
git clone https://github.com/23eg112e02-gif/DocuEase.git
cd DocuEase
npm install
```

**`server/.env`**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/docuease
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=dev-access-secret
JWT_REFRESH_SECRET=dev-refresh-secret
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_COLLAB_WS_URL=ws://localhost:5000
```

```bash
npm run dev
```

- App → http://localhost:5173  
- API → http://localhost:5000

---

## Production environment

### Render (API + WebSocket)

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas URI |
| `CLIENT_URL` | `https://docu-ease-client.vercel.app` |
| `JWT_ACCESS_SECRET` | strong random string |
| `JWT_REFRESH_SECRET` | strong random string |
| `COOKIE_SAME_SITE` | `none` |
| `COOKIE_SECURE` | `true` |
| `TRUST_PROXY_HOPS` | `1` |

### Vercel (frontend)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://docuease.onrender.com/api` |
| `VITE_COLLAB_WS_URL` | `wss://docuease.onrender.com` |

> Vite injects `VITE_*` at **build time**. After changing env vars, trigger a fresh redeploy.

---

## API overview

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `/login`, `/refresh`, `/logout` · `GET /auth/me` |
| Documents | `GET/POST /documents` · `GET/PUT/DELETE /documents/:id` |
| Share | `POST /documents/:id/share` · `DELETE .../share/:userId` · `GET .../collaborators` |
| Versions | `GET /documents/:id/versions` · `POST .../versions/:id/restore` |
| Export | `POST /export/pdf` · `/docx` · `/txt` · `/md` |
| Uploads | `GET/POST /uploads` · `DELETE /uploads/:id` |
| Collab | `WS /collaboration/:documentId` |

---

## Project structure

```
DocuEase/
├── client/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/     # Editor, Share, Version history, UI
│   │   ├── pages/          # Home, Guest, Dashboard, Document, Auth
│   │   ├── services/       # API + export clients
│   │   ├── hooks/          # Auth, document, collaboration
│   │   └── editor/         # TipTap + Yjs wiring
│   └── ...
├── server/                 # Express API + WebSocket collab server
│   ├── controllers/
│   ├── models/             # User, Document (+ collaborators, versions)
│   ├── routes/
│   ├── services/           # tokens, collab, export
│   └── middleware/
└── README.md
```

---

## Known limits (honest)

- Invitee must already have an account (no email delivery service)
- Free Render instances cold-start after idle (~30–60s)
- PDF/DOCX export flattens complex HTML (tables/images limited fidelity)
- Version history has restore UI; no side-by-side visual diff yet

---

## Author

Built as a portfolio project to demonstrate full-stack engineering: realtime systems, auth across origins, product-facing collaboration features, and production deployment.

**Live app:** [https://docu-ease-client.vercel.app](https://docu-ease-client.vercel.app/)  
**Repo:** [github.com/23eg112e02-gif/DocuEase](https://github.com/23eg112e02-gif/DocuEase)
