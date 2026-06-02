# NPM Install & Backend Startup - Quick Reference

## One Command to Rule Them All

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend && npm install
```

---

## After Installation (5 Simple Steps)

### Step 1: Start Backend
```bash
npm start
```
✅ Should see: `Backend server running on port 5000`

### Step 2: Open New Terminal, Start Frontend
```bash
cd ../frontend
npm run dev
```
✅ Should see: `Local: http://localhost:5173/`

### Step 3: Open Browser
```
http://localhost:5173
```
✅ You should see the login page

### Step 4: Test Signup
- Email: `test@example.com`
- Password: `Test@1234`
- Click Sign Up
- Should redirect to Dashboard

### Step 5: Test Create Project
- Click "+ New Project"
- Enter name and click Create
- Should appear in project list

---

## What npm install Does

Downloads and installs these packages:
```
✓ express (web server)
✓ @supabase/supabase-js (database)
✓ typescript (type checking)
✓ tsx (run TypeScript)
✓ openai (GPT-4 integration)
✓ + 8 more packages
```

**Size:** ~500MB in node_modules folder  
**Time:** 5-10 minutes  
**Result:** Backend ready to run

---

## Verification

After install, verify:
```bash
npm list --depth=0
```

Should show all 13 packages ✓

---

## If Errors

### "Command not found"
→ Install Node.js: https://nodejs.org

### "supabaseUrl is required"
→ Verify .env file has credentials
→ Run `npm start` again

### "Cannot find module X"
→ Run `npm install` again

### "Port already in use"
→ Change PORT in .env to 3001
→ Run `npm start`

---

## Files Location

```
C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\
├── backend/
│   ├── package.json              ← Dependencies defined
│   ├── .env                       ← Credentials (KEEP SECRET)
│   └── npm install → creates node_modules/
├── frontend/
└── docs/
```

---

## Success Indicators

✅ `npm install` completes without errors  
✅ `node_modules` folder appears (~500MB)  
✅ `npm start` shows "Backend server running"  
✅ `npm run dev` shows frontend URL  
✅ Browser loads login page  
✅ Can signup and create projects  

---

## Next: Deploy to Production

After testing locally:
```bash
git add .
git commit -m "deps: install node modules"
git push
```

Then follow: `FINAL_DEPLOYMENT_CHECKLIST.md`

---

**Start here:** `cd backend && npm install`
