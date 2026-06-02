# Vercel Setup: Step-by-Step Visual Guide

## Do NOT Add .env Files to Vercel ❌

Your `.env.development` and `.env.production` files should:
- ✅ Stay on your computer
- ✅ Be in `.gitignore` (not committed)
- ❌ Never be uploaded to Vercel
- ❌ Never be added to GitHub

**Vercel has its own system!**

---

## Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com
2. Click: Your project → `k2020-ohse-s`
3. Go to: **Settings** (tab at top)

---

## Step 2: Find Environment Variables

1. In left sidebar → Click: **Environment Variables**
2. You should see empty list (or existing vars)

---

## Step 3: Add Variable

Click: **"Add New" or "New"**

### Example 1: VITE_API_URL

Fill in:
```
Name:  VITE_API_URL
Value: https://k2020-ohse-backend.onrender.com/api

Select Environments:
☑ Production
☑ Preview  
☐ Development
```

Click: **Save**

### Example 2: VITE_SUPABASE_URL

Fill in:
```
Name:  VITE_SUPABASE_URL
Value: https://qvvmuxwwdishyskheqnh.supabase.co

Select Environments:
☑ Production
☑ Preview
☐ Development
```

Click: **Save**

### Example 3: VITE_SUPABASE_ANON_KEY

Fill in:
```
Name:  VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Select Environments:
☑ Production
☑ Preview
☐ Development
```

Click: **Save**

### Example 4: VITE_NODE_ENV

Fill in:
```
Name:  VITE_NODE_ENV
Value: production

Select Environments:
☑ Production
☑ Preview
☐ Development
```

Click: **Save**

### Example 5: VITE_APP_NAME

Fill in:
```
Name:  VITE_APP_NAME
Value: K2020 OHSE SaaS

Select Environments:
☑ Production
☑ Preview
☐ Development
```

Click: **Save**

### Example 6: VITE_APP_VERSION

Fill in:
```
Name:  VITE_APP_VERSION
Value: 1.0.0

Select Environments:
☑ Production
☑ Preview
☐ Development
```

Click: **Save**

---

## Step 4: Trigger a Redeploy

1. Go to: **Deployments** tab
2. Find latest deployment
3. Click the **three dots** → **Redeploy**
4. Vercel will rebuild with new environment variables

---

## Step 5: Verify It Works

1. Wait for deployment to finish
2. Visit: https://k2020-ohse-s.vercel.app
3. Open browser **Console** (F12)
4. Type: `console.log(import.meta.env.VITE_API_URL)`
5. Should output: `https://k2020-ohse-backend.onrender.com/api`

✅ Success!

---

## Quick Reference Table

| Variable | Local Dev | Vercel Prod | Where? |
|----------|-----------|-----------|--------|
| `VITE_API_URL` | `http://localhost:5000/api` | `https://k2020-ohse-backend.onrender.com/api` | .env.dev file / Vercel dashboard |
| `VITE_NODE_ENV` | `development` | `production` | .env.dev file / Vercel dashboard |
| `VITE_SUPABASE_URL` | `https://qvvm...` | `https://qvvm...` | .env.dev file / Vercel dashboard |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | `eyJhbGc...` | .env.dev file / Vercel dashboard |

---

## Development Workflow

