# DocuEase

DocuEase is a production-oriented MERN document platform with two isolated editing experiences:

- Guest Mode: instant editor access with browser-local content only.
- Account Mode: secure auth, persistent MongoDB documents, uploads, history, and exports.

## Why It Stands Out

- Hybrid flow architecture that strictly separates guest and account persistence.
- TipTap-powered rich editor with backend PDF and DOCX export.
- Security-first cookie auth with access and refresh JWT tokens.
- Modular server and client workspaces designed for scaling and deployment.

## Tech Stack

- Client: React, Vite, Tailwind CSS, React Router, Context API, TipTap
- Server: Node.js, Express, MongoDB, Mongoose
- Security: JWT in httpOnly cookies, helmet, rate limiting, CORS controls
- File system: multer uploads with type restrictions

## Project Structure

- client: React application
- server: Express API
- docs: API, architecture, and database notes

## Quick Start

1. Install dependencies:

```bash
npm.cmd install
```

2. Copy env templates:

```bash
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
```

3. Update env values, especially JWT secrets and Mongo URI.

4. Run development:

```bash
npm.cmd run dev
```

## Build And Run

```bash
npm.cmd run build
npm.cmd run start
```

## Production Hardening Included

- Helmet headers enabled
- Compression enabled
- Request rate limiting for API and auth routes
- Cookie settings controlled via env (secure, sameSite, domain)
- Graceful shutdown handlers (SIGINT and SIGTERM)
- ObjectId route validation middleware

## Performance Optimizations Included

- Route-level lazy loading with Suspense fallback
- Vite manual chunk splitting for React and TipTap bundles

## Environment Variables

Server .env values:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/docuease
CLIENT_URL=https://your-vercel-domain.vercel.app
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
TRUST_PROXY_HOPS=1
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
COOKIE_DOMAIN=
```

Client .env values:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
```

## Deploying On Vercel And Render

Recommended split deployment:

- Client on Vercel (set project root to `client`)
- Server on Render (set service root to `server`)

### Vercel (Client)

1. Create a new Vercel project from this repository.
2. Set Root Directory to `client`.
3. Add environment variable:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
```

4. Build command: `npm run build`
5. Output directory: `dist`

### Render (Server)

1. Create a new Render Web Service from this repository.
2. Set Root Directory to `server`.
3. Build command: `npm install`
4. Start command: `npm run start`
5. Health check path: `/api/health`
6. Add required environment variables:

```bash
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
CLIENT_URL=https://your-vercel-domain.vercel.app
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
TRUST_PROXY_HOPS=1
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
COOKIE_DOMAIN=
```

Cross-domain auth requires `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` when client and API are on different domains.

## Core Features

- Guest editor with non-persistent local state
- Register, login, logout, and current-user session check
- Protected account routes
- Full document CRUD for authenticated users
- Uploads for PDF, DOCX, and TXT
- Export endpoints for PDF and DOCX
- Dashboard showing documents and upload activity

## Important Rule Enforcement

- Guest content is never written to MongoDB.
- Persistent storage is only available in authenticated account mode.
