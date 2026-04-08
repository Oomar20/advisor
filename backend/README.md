# Backend

NestJS API for the booking flow, managed with Bun.

## Stack

- Bun for package management and scripts
- NestJS + TypeScript
- Zod validation
- Drizzle ORM
- PostgreSQL via `postgres`

## Routes

- `GET /bookings/available?date=YYYY-MM-DD&timezone=UTC`
- `POST /bookings`

Example booking body:

```json
{
  "date": "2026-04-07",
  "timeSlot": "10:00",
  "timezone": "UTC"
}
```

## Run

```bash
cd /mnt/storage/Work/Operator/backend
bun install
bun run dev
```

The server starts on `http://localhost:3002`.

## Database

If `DATABASE_URL` is set, the service uses PostgreSQL through Drizzle.

If `DATABASE_URL` is not set, the app falls back to an in-memory booking store so the API can still be exercised during local setup.

Start PostgreSQL from the repo root:

```bash
cd /mnt/storage/Work/Operator
docker compose up -d postgres
```

The included compose file starts PostgreSQL 16 with these defaults:

- host: `localhost`
- port: `5432`
- database: `operator`
- username: `postgres`
- password: `postgres`

Copy the backend env file and keep the default `DATABASE_URL` if you want to use the local database:

```bash
cd /mnt/storage/Work/Operator/backend
cp .env.example .env
```

Apply the schema to the database:

```bash
cd /mnt/storage/Work/Operator/backend
bun run db:push
```

Generate Drizzle files:

```bash
bun run db:generate
```

Push schema to the database:

```bash
bun run db:push
```
