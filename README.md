# EMMS — Enterprise MoU Management System

A college web application for managing Memorandums of Understanding (MoUs) between faculty and companies. Two roles: **Faculty** (manages own MoUs) and **Senior** (oversees all faculty/department MoU activity).

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | React 19, Vite 7, Tailwind CSS v4, React Router v7     |
| Backend    | Express 5, Mongoose 9, Firebase Admin SDK (CommonJS)    |
| Database   | MongoDB Atlas                                           |
| Auth       | Firebase Authentication (email/password)                |
| Storage    | Local file storage via Multer (PDF uploads, max 10 MB)  |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB)
- Firebase project with Authentication enabled

### 1. Clone & install

```bash
git clone <repo-url> && cd EMMS

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment variables

**Server** — create `server/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

> MongoDB passwords with special characters must be URL-encoded (`@` → `%40`, `#` → `%23`).

Place your Firebase service account key JSON at `server/serviceAccountKey.json`.

**Client** — create `client/.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Run

Both servers must run simultaneously. The client proxies `/api` requests to the backend via Vite config.

```bash
# Terminal 1 — Server (from /server)
npm run dev          # node --watch src/server.js on port 5001

# Terminal 2 — Client (from /client)
npm run dev          # Vite dev server with HMR
```

> **Note:** macOS AirPlay occupies port 5000, so the server uses port **5001**.

## Project Structure

```
EMMS/
├── client/
│   └── src/
│       ├── components/        # Reusable UI (MouCard, Navbar, FileUpload, etc.)
│       ├── contexts/          # AuthContext — Firebase auth state + role routing
│       ├── hooks/             # useApi — Axios instance with auto token injection
│       ├── pages/
│       │   ├── auth/          # Login, Register
│       │   ├── faculty/       # Dashboard, MoU submission/edit, Org search
│       │   └── senior/        # Dashboard, Faculty list, Org MoU review
│       ├── services/          # API service utilities
│       ├── utils/             # Constants (enums), date helpers
│       └── config/            # Firebase client config
│
└── server/
    └── src/
        ├── controllers/       # Route handlers (auth, mou, activity, admin, org, upload)
        ├── models/            # Mongoose schemas (User, Mou, Activity, GracePeriod, Organisation)
        ├── routes/            # Express route definitions
        ├── middleware/        # Auth (Firebase verify), role guard, error handler
        ├── services/          # Business logic (inactivity detection)
        ├── utils/             # Standardised API response helper
        └── config/            # DB, Firebase Admin, env config
```

## Features

### Faculty

- **Dashboard** — active/expired/renewed MoU stats, upcoming expirations
- **Submit MoUs** — create MoUs with organisation search or creation, upload signed PDF copies
- **Edit & Renew** — update active MoUs, renew expired ones (creates a new MoU linked to the original)
- **Activity Logging** — log meetings, workshops, exchanges, lectures, internships, etc.
- **Grace Periods** — view grace periods issued by senior users

### Senior (Admin)

- **Dashboard** — system-wide stats with department breakdown
- **Faculty Oversight** — browse all faculty, filter by department, view individual MoU portfolios
- **Inactivity Detection** — identify faculty with no MoU interaction in 90+ days
- **Grace Periods** — issue, track, and manage grace periods for inactive faculty
- **Organisation Review** — view all MoUs associated with a given organisation

## Authentication & Authorization

1. Firebase handles signup/login (email/password) on the client
2. Axios interceptor in `useApi.js` attaches `Authorization: Bearer <firebaseIdToken>` to every request
3. Server `authMiddleware` verifies the token via Firebase Admin SDK and resolves the MongoDB user
4. `roleMiddleware` gates admin endpoints to `senior` role only
5. Frontend `ProtectedRoute` and `RoleRoute` components enforce auth and role-based access

## Key Business Logic

### Inactivity Tracking

`Mou.lastInteractionDate` is denormalized — updated inline whenever an activity is logged. The inactivity service queries MoUs where `lastInteractionDate` is older than 90 days to surface stale records on the senior dashboard.

### MoU Renewal

Renewal creates a **new MoU document** with `renewedFrom` pointing to the previous one. The old MoU's status changes to `renewed`, preserving full history.

### Auto-Expiration

A Mongoose pre-hook on `find`/`findOne` automatically marks MoUs as `expired` when their `expiryDate` has passed.

### Grace Period Auto-Resolution

Logging an activity on an MoU automatically resolves any active grace periods associated with it.

## API Overview

All endpoints return `{ success, message, data }`.

| Route                        | Auth     | Description                          |
| ---------------------------- | -------- | ------------------------------------ |
| `POST /api/auth/register`   | Firebase | Register new user                    |
| `GET /api/auth/me`          | Auth     | Current user profile                 |
| `POST /api/mous`            | Auth     | Create MoU                           |
| `GET /api/mous`             | Auth     | List user's MoUs                     |
| `PUT /api/mous/:id`         | Faculty  | Update active MoU                    |
| `POST /api/mous/:id/renew`  | Auth     | Renew MoU                            |
| `POST /api/activities`      | Auth     | Log activity                         |
| `GET /api/activities/mou/:mouId` | Auth | Activities for a MoU                |
| `POST /api/organisations`   | Auth     | Create organisation                  |
| `GET /api/organisations`    | Auth     | Search organisations                 |
| `GET /api/admin/dashboard/stats` | Senior | Dashboard statistics            |
| `GET /api/admin/faculty`    | Senior   | List all faculty                     |
| `GET /api/admin/inactive-faculty` | Senior | Faculty inactive 90+ days      |
| `POST /api/admin/grace-periods` | Senior | Issue grace period               |
| `POST /api/uploads/file`    | Auth     | Upload signed MoU PDF                |
| `GET /api/health`           | None     | Health check                         |

## Data Models

- **User** — `firebaseUid`, `email`, `name`, `department`, `designation`, `role` (faculty/senior)
- **Mou** — `title`, `faculty`, `organisation`, `signedCopyUrl`, `status`, `signedDate`, `expiryDate`, `renewedFrom`, `lastInteractionDate`
- **Organisation** — `name`, `type` (industry/academic/government/ngo/other), `contactPerson`, `contactEmail`
- **Activity** — `mou`, `faculty`, `type` (meeting/workshop/student_exchange/...), `description`, `date`
- **GracePeriod** — `mou`, `faculty`, `issuedBy`, `reason`, `graceDays`, `deadline`, `status` (active/resolved/escalated)

## Available Scripts

```bash
# Server (from /server)
npm run dev          # Development with file watching
npm start            # Production

# Client (from /client)
npm run dev          # Vite dev server
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```
