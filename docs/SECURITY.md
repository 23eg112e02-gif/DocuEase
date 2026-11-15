# Security Notes

DocuEase is deployed with the React/Vite frontend on Vercel and the Express/MongoDB API on Render.

## Auth and sessions

- Passwords are excluded from normal user queries and validated for length, uppercase, lowercase, and digit requirements.
- Five failed logins lock an account for 15 minutes.
- Access tokens are short-lived JWTs. Refresh tokens are stored as SHA-256 hashes, rotated on use, and removed on reuse detection.
- HTTP-only cookies use production `Secure` and `SameSite` settings for the cross-origin Vercel/Render deployment.
- Forgot-password always returns the same generic response. Reset tokens are random, hashed, single-use, and expire after 15 minutes.
- Logout-all, password change, and password reset revoke refresh sessions.

## Limits and network controls

- API: 300 requests per 15 minutes.
- Login and registration: 15 requests per 15 minutes.
- Password reset: 5 requests per hour.
- Sensitive operations: 20 requests per 15 minutes.
- CORS allows configured `CLIENT_URL` origins and localhost outside production. Vercel preview origins require explicit opt-in.
- Helmet sets CSP, HSTS, frame denial, and `nosniff`. JSON bodies are limited to 1 MB.
- Uploads require matching PDF, DOCX, or TXT extension and MIME type. Filenames are UUIDs and the default size limit is 5 MB. Public upload serving is disabled.

## Audit and personal data

- Audit records cover login success/failure/lock, registration, logout, refresh, password actions, profile updates, data export, and account deletion. Audit recording does not throw into request handling.
- `GET /api/auth/export-data` returns the authenticated user's profile, owned documents, and uploads.
- `DELETE /api/auth/delete-account` verifies the password, deletes owned documents and uploads, then soft-deletes and scrubs the user record.
- Soft-deleted users cannot authenticate. Admin authorization is checked on the server with `requireAdmin`.

## WebSocket checks

Collaboration connections must provide a valid access token. The server validates the document ID, resolves the user from the token, and checks that the user is the document owner or a collaborator before joining the Yjs room. Viewer/editor permissions are checked by document API handlers; invalid or unauthorized sockets are closed.
