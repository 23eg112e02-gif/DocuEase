# DocuEase

**Live app:** [docu-ease-client.vercel.app](https://docu-ease-client.vercel.app/)
**API health:** [docuease.onrender.com/api/health](https://docuease.onrender.com/api/health)

DocuEase is a document editor built with React, Express, MongoDB, TipTap, and Yjs. It is deployed as a Vercel frontend and a Render API/WebSocket service.

## What the app does

- **Guest mode:** open the editor without an account. Guest content stays in browser storage and can be migrated into an account later.
- **Account mode:** create, search, duplicate, update, and delete documents stored in MongoDB. Uploads can be imported as editable documents.
- **Collaboration:** the editor uses Yjs over WebSockets for shared document state, live cursors, and presence. A document owner can share with an existing user as an `editor` or `viewer`.
- **Versions:** edits to title or content create snapshots, with up to 30 versions retained. Users with edit access can restore a version.
- **Import/export:** import PDF, DOCX, or TXT files. Export documents as PDF, DOCX, TXT, or Markdown.

## Authentication and account data

The API uses short-lived JWT access tokens and refresh tokens in HTTP-only cookies. Refresh tokens are stored as SHA-256 hashes, rotated when used, and revoked on reuse detection. Other implemented account controls include:

- Lock the account for 15 minutes after five failed login attempts.
- Password reset tokens are hashed, expire after 15 minutes, and use a generic forgot-password response so email existence is not disclosed.
- Logout, logout-all, password change, and password reset revoke sessions as appropriate.
- `export-data` returns the authenticated user's profile, documents, and uploads.
- `delete-account` requires the password, deletes owned documents and uploads, then soft-deletes and scrubs the user record.
- Authentication, profile, password, export, and account events are written to an audit log.

More detail is in [docs/SECURITY.md](docs/SECURITY.md).

## Architecture

```text
┌──────────────────────┐       HTTPS + cookies       ┌──────────────────────┐
│  Vercel React/Vite   │ ───────────────────────────> │  Render Express API  │
│  SPA + TipTap editor │ <──── WebSocket / Yjs ───── │  REST + collaboration│
└──────────────────────┘                             └──────────┬───────────┘
                                                               │
                                                               ▼
                                                       ┌─────────────────┐
                                                       │  MongoDB         │
                                                       └─────────────────┘
```

| Area | Choice | Reason |
| --- | --- | --- |
| Editor | TipTap on ProseMirror | Structured rich-text state with a practical React integration. |
| Realtime state | Yjs + WebSockets | Shared document updates and awareness data without sending editor HTML on every keystroke. |
| API | Express + Mongoose + Zod | Small route/controller boundaries with schema validation at request edges. |
| Deployment | Vercel + Render | Vercel serves the SPA; Render keeps the API and long-lived WebSocket process together. |
| Files | Multer + parser/export services | Upload handling, document parsing, and generated exports stay on the server side. |

## Local development

Requirements: Node.js 18 or newer and MongoDB.

```bash
git clone https://github.com/23eg112e02-gif/DocuEase.git
cd DocuEase
npm install
```

Create `server/.env` from [`server/.env.example`](server/.env.example). For local frontend development, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_COLLAB_WS_URL=ws://localhost:5000
```

Run both applications:

```bash
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Deployment

### Render

The repository's [`render.yaml`](render.yaml) defines the Node service, `/api/health` health check, MongoDB/JWT variables, cross-site cookie settings, a 5 MB upload limit, private uploads, and optional SMTP variables.

### Vercel

[`client/vercel.json`](client/vercel.json) rewrites SPA routes to `index.html`. Set these build-time variables in Vercel:

```env
VITE_API_URL=https://docuease.onrender.com/api
VITE_COLLAB_WS_URL=wss://docuease.onrender.com
```

## API areas

- Auth: `/api/auth/register`, `/login`, `/refresh`, `/logout`, `/logout-all`, `/forgot-password`, `/reset-password`, `/export-data`, `/delete-account`
- Documents and sharing: `/api/documents` and `/api/documents/:id/share`
- Versions: `/api/documents/:id/versions` and `/api/documents/:id/versions/:versionId/restore`
- Uploads: `/api/uploads`
- Exports: `/api/export/pdf`, `/docx`, `/txt`, and `/md`
- Collaboration: WebSocket rooms at `/collaboration/:documentId`

## Honest limits

- Sharing is by email with users who already have accounts; there is no invitation email flow.
- Collaboration authentication uses the current access token. A WebSocket connection does not refresh an expired token in place.
- Version history retains the latest 30 snapshots and does not provide a visual diff.
- Export fidelity depends on the source HTML; complex layouts, tables, and images may not reproduce exactly in PDF or DOCX.
- Uploads are stored on the Render service filesystem, so production storage is tied to the service's filesystem lifecycle rather than object storage.
- Render free instances can sleep when idle, which makes the first request slower.

## Repository layout

```text
client/    React + Vite application
server/    Express API, WebSocket collaboration, models, and services
docs/      Architecture, API, database, and security notes
tests/     Test fixtures and API test artifacts
```

## Project link

[GitHub: 23eg112e02-gif/DocuEase](https://github.com/23eg112e02-gif/DocuEase)
