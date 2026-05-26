# Quick Reference Card - K2020 OHSE Deployment

## 🎯 Three Services You Need:

1. **Supabase** (Database) - https://supabase.com
2. **Render** (Backend API) - https://render.com  
3. **Vercel** (Frontend) - https://vercel.com

---

## 📋 Credentials You'll Need:

### From Supabase Dashboard > Settings > API:
```
✓ Project URL → VITE_SUPABASE_URL, SUPABASE_URL
✓ Anon Key → VITE_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY
✓ Service Key → SUPABASE_SERVICE_KEY
```

### From OpenAI:
```
✓ API Key → OPENAI_API_KEY (starts with sk-)
```

---

## 🚀 Deployment Steps:

### 1. Fix Local Issue (5 min)
```bash
# Update frontend/.env with real Supabase credentials
# Update backend/.env with real credentials
# Restart both servers (Ctrl+C then npm start/npm run dev)
# Test signup at http://localhost:5173
```

### 2. Deploy Backend (5 min)
- Go to Render.com
- Click "New Web Service"
- Select your GitHub repo
- Set environment variables
- Click Deploy
- Wait 5-10 min
- Copy backend URL

### 3. Deploy Frontend (5 min)
- Go to Vercel.com
- Click "Add New" → "Project"
- Select your GitHub repo
- Set `frontend` as root directory
- Set environment variables (including backend URL)
- Click Deploy
- Wait 3-5 min

### 4. Update CORS in Supabase
- Add your Vercel URL to CORS Allow List

### 5. Test Production
- Visit your Vercel URL
- Try signup
- Should work!

---

## ✅ Testing Commands:

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Test production backend
curl https://k2020-ohse-backend.onrender.com/api/health

# Test Supabase connection
# See test-supabase.js in repo root
```

---

## 📁 Files to Check/Update:

| File | Purpose | Status |
|------|---------|--------|
| `frontend/.env` | Frontend config | ⚠️ Needs real credentials |
| `backend/.env` | Backend config | ⚠️ Needs real credentials |
| `supabase/schema.sql` | Database schema | ✅ Ready |
| `.git/config` | Git remote | ✅ Fixed |
| `DEPLOYMENT_STEP_BY_STEP.md` | Detailed guide | ✅ Ready |
| `ACTION_PLAN.md` | Quick action plan | ✅ Ready |

---

## 🔗 Useful Links:

- Supabase Dashboard: https://app.supabase.com
- Render Dashboard: https://dashboard.render.com  
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/stanfliet/k2020-OHSE-SAAS

---

## ⚡ Quick Troubleshooting:

| Issue | Solution |
|-------|----------|
| "FAILED TO FETCH" | Check Supabase credentials, reload page |
| Render deploy fails | Check logs, verify env vars |
| Vercel build fails | Check TypeScript errors, verify env vars |
| Signup still not working | Check CORS in Supabase, verify API URL |
| Backend URL wrong | Update VITE_API_URL in frontend/.env |

---

## 📊 Deployment Status:

```
Local Development:
├── Frontend: http://localhost:5173 ✓
├── Backend: http://localhost:5000 ✓
└── Database: Supabase ✓

Production:
├── Frontend: [Your Vercel URL] ⏳
├── Backend: [Your Render URL] ⏳
└── Database: [Your Supabase URL] ✓
```

---

## 🎊 Final Checklist Before Commit:

- [ ] Supabase project created and configured
- [ ] Database schema loaded
- [ ] Local signup works (no errors)
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Production signup tested
- [ ] All environment variables correct
- [ ] No console errors

**Then run:**
```bash
git add .
git commit -m "fix: implement complete sign up functionality with validation and UI improvements"
git push origin main
```

---

**Made with ❤️ for K2020 OHSE**
