# Operator

This project is a small booking flow with two apps:

- `frontend/`: a Next.js app that renders the booking UI and proxies auth and booking requests to the backend
- `backend/`: a NestJS API that handles sessions, availability, and bookings

The backend can run in two modes:

- with PostgreSQL through Drizzle
- without PostgreSQL, using an in-memory booking store for local development

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: NestJS, Fastify, TypeScript, Zod
- Database: PostgreSQL, Drizzle ORM
- Package/runtime: Bun

## Prerequisites

You need:

- Bun
- Docker and Docker Compose, if you want to run PostgreSQL locally

## Project structure

```text
.
├── frontend
├── backend
└── docker-compose.yml
```

### Backend env variables

Create `backend/.env`:

```env
PORT=3002
HOST=0.0.0.0
ALLOWED_ORIGIN=http://localhost:3000
DEFAULT_TIMEZONE=UTC
CONSULTANT_ID=sara-ahmad
SESSION_COOKIE_NAME=advisor_session
DATABASE_URL=postgres://postgres:postgres@localhost:5432/operator
```

What each value does:

- `PORT`: port the API listens on
- `HOST`: host interface for the API server
- `ALLOWED_ORIGIN`: frontend origin allowed by CORS
- `DEFAULT_TIMEZONE`: fallback timezone used by booking logic
- `CONSULTANT_ID`: consultant identifier stored with bookings
- `SESSION_COOKIE_NAME`: cookie name used for auth sessions
- `DATABASE_URL`: PostgreSQL connection string

If you want to run the backend without Postgres, set:

```env
DATABASE_URL=
```

That keeps the API running and uses the in-memory booking fallback instead of the database.

Important: Drizzle commands such as `bun run db:push` and `bun run db:generate` still need a real `DATABASE_URL`.

### Frontend env variables

Create `frontend/.env.local`:

```env
BACKEND_API_BASE_URL=http://localhost:3002
```

What it does:

- `BACKEND_API_BASE_URL`: base URL the Next.js API routes use when forwarding requests to the backend

## Install dependencies

Install dependencies in both apps:

```bash
cd backend
bun install
```

```bash
cd frontend
bun install
```

## Running locally

### Option 1: Run with PostgreSQL

Start Postgres from the repo root:

```bash
docker compose up -d postgres
```

The local database uses:

- host: `localhost`
- port: `5432`
- database: `operator`
- username: `postgres`
- password: `postgres`

Push the schema:

```bash
cd backend
bun run db:push
```

Start the backend:

```bash
cd backend
bun run dev
```

Start the frontend in another terminal:

```bash
cd frontend
bun run dev
```

Open `http://localhost:3000`.

### Option 2: Run without PostgreSQL

Set `DATABASE_URL=` in `backend/.env`, then start the apps:

```bash
cd backend
bun run dev
```

```bash
cd frontend
bun run dev
```

In this mode, bookings are kept in memory and disappear when the backend restarts.

## Useful commands

Backend:

```bash
cd backend
bun run dev
bun run check
bun run db:push
bun run db:generate
```

Frontend:

```bash
cd frontend
bun run dev
bun run check
bun run build
```

## API docs

You can reach the API docs from the following link: `https://operator-pzwt.readme.io/reference/get_auth-session`
