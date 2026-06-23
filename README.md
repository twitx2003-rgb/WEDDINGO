# תחביב־כסף — Hobby Marketplace

A two-sided Hebrew (RTL) marketplace that matches **customers** ("לקוח") with **hobbyists**
("בעל תחביב") who offer services from their hobby — so hobbyists earn from what they love, and
customers pay below full professional rates.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Shadcn UI · Supabase (PostgreSQL + Auth)

---

## 1. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the entire contents of `supabase/schema.sql`, and click **Run**.
   This drops any previous tables, creates the three new tables, seeds the categories, and enables RLS.

### Tables

| Table        | Purpose                                                                 |
|--------------|-------------------------------------------------------------------------|
| `profiles`   | One row per auth user. `role` is `customer` or `hobbyist`. `id` == `auth.users.id`. |
| `categories` | Hobby categories (seeded in Hebrew, e.g. צילום, אפייה, נגרות).           |
| `listings`   | Service listings published by hobbyists (title, price, category, status). |

RLS is enabled on all tables; policies are deferred — MVP data access runs server-side with the
service-role key.

---

## 2. Local Setup

```bash
npm install

# Environment variables
cp .env.local.example .env.local
# Fill in from Supabase → Settings → API:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The register flow and all data reads require a real `SUPABASE_SERVICE_ROLE_KEY` — placeholder
> values let the server boot but won't authenticate.

---

## 3. How it works

- **Browse (`/`)** — public. Customers see active listings and filter by category (`/?category=<slug>`).
- **Listing detail (`/listings/[id]`)** — public. A "הצג פרטי קשר" button reveals a WhatsApp
  (`wa.me`) + phone link to contact the hobbyist directly. (In-app payments are a later phase.)
- **Register (`/register`)** — choose a role: hobbyist or customer.
- **Hobbyist dashboard (`/dashboard`)** — create/edit/pause/delete listings and edit the profile.
  Guarded by middleware (auth) + the dashboard layout (`requireHobbyist`).

---

## 4. Folder Structure

```
src/
├── app/
│   ├── layout.tsx                       ← lang="he" dir="rtl", metadata
│   ├── page.tsx                         ← browse / landing (category filter + listing grid)
│   ├── listings/[id]/page.tsx           ← public listing detail + contact reveal
│   ├── (auth)/
│   │   ├── actions.ts                   ← login / register(role) / logout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/                     ← hobbyist-only
│       ├── layout.tsx                   ← requireHobbyist guard + sidebar
│       └── dashboard/
│           ├── page.tsx                 ← my listings (table)
│           ├── actions.ts               ← create/update/delete/toggle listing
│           ├── listings/new/page.tsx
│           ├── listings/[id]/edit/page.tsx
│           └── profile/
│               ├── page.tsx
│               └── actions.ts           ← updateProfile
├── components/
│   ├── ui/                              ← Shadcn base (button, card, input, label, badge,
│   │                                       table, textarea, select)
│   ├── auth/                            ← LoginForm, RegisterForm (role toggle)
│   ├── listings/                        ← ListingCard, CategoryFilter, ListingForm,
│   │                                       ListingActions, ContactReveal
│   ├── profile/                         ← ProfileForm
│   └── layout/                          ← SiteHeader
└── lib/
    ├── utils.ts                         ← cn()
    ├── types.ts                         ← Profile, Category, Listing, ListingWithRelations
    ├── session.ts                       ← getCurrentProfile(), requireHobbyist()
    └── supabase/
        ├── client.ts                    ← browser client
        └── server.ts                    ← server client + admin (service-role) client
```

---

## Next steps (later phases)

In-app payments/checkout · Supabase Storage image upload · in-app chat · ratings & reviews ·
advanced search/filters · customer profile-edit page.
