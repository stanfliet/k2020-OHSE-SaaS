# 🔧 COMPLETE ENVIRONMENT SETUP & CREDENTIALS GUIDE

## ⚡ QUICK START (3 STEPS)

### **Step 1: Create Supabase Project (2 minutes)**
1. Go to https://supabase.com → Sign Up
2. Create new project (Free tier)
3. Wait 2-3 minutes for initialization
4. Copy credentials from Project Settings → API

### **Step 2: Update .env Files (2 minutes)**
```bash
# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# frontend/.env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **Step 3: Deploy Schema (2 minutes)**
1. In Supabase → SQL Editor
2. Paste entire `supabase/schema.sql`
3. Click Run
4. Verify 21 tables created

**Total Time: 6 minutes**

---

## 📋 DETAILED SETUP

### **WHERE TO GET CREDENTIALS**

| Credential | Source | Looks Like |
|-----------|--------|-----------|
| SUPABASE_URL | Supabase Dashboard → Settings → API → Project URL | `https://xxxx.supabase.co` |
| SUPABASE_ANON_KEY | Supabase Dashboard → Settings → API → Anon public key | `eyJhbGciOiJIUzI1NiIs...` (long JWT) |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Dashboard → Settings → API → Service role secret | `eyJhbGciOiJIUzI1NiIs...` (long JWT) |
| OPENAI_API_KEY | OpenAI → API Keys (optional, for AI features) | `sk-...` |

---

## 🎯 BACKEND SETUP

### **File: `backend/.env`**

```env
# ============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZmdkdnRndmlheGVhd2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTI3MzA1OTcsImV4cCI6MTk0MDUyNzE5N30.YOUR_ACTUAL_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZmdkdnRndmlheGVhd2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYxMjczMDU5NywiZXhwIjoxOTQwNTI3MTk3fQ.YOUR_ACTUAL_SERVICE_ROLE_KEY

# ============================================
# OPENAI CONFIGURATION (OPTIONAL - For AI Features)
# ============================================
OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://your-frontend-domain.vercel.app

# ============================================
# FILE UPLOAD CONFIGURATION
# ============================================
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# ============================================
# AI CONFIGURATION
# ============================================
AI_MODEL=gpt-4-mini
AI_TEMPERATURE=0.7
```

### **How to Fill It:**

1. **SUPABASE_URL:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy **Project URL**
   - Example: `https://qvvmuxwwdishyskheqnh.supabase.co`

2. **SUPABASE_ANON_KEY:**
   - Same page: Settings → API
   - Copy **Anon public key**
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (very long string)

3. **SUPABASE_SERVICE_ROLE_KEY:**
   - Same page: Settings → API
   - Copy **Service role secret**
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (very long string)

4. **OPENAI_API_KEY (Optional):**
   - Go to https://platform.openai.com/api-keys
   - Create new API key
   - Copy entire key
   - Example: `sk-proj-...` (starts with sk-)

5. **CORS_ORIGIN_PROD:**
   - After deploying to Vercel, use your frontend URL
   - Example: `https://k2020-ohse-app.vercel.app`

---

## 📱 FRONTEND SETUP

### **File: `frontend/.env`**

```env
# ============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...

# ============================================
# API CONFIGURATION
# ============================================
VITE_API_URL=http://localhost:3000

# ============================================
# ENVIRONMENT
# ============================================
VITE_ENV=development

# ============================================
# OPTIONAL - THIRD-PARTY SERVICES
# ============================================
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### **How to Fill It:**

1. **VITE_SUPABASE_URL:**
   - Same as backend (use same Supabase project)

2. **VITE_SUPABASE_ANON_KEY:**
   - Same as backend SUPABASE_ANON_KEY
   - (Use ANON_KEY, never expose SERVICE_ROLE_KEY in frontend)

3. **VITE_API_URL:**
   - Local dev: `http://localhost:3000`
   - Production: `https://your-backend.onrender.com`

---

## 🗄️ DATABASE SCHEMA DEPLOYMENT

### **Step 1: Open SQL Editor**
1. Go to Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**

### **Step 2: Copy Schema**
1. Open `supabase/schema.sql` in your editor
2. Select all content (Ctrl+A)
3. Copy (Ctrl+C)

### **Step 3: Paste & Execute**
1. In Supabase SQL Editor, paste schema
2. Click blue **Run** button
3. Wait for completion (should see no errors)

