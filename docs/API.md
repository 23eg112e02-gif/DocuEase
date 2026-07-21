# API

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Documents

- `GET /api/documents`
- `POST /api/documents`
- `GET /api/documents/:id`
- `PUT /api/documents/:id`
- `DELETE /api/documents/:id`

## Uploads

- `POST /api/uploads`
- `GET /api/uploads`

## Export

- `POST /api/export/pdf`
- `POST /api/export/docx`

## Dashboard

- `GET /api/dashboard`

Guest export requests can send raw `{ title, content }`. Account export requests can send a `documentId`.