```
┌────────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL COMPUTER                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  npm run dev                                                   │
│  ├─ Reads .env.development                                    │
│  ├─ VITE_API_URL = http://localhost:5000/api                  │
│  ├─ Frontend on: http://localhost:5173                        │
│  └─ Backend on: http://localhost:5000 (your local backend)   │
│                                                                │
│  ✅ Edit code, test, repeat                                   │
│                                                                │
│  git add . && git commit && git push                           │
│  ├─ Push to: GitHub (develop or main branch)                  │
│  └─ .env.development is NOT committed (in .gitignore)        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  git push → main branch                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                   VERCEL DEPLOYMENT                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Webhook triggered                                             │
│  ├─ Vercel builds frontend                                    │
│  ├─ Reads Environment Variables from Dashboard                │
│  │  ├─ VITE_API_URL = https://k2020-ohse-backend...          │
│  │  ├─ VITE_NODE_ENV = production                             │
│  │  └─ etc                                                     │
│  ├─ Hardcodes these into JavaScript bundle                    │
│  ├─ Deploys to: https://k2020-ohse-s.vercel.app              │
│  └─ ✅ Live for all users!                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Files on Your Computer vs Vercel

### Your Computer (`C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS`)
```
frontend/
├─ .env.development          ← Your local dev config (in .gitignore)
├─ .env.production          ← NOT USED by local dev (for reference)
├─ src/
│  └─ lib/
│     └─ api.ts             ← Reads VITE_API_URL
└─ package.json
```

### Vercel (Cloud)
```
No .env files!

Instead uses:
Dashboard → Settings → Environment Variables
├─ VITE_API_URL: https://k2020-ohse-backend.onrender.com/api
├─ VITE_NODE_ENV: production
├─ VITE_SUPABASE_URL: https://...
└─ etc
```

---

## Why This Structure?

| Component | Why? | Location |
|-----------|------|----------|
| `.env.development` | Local testing with localhost | Your computer |
| `.env.production` | Reference for Vercel settings | Your computer (reference only) |
| Vercel Env Vars | Production settings | Vercel Dashboard (for real) |
| `.gitignore` | Don't commit secrets | GitHub |

---

## The Golden Rule ✅

**Your .env files = Local only**
**Vercel Dashboard = Production only**

They should NEVER overlap or interfere with each other!

---

## Continuous Development + Live Production

### You can have:
1. ✅ Production running live on `https://k2020-ohse-s.vercel.app`
2. ✅ Keep developing locally with `npm run dev`
3. ✅ Push new features without stopping production
4. ✅ Use GitHub branches to organize work
5. ✅ Create PR previews for testing
6. ✅ Merge to `main` only when ready
7. ✅ Vercel auto-deploys to production

### Example Workflow:

```
Day 1:
└─ Production is live on main branch
└─ Users can use the app

Day 1 Evening:
└─ You create feature branch: git checkout -b feature/new-module
└─ You develop: npm run dev
└─ You commit and push: git push origin feature/new-module
└─ Production still running (unaffected)
└─ Vercel creates preview URL for testing

Day 2:
└─ You merge feature → main
└─ Vercel auto-deploys to production
└─ Production is updated with new feature
└─ Users get the new feature automatically

Day 2 Afternoon:
└─ You create another feature branch
└─ Cycle repeats...
└─ Production keeps running the whole time!
```

---

## Troubleshooting

### Issue: Frontend Can't Reach Backend on Vercel

**Check 1:** Browser console
```javascript
console.log(import.meta.env.VITE_API_URL)
// Should show: https://k2020-ohse-backend.onrender.com/api
// NOT: http://localhost:5000/api
```

**Check 2:** Vercel Dashboard
```
Settings → Environment Variables → VITE_API_URL
Should show: https://k2020-ohse-backend.onrender.com/api
```

**Check 3:** Backend is Running
```
Curl or browser:
https://k2020-ohse-backend.onrender.com/api/health
Should respond with JSON
```

**Fix:** Update Vercel env var and redeploy

### Issue: Using Old Values

**Solution:** 
1. Go to Vercel Dashboard
2. Click **Deployments**
3. Find latest
4. Click **Redeploy**
5. Wait for build to complete
6. Hard refresh browser (Ctrl+Shift+R)

---

## Summary

✅ **Don't add .env files to Vercel**
✅ **Use Vercel Dashboard for environment variables**
✅ **Check Production ✅ and Preview ✅, uncheck Development ❌**
✅ **Use branches for development**
✅ **Keep production running while developing**
✅ **Test with preview deployments before merging**

You're all set! 🚀
