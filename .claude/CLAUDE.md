# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMMS (Enterprise MoU Management System) — a college web app for managing Memorandums of Understanding between faculty and companies. Two roles: **faculty** (manages own MoUs) and **senior** (oversees all faculty/department MoU activity).

## Development Commands

```bash
# Server (Express, from /server)
npm run dev          # node --watch src/server.js (port 5001)
npm start            # production start

# Client (React+Vite, from /client)
npm run dev          # Vite dev server with proxy to :5001
npm run build        # production build
npm run lint         # ESLint
```

Both must run simultaneously. Client proxies `/api` requests to `http://localhost:5001` via Vite config.

## Architecture

**Client**: React 19 + Vite + Tailwind CSS v4 + React Router v7 + Firebase Auth/Storage
**Server**: Express 5 + Mongoose 9 + Firebase Admin SDK (CommonJS)
**Database**: MongoDB Atlas

### Auth Flow
1. Firebase handles signup/login (email/password) on client
2. Client Axios interceptor (`hooks/useApi.js`) adds `Authorization: Bearer <firebaseIdToken>` to every request
3. Server `authMiddleware` verifies token via Firebase Admin SDK, looks up MongoDB User by `firebaseUid`, sets `req.user`
4. `roleMiddleware` (`requireRole('senior')`) gates admin endpoints
5. `AuthContext` on client watches `onAuthStateChanged`, syncs with `/api/auth/me`, drives role-based routing

### Inactivity Tracking (Critical Business Logic)
`Mou.lastInteractionDate` is **denormalized** — updated inline when activities are logged (`activityController.create`). This avoids expensive aggregation across the Activity collection. The inactivity service (`services/inactivityService.js`) queries `lastInteractionDate < 90 days ago` to find stale MoUs. Logging an activity also **auto-resolves** any active grace periods on that MoU.

### MoU Renewal Pattern
Renewal creates a **new Mou document** with `renewedFrom` pointing to the old one. The old MoU's status changes to `renewed`. This preserves full history.

### API Response Format
All endpoints return `{ success: boolean, message: string, data: any }` via `utils/apiResponse.js`.

## Key Files

- `server/src/middleware/authMiddleware.js` — Firebase token verification + MongoDB user lookup
- `server/src/services/inactivityService.js` — 90-day stale MoU detection query
- `server/src/controllers/activityController.js` — Updates `lastInteractionDate` + auto-resolves grace periods
- `client/src/contexts/AuthContext.jsx` — Firebase auth state sync, role-based routing source of truth
- `client/src/hooks/useApi.js` — Axios instance with automatic Firebase token injection

## Route Conventions

- `/api/auth/*` — no role middleware (used during registration before user exists in MongoDB)
- `/api/mous/*`, `/api/organisations/*`, `/api/activities/*` — require auth + either role
- `/api/admin/*` — require `senior` role (except `/api/admin/grace-periods/my` which is dual-role)

Frontend routes: `/faculty/*` pages for faculty role, `/senior/*` pages for senior role. `ProtectedRoute` checks auth, `RoleRoute` checks role.

## Environment Variables

**Server** (`server/.env`): `PORT`, `MONGO_URI`, `FIREBASE_SERVICE_ACCOUNT_PATH`
**Client** (`client/.env`): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

Firebase service account key JSON file goes at `server/serviceAccountKey.json`.

## Gotchas

- macOS AirPlay uses port 5000 — server runs on **5001**
- MongoDB password in connection string contains special chars (`@#`) that must be URL-encoded (`%40%23`)
- Firebase config path resolves relative to `process.cwd()` (the `server/` directory), not the config file location
