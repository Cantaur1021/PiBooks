# PiBooks (Self-hosted Accounting)

FastAPI + SQLite/Postgres + Next.js (shadcn-style). Double-entry, invoices, VAT, reports.

## Dev

- Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
- Frontend: `cd frontend && pnpm i && pnpm dev` (set `NEXT_PUBLIC_API_BASE=http://localhost:8000`)

## Docker (Mac or Raspberry Pi)

docker compose build
docker compose up -d

- Visit http://<host> or your domain.
