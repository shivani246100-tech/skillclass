# SkillClass Phase 2 — Authentication

This update adds real role-based registration/login using PostgreSQL + Prisma and secure HTTP-only session cookies.

## 1. In the project folder

```powershell
npm install
```

If npm reports that Prisma install scripts are blocked, run:

```powershell
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild
```

Then:

```powershell
npx prisma generate
```

## 2. Database

Create `.env` from `.env.example` and set a real PostgreSQL DATABASE_URL and NEXTAUTH_SECRET.

Then:

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

## 3. Start

```powershell
npm run dev
```

Open http://localhost:3000/register

Admin is not selectable from public registration. The owner account is seeded by `npm run db:seed`.

Demo seeded password: `ChangeMe123!`

Change it before production.
