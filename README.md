# EIC Admin Dashboard

Admin interface for managing registrations, attendance, communications, analytics, and exports for the Invest in Ethiopia event.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Recharts (analytics)
- Zustand (state)

## Functional Overview (What This App Does)

### 1) Admin Authentication

- Login with email/password.
- OTP verification flow.
- Forgot-password and reset-password flows.
- Session token stored as HTTP-only cookie by the backend.

### 2) Dashboard & Analytics

- Attendance summary (total vs checked-in).
- Registration trends by day.
- Category, sector, and country distributions.
- Top countries and sectors.

### 3) Attendee Management

- View full attendee list.
- Search, filter by category/status, and sort by columns.
- Pagination controls.
- Actions: view, edit, delete, send email, generate badge, export attendee data.

### 4) Communications Center

- Create and manage email templates.
- Audience targeting or selected recipients.
- Merge tags (e.g., first name, organization).
- Send immediately, schedule, or send test emails.
- Attachments support and preview rendering.
- Visibility into email stats and recent activity.

### 5) Reports

- CSV exports for attendee directory, check-in report, country analysis, sector interests, and daily summaries.
- Live metrics and file size estimates.

## Main Routes

- `/login` — admin login
- `/otp` — OTP verification
- `/forgot-password` — reset request
- `/reset-password` — set new password

- `/admin` — dashboard
- `/admin/attendees` — attendee list + actions
- `/admin/communications` — email templates and campaigns
- `/admin/reports` — downloadable reports

## Environment Variables

```
NEXT_PUBLIC_API_BASE=https://your-backend-domain/api
```

If not set, the app falls back to the deployed backend URL defined in [lib/adminApi.ts](lib/adminApi.ts).

## Key Areas

- [app](app) — routes and layouts
- [components](components) — UI modules, sidebar, forms
- [lib/adminApi.ts](lib/adminApi.ts) — API client
- [store](store) — Zustand stores

## Local Development

From the admin folder:

```bash
pnpm install
pnpm dev
```

By default, Next.js starts on port `3000`. To avoid conflicts with the backend, you can run:

```bash
PORT=3002 pnpm dev
```

## Scripts

- `pnpm dev` — start development server
- `pnpm build` — build production bundle
- `pnpm start` — run production server
- `pnpm lint` — run ESLint
