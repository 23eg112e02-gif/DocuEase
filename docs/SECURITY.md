# DocuEase Security Hardening

DocuEase keeps the Express/MongoDB API on Render and the Vite React client on Vercel.

## Authentication

- Passwords are excluded from normal user queries and require strong passwords.
- Five failed logins lock an account for 15 minutes.
- Access tokens are short-lived and refresh tokens are stored as SHA-256 hashes.
- Refresh-token rotation removes used tokens and detects reuse by revoking all sessions.
- Auth cookies are `httpOnly`, environment-configured for `Secure` and `SameSite`, and cleared on logout and password changes.
- Password reset tokens are random, hashed, single-use, and expire after 15 minutes.
- Forgot-password responses do not reveal whether an email is registered.

## Authorization and data protection

- Protected API routes ignore soft-deleted users.
- Admin checks are server-side through `requireAdmin`.
- Account deletion removes owned documents and uploads, then scrubs and soft-deletes the user.
- Personal data export returns the user profile, owned documents, and owned uploads.
- Audit events cover authentication, sessions, password actions, profile changes, export, and account deletion. Audit recording never blocks a request.

## Network and uploads

- Helmet applies CSP, HSTS, frame denial, and MIME sniffing protection.
- JSON request bodies are limited to 1 MB.
- CORS accepts configured client origins and localhost only outside production. Vercel previews require explicit opt-in.
- Uploads accept only PDF, DOCX, and TXT files when both extension and MIME type match.
- Uploaded files use random UUID filenames and default to a 5 MB limit. Public upload serving is disabled by default.
- API, authentication, password-reset, and sensitive-operation rate limits are enabled.

## Deployment notes

Set strong, unique JWT secrets and configure `CLIENT_URL` on Render. Set `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` when the Vercel client and Render API are on different HTTPS origins. Configure the `SMTP_*` variables to send reset email through SMTP; without them, reset messages are logged for local development only.
