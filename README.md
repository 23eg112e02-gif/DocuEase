# DocuEase

Simple document editor built with MERN. Supports guest mode (no login) and account mode (saved docs).

## Features

- Rich text editor (TipTap)
- Guest mode — works in browser only
- Account mode — save docs, upload files, export PDF/DOCX
- JWT auth with httpOnly cookies
- File upload + text extraction

## Stack

**Client:** React + Vite + Tailwind + TipTap  
**Server:** Node + Express + MongoDB + JWT

## Run locally

```bash
git clone https://github.com/23eg112e02-gif/DocuEase.git
cd DocuEase
npm install

# copy env files and fill them
cp server/.env.example server/.env
cp client/.env.example client/.env

npm run dev
```

Client: http://localhost:5173  
Server: http://localhost:5000

## Env basics

**server/.env**
```
PORT=5000
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Structure

- `client/` — React frontend
- `server/` — Express API

Built as a portfolio project to practice full-stack auth, file handling and rich text editing.
