# Vercel Deployment Guide — School Management Application

## 1. Prerequisites

- [ ] A [Neon](https://neon.tech) (recommended) or Vercel Postgres database provisioned and running
- [ ] A [Vercel](https://vercel.com) account with the GitHub repo connected
- [ ] [Vercel CLI](https://vercel.com/docs/cli) installed locally (optional but helpful)

---

## 2. Quick Checklist Before Deploying

| Step | Command / Action | Notes |
|---|---|---|
| Verify local build passes | `pnpm build` | Make sure no TypeScript / bundler errors |
| Choose a PostgreSQL provider | — | Neon free tier works great |
| Run migrations against the cloud DB | `npx prisma migrate deploy` | Uses the **production** `DATABASE_URL` |
| Regenerate Prisma Client | `pnpm prisma:generate` | Already runs in `postinstall` |
| Set all environment variables in Vercel | See section 4 below | At minimum `DATABASE_URL` and `JWT_SECRET` |
| Seed RBAC permissions & roles after deployment | See section 5 below | Only needed once per environment |

---

## 3. Database Commands (Run Before First Deploy)

### 3.1 Option A — Neon DB (Recommended)

```bash
# 1. Create a Neon project & database, then copy the connection string
#    Example: postgresql://neondb_owner:xxxx@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# 2. Set it as DATABASE_URL in your local .env temporarily
#    (or export it directly)

# 3. Run every migration against the Neon DB
export DATABASE_URL="postgresql://neondb_owner:xxxx@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy

# 4. Verify tables were created
npx prisma studio
```

> **Important:** For Vercel's serverless functions, also create a **pooled** (PgBouncer) connection.
> In Neon, the pooled URL usually ends with `?pgbouncer=true`. Store this as `DATABASE_URL_POOLED`
> or append `?pgbouncer=true&connection_limit=1` if you use a single connection string.  
> Prisma needs a **direct** connection for migrations and a **pooled** connection for serverless.

### 3.2 Option B — Your Existing Local Database → Cloud

```bash
# 1. Dump your local database
pg_dump -h localhost -U super_admin -d school_management -F c -f school_management.dump

# 2. Restore to the cloud database
pg_restore -h <cloud-host> -U <cloud-user> -d <cloud-db> school_management.dump

# 3. Run migrate deploy to make sure everything is in sync
npx prisma migrate deploy
```

### 3.3 Option C — Fresh Database (No Existing Data)

```bash
# Set the cloud DATABASE_URL in your .env
DATABASE_URL="postgresql://..."

# Create the schema from scratch
npx prisma generate
npx prisma migrate deploy
```

---

## 4. Vercel Project Setup

### 4.1 Import Project

1. Login to [vercel.com](https://vercel.com)
2. **Add New → Project**
3. Import your GitHub repo: `yaseen-ui/school-management-application`
4. Framework preset: **Next.js**
5. Root directory: `./`
6. Build command: `pnpm build`
7. Output directory: `.next`
8. Install command: `pnpm install`

### 4.2 Environment Variables (Set in Vercel Dashboard)

Go to **Project → Settings → Environment Variables** and add:

| Variable | Required? | Example / Notes |
|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `DIRECT_URL` | **Yes** if using pooled URL | Same as above but **without** `?pgbouncer=true` (for Prisma migrations) |
| `JWT_SECRET` | **Yes** | A long random string, e.g. `openssl rand -hex 64` |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | `/api` (since the frontend and API live in the same Next.js app) |
| `NEXT_PUBLIC_HOST_TYPE` | **Yes** | `tenant` or `company` based on your deployment model |
| `LOG_LEVEL` | No | `info` (default), `warn`, `error`, `debug` |
| `GOOGLE_CLOUD_PROJECT_ID` | Only if using GCS | Your GCP project ID |
| `GCS_BUCKET_NAME` | Only if using GCS | Bucket name for uploads |
| `GCS_SERVICE_ACCOUNT_PATH` | Only if using GCS | Path relative to project root, or base64 the key and store as env var |
| `TWILIO_ACCOUNT_SID` | Only if using SMS | Twilio SID |
| `TWILIO_AUTH_TOKEN` | Only if using SMS | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Only if using SMS | Sender phone number |
| `DEEPSEEK_API_KEY` | Only if using ZAI (AI bot) | DeepSeek API key |
| `COMM_IN_APP_ENABLED` | No | `true` (default) |
| `COMM_EMAIL_ENABLED` | No | `false` (unless you configure email) |
| `COMM_SMS_ENABLED` | No | `false` (unless you configure SMS) |
| `COMM_PUSH_ENABLED` | No | `false` (unless you configure push) |

> **Google Cloud Storage Note:** Vercel's filesystem is read-only. You must either:
> - Store `google-service-key.json` contents as an env var (`GCS_SERVICE_ACCOUNT_JSON`) and parse it at runtime
> - OR use `@vercel/blob` instead of GCS for file uploads

### 4.3 Vercel Configuration File (optional)

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 5. Post-Deployment Startup Scripts

These scripts **must** be run once after the database is ready with tables.

### 5.1 Seed RBAC Permissions

```bash
# Using Vercel CLI (recommended — runs in the Vercel serverless environment)
npx vercel run node lib/backend/rbac/seed-permissions.js

# OR: run locally pointing to the production database
DATABASE_URL="<production-db-url>" node lib/backend/rbac/seed-permissions.js
```

> **Idempotent** — safe to re-run. Only inserts new permissions, never deletes.

### 5.2 Seed Default Roles

```bash
# Using Vercel CLI
npx vercel run node lib/backend/rbac/seed-roles.js

# OR: run locally pointing to the production database
DATABASE_URL="<production-db-url>" node lib/backend/rbac/seed-roles.js
```

> **Idempotent** — safe to re-run. Creates 10 default roles (School Admin, Principal, etc.).

### 5.3 Legacy Tenant Migration (If Applicable)

```bash
npx vercel run node scripts/migrate-legacy-tenant.cjs

# OR locally:
DATABASE_URL="<production-db-url>" node scripts/migrate-legacy-tenant.cjs
```

---

## 6. Full Deployment Flow (Step by Step)

```bash
# 1. Install dependencies and generate Prisma Client
pnpm install

# 2. Build the Next.js app (validates everything compiles)
pnpm build

# 3. Set DATABASE_URL to your cloud database and run migrations
export DATABASE_URL="postgresql://user:pass@cloud-host:5432/db?sslmode=require"
npx prisma migrate deploy

# 4. Deploy to Vercel (production)
vercel --prod

# 5. Seed RBAC data (pick one method)
#    Option A: via Vercel CLI
npx vercel run node lib/backend/rbac/seed-permissions.js
npx vercel run node lib/backend/rbac/seed-roles.js

#    Option B: locally against production DB
DATABASE_URL="<production-db-url>" node lib/backend/rbac/seed-permissions.js
DATABASE_URL="<production-db-url>" node lib/backend/rbac/seed-roles.js

# 6. Verify — open the deployed URL and log in
#    Create your first tenant via the UI
```

---

## 7. Vercel CLI Cheatsheet

| Command | Description |
|---|---|
| `vercel` | Preview deployment |
| `vercel --prod` | Production deployment |
| `vercel logs` | Tail production logs |
| `vercel logs <deployment-url>` | Tail logs for a specific deployment |
| `vercel env ls` | List environment variables |
| `vercel env add DATABASE_URL production` | Add an env var for production |
| `vercel run <command>` | Run a script in the Vercel environment |
| `vercel pull` | Pull environment variables to local `.vercel` |
| `vercel rollback` | Rollback to the previous deployment |

---

## 8. Troubleshooting

### "Cannot find module '.prisma/client/default'" during build

Make sure `pnpm install` runs the `postinstall` hook (it calls `prisma generate`).
If the build fails on Vercel, verify:
- `prisma` is in `devDependencies`
- `@prisma/client` is in `dependencies`
- The `postinstall` script exists: `"postinstall": "prisma generate"`

### "FATAL: too many connections" from PostgreSQL

Vercel serverless functions can open many concurrent database connections.
**Solution:** Use a **pooled** connection string with PgBouncer.
- In Neon: use the pooled connection string (ends with `?pgbouncer=true`)
- Add `?connection_limit=1` to the DATABASE_URL
- Or use Prisma's `connection_limit` setting in the datasource

### Build succeeds but deployments fail

Check `vercel logs` for runtime errors. Common issues:
- Missing env vars (e.g., `JWT_SECRET` not set)
- Database connection fails
- GCS service account file missing

### "Relation 'permissions' doesn't exist"

The database tables exist but haven't been seeded yet. Run the seed scripts from section 5.

### Slow cold starts on Vercel

- Next.js ISR/SSG pages help, but API routes are serverless
- Use Vercel's Edge Functions for latency-sensitive routes
- Upgrade from Hobby to Pro plan for longer execution timeouts

---

## 9. CI/CD Configuration (GitHub Integration)

Vercel auto-deploys on push to `main`. To add pre-deploy checks:

1. Go to your Vercel project → Settings → Git
2. Under **Ignored Build Step**, you can add: `bash [[ $(git log -1 --pretty=%B) == *"[skip vercel]"* ]] && exit 0 || exit 1`
3. For PR previews, make sure **Build Comments** are enabled

---

## 10. Recommendations

1. **Database**: Use a Neon pooled connection string for `DATABASE_URL` and keep a separate `DIRECT_URL` for migrations
2. **Seeds**: Consider wiring `seed-permissions.js` into Next.js's [`instrumentation.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation) so it auto-runs on app startup
3. **File Storage**: Swap GCS for `@vercel/blob` to avoid managing service account keys in env vars
4. **Monitoring**: Enable Vercel Analytics (`@vercel/analytics` is already in your `package.json`)
5. **Prod Params**: Create a `.env.production` file to test production config locally before deploying

---

_Last updated: 28 July 2026_