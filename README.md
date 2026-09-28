# SkillClass

Professional live education + digital PDF marketplace.

## Roles
- Student
- Teacher
- Seller
- Admin

## Current starter includes
- Professional responsive homepage
- Public class/PDF marketplace pages
- Login/register UI
- Teacher/Seller onboarding pages
- Admin dashboard UI
- PostgreSQL + Prisma schema
- Wallet ledger schema
- Payment/approval schema
- Subscription schema
- Audit log schema
- Health API

## Run locally

Requirements:
- Node.js 20+
- PostgreSQL

```bash
npm install
cp .env.example .env
# Put your PostgreSQL URL in .env

npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000

Demo seed accounts:
- admin@skillclass.local
- teacher@skillclass.local
- seller@skillclass.local
- student@skillclass.local

Demo password:
`ChangeMe123!`

Change all demo credentials before production.

## Production work still required
The UI and data model are structured for the requested product, but real production integrations must still be connected:
- secure authentication/session provider
- Razorpay order creation + signature verification + webhook
- private object storage for PDFs
- signed PDF access
- live video provider/WebRTC
- real withdrawal/payout provider
- server-side admin approval actions
- rate limiting and production monitoring

Never treat frontend payment success as payment verification.
Never expose private PDF storage URLs.
