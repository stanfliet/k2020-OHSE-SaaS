# 🆘 Complete Troubleshooting & Fix Guide

## ⚠️ Current Issues:

1. ❌ Signup not working - "Failed to fetch" error
2. ❌ GitHub push permission denied (403 error)
3. ❌ Vercel deployment needs root directory fix
4. ❌ Git unrelated histories issue

---

## 🔧 ISSUE 1: Fix Signup - "Failed to fetch" Error

### Root Cause:
- Supabase URL is not resolving
- Network connectivity to Supabase

### Solution:

**Step 1: Verify Supabase Credentials**

Your current Supabase URL: `https://vyyszzbyqfwzxvqfegdj.supabase.co`
Your current Anon Key: `sb_publishable_J6iyLqnjx90Fmj-udtR_GA_SCKgnphD`

Test the URL in your browser:
```
https://vyyszzbyqfwzxvqfegdj.supabase.co
```

✅ **If it works:** Connection is fine, continue below
❌ **If it fails:** Project may be suspended or credentials invalid

**Step 2: Update .env Files with CORRECT Credentials**

In `frontend/.env`:
```env
VITE_SUPABASE_URL=https://vyyszzbyqfwzxvqfegdj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_J6iyLqnjx90Fmj-udtR_GA_SCKgnphD
VITE_API_URL=http://localhost:5000
NODE_ENV=development
```

In `backend/.env`:
```env
OPENAI_API_KEY=sk-your_actual_key_here
SUPABASE_URL=https://vyyszzbyqfwzxvqfegdj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_J6iyLqnjx90Fmj-udtR_GA_SCKgnphD
SUPABASE_SERVICE_KEY=your_service_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Step 3: Restart Both Servers**
```bash
# Terminal 1 - Kill old process
# Press Ctrl+C

# Restart backend
cd backend
npm start

# Terminal 2 - Kill old process
# Press Ctrl+C

# Restart frontend
cd frontend
npm run dev
```

**Step 4: Hard Refresh Browser**
```
Press: Ctrl + Shift + R
```

**Step 5: Try Signup Again**
- Fill in the form
- Click Sign Up
- Check browser console for errors

---

## 🔐 ISSUE 2: Fix GitHub Authentication (Permission 403)

### Root Cause:
- Git doesn't have proper credentials to push to repo
- GitHub account doesn't have access to the repository

### Solution A: Using GitHub Personal Access Token (Recommended)

**Step 1: Create Personal Access Token**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select "Personal access tokens (classic)"
4. Give it a name: "K2020-OHSE-Deploy"
5. Select scopes: `repo` (full control)
6. Click "Generate token"
7. **Copy the token** (looks like `ghp_xxxxxxx...`)

**Step 2: Configure Git with Token**
```bash
# Option A: Store token in Windows Credential Manager
# (Recommended - more secure)
# Run this in PowerShell:
$token = "ghp_your_token_here"
echo "https://YOUR_USERNAME:${token}@github.com" | git credential approve

# Option B: Update remote URL with token (simpler)
cd c:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS
git remote set-url origin "https://YOUR_USERNAME:ghp_your_token_here@github.com/stanfliet/k2020-OHSE-SAAS.git"

# Replace:
# - YOUR_USERNAME: your GitHub username
# - ghp_your_token_here: your personal access token
```

**Step 3: Test Push**
```bash
git push origin main
```

### Solution B: Using SSH (More Secure)

**Step 1: Generate SSH Key**
```bash
ssh-keygen -t ed25519 -C "hambaniks@gmail.com"
# Press Enter for default location
# Press Enter for no passphrase (or create one)
```

**Step 2: Add SSH Key to GitHub**
1. Go to https://github.com/settings/keys
2. Click "New SSH key"
3. Paste contents of: `C:\Users\k2020\.ssh\id_ed25519.pub`
4. Click "Add SSH key"

**Step 3: Update Git Remote**
```bash
cd c:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS
git remote set-url origin "git@github.com:stanfliet/k2020-OHSE-SAAS.git"
```

**Step 4: Test Push**
```bash
git push origin main
```

---

## 📦 ISSUE 3: Fix Vercel Deployment Root Directory

### Solution:

**Option 1: Use Root vercel.json** (Recommended)

1. In Vercel Dashboard, go to Project Settings
2. Under "Build & Development Settings"
3. Set **Root Directory**: `/` (leave empty or use `/`)
4. Set **Build Command**: `cd frontend && npm run build`
5. Set **Output Directory**: `frontend/dist`
6. Click Save
7. Redeploy

**Option 2: Move Frontend to Root**

```bash
# This requires restructuring (not recommended)
# Skip this if Option 1 works
```

---

## 🔀 ISSUE 4: Fix Git Unrelated Histories

If you get "refusing to merge unrelated histories" error:

```bash
# Force allow the merge
git pull origin main --allow-unrelated-histories

# If that fails, use:
git merge --allow-unrelated-histories origin/main

# Then push
git push origin main
```

---

## ✅ Complete Fix Checklist

### 1. Fix Supabase Connection
- [ ] Verify Supabase URL is accessible
- [ ] Confirm credentials in frontend/.env
- [ ] Confirm credentials in backend/.env
- [ ] Restart both servers
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Try signup again

### 2. Fix GitHub Push
- [ ] Create Personal Access Token on GitHub
- [ ] Update git remote with token OR setup SSH
- [ ] Test: `git push origin main`

### 3. Fix Vercel
- [ ] Update Vercel build settings
- [ ] Set root directory correctly
- [ ] Redeploy

### 4. Commit and Push
```bash
git add .
git commit -m "fix: supabase connection and deployment configuration"
git push origin main
```

---

## 🧪 Testing Commands

### Test Supabase Connection
```bash
# In browser console (F12):
fetch('https://vyyszzbyqfwzxvqfegdj.supabase.co')
  .then(r => console.log('✅ Connected'))
  .catch(e => console.log('❌ Error:', e))
```

### Test Git Configuration
```bash
git config -l | grep github
git remote -v
```

### Test API Connectivity
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"...","version":"1.0.0"}
```

---

## 📞 Quick Debugging

### "Failed to fetch" persists?
1. Check Supabase status: https://status.supabase.com
2. Try different network (if on VPN, disable it)
3. Check firewall/antivirus isn't blocking Supabase
4. Create NEW Supabase project if current one is broken

### GitHub still won't accept push?
1. Check you're using correct GitHub account (stanfliet)
2. Verify token hasn't expired
3. Try SSH instead of HTTPS
4. Check repository permissions

### Vercel build still failing?
1. Check build logs in Vercel dashboard
2. Ensure root directory setting is correct
3. Verify all environment variables are set
4. Try redeploying

---

## 🎯 Next Steps in Order:

1. **First**: Fix Supabase connection (takes 5 min)
   - Test signup works locally

2. **Second**: Fix GitHub authentication (takes 5 min)
   - Test `git push` works

3. **Third**: Fix Vercel build (takes 2 min)
   - Redeploy frontend

4. **Fourth**: Deploy backend to Render
   - Copy URL to frontend env

5. **Finally**: Test production signup
   - Commit and push

---

## 💡 Pro Tips:

- **Keep tokens secret**: Never commit tokens to Git
- **Use SSH for security**: More secure than tokens
- **Test locally first**: Always test locally before deploying
- **Check logs**: Always check error logs in browser/dashboard
- **Restart services**: Sometimes just restarting fixes issues

---

**Last Updated**: May 26, 2026
**Priority**: 🔴 URGENT - Fix Supabase first!
