# Vercel Environment Setup for Development + Production

## Important: .env Files Are LOCAL ONLY! ❌ Do NOT Upload

Your `.env.development` and `.env.production` files:
- ✅ Exist on YOUR computer
- ✅ Used by `npm run dev` and `npm run build` locally
- ❌ Should NOT be committed to GitHub
- ❌ Should NOT be added to Vercel
- ❌ Not needed on Vercel

**Why?** Vercel has its own environment variable system in the dashboard!

---

## Vercel's Environment Variable System ✅

### Step 1: Add Variables to Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

```
VITE_SUPABASE_URL = https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL = https://k2020-ohse-backend.onrender.com/api
VITE_NODE_ENV = production
VITE_APP_NAME = K2020 OHSE SaaS
VITE_APP_VERSION = 1.0.0
```

### Step 2: Set Environment for Each Variable

For each variable, select which environment it applies to:

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `VITE_API_URL` | ✅ `https://k2020-ohse-backend.onrender.com/api` | ✅ `https://k2020-ohse-backend.onrender.com/api` | ❌ Leave empty |
| `VITE_NODE_ENV` | ✅ `production` | ✅ `production` | ❌ Leave empty |
| `VITE_SUPABASE_URL` | ✅ | ✅ | ❌ |
| `VITE_SUPABASE_ANON_KEY` | ✅ | ✅ | ❌ |

**Why unchecked for Development?**
- Development uses your local `.env.development` file
- Vercel doesn't handle your local machine

---

## The Three Deployment Types on Vercel

### 1. **Production** (Main Deployment)
- **Triggered by:** Push to `main` branch
- **URL:** `https://k2020-ohse-s.vercel.app`
- **Environment Variables:** Production ones from dashboard
- **Uses:** `VITE_API_URL=https://k2020-ohse-backend.onrender.com/api`
- **Status:** Live for end users

### 2. **Preview** (Auto-created for Pull Requests)
- **Triggered by:** Open a PR to `main`
- **URL:** `https://pr-XXX---k2020-ohse-s.vercel.app`
- **Environment Variables:** Preview ones from dashboard
- **Uses:** `VITE_API_URL=https://k2020-ohse-backend.onrender.com/api`
- **Status:** Testing URL, auto-deleted when PR closes

### 3. **Development** (Your Local Computer)
- **Triggered by:** You type `npm run dev`
- **URL:** `http://localhost:5173`
- **Environment Variables:** Your local `.env.development`
- **Uses:** `VITE_API_URL=http://localhost:5000/api`
- **Status:** Only you can access it

---

## Recommended Workflow

### For Continuous Development + Production

```
YOUR LOCAL MACHINE (Development)
├─ npm run dev              → Uses .env.development
├─ Test features locally
├─ git add, commit, push
│
└─ Push to GitHub (develop or feature branch)
   │
   ├─ Vercel creates Preview deployment ✅
   │  (Tests the build process)
   │  URL: https://pr-XXX---k2020-ohse-s.vercel.app
   │
   └─ Open Pull Request to main
      │
      ├─ Code review
      ├─ Run PR checks
      │
      └─ Merge to main
         │
         └─ Vercel deploys to Production ✅
            URL: https://k2020-ohse-s.vercel.app
```

---

## Step-by-Step Setup

### Step 1: GitHub Branches Setup

```bash
# Your local branches
main    # Production branch (live)
develop # Development branch (staging)
```

### Step 2: Configure Vercel Dashboard

**Project Settings → Connected Git Repository**
- Production Branch: `main`
- Preview Deployments: Enabled for all branches/PRs

### Step 3: Add Environment Variables to Vercel

Go to: **Settings → Environment Variables**

#### For Production + Preview:
```
Name: VITE_API_URL
Value: https://k2020-ohse-backend.onrender.com/api
Environments: ✅ Production  ✅ Preview  ❌ Development
```

Repeat for all `VITE_*` variables

