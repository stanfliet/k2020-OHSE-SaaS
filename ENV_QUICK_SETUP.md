# Environment Configuration Quick Setup

## Your Current Setup ✅

### Frontend: Development
**File:** `frontend/.env.development`
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0
```

### Frontend: Production
**File:** `frontend/.env.production`
```env
VITE_API_URL=https://k2020-ohse-backend.onrender.com/api
VITE_NODE_ENV=production
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0
```

### Backend: All Environments
**File:** `backend/.env`
```env
# Supabase
SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# Server
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app

# OpenAI
OPENAI_API_KEY=sk-...
```

---

## The Flow

### Local Development
```
You type:  npm run dev
           ↓
Frontend loads: .env.development
           VITE_API_URL = http://localhost:5000/api
           ↓
Browser makes request: http://localhost:5000/api/...
           ↓
Backend checks CORS: Is origin "http://localhost:5173" allowed?
           Yes! (CORS_ORIGIN in .env)
           ↓
Response sent back ✅
```

### Production Build
```
You type:  npm run build
           ↓
Frontend loads: .env.production
           VITE_API_URL = https://k2020-ohse-backend.onrender.com/api
           (Gets hardcoded in the JavaScript bundle)
           ↓
Deployed to: https://k2020-ohse-s.vercel.app
           ↓
Browser makes request: https://k2020-ohse-backend.onrender.com/api/...
           ↓
Backend checks CORS: Is origin "https://k2020-ohse-s.vercel.app" allowed?
           Yes! (CORS_ORIGIN_PROD in .env)
           ↓
Response sent back ✅
```

---

## Key Concepts

| Concept | Explanation |
|---------|-------------|
| **VITE_** prefix | Variables are exposed to frontend/browser |
| **VITE_API_URL** | Tells frontend where the backend API is |
| **VITE_NODE_ENV** | Lets frontend know if it's in dev or production |
| **CORS_ORIGIN** | Backend setting: Allow frontend from this URL (dev) |
| **CORS_ORIGIN_PROD** | Backend setting: Allow frontend from this URL (prod) |
| **.env.development** | Frontend config for local `npm run dev` |
| **.env.production** | Frontend config for `npm run build` (hardcoded in bundle) |
| **.env** | Backend config for all environments (reads NODE_ENV at runtime) |

---

## Your Render URL

Once you deploy backend to Render, replace:
```env
# frontend/.env.production
VITE_API_URL=https://your-render-url.onrender.com/api
```

Example: If your Render deployment URL is `https://k2020-ohse-backend-abc123.onrender.com`, then:
```env
VITE_API_URL=https://k2020-ohse-backend-abc123.onrender.com/api
```

Also update backend `.env`:
```env
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

---

## Commands to Run

### Development
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev

# Visit: http://localhost:5173
```

### Production Build (Test Locally)
```bash
cd frontend
npm run build      # Creates dist/ folder with hardcoded Render URL
npm run preview    # Runs the production build locally
# Visit: http://localhost:4173
```

### Production Build (Deploy)
```bash
# Backend to Render (first)
git push origin main  # Render auto-deploys

# Frontend to Vercel (second)
git push origin main  # Vercel auto-deploys
```

---

## Verification

### Check Frontend Config in Development
```bash
# Terminal: Run npm run dev, then open browser console
console.log(import.meta.env.VITE_API_URL)
// Should output: http://localhost:5000/api

console.log(import.meta.env.VITE_NODE_ENV)
// Should output: development
```

### Check Frontend Config in Production Build
```bash
# Terminal: Run npm run build && npm run preview
# Then open browser console
console.log(import.meta.env.VITE_API_URL)
// Should output: https://k2020-ohse-backend.onrender.com/api

console.log(import.meta.env.VITE_NODE_ENV)
// Should output: production
```

### Check Backend Config
```bash
# Backend logs on startup should show:
# "Backend server running on port 5000"
# "CORS Origins configured: http://localhost:5173, https://k2020-ohse-s.vercel.app"
```

---

## No Changes Needed! ✅

Your environment configuration is:
- ✅ **Correct** for local development
- ✅ **Correct** for production deployment
- ✅ **Secure** (no secrets exposed to frontend)
- ✅ **Production-ready**

Just run:
```bash
npm run dev      # Local testing
npm run build    # Production bundle (auto-deploys to Vercel)
```

Done! 🚀
