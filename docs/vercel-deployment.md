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
| Run first migration against the cloud DB | `npx prisma migrate deploy` | Only needed once for **brand new** databases (see 3.3) |
| Set all environment variables in Vercel | See section 4 below | At minimum `DATABASE_URL` and `JWT_SECRET` |
| Deploy to Vercel | `git push` or `vercel --prod` | Everything else is automatic (see section 5) |

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

# Run migrations to create all tables
npx prisma generate
npx prisma migrate deploy
```

> **After running migrations once**, future deploys will auto-apply pending migrations via the build script (see section 5).

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

> **The build command already includes `prisma migrate deploy`** (see `package.json`), so database migrations run automatically on every deploy.

### 4.2 Environment Variables (Set in Vercel Dashboard)

Go to **Project → Settings → Environment Variables** and add:

| Variable | Required? | Example / Notes |
|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/db?sslmode=require` (use Neon pooled URL for serverless) |
| `JWT_SECRET` | **Yes** | A long random string, e.g. `openssl rand -hex 64` |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | `/api` (since the frontend and API live in the same Next.js app) |
| `NEXT_PUBLIC_HOST_TYPE` | **Yes** | `tenant` or `company` based on your deployment model |
| `LOG_LEVEL` | No | `info` (default), `warn`, `error`, `debug` |
| `GOOGLE_CLOUD_PROJECT_ID` | Only if using GCS | Your GCP project ID |
| `GCS_BUCKET_NAME` | Only if using GCS | Bucket name for uploads (e.g., `school-management-uploads`) |
| `GCS_SERVICE_ACCOUNT_JSON` | **Yes** if using GCS in production | Base64-encoded service account JSON key (see section 4.4) |
| `GCS_SERVICE_ACCOUNT_PATH` | Only for local dev | Path to JSON key file (e.g., `./config/google-service-key.json`) |
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

### 4.4 Google Cloud Storage Setup for Vercel

Vercel's filesystem is **read-only**, so you can't reference a JSON key file by path. Instead, base64-encode the entire key and store it as `GCS_SERVICE_ACCOUNT_JSON`.

**Generate the base64 string:**

```bash
base64 -i config/google-service-key.json
# Copy the long output string
```

**Set in Vercel:**

Add `GCS_SERVICE_ACCOUNT_JSON` as the variable, and paste the base64 string.

The `lib/backend/lib/gcs-config.js` helper automatically detects whether `GCS_SERVICE_ACCOUNT_JSON` (base64, for production) or `GCS_SERVICE_ACCOUNT_PATH` (file, for local dev) is set and initializes the Storage client accordingly.

> **Security:** The key file (`config/google-service-key.json`) is now in `.gitignore` and untracked from Git. Never commit service account keys to version control. After this change, rotate the key in GCP since the old one was previously committed.

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

## 5. Automated Deployment Pipeline

Every deployment now runs the following sequence automatically:

```
git push / vercel --prod
  │
  ├─ 1. pnpm install
  │     └─ postinstall: prisma generate   (generates Prisma client from schema)
  │
  ├─ 2. pnpm build
  │     ├─ prisma migrate deploy           (applies pending migrations to the database)
  │     └─ next build                      (builds the Next.js app)
  │
  └─ 3. Server starts
        └─ instrumentation.ts fires
           └─ seedPermissions()            (upserts canonical permission catalog)
```

### What's Automated

| Task | How It Runs | When |
|---|---|---|
| **Prisma Client generation** | `postinstall` script | During `pnpm install` |
| **Database migrations** | `prisma migrate deploy` in `build` script | During every `pnpm build` |
| **Permission catalog seeding** | `instrumentation.ts` at startup | On every server boot (`next start`) |
| **Default roles + groups seeding** | `seedDefaultRoles()` in `tenant.service.js` | When a new tenant is onboarded |

### What You No Longer Need to Do Manually

- ❌ ~~Run `node lib/backend/rbac/seed-permissions.js` after deploy~~
- ❌ ~~Run `node lib/backend/rbac/seed-roles.js` after deploy~~
- ❌ ~~Run `npx prisma migrate deploy` before deploy~~

**Permissions** are seeded automatically when the server starts via `instrumentation.ts`.  
**Default roles** are created automatically whenever a tenant is onboarded via the UI.

> **One-time setup only:** On a brand new database, you still need to run `prisma migrate deploy` once manually to create all tables. After that, every deploy handles it.

---

## 6. Full Deployment Flow (Step by Step)

### First-Time Deploy

```bash
# 1. Install dependencies and generate Prisma Client
pnpm install

# 2. Set DATABASE_URL to your cloud database and run initial migrations
export DATABASE_URL="postgresql://user:pass@cloud-host:5432/db?sslmode=require"
npx prisma migrate deploy

# 3. Deploy to Vercel (production)
vercel --prod

# That's it. The server starts, permissions are seeded automatically.
# Visit the deployed URL and onboard your first tenant from the UI.
```

### Subsequent Deploys

```bash
# Just push or deploy — everything is automatic:
git push origin main
# or
vercel --prod
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
- In Neon: use the pooled connection string (host contains `-pooler`)
- Add `?connection_limit=1` to the DATABASE_URL
- Or use Prisma's `connection_limit` setting in the datasource

### Build succeeds but deployments fail

Check `vercel logs` for runtime errors. Common issues:
- Missing env vars (e.g., `JWT_SECRET` not set)
- Database connection fails
- GCS service account file missing
- `DATABASE_URL` is inaccessible (check if the Neon instance is running)

### "Relation 'permissions' doesn't exist"

This means the database tables haven't been migrated yet. Run `npx prisma migrate deploy` manually once against your cloud database. After that, the build script handles it automatically.

### Permissions not found warnings during tenant onboarding

Check the startup logs for `✅ RBAC: Seeded ... permissions`. If `seedPermissions()` failed silently, check:
- `DATABASE_URL` is accessible from the Vercel function
- The `Permission` table exists (migration ran successfully)
- The `instrumentation.ts` file is being bundled (check Vercel build logs)

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

1. **Database**: Use a Neon pooled connection string for `DATABASE_URL`. The same connection works for both serverless queries and `prisma migrate deploy` during builds.
2. **Seeds**: RBAC permissions seed automatically on startup via `instrumentation.ts` — no manual steps needed
3. **File Storage**: Swap GCS for `@vercel/blob` to avoid managing service account keys in env vars
4. **Monitoring**: Enable Vercel Analytics (`@vercel/analytics` is already in your `package.json`)
5. **Prod Params**: Create a `.env.production` file to test production config locally before deploying

---

_Last updated: 29 July 2026_