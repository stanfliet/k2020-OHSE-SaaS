# 🚀 Quick Action - Fix Everything in 10 Minutes

## ⚡ DO THIS NOW:

### Step 1: Open Browser Console (F12)
Press `F12` → Click **Console** tab → Paste this:

```javascript
// Quick diagnostic
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0,20) + "...");

// Test connection
fetch(import.meta.env.VITE_SUPABASE_URL)
  .then(r => console.log("✅ Supabase connected!"))
  .catch(e => console.log("❌ Supabase error:", e.message));
```

### Step 2: What You'll See:

**If ✅ Shows "Supabase connected!":**
→ Go to **Step 3A**

**If ❌ Shows "Failed to fetch":**
→ Go to **Step 3B**

---

## 3A: If Supabase IS Connected ✅

This means signup UI issue. Try this:

1. Open the signup form
2. Enter test data:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `Test1234`
   - Confirm: `Test1234`
3. Click "Sign Up"
4. Check console for error message
5. **Share the error message** → I can fix it

---

## 3B: If Supabase NOT Connected ❌

**Problem**: Invalid Supabase URL or credentials

**Quick Fix:**

1. Go to https://supabase.com/dashboard
2. Select your project: `vyyszzbyqfwzxvqfegdj`
3. Go to Settings > API
4. Copy exact values:
   - **Project URL** (starts with `https://`)
   - **Anon Key** (starts with `eyJ` or `sb_publishable`)

5. Edit `frontend/.env`:
```
VITE_SUPABASE_URL=[PASTE_PROJECT_URL_HERE]
VITE_SUPABASE_ANON_KEY=[PASTE_ANON_KEY_HERE]
```

6. Save file
7. Restart frontend server:
   - Press `Ctrl+C` in frontend terminal
   - Run: `npm run dev`
8. Refresh browser: `Ctrl+Shift+R`
9. Go back to **Step 1**

---

## GitHub Push Fix (When Ready)

```bash
# Create token: https://github.com/settings/tokens
# Select scopes: repo

# Then run:
git config user.name "Michael Stanfliet"
git config user.email "hambaniks@gmail.com"

# Option A: Using token (simpler)
git remote set-url origin "https://USERNAME:ghp_TOKEN@github.com/stanfliet/k2020-OHSE-SAAS.git"

# Then:
git add .
git commit -m "fix: complete signup and deployment setup"
git push origin main
```

---

## Vercel Fix (After GitHub works)

1. Go to https://vercel.com/dashboard
2. Find your project `k2020-ohse`
3. Click **Settings** > **Build & Development**
4. Change to:
   - Root Directory: `/` (empty)
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
5. Click **Save**
6. Click **Deployments** > Select last deployment > Click **Redeploy**

---

## 🎯 Status Check

Run this in browser console to get current status:

```javascript
const status = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKeySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  apiUrl: import.meta.env.VITE_API_URL,
  nodeEnv: import.meta.env.NODE_ENV
};
console.table(status);
```

---

## 💬 When to Ask for Help:

After doing Steps 1-3, if still not working, provide:
1. Browser console error message (copy-paste it)
2. Result from status check above
3. Screenshot of signup form

Then I can debug faster!

---

## ✅ Success Indicators:

- ✅ Signup form displays
- ✅ Can enter credentials
- ✅ "Sign Up" button click works
- ✅ Success message OR clear error message (not "Failed to fetch")

---

**Do Step 1 RIGHT NOW → Tell me what you see! 👇**