#### For Local Development:
Keep `.env.development` on your computer (don't commit it)

### Step 4: Don't Commit .env Files

**File: `.gitignore`**
```
# Environment files (local only)
.env
.env.local
.env.development
.env.production
.env.*.local
```

Already done? Check with:
```bash
git status
# Should NOT show .env files
```

---

## Your Complete Setup

### Local Development (Your Computer)

**File: `frontend/.env.development`** (In .gitignore - not committed)
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0
```

Run locally:
```bash
npm run dev
# Uses .env.development
# Frontend: http://localhost:5173
# Backend: http://localhost:5000 (your local backend)
```

### Preview Deployment (PR Testing)

**Vercel Dashboard Environment Variables:**
```
VITE_API_URL = https://k2020-ohse-backend.onrender.com/api
VITE_NODE_ENV = production
(all other VITE_* vars)
```

When you push to GitHub → Vercel auto-builds → Creates PR preview URL

### Production Deployment (Live)

**Vercel Dashboard (Same as Preview):**
```
VITE_API_URL = https://k2020-ohse-backend.onrender.com/api
VITE_NODE_ENV = production
(all other VITE_* vars)
```

When you merge to `main` → Vercel auto-deploys → Updates production URL

---

## Development Workflow Examples

### Example 1: Fix a Bug

```bash
# 1. Update code locally
# 2. Test with: npm run dev
# 3. Commit and push to develop branch
git add .
git commit -m "fix: login page styling"
git push origin develop

# 4. Open PR in GitHub (develop → main)
# 5. Vercel auto-creates preview URL
# 6. Test the preview
# 7. Merge to main
# 8. Vercel auto-deploys to production (live!)
```

### Example 2: Add a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-module
# 2. Develop locally: npm run dev
# 3. Push to feature branch
git push origin feature/new-module
# 4. Open PR → Vercel creates preview
# 5. Test preview
# 6. Request review
# 7. Merge to develop (staging)
# 8. Later merge develop → main (go live)
```

### Example 3: Keep Developing While Production is Live

```bash
# Your production is live on main
# You want to add new features

# Create feature branch
git checkout -b feature/advanced-search
npm run dev  # Work locally with .env.development

# Push to GitHub
git push origin feature/advanced-search

# Open PR to develop (NOT main!)
# This creates a preview deployment
# Test the preview
# Merge to develop

# Later, when ready to release:
git checkout main
git merge develop
git push origin main
# Vercel auto-deploys to production!
```

---

## Vercel Dashboard Configuration

### Step 1: Go to Project Settings

1. Open Vercel Dashboard
2. Select your project: `k2020-ohse-s`
3. Go to: **Settings**

### Step 2: Navigate to Environment Variables

**Settings → Environment Variables**

### Step 3: Add Each Variable

Click "Add New" for each:

**Example: VITE_API_URL**
```
Name: VITE_API_URL
Value: https://k2020-ohse-backend.onrender.com/api

Environments (checkboxes):
☑ Production
☑ Preview
☐ Development
```

Click "Save"

### Step 4: Repeat for All Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_NAME
VITE_APP_VERSION
VITE_NODE_ENV
```

All should be checked for ✅ Production and ✅ Preview

### Step 5: Verify in Deployments

**Deployments tab** → Click a deployment → Should show all env vars loaded

---

## Managing Development Branches

### Recommended Git Structure

```
main
  ├─ Production deployment (live)
  ├─ Protected branch (require PR review)
  ├─ Auto-deploy on push
  │
develop
  ├─ Staging branch
  ├─ Testing ground
  ├─ Vercel creates preview
  │
feature/xyz
  ├─ Your feature branches
  ├─ Create from develop
  ├─ Vercel creates preview for each PR
```

### Branch Rules in GitHub

Go to: **Settings → Branches → Branch protection rules**

For `main` branch:
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

This ensures code is tested before deploying to production.

---

## Environmental Variable Hierarchy

### In Development (Your Computer)
1. `.env.development` file → Uses localhost URLs
2. `npm run dev` → Vite loads variables
3. Frontend can access via `import.meta.env`

### On Vercel (Production)
1. Vercel Dashboard → Environment Variables (Production)
2. When you push to `main` → Vercel build process starts
3. Vercel injects variables into build
4. Frontend bundle is created with variables hardcoded
5. Frontend deployed to `https://k2020-ohse-s.vercel.app`

### On Vercel (Preview)
1. Vercel Dashboard → Environment Variables (Preview)
2. When you create a PR → Vercel build process starts
3. Same as production, but different URL + preview settings
4. Test deployment created
5. Auto-deleted when PR closes

---

## Quick Reference

| Scenario | What to Do |
|----------|-----------|
| Developing locally | Use `npm run dev` with `.env.development` |
| Pushing code to GitHub | Don't commit `.env` files |
| Testing PR before merging | Use Vercel preview URL (auto-created) |
| Going live to production | Merge PR to `main` (Vercel auto-deploys) |
| Want to keep developing | Create new feature branch, work locally |
| Need preview of changes | Push to GitHub, Vercel creates preview URL |
| Need to change API URL | Update Vercel dashboard (not .env file) |
| Need local backend | Keep it running on `http://localhost:5000` |

---

## Common Mistakes to Avoid ❌

1. **Committing .env files to GitHub**
   - ❌ Don't do this
   - ✅ Add to `.gitignore`

2. **Uploading .env files to Vercel**
   - ❌ Vercel doesn't read .env files
   - ✅ Use Vercel Dashboard environment variables

3. **Using localhost URLs in Vercel**
   - ❌ Production can't reach `http://localhost:5000`
   - ✅ Use remote backend URL in Vercel env vars

4. **Same variables for development and production**
   - ❌ Frontend can't reach localhost from production
   - ✅ Use different URLs for each environment

5. **Forgetting to set Development env as unchecked**
   - ❌ Vercel doesn't affect your local machine
   - ✅ Only check Production + Preview

---

## Summary: Your Complete Setup ✅

### Local Development
- ✅ `.env.development` on your computer
- ✅ `npm run dev` uses it
- ✅ Not committed to GitHub

### Vercel Production
- ✅ Environment variables in Vercel Dashboard
- ✅ Auto-deploys when you push to `main`
- ✅ Uses remote backend URL

### Vercel Preview
- ✅ Same env vars as production (for now)
- ✅ Auto-created for each PR
- ✅ Tests your changes before merging

### Continuous Development
- ✅ Keep developing locally with `npm run dev`
- ✅ Production keeps running on `main`
- ✅ Use branches for new features
- ✅ Create PRs to merge features
- ✅ Vercel handles all deployments automatically

---

## Next Steps

1. ✅ Ensure `.env.development` and `.env.production` are in `.gitignore`
2. ✅ Go to Vercel Dashboard
3. ✅ Add environment variables (Settings → Environment Variables)
4. ✅ For each var: Check Production ✅ and Preview ✅, uncheck Development ❌
5. ✅ Save changes
6. ✅ Trigger a redeploy from Vercel dashboard
7. ✅ Test production URL

Then continue developing locally while your production deployment stays live! 🚀
