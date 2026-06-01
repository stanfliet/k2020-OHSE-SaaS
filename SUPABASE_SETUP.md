# 🔑 SUPABASE CREDENTIALS SETUP GUIDE

## ⚠️ IMPORTANT: You Need Real Supabase Credentials

The backend requires **actual** Supabase credentials to run. The placeholder values in `.env` won't work.

---

## 📋 HOW TO GET YOUR SUPABASE CREDENTIALS

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click **Sign Up** (free tier available)
3. Sign in with GitHub (recommended) or email
4. Create a new organization

### Step 2: Create a New Project
1. In Supabase dashboard, click **New Project**
2. Name: `K2020-OHSE-SaaS`
3. Password: Create a strong password
4. Region: Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
5. Pricing: Select **Free** tier
6. Click **Create New Project**
7. Wait 2-3 minutes for project to initialize

### Step 3: Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Click **API** in left menu
3. You'll see:

```
Project URL: https://YOUR_PROJECT_ID.supabase.co
Anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy these three values!**

---

## 📝 UPDATE YOUR .env FILE

Open `backend/.env` and replace:

```env
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**With your actual credentials from Supabase dashboard.**

---

## 🔄 DEPLOY DATABASE SCHEMA

Once you have Supabase project created:

### Step 1: Open SQL Editor
1. In Supabase dashboard, click **SQL Editor** (left menu)
2. Click **New Query**

### Step 2: Paste Schema
1. Open `supabase/schema.sql` from the repository
2. Copy **entire content**
3. Paste into SQL Editor in Supabase
4. Click **Run** (blue button)
5. Wait for execution to complete

**You should see no errors!**

### Step 3: Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see 21 tables:
   - users
   - company_profiles
   - projects
   - incident_reports
   - training_records
   - compliance_items
   - environmental_plans
   - quality_plans
   - boq_records
   - generated_documents
   - And more...

---

## 🚀 NOW TRY STARTING BACKEND

```bash
cd backend
npm start
```

**You should see:**
```
Backend server running on port 3000
Connected to Supabase
All routes initialized successfully
```

If you get an error, check:
1. ✅ `.env` file has correct credentials
2. ✅ Supabase project is created
3. ✅ Schema.sql was executed
4. ✅ SUPABASE_ANON_KEY is copied correctly (no spaces at end)

---

## 🔐 SECURITY NOTE

⚠️ **NEVER commit .env file to GitHub!**

Your `.env` file contains secret keys. Add to `.gitignore`:

```
# backend/.gitignore
.env
.env.local
.env.*.local
```

---

## 📱 FRONTEND ENVIRONMENT VARIABLES

You also need to configure the frontend with Supabase credentials.

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000
```

**Use the SAME credentials from Supabase (ANON_KEY only for frontend)**

---

## ✅ CHECKLIST

- [ ] Created Supabase account at supabase.com
- [ ] Created new project (free tier)
- [ ] Copied SUPABASE_URL
- [ ] Copied SUPABASE_ANON_KEY
- [ ] Copied SUPABASE_SERVICE_ROLE_KEY
- [ ] Updated `backend/.env` with credentials
- [ ] Updated `frontend/.env` with credentials
- [ ] Executed schema.sql in Supabase SQL Editor
- [ ] Verified 21 tables created
- [ ] Tested `npm start` in backend
- [ ] Backend starts successfully

---

## 🆘 TROUBLESHOOTING

### "supabaseUrl is required"
**Solution:** Check `.env` file has `SUPABASE_URL` with value starting with `https://`

### "Connection refused"
**Solution:** Make sure Supabase project is fully initialized (wait 2-3 min after creating)

### "Invalid JWT"
**Solution:** Copy the ANON_KEY again, make sure no spaces at beginning/end

### "RLS violation"
**Solution:** Run schema.sql to create RLS policies

### "Table does not exist"
**Solution:** Run schema.sql in Supabase SQL Editor

---

## 💾 FULL ENVIRONMENT SETUP

### Backend (.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_key_here

# Supabase Configuration
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3000
```

---

## 🎯 AFTER SETUP

Once backend starts successfully:

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit http://localhost:5173 in browser
Test login, create project, upload document!

---

**All set! You're ready to deploy!** 🚀