### **Step 4: Verify**
1. Go to **Table Editor** in Supabase
2. You should see these 21 tables:
   ```
   ✅ users
   ✅ company_profiles
   ✅ company_directors
   ✅ company_settings
   ✅ projects
   ✅ project_documents
   ✅ generated_documents
   ✅ safety_files
   ✅ incident_reports
   ✅ training_records
   ✅ compliance_items
   ✅ environmental_plans
   ✅ quality_plans
   ✅ non_conformances
   ✅ boq_records
   ✅ ppe_register
   ✅ visitor_register
   ✅ toolbox_talks
   ✅ equipment_register
   ✅ vehicle_register
   ✅ medical_register
   ```

---

## 🚀 TEST CONFIGURATION

### **Test Backend**
```bash
cd backend
npm start
```

**Expected Output:**
```
Backend server running on port 3000
Environment: development
Production Mode: false
Allowed CORS origins: Set(4) { ... }
```

### **Test Frontend**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
Local:   http://localhost:5173/
Ready in XXms
```

### **Test Connection**
1. Open http://localhost:5173
2. Should load without errors
3. Try to create account or login
4. Check browser console (F12) for errors

---

## 🔐 SECURITY CHECKLIST

- [ ] `.env` file is in `.gitignore` (never commit secrets!)
- [ ] SUPABASE_ANON_KEY is used in frontend
- [ ] SUPABASE_SERVICE_ROLE_KEY is only in backend
- [ ] OPENAI_API_KEY is only in backend
- [ ] No credentials in source code
- [ ] Environment variables are secure

---

## 📋 ENVIRONMENT VARIABLES BY SERVICE

### **Supabase (All these go in .env)**
- ✅ SUPABASE_URL (required)
- ✅ SUPABASE_ANON_KEY (required)
- ✅ SUPABASE_SERVICE_ROLE_KEY (required for backend)

### **OpenAI (Optional - for AI features)**
- ⚠️ OPENAI_API_KEY (optional, backend only)

### **Frontend Only (VITE_ prefix)**
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_API_URL
- ⚠️ VITE_SENTRY_DSN (optional)

### **Backend Only**
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ OPENAI_API_KEY
- ✅ PORT
- ✅ NODE_ENV

---

## ⚡ TROUBLESHOOTING

### **"supabaseUrl is required"**
```
Problem: .env file missing SUPABASE_URL
Solution: 
1. Check backend/.env exists
2. Verify SUPABASE_URL has a value
3. Make sure it starts with https://
```

### **"Invalid JWT"**
```
Problem: Key is malformed or incomplete
Solution:
1. Copy key from Supabase again
2. Make sure no spaces at beginning/end
3. Use full key (very long string)
```

### **"Connection refused"**
```
Problem: Supabase project not initialized
Solution:
1. Wait 2-3 minutes after creating project
2. Check Supabase dashboard loads
3. Try again
```

### **"RLS violation"**
```
Problem: Schema not deployed
Solution:
1. Go to Supabase SQL Editor
2. Run schema.sql again
3. Verify no errors
```

### **"Table does not exist"**
```
Problem: Schema.sql not executed
Solution:
1. Paste schema.sql into SQL Editor
2. Click Run
3. Verify tables in Table Editor
```

### **"Env var undefined in frontend"**
```
Problem: Missing VITE_ prefix
Solution:
1. Frontend env vars must start with VITE_
2. Restart npm run dev
3. Check browser console
```

---

## 🎯 NEXT STEPS

1. **✅ Create Supabase project** → 2 minutes
2. **✅ Get credentials** → 1 minute
3. **✅ Update .env files** → 2 minutes
4. **✅ Deploy schema** → 2 minutes
5. **✅ Test backend** → 1 minute
6. **✅ Test frontend** → 1 minute
7. **✅ Ready to deploy!** → Proceed to FINAL_DEPLOYMENT_CHECKLIST.md

**Total Setup Time: ~10 minutes**

---

## 📞 SUPPORT

**Stuck?** Check these files:
- `FINAL_DEPLOYMENT_CHECKLIST.md` - Full deployment guide
- `TROUBLESHOOTING.md` - Common issues
- Supabase Docs: https://supabase.com/docs

---

**You're almost there! Get credentials and start the backend!** 🚀
