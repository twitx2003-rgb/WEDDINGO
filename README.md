# ועד-טק — Vaad-Tech

A minimalist Building Management System (HOA manager) for residential buildings.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Shadcn UI · Supabase (PostgreSQL + Auth)

---

## 1. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and paste the entire contents of `supabase/schema.sql`.
3. Click **Run** — this creates all five tables with foreign keys and enables Row Level Security.

### Tables

| Table       | Purpose                                               |
|-------------|-------------------------------------------------------|
| `buildings` | Building info — address, apartment count, monthly fee |
| `users`     | Admins + tenants. Tenants carry an `access_token` UUID used as their magic portal link |
| `payments`  | One row per tenant per month/year, `paid` or `unpaid` |
| `expenses`  | Building running costs logged by the admin            |
| `issues`    | Service tickets submitted by tenants                  |

---

## 2. Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Then fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# and SUPABASE_SERVICE_ROLE_KEY from your Supabase project → Settings → API

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Terminal commands used to bootstrap this project (for reference)

```bash
npx create-next-app@latest vaad-tech \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-git --use-npm

npm install @supabase/supabase-js @supabase/ssr \
  class-variance-authority clsx tailwind-merge lucide-react \
  @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu sonner react-hook-form \
  @hookform/resolvers zod
```

Shadcn UI was wired up manually (the `shadcn init` command requires external network access to their registry).
When you have network access, run: `npx shadcn@latest add <component>` to add more components.

---

## 3. Folder Structure

```
src/
├── app/
│   ├── page.tsx                          ← Landing page / entry point
│   │
│   ├── (auth)/                           ← Route group: no shared layout
│   │   ├── login/page.tsx                ← Admin email + password login
│   │   └── register/page.tsx             ← Admin signup + building creation
│   │
│   ├── (admin)/                          ← Route group: shared admin sidebar
│   │   └── admin/
│   │       ├── layout.tsx                ← Admin shell with navigation
│   │       ├── page.tsx                  ← Dashboard (balance, debts, open tickets)
│   │       ├── tenants/page.tsx          ← Add/edit tenants, copy magic links
│   │       ├── payments/page.tsx         ← Mark paid/unpaid per month
│   │       ├── expenses/page.tsx         ← Log building expenses
│   │       └── issues/page.tsx           ← View and update service tickets
│   │
│   └── (tenant)/                         ← Route group: tenant-facing (no auth wall)
│       └── portal/[token]/
│           ├── page.tsx                  ← Personal payment status view
│           └── ticket/page.tsx           ← Submit a service ticket
│
├── components/
│   └── ui/                               ← Shadcn-style base components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       └── table.tsx
│
└── lib/
    ├── utils.ts                          ← cn() helper (clsx + tailwind-merge)
    ├── types.ts                          ← TypeScript types for all DB tables
    └── supabase/
        ├── client.ts                     ← Browser Supabase client
        └── server.ts                     ← Server client + admin (service-role) client
```

### Why Route Groups?

- `(auth)` — login/register pages share no layout; the parentheses mean they don't add a URL segment.
- `(admin)` — all `/admin/*` routes share the sidebar `layout.tsx` with navigation.
- `(tenant)` — tenant portal routes at `/portal/[token]/*` are completely separate from the admin section.

### Tenant Magic Link

Each tenant row has an `access_token` UUID column. The admin copies the URL  
`https://your-app.com/portal/<access_token>` and sends it via WhatsApp.  
No email, no password — the token is the credential.

---

## Next Steps (feature implementation)

1. **Auth (Admin):** Wire `(auth)/login` and `(auth)/register` to Supabase `signInWithPassword` / `signUp`.
2. **Admin Dashboard:** Server component fetching real aggregates from Supabase via `createAdminClient()`.
3. **Tenants:** Add/edit form with server action; auto-copy portal link to clipboard.
4. **Payments:** Toggle `paid`/`unpaid` per tenant per month via server action.
5. **Expenses:** `addExpense` server action; running balance calculation.
6. **Issues:** `updateIssueStatus` server action; tenant `submitIssue` server action.
7. **RLS:** Add Supabase Row Level Security policies so each tenant can only read their own rows.
