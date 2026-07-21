# Architecture

DocuEase is split into two workspaces:

- `client/` contains the React UI, routes, shared contexts, and the TipTap editor shell.
- `server/` contains the Express API, Mongoose models, cookie-based JWT auth, uploads, and export services.

Guest editor state lives only in client memory. Authenticated data is stored in MongoDB and accessed through protected routes.
