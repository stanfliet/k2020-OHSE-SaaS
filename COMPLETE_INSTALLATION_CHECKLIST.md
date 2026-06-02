# Installation & Startup Checklist

## Phase 1: Verify Prerequisites ✓

- [ ] Node.js installed (`node --version` should show v18+)
- [ ] npm installed (`npm --version` should show v9+)
- [ ] You're in the correct directory: `C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend`

---

## Phase 2: Install Backend Dependencies ✓

**Run this command:**

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm install
```

**Checklist:**
- [ ] Command started (you see "up to date" or install progress)
- [ ] No errors appear during installation
- [ ] Installation completes (takes 5-10 minutes)
- [ ] `node_modules` folder created (will be ~500MB)
- [ ] `package-lock.json` file updated

**If errors occur:**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

---

## Phase 3: Verify Installation ✓

**Run this command:**

```bash
npm list --depth=0
```

**You should see:**
```
k2020-ohse-backend@1.0.0
├── @types/express@4.17.21
├── @types/multer@1.4.11
├── @types/node@20.10.6
├── cors@2.8.5
├── docx@8.5.0
├── dotenv@16.5.0
├── express@4.21.2
├── mammoth@1.6.1
├── multer@1.4.5-lts.2
├── openai@4.89.0
├── pdf-parse@1.1.1
├── pdfkit@0.13.0
└── @supabase/supabase-js@2.49.8
```

**Checklist:**
- [ ] All 13 packages listed without errors
- [ ] No red "unmet dependency" warnings
- [ ] No "missing module" errors

---

## Phase 4: Start Backend Server ✓

**Run this command:**

```bash
npm start
```

**Expected output:**
```
Environment: production
Production Mode: true
[RBAC] Initializing Supabase client with URL: https://qvvmuxwwdishi...
Allowed CORS origins: Set(3) {
  'http://localhost:5173',
  'http://localhost:3000',
  'https://k2020-ohse-s.vercel.app'
}
Backend server running on port 5000
```

**Checklist:**
- [ ] No errors in console
- [ ] "Backend server running on port 5000" appears
- [ ] Server stays running (doesn't exit)
- [ ] Can see the CORS origins listed

**If error occurs: "supabaseUrl is required"**
- Check that `.env` file has SUPABASE_URL
- Verify it's not empty
- Run `npm start` again

**If error: "Cannot find module..."**
```bash
npm install
npm start
```

---

## Phase 5: Test Backend API ✓

**Open a NEW terminal window and run:**

```bash
curl http://localhost:3000/api/health
```

Or use a browser: `http://localhost:3000/api/health`

**Expected response:**
```json
{"status": "ok", "environment": "production"}
```

**Checklist:**
- [ ] Request succeeds (no connection error)
- [ ] Response shows JSON with "status": "ok"
- [ ] Backend is responding to requests

---

## Phase 6: Start Frontend Server ✓

**Open a THIRD terminal window and run:**

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.0
Local: http://localhost:5173/
press h to show help
```

**Checklist:**
- [ ] Frontend dev server starts
- [ ] "Local: http://localhost:5173/" appears
- [ ] No build errors

---

## Phase 7: Test Frontend ✓

**Open browser to:** `http://localhost:5173`

**You should see:**
- [ ] K2020-OHSE-SaaS login page
- [ ] Email and password input fields
- [ ] "Sign Up" and "Login" buttons
- [ ] No JavaScript errors in browser console

---

## Phase 8: Test Login Flow ✓

**On the login page:**

1. [ ] Click "Sign Up"
2. [ ] Enter test email: `test@example.com`
3. [ ] Enter test password: `Test@1234`
4. [ ] Click "Sign Up" button
5. [ ] Wait for redirect...
6. [ ] Should see Dashboard page

**If signup works:**
- [ ] You're logged in
- [ ] Dashboard shows
- [ ] Backend is connected to frontend

---

## Phase 9: Test Create Project ✓

**On Dashboard page:**

1. [ ] Click "+ New Project" button
2. [ ] Enter project name: `Test Project`
3. [ ] Enter client: `Test Client`
4. [ ] Click "Create" button
5. [ ] Project appears in list

**Checklist:**
- [ ] Project created successfully
- [ ] Project appears in list
- [ ] No errors in backend console

---

## Phase 10: Commit Changes to GitHub ✓

**In main terminal:**

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS
git add .
git commit -m "fix: implement lazy Supabase initialization and install dependencies"
git push origin main
```

**Checklist:**
- [ ] Git commit succeeds
- [ ] No merge conflicts
- [ ] Changes pushed to GitHub

---

## Summary Checklist

| Phase | Task | Status | Time |
|-------|------|--------|------|
| 1 | Prerequisites | - | 2 min |
| 2 | npm install | ⏳ In Progress | 5-10 min |
| 3 | Verify packages | ⏳ Next | 1 min |
| 4 | Start backend | ⏳ Next | 1 min |
| 5 | Test backend API | ⏳ Next | 1 min |
| 6 | Start frontend | ⏳ Next | 1 min |
| 7 | Test frontend | ⏳ Next | 2 min |
| 8 | Test login | ⏳ Next | 2 min |
| 9 | Test project creation | ⏳ Next | 2 min |
| 10 | Commit to GitHub | ⏳ Next | 2 min |

**Total Time:** ~20 minutes

---

## Terminal Setup

You'll need 3 terminals open:

**Terminal 1: Backend**
```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm start
# Keep running
```

**Terminal 2: Frontend**
```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\frontend
npm run dev
# Keep running
```

**Terminal 3: Testing/Commands**
```bash
# Run commands here
curl http://localhost:3000/api/health
git status
# etc.
```

---

## Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: "EACCES: permission denied"
**Solution:** Run terminal as Administrator

### Issue: Backend won't start
**Solution:** Check .env file has SUPABASE_URL

### Issue: Frontend won't build
**Solution:** Clear node_modules: `rm -rf node_modules && npm install`

### Issue: "Port 3000 already in use"
**Solution:** Kill process or change PORT in .env to 3001

### Issue: "Cannot find module X"
**Solution:** Run `npm install` again

---

## Next Steps After Successful Testing

1. ✅ Install npm packages
2. ✅ Start both servers
3. ✅ Test login and project creation
4. 📋 Deploy to production:
   - Push to GitHub
   - Deploy backend to Render
   - Deploy frontend to Vercel
   - (Follow FINAL_DEPLOYMENT_CHECKLIST.md)

---

**Ready to proceed? Start with:**
```bash
cd backend
npm install
```
