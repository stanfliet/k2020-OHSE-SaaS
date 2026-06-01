# 🚀 GET BACKEND RUNNING: Step-by-Step Guide

## 🎯 YOUR CURRENT ERROR

```
Error: supabaseUrl is required.
```

**This means:** The backend can't connect to Supabase because `.env` file is missing or has incomplete credentials.

---

## ✅ SOLUTION: 5 MINUTES

### **Step 1: Create Supabase Project (2 min)**

1. Open https://supabase.com in browser
2. Click **Sign Up** (use GitHub for fastest setup)
3. Authorize with GitHub
4. Click **New Project**
5. Fill in:
   - **Organization:** Create new
   - **Project Name:** `K2020-OHSE-SaaS`
   - **Password:** Create strong password (you'll need this)
   - **Region:** Choose nearest to you (e.g., us-east-1)
   - **Pricing Plan:** Select **Free**
6. Click **Create new project**
7. **WAIT 2-3 MINUTES** for project to initialize

**You'll see a loading screen, this is normal. Wait!**

### **Step 2: Get Your Credentials (1 min)**

Once Supabase dashboard loads:

1. Click your project name (left side)
2. Click **Settings** (gear icon, bottom left)
3. Click **API** in left menu
4. You'll see credentials page with 3 important values:

```
┌─────────────────────────────────────────┐
│         YOUR CREDENTIALS HERE            │
├─────────────────────────────────────────┤
│ Project URL:                             │
│ https://YOUR_PROJECT_ID.supabase.co     │
│                                         │
│ Anon public key:                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │
│ (very long string)                      │
│                                         │
│ Service role secret:                    │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │
│ (very long string)                      │
└─────────────────────────────────────────┘
```

**COPY these exact values!** (Highlight → Ctrl+C)

### **Step 3: Update .env File (1 min)**

Open `backend/.env` in your text editor:

```
C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend\.env
```

Update these 3 lines with your actual Supabase credentials:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dm11eHd3ZGlzaHlza2hlcW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTE3ODUsImV4cCI6MjA5NTIyNzc4NX0.PASTE_YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dm11eHd3ZGlzaHlza2hlcW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY1MTc4NSwiZXhwIjoyMDk1MjI3Nzg1fQ.PASTE_YOUR_SERVICE_ROLE_KEY_HERE
```

**Example (with real values):**
```env
SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dm11eHd3ZGlzaHlza2hlcW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTE3ODUsImV4cCI6MjA5NTIyNzc4NX0.ACTUAL_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dm11eHd3ZGlzaHlza2hlcW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY1MTc4NSwiZXhwIjoyMDk1MjI3Nzg1fQ.ACTUAL_SERVICE_ROLE
```

**Save the file** (Ctrl+S)

### **Step 4: Deploy Database Schema (1 min)**

Now you need to create the database tables in Supabase:

1. Go back to Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query** button
4. In Supabase, you'll see empty SQL editor
5. Open `supabase/schema.sql` from the project
6. Select all content (Ctrl+A)
7. Copy (Ctrl+C)
8. Go back to Supabase SQL Editor
9. Paste (Ctrl+V) into the editor
10. Click blue **Run** button (top right)
11. **Wait for it to complete** (should show no errors)

**You should see:**
```
✅ All 21 tables created successfully
```

### **Step 5: Test Backend Start (1 min)**

Open command prompt and run:

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm start
```

**If successful, you'll see:**
```
✅ Backend server running on port 3000
✅ Connected to Supabase
✅ All routes initialized successfully
```

**If you get an error, check:**
- [ ] SUPABASE_URL is in .env and starts with https://
- [ ] SUPABASE_ANON_KEY is in .env (very long string)
- [ ] SUPABASE_SERVICE_ROLE_KEY is in .env (very long string)
- [ ] No spaces before/after the values
- [ ] Supabase project fully initialized (wait 2-3 min after creating)

---

## 🔧 ALSO UPDATE FRONTEND .env

While backend is running, open another terminal:

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\frontend
```

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000
```

**Use SAME Supabase URL and ANON_KEY from backend**

Then run:
```bash
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

---

## ✅ TEST BOTH ARE WORKING

1. **Backend:** Still running in first terminal
   ```
   ✅ Backend server running on port 3000
   ```

2. **Frontend:** Running in second terminal
   ```
   ✅ Local: http://localhost:5173/
   ```

3. **Browser:** Open http://localhost:5173
   - Should load the app
   - Should NOT show errors in console
   - Can try to signup/login

---

## 🎯 WHAT'S NEXT

Once both are running:

1. Test the app locally (signup, create project, upload document)
2. Commit to GitHub: `git add . && git commit -m "fix: add supabase credentials"`
3. Deploy to Render (backend) - see FINAL_DEPLOYMENT_CHECKLIST.md
4. Deploy to Vercel (frontend)
5. Live! 🚀

---

## 🆘 TROUBLESHOOTING

### "supabaseUrl is required"
```
✗ Problem: SUPABASE_URL not in .env
✓ Solution: 
  1. Check backend/.env exists
  2. Check SUPABASE_URL line has a value
  3. Make sure it starts with https://
  4. Restart npm start
```

### "Invalid JWT" or "Invalid API Key"
```
✗ Problem: Key is wrong or incomplete
✓ Solution:
  1. Copy from Supabase again (Settings → API)
  2. Check entire key is copied (very long!)
  3. No spaces at beginning/end
  4. Save .env file
  5. Restart npm start
```

### "Connection refused" or "ECONNREFUSED"
```
✗ Problem: Supabase project not initialized
✓ Solution:
  1. Wait 2-3 minutes after creating project
  2. Check Supabase dashboard loads: https://supabase.com/dashboard
  3. Try again
```

### "Table does not exist"
```
✗ Problem: Schema.sql not run
✓ Solution:
  1. Go to Supabase SQL Editor
  2. Click New Query
  3. Paste schema.sql
  4. Click Run
  5. Verify no errors
  6. Restart backend
```

### "RLS violation"
```
✗ Problem: Database security policies not set
✓ Solution:
  1. Re-run schema.sql (it sets RLS policies)
  2. Make sure you run entire schema
  3. Check for errors in SQL output
```

### "CORS error" in frontend
```
✗ Problem: Backend not running or CORS not configured
✓ Solution:
  1. Make sure backend: npm start is running (port 3000)
  2. Check VITE_API_URL points to http://localhost:3000
  3. Check backend has CORS_ORIGIN=http://localhost:5173
  4. Restart both
```

---

## 📋 FINAL CHECKLIST

- [ ] Supabase account created
- [ ] Supabase project initialized (wait 2-3 min)
- [ ] Credentials copied from Supabase
- [ ] backend/.env updated with SUPABASE_URL
- [ ] backend/.env updated with SUPABASE_ANON_KEY
- [ ] backend/.env updated with SUPABASE_SERVICE_ROLE_KEY
- [ ] Schema.sql executed in Supabase SQL Editor
- [ ] 21 tables visible in Supabase Table Editor
- [ ] Backend starts: npm start ✅
- [ ] frontend/.env created with VITE_ variables
- [ ] Frontend starts: npm run dev ✅
- [ ] App loads at http://localhost:5173 ✅

---

## 🎊 YOU'RE READY!

Once both backend and frontend are running:

1. App should load at http://localhost:5173
2. You can signup, login, create projects
3. Everything is working!
4. Next: Commit and deploy to production (see FINAL_DEPLOYMENT_CHECKLIST.md)

---

**Total Time: 5-10 minutes to get everything running!** ⚡

**Start with Step 1 now!** 👆
