# RoleMark - Project Specification

> AI-powered resume scoring, tailoring, and cover letter generation SaaS

**Tagline:** Every role deserves the right resume

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Specification](#api-specification)
6. [Authentication](#authentication)
7. [Payments & Billing](#payments--billing)
8. [Feature Flags](#feature-flags)
9. [File Structure](#file-structure)
10. [Design System](#design-system)
11. [Key Components](#key-components)
12. [Setup Instructions](#setup-instructions)
13. [Future Enhancements](#future-enhancements)

---

## Overview

RoleMark is a SaaS application that helps job seekers optimize their resumes for specific roles. Users can:

1. **Upload a resume** (PDF) and paste/fetch a job description
2. **Get AI-powered scoring** against the role (free tier - uses gpt-4o-mini)
3. **Generate a tailored resume** optimized for the specific job (paid feature - uses gpt-4o)
4. **Create cover letters** with AI assistance (paid feature)
5. **Edit with rich text editor** (Tiptap) with inline AI editing
6. **Organize by company** and manage versions
7. **Export to PDF** for applications

### Business Model

- **Free tier:** 1 resume upload + AI scoring (uses lightweight model)
- **One-time purchases:**
  - Tailored Resume: $4.99
  - Cover Letter: $2.99
  - Bundle (both): $6.99
- **Subscriptions:**
  - Pro Monthly: $12.99/mo
  - Pro Yearly: $99.99/yr (save 36%)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (OAuth: Google, GitHub, LinkedIn) |
| Payments | Stripe (Checkout, Subscriptions, Webhooks) |
| AI | Vercel AI SDK 6 + AI Gateway |
| Rich Text Editor | Tiptap |
| File Storage | Supabase Storage |
| Deployment | Vercel |

### Key Dependencies

```json
{
  "@ai-sdk/react": "^3.0.0",
  "ai": "^6.0.0",
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.49.4",
  "@stripe/react-stripe-js": "^3.6.0",
  "stripe": "^18.1.0",
  "@tiptap/react": "^2.11.7",
  "@tiptap/starter-kit": "^2.11.7",
  "@react-pdf/renderer": "^4.3.0"
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Landing Page │  │  Dashboard   │  │   Rich Text Editor   │   │
│  │  (Marketing) │  │  (App Core)  │  │      (Tiptap)        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API ROUTES                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │ /api/ai/*  │  │ /api/      │  │ /auth/     │  │ Server    │  │
│  │ - score    │  │ webhooks/  │  │ callback   │  │ Actions   │  │
│  │ - tailor   │  │ stripe     │  │            │  │ (Stripe)  │  │
│  │ - cover    │  │            │  │            │  │           │  │
│  │ - inline   │  │            │  │            │  │           │  │
│  │ - fetch-jd │  │            │  │            │  │           │  │
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Supabase   │  │    Stripe    │  │  Vercel AI Gateway   │   │
│  │  - Auth      │  │  - Checkout  │  │  - gpt-4o-mini       │   │
│  │  - Database  │  │  - Subs      │  │  - gpt-4o            │   │
│  │  - Storage   │  │  - Webhooks  │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables (8 total, all with RLS enabled)

#### `profiles`
Stores user profile data, linked to Supabase Auth users.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK → auth.users) | User ID |
| full_name | text | User's display name |
| avatar_url | text | Profile picture URL |
| subscription_status | text | 'active', 'canceled', 'past_due', null |
| subscription_plan | text | 'monthly', 'yearly', null |
| subscription_current_period_end | timestamp | When subscription renews/expires |
| stripe_customer_id | text | Stripe customer ID |
| free_uploads_used | integer | Count of free uploads (max 1) |
| created_at | timestamp | Account creation |
| updated_at | timestamp | Last update |

#### `companies`
Organize resumes by company applied to.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Company ID |
| user_id | uuid (FK) | Owner |
| name | text | Company name |
| website | text | Company website |
| logo_url | text | Company logo |
| notes | text | User notes about company |
| created_at | timestamp | Created at |

#### `resumes`
Main resume records.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Resume ID |
| user_id | uuid (FK) | Owner |
| company_id | uuid (FK, nullable) | Associated company |
| title | text | Resume title/name |
| original_file_url | text | Path to uploaded PDF in Supabase Storage |
| original_text | text | Extracted text from PDF |
| status | text | 'uploaded', 'scored', 'tailored' |
| created_at | timestamp | Created at |
| updated_at | timestamp | Last update |

#### `resume_versions`
Version history for resumes.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Version ID |
| resume_id | uuid (FK) | Parent resume |
| user_id | uuid (FK) | Owner |
| version_number | integer | Sequential version number |
| label | text | Optional version label |
| content | jsonb | Structured resume content |
| is_current | boolean | Whether this is the active version |
| created_at | timestamp | Created at |

#### `job_descriptions`
Stored job descriptions for scoring.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | JD ID |
| user_id | uuid (FK) | Owner |
| resume_id | uuid (FK) | Associated resume |
| title | text | Job title |
| company_name | text | Company name |
| raw_text | text | Full JD text |
| source_url | text | URL if fetched from web |
| source_type | text | 'pasted', 'fetched' |
| created_at | timestamp | Created at |

#### `resume_scores`
AI scoring results.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Score ID |
| resume_id | uuid (FK) | Scored resume |
| job_description_id | uuid (FK) | JD scored against |
| user_id | uuid (FK) | Owner |
| overall_score | integer | 0-100 overall score |
| scores | jsonb | Category breakdowns |
| weaknesses | jsonb | Array of weakness objects |
| strengths | jsonb | Array of strength objects |
| suggestions | jsonb | Array of improvement suggestions |
| created_at | timestamp | Created at |

**Scores JSONB structure:**
```typescript
{
  keywords: number,    // 0-100
  experience: number,  // 0-100
  skills: number,      // 0-100
  education: number,   // 0-100
  impact: number       // 0-100
}
```

**Weaknesses JSONB structure:**
```typescript
{
  area: string,
  detail: string,
  severity: 'high' | 'medium' | 'low'
}[]
```

#### `cover_letters`
Generated cover letters.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Cover letter ID |
| user_id | uuid (FK) | Owner |
| resume_id | uuid (FK) | Associated resume |
| job_description_id | uuid (FK) | Target JD |
| content | jsonb | Structured content (Tiptap JSON) |
| created_at | timestamp | Created at |
| updated_at | timestamp | Last update |

#### `purchases`
Payment records for one-time purchases and subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Purchase ID |
| user_id | uuid (FK) | Purchaser |
| resume_id | uuid (FK, nullable) | Associated resume |
| product_type | text | 'tailored_resume', 'cover_letter', 'bundle', 'monthly', 'yearly' |
| amount_cents | integer | Amount paid |
| status | text | 'pending', 'completed', 'refunded' |
| stripe_checkout_session_id | text | Stripe session ID |
| stripe_payment_intent_id | text | Stripe payment intent |
| created_at | timestamp | Created at |

### RLS Policies

All tables have Row Level Security enabled with policies:
- `*_select_own`: Users can only SELECT their own rows
- `*_insert_own`: Users can only INSERT rows with their user_id
- `*_update_own`: Users can only UPDATE their own rows
- `*_delete_own`: Users can only DELETE their own rows

### Storage Buckets

- **`resumes`**: Stores uploaded PDF files
  - Path format: `{user_id}/{resume_id}.pdf`
  - RLS: Users can only access their own files

---

## API Specification

### AI Endpoints

#### `POST /api/ai/score`
Score a resume against a job description.

**Auth:** Required (Supabase session)
**Model:** `openai/gpt-4o-mini` (free tier)
**Paywall:** None (free feature, limited by upload count)

**Request:**
```typescript
{
  resumeId: string,
  jobDescriptionId: string
}
```

**Response:**
```typescript
{
  success: boolean,
  score: {
    overall_score: number,      // 0-100
    scores: {
      keywords: number,
      experience: number,
      skills: number,
      education: number,
      impact: number
    },
    weaknesses: Array<{
      area: string,
      detail: string,
      severity: 'high' | 'medium' | 'low'
    }>,
    strengths: Array<{
      area: string,
      detail: string
    }>,
    suggestions: Array<{
      text: string,
      priority: 'high' | 'medium' | 'low'
    }>
  }
}
```

#### `POST /api/ai/tailor`
Generate a tailored resume for a specific role.

**Auth:** Required
**Model:** `openai/gpt-4o` (premium model)
**Paywall:** Requires subscription OR one-time purchase

**Request:**
```typescript
{
  resumeId: string,
  jobDescriptionId: string
}
```

**Response:**
```typescript
{
  success: boolean,
  tailoredResume: {
    summary: string,
    experience: Array<{
      company: string,
      title: string,
      startDate: string,
      endDate: string | null,
      bullets: string[]
    }>,
    skills: {
      technical: string[],
      soft: string[],
      tools: string[]
    },
    education: Array<{
      institution: string,
      degree: string,
      field: string,
      graduationDate: string
    }>,
    suggestions: string[]
  },
  versionId: string
}
```

#### `POST /api/ai/cover-letter`
Generate a cover letter for a role.

**Auth:** Required
**Model:** `openai/gpt-4o`
**Paywall:** Requires subscription OR one-time purchase

**Request:**
```typescript
{
  resumeId: string,
  jobDescriptionId: string,
  tone?: 'professional' | 'conversational' | 'enthusiastic'
}
```

#### `POST /api/ai/inline`
Inline AI editing for the Tiptap editor.

**Auth:** Required
**Model:** `openai/gpt-4o`
**Paywall:** Requires subscription

**Request:**
```typescript
{
  text: string,
  action: 'improve' | 'shorten' | 'expand' | 'quantify' | 'ats_optimize' | 'custom',
  customPrompt?: string
}
```

#### `POST /api/ai/fetch-jd`
Fetch and parse a job description from URL.

**Auth:** Required

**Request:**
```typescript
{
  url: string
}
```

**Response:**
```typescript
{
  success: boolean,
  jobDescription: {
    title: string,
    company: string,
    content: string
  }
}
```

### Webhook Endpoints

#### `POST /api/webhooks/stripe`
Handles Stripe webhook events.

**Events handled:**
- `checkout.session.completed` - Process successful payment
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription change
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Recurring payment success
- `invoice.payment_failed` - Payment failure

### Auth Endpoints

#### `GET /auth/callback`
OAuth callback handler for Supabase Auth.

Exchanges OAuth code for session and redirects to `/dashboard`.

---

## Authentication

### OAuth Providers

1. **Google** - Primary consumer auth
2. **GitHub** - Developer-focused users
3. **LinkedIn** - Professional/career-focused users

### Setup Requirements

For each provider, configure in Supabase Dashboard (Authentication > Providers):

1. **Callback URL format:** `https://<project-ref>.supabase.co/auth/v1/callback`
2. **Site URL:** Your production domain
3. **Redirect URLs:** Include localhost for development

### Auth Flow

1. User clicks OAuth button on `/auth/login`
2. Redirected to provider (Google/GitHub/LinkedIn)
3. Provider redirects to Supabase callback
4. Supabase exchanges code for session
5. Redirects to `/auth/callback` in Next.js
6. Next.js route handler sets cookies
7. User redirected to `/dashboard`

### Middleware Protection

Protected routes defined in `/lib/supabase/proxy.ts`:
- All `/dashboard/*` routes require authentication
- Authenticated users accessing `/auth/*` are redirected to dashboard

---

## Payments & Billing

### Products

```typescript
// One-time purchases
{ id: 'tailored_resume', price: 499 }   // $4.99
{ id: 'cover_letter', price: 299 }       // $2.99
{ id: 'bundle', price: 699 }             // $6.99

// Subscriptions
{ id: 'monthly', price: 1299, interval: 'month' }  // $12.99/mo
{ id: 'yearly', price: 9999, interval: 'year' }    // $99.99/yr
```

### Stripe Integration

**Server Action:** `/app/actions/stripe.ts`
- `createCheckoutSession(productId, resumeId?)` - Create Stripe Checkout session

**Webhook:** `/api/webhooks/stripe/route.ts`
- Processes payment events
- Updates `profiles` table with subscription status
- Records purchases in `purchases` table

### Access Control

Implemented in `/lib/paywall.ts`:

```typescript
checkAccess(userId, feature) → { allowed: boolean, message?: string }
```

Features checked:
- `upload` - Can upload new resumes (free limit: 1)
- `tailored_resume` - Can generate tailored resumes
- `cover_letter` - Can generate cover letters
- `inline_ai` - Can use inline AI editing

---

## Feature Flags

Located in `/lib/feature-flags.ts`:

```typescript
{
  showTrustBadge: false,      // Social proof in hero
  showCustomerLogos: false,   // Customer logo carousel
  enableSemanticSearch: true, // Command bar (Cmd+K)
  enableCoverLetters: false,  // Cover letter feature
  enableAIRewrite: false,     // Full AI rewrite
  enableBulkUpload: false     // Multiple resume upload
}
```

---

## File Structure

```
/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── cover-letter/route.ts
│   │   │   ├── fetch-jd/route.ts
│   │   │   ├── inline/route.ts
│   │   │   ├── score/route.ts
│   │   │   └── tailor/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── auth/
│   │   ├── callback/route.ts
│   │   ├── error/page.tsx
│   │   └── login/page.tsx
│   ├── dashboard/
│   │   ├── billing/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── companies/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── cover-letters/page.tsx
│   │   ├── resumes/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── billing/
│   ├── company/
│   ├── cover-letter/
│   ├── dashboard/
│   │   ├── header.tsx
│   │   ├── overview.tsx
│   │   └── sidebar.tsx
│   ├── editor/
│   │   ├── resume-editor.tsx
│   │   └── resume-editor-wrapper.tsx
│   ├── landing/
│   │   ├── cta.tsx
│   │   ├── faq.tsx
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   ├── nav.tsx
│   │   └── pricing.tsx
│   ├── resume/
│   │   ├── resume-detail.tsx
│   │   ├── resumes-list.tsx
│   │   └── upload-flow.tsx
│   ├── settings/
│   ├── ui/ (shadcn components)
│   ├── command-bar.tsx
│   ├── logo.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── proxy.ts
│   │   └── server.ts
│   ├── feature-flags.ts
│   ├── paywall.ts
│   ├── products.ts
│   ├── stripe.ts
│   └── utils.ts
├── scripts/ (SQL migrations)
│   ├── 001_create_profiles.sql
│   ├── 002_create_companies.sql
│   ├── 003_create_resumes.sql
│   ├── 004_create_job_descriptions.sql
│   ├── 005_create_scores.sql
│   ├── 006_create_cover_letters.sql
│   ├── 007_create_purchases.sql
│   └── 008_create_storage.sql
├── middleware.ts
└── package.json
```

---

## Design System

### Color Palette (OKLCH)

**Light Mode:**
- Background: `oklch(0.98 0 0)` - Near white
- Foreground: `oklch(0.13 0.02 260)` - Near black with blue tint
- Primary: `oklch(0.5 0.25 260)` - Deep blue (#1328DC)
- Muted: `oklch(0.95 0.005 260)` - Light gray

**Dark Mode:**
- Background: `oklch(0.07 0.015 260)` - Ultra dark (#0A0A0F)
- Foreground: `oklch(0.92 0.01 260)` - Light gray
- Primary: `oklch(0.55 0.25 260)` - Vibrant blue
- Border: `oklch(0.2 0.025 260)` - Subtle borders

### Typography

- **Sans:** Inter (Vercel/Cursor style)
- **Mono:** JetBrains Mono

### Border Radius

Minimal: `0.125rem` (2px) - Sharp, modern edges

### Logo

SVG component at `/components/logo.tsx`:
- Teal document icon with dark blue upward arrow
- Represents resume improvement/scoring up
- Transparent background

---

## Key Components

### Command Bar (`/components/command-bar.tsx`)

Spotlight-style search accessible via `Cmd+K` (Mac) or `Ctrl+K` (Windows).

**Features:**
- Quick actions (upload resume, create cover letter)
- Navigation to all dashboard sections
- Placeholder for semantic search (ready for RAG/vector integration)

### Resume Editor (`/components/editor/resume-editor.tsx`)

Tiptap-based rich text editor.

**Features:**
- Formatting toolbar (bold, italic, underline, lists, links)
- AI bubble menu (improve, shorten, quantify, ATS optimize)
- Style controls (fonts, margins, line height)
- Version history panel
- PDF export

### Upload Flow (`/components/resume/upload-flow.tsx`)

Multi-step wizard for resume upload and scoring.

**Steps:**
1. Upload PDF
2. Enter job description (paste or fetch URL)
3. AI scoring with results display

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project
- Stripe account

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Database Setup

Run migrations in order:
```bash
# Via Supabase SQL Editor or CLI
psql -f scripts/001_create_profiles.sql
psql -f scripts/002_create_companies.sql
# ... etc
```

### OAuth Setup

1. **Google:** Google Cloud Console → OAuth credentials
2. **GitHub:** Developer Settings → OAuth Apps
3. **LinkedIn:** Developer Portal → Create App

Add callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`

### Stripe Webhook

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Future Enhancements

### Planned (RAG/Vectors)

- **Semantic search:** Use Supabase pgvector to embed and search resumes
- **Smart suggestions:** Find similar successful resumes
- **Company research:** Auto-fetch company info for applications

### Potential Features

- Resume templates/themes
- Interview prep based on JD
- Application tracking (ATS integration)
- Team/agency accounts
- Chrome extension for JD capture
- Mobile app

---

## Development Notes

### AI Models

- **Scoring (free):** `openai/gpt-4o-mini` - Fast, cheap, good enough for scoring
- **Generation (paid):** `openai/gpt-4o` - Higher quality for tailored content

### Supabase RLS

All database operations go through Supabase client with user session. RLS policies ensure users can only access their own data.

### Tiptap Editor

Uses modular extensions:
- StarterKit (basic formatting)
- TextAlign, TextStyle, Color
- Link, Placeholder, Highlight
- Custom AI extension for inline editing

---

*Generated for RoleMark project - March 2026*
