# DocuEase

Google Docs-style document editor with guest mode, cloud accounts, real-time collaboration, sharing, version history, and multi-format export.

**Live**
- Frontend: https://docu-ease-client.vercel.app
- Backend: https://docuease.onrender.com

---

## What works

| Feature | Status |
|---------|--------|
| Guest editor (browser-local only) | Working |
| Guest → account migration | Working |
| Account documents (MongoDB) | Working |
| TipTap rich editor (headings, tables, images, checklists, etc.) | Working |
| Real-time collaboration (Yjs + WebSocket) | Working |
| Share by email (editor / viewer roles) | Working |
| Version history (auto-snapshot on save, restore) | Working |
| Export PDF, DOCX, TXT, Markdown, HTML | Working |
| Templates | Working |
| File upload / import (PDF, DOCX, TXT) | Working |
| Auth (register, login, refresh, cookies) | Working |
| Dashboard + uploads pages | Working |

---

## Stack

- **Client:** React 18, Vite, Tailwind, TipTap, Yjs, React Router
- **Server:** Node.js, Express, MongoDB/Mongoose, `ws`, JWT cookies
- **Deploy:** Vercel (frontend) + Render (API + WebSocket)

---

## Local setup

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
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_COLLAB_WS_URL=ws://localhost:5000
```

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000

---

## Production env

### Render (backend)

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `CLIENT_URL` | `https://docu-ease-client.vercel.app` |
| `JWT_ACCESS_SECRET` | strong random string |
| `JWT_REFRESH_SECRET` | strong random string |
| `COOKIE_SAME_SITE` | `none` |
| `COOKIE_SECURE` | `true` |
| `TRUST_PROXY_HOPS` | `1` |

Root directory: `server`  
Start: `npm run start`  
Health: `/api/health`

### Vercel (frontend)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://docuease.onrender.com/api` |
| `VITE_COLLAB_WS_URL` | `wss://docuease.onrender.com` |

Root directory: `client` (or use root `vercel.json`)  
Build: `npm run build`  
Output: `dist`

**Important:** Vite only reads `VITE_*` vars at build time. After changing them, redeploy with a clean build.

---

## Sharing

1. Owner opens a document → **Share**
2. Invite by email (user must already have an account)
3. Role: `editor` or `viewer`
4. Collaborator opens the same document URL and can collaborate in real time

API:
- `POST /api/documents/:id/share` `{ email, role }`
- `DELETE /api/documents/:id/share/:userId`
- `GET /api/documents/:id/collaborators`

---

## Version history

- Every title/content change creates a snapshot (max 30)
- Editor toolbar → **History** → restore any version
- Current content is snapshotted before restore

API:
- `GET /api/documents/:id/versions`
- `POST /api/documents/:id/versions/:versionId/restore`

---

## Main API surface

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Cookie |
| GET | `/api/auth/me` | Required |
| GET/POST | `/api/documents` | Required |
| GET/PUT/DELETE | `/api/documents/:id` | Required (owner or collaborator) |
| POST | `/api/documents/:id/share` | Owner |
| GET | `/api/documents/:id/versions` | Required |
| POST | `/api/export/pdf\|docx\|txt\|md` | Optional |
| WS | `/collaboration/:id` | Cookie/token + access |

---

## Notes / limits

- No email invite system — invitee must register first
- Version history is basic (no side-by-side diff UI)
- Free Render instances sleep; first request after idle can be slow
- Exports flatten rich HTML to plain text for PDF/DOCX/TXT (tables/images limited fidelity)
