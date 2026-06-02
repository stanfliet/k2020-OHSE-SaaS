# Vercel Production Deployment Checklist

## The Short Answer ❌➡️✅

**DO NOT add .env files to Vercel**

Instead:
1. Keep `.env.development` and `.env.production` on YOUR computer
2. Add them to `.gitignore` (don't commit)
3. Use Vercel Dashboard → Settings → Environment Variables
4. Add the variables there (Vercel will use them at build time)

---

## Pre-Deployment Checklist

### Local Development ✅
- [ ] `.env.development` exists and has correct values
- [ ] `.env.development` is in `.gitignore`
- [ ] `npm run dev` works locally
- [ ] Backend runs on `http://localhost:5000`
- [ ] Frontend loads on `http://localhost:5173`
- [ ] Can login and create projects

### Git Setup ✅
- [ ] `.gitignore` includes `.env*` files
- [ ] No `.env` files in git history
- ```bash
     git status  # Should not show .env files
     ```
- [ ] Main branch is production-ready
- [ ] Code is committed and pushed

### Backend (Render) ✅
- [ ] Backend deployed to Render
- [ ] Get your Render URL: `https://k2020-ohse-backend-xxx.onrender.com`
- [ ] Backend is running
- [ ] Test with: `curl https://k2020-ohse-backend-xxx.onrender.com/api/health`

### Update `.env.production` (Reference)
```env
VITE_API_URL=https://k2020-ohse-backend-xxx.onrender.com/api
VITE_NODE_ENV=production
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0
```

---

## Vercel Setup (5 Minutes)

### Step 1: Go to Vercel
- Open: https://vercel.com
- Select project: `k2020-ohse-s`
- Click: **Settings** tab

### Step 2: Click Environment Variables
- Left sidebar → **Environment Variables**

### Step 3: Add Variables (6 total)

**Variable 1:**
```
Name:  VITE_API_URL
Value: https://k2020-ohse-backend-xxx.onrender.com/api
Env:   ✅ Production  ✅ Preview  ❌ Development
```

**Variable 2:**
```
Name:  VITE_SUPABASE_URL
Value: https://qvvmuxwwdishyskheqnh.supabase.co
Env:   ✅ Production  ✅ Preview  ❌ Development
```

**Variable 3:**
```
Name:  VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Env:   ✅ Production  ✅ Preview  ❌ Development
```

**Variable 4:**
```
Name:  VITE_NODE_ENV
Value: production
Env:   ✅ Production  ✅ Preview  ❌ Development
```

**Variable 5:**
```
Name:  VITE_APP_NAME
Value: K2020 OHSE SaaS
Env:   ✅ Production  ✅ Preview  ❌ Development
```

**Variable 6:**
```
Name:  VITE_APP_VERSION
Value: 1.0.0
Env:   ✅ Production  ✅ Preview  ❌ Development
```

### Step 4: Redeploy
- Go to: **Deployments** tab
- Find latest deployment
- Click **...** → **Redeploy**
- Wait for build to complete (2-3 min)

### Step 5: Verify
- Visit: `https://k2020-ohse-s.vercel.app`
- Open browser console (F12)
- Type: `import.meta.env.VITE_API_URL`
- Should show: `https://k2020-ohse-backend-xxx.onrender.com/api` ✅

---

## Continuous Development Setup

### Keep Production Live + Keep Developing

```bash
# Your local development
npm run dev
# Uses .env.development
# Frontend: http://localhost:5173
# Backend: http://localhost:5000

# Production keeps running
# User traffic → https://k2020-ohse-s.vercel.app

# You can work on new features without stopping production!
```

### Using Git Branches

```bash
# Main branch = Production
git checkout main
git push origin main
# → Vercel auto-deploys

# Develop branch = Staging
git checkout -b develop
git push origin develop
# → Vercel creates preview

# Feature branches = Isolated work
git checkout -b feature/my-feature
npm run dev    # Develop locally
git push origin feature/my-feature
# → Open PR to develop
# → Vercel creates preview
# → Test it
# → Merge to develop
# → Later merge develop → main for production
```

---

## File Structure Reminder

### Your Computer
```
frontend/
├─ .env.development         ← Localhost config (DO NOT COMMIT)
├─ .env.production         ← Reference for Vercel (DO NOT COMMIT)
├─ .gitignore             ← Should include: .env* 
└─ src/...
```

### Vercel (No files needed!)
```
Settings → Environment Variables
├─ VITE_API_URL → https://k2020-ohse-backend-xxx.onrender.com/api
├─ VITE_SUPABASE_URL → https://...
├─ VITE_NODE_ENV → production
└─ etc
```

### GitHub (Only source code)
```
main branch
├─ src/
├─ package.json
├─ .gitignore          ← Should exclude .env files
└─ .env files NOT here ✅
```

---

## Common Questions Answered

### Q: Do I upload .env files to Vercel?
**A:** ❌ No! Use the Vercel Dashboard instead.

### Q: Can I keep developing while production is live?
**A:** ✅ Yes! Use git branches and feature flags.

### Q: How does Vercel know my API URL?
**A:** Through Environment Variables in the Dashboard (not .env files).

### Q: What if I need to change the API URL?
**A:** 
1. Update Vercel Dashboard
2. Go to Deployments
3. Click Redeploy
4. Vercel rebuilds with new URL

### Q: Do I commit .env.production to GitHub?
**A:** ❌ No, it should be in .gitignore. It's just for reference locally.

### Q: What's the difference between .env.development and .env.production?
**A:** 
- `.env.development` → Used locally with `npm run dev` (localhost URLs)
- `.env.production` → Reference only (for what to put in Vercel Dashboard)

### Q: How do preview deployments work?
**A:** 
- You open PR → Vercel auto-creates PR preview URL
- Uses same env vars as production
- Test before merging
- PR merged → Production updated

---

## Quick Deploy Process

### First Time Deploy to Vercel

1. **Vercel Project Already Connected?**
   ```bash
   # If yes, skip to step 2
   # If no, go to vercel.com, connect your GitHub repo
   ```

2. **Add Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add all 6 `VITE_*` variables
   - Save each one

3. **Redeploy**
   - Deployments tab → Latest → Redeploy
   - Wait 2-3 minutes

4. **Test**
   - Visit `https://k2020-ohse-s.vercel.app`
   - Check env vars in console
   - Test login

### Subsequent Deploys

```bash
# Make changes locally
npm run dev  # Test locally

# Commit and push
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel auto-deploys
# No manual action needed!
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Frontend shows "Cannot reach backend" | Check VITE_API_URL in Vercel env vars |
| Using old API URL | Go to Deployments → Redeploy |
| Changes not showing up | Hard refresh: Ctrl+Shift+R |
| Build failing | Check Vercel Deployments → Build logs |
| CORS errors | Check backend CORS_ORIGIN_PROD in .env |

---

## You're Ready! 🚀

**Your Setup:**
- ✅ Local development with `.env.development`
- ✅ Production on Vercel with Dashboard env vars
- ✅ Backend on Render
- ✅ Continuous development possible
- ✅ Production stays live while you work
- ✅ Auto-deployments when you push

**Next Steps:**
1. Update Vercel environment variables (5 min)
2. Redeploy on Vercel
3. Test production URL
4. Keep developing locally!

Done! 🎉
