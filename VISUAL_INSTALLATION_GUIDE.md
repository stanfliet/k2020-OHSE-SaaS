# 📋 Backend Installation & Startup - Visual Guide

## 🎯 The Goal

Get backend server running so you can:
- ✅ Test locally
- ✅ Develop new features  
- ✅ Connect frontend to backend
- ✅ Deploy to production

---

## 🔧 What to Do NOW

### Step 1️⃣: Install Packages (First Time Only)

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm install
```

**Wait 5-10 minutes for completion...**

**You'll see:**
```
added 150 packages
npm WARN ... (warnings OK)
```

✅ When done: `node_modules` folder created (~500MB)

---

### Step 2️⃣: Verify Installation

```bash
npm list --depth=0
```

**You should see all packages listed:**
```
k2020-ohse-backend@1.0.0
├── express@4.21.2              ✓
├── @supabase/supabase-js@2.49.8 ✓
├── dotenv@16.5.0               ✓
├── typescript@5.8.2            ✓
└── ... (9 more packages)       ✓
```

✅ All 13 packages present = Install successful

---

### Step 3️⃣: Start Backend Server

```bash
npm start
```

**You should see:**
```
Environment: production
Production Mode: true
[RBAC] Initializing Supabase client with URL: https://qvvmuxwwdishi...
Allowed CORS origins: Set(3) {...}
Backend server running on port 5000
```

✅ "Backend server running" = Success! Keep this terminal open.

---

### Step 4️⃣: Test Backend (New Terminal)

Open another terminal and run:

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{"status": "ok", "environment": "production"}
```

✅ Got JSON response = Backend working!

---

### Step 5️⃣: Start Frontend (New Terminal)

In a third terminal:

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\frontend
npm run dev
```

**You should see:**
```
VITE v5.0.0
Local: http://localhost:5173/
```

✅ Frontend server running = Ready to test

---

### Step 6️⃣: Test in Browser

Visit: **http://localhost:5173**

You should see:
- 🔒 Login/Signup page
- 📧 Email input
- 🔐 Password input
- ➕ Sign Up button
- ✅ Login button

✅ Page loads without errors = Frontend working!

---

### Step 7️⃣: Test Full Flow

1. Click **"Sign Up"**
2. Enter:
   - Email: `test@example.com`
   - Password: `Test@1234`
3. Click **"Sign Up"** button
4. Wait for redirect...
5. You should see **Dashboard**

✅ Got Dashboard = Full integration working!

---

## 📊 Terminal Setup

You'll need **3 terminals running side-by-side:**

```
┌─ Terminal 1: Backend ─────────────────┐
│ cd backend                            │
│ npm start                             │
│ (keeps running)                       │
│ Shows: "Backend server running..."    │
└───────────────────────────────────────┘

┌─ Terminal 2: Frontend ────────────────┐
│ cd frontend                           │
│ npm run dev                           │
│ (keeps running)                       │
│ Shows: "Local: http://localhost:5173" │
└───────────────────────────────────────┘

┌─ Terminal 3: Testing ─────────────────┐
│ curl http://localhost:3000/api/health │
│ (run commands/tests here)             │
└───────────────────────────────────────┘
```

---

## ✅ Success Checklist

| Item | Check | Status |
|------|-------|--------|
| npm install completes | No errors | ⏳ Do this |
| node_modules created | Folder exists (~500MB) | ⏳ Do this |
| npm list shows all packages | 13 packages | ⏳ Do this |
| npm start succeeds | "Backend server running" | ⏳ Do this |
| /health endpoint responds | Returns JSON | ⏳ Do this |
| Frontend starts | "Local: http://..." | ⏳ Do this |
| Browser loads login page | No JS errors | ⏳ Do this |
| Signup/Login works | Redirects to Dashboard | ⏳ Do this |

---

## 🚨 Common Errors & Fixes

### ❌ "npm: command not found"
```
→ Install Node.js from https://nodejs.org
```

### ❌ "supabaseUrl is required"
```
→ Check .env file has SUPABASE_URL
→ Run: npm start again
```

### ❌ "Cannot find module X"
```
→ Run: npm install
→ Run: npm start
```

### ❌ "Port 3000 already in use"
```
→ Change PORT in .env to 3001
→ Run: npm start
```

### ❌ "EACCES: permission denied"
```
→ Run terminal as Administrator
```

---

## 🎬 Full Command Sequence (Copy-Paste)

```bash
# Terminal 1: Install & Run Backend
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm install
# Wait 5-10 minutes...
npm start
# Leaves this terminal running

# Terminal 2: Start Frontend
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\frontend
npm run dev
# Leaves this terminal running

# Terminal 3: Test Backend
curl http://localhost:3000/api/health

# Then open browser:
http://localhost:5173
```

---

## 📈 What Happens Behind Scenes

```
npm install
    ↓
Downloads packages from npm registry
    ↓
Installs to node_modules/ (~500MB)
    ↓
Creates package-lock.json
    ↓
Ready to run!

npm start
    ↓
Loads index.ts
    ↓
dotenv.config() loads env vars
    ↓
Imports all modules (rbac, routes, etc.)
    ↓
Starts Express server on :5000
    ↓
Ready to receive requests!
```

---

## 📝 Files Involved

### Before Installation
```
backend/
├── package.json          ← Lists packages to install
├── .env                  ← Credentials
├── index.ts              ← Main server code
├── rbac.ts               ← Auth (FIXED!)
├── routes.ts             ← API endpoints
└── tsconfig.json         ← TypeScript config
```

### After `npm install`
```
backend/
├── node_modules/         ← NEW! All packages here
│   ├── express/
│   ├── @supabase/
│   ├── typescript/
│   └── ...
├── package-lock.json     ← NEW! Version lock file
└── ... (same as before)
```

---

## 🎯 Next Steps After Success

### After Local Testing Works ✅

1. **Commit to GitHub:**
   ```bash
   git add .
   git commit -m "deps: install node modules; fix: lazy Supabase init"
   git push origin main
   ```

2. **Deploy to Production:**
   - Follow: `FINAL_DEPLOYMENT_CHECKLIST.md`
   - Deploy backend to Render
   - Deploy frontend to Vercel
   - Go live! 🚀

---

## 🏁 Summary

**Install time:** 5-10 minutes  
**Setup time:** 5 minutes  
**Testing time:** 5 minutes  
**Total:** ~20 minutes

**You get:**
✅ Working backend server  
✅ Working frontend dev server  
✅ Verified full integration  
✅ Ready for deployment  

---

## 🚀 Ready?

**Start here:**
```bash
cd backend && npm install
```

Then come back here and follow steps 2-7.

Good luck! 💪
