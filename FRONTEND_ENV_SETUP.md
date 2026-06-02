# Frontend Environment Configuration Guide

## Frontend Environment Files Structure

Your frontend has **two separate .env files** for different environments:

### File 1: `.env.development` (LOCAL DEVELOPMENT)
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (Local)
VITE_API_URL=http://localhost:5000/api

# App Config
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0

# Node Environment
VITE_NODE_ENV=development
```

### File 2: `.env.production` (PRODUCTION DEPLOYMENT)
```env
# Supabase Configuration (Same as dev)
VITE_SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (Remote on Render)
VITE_API_URL=https://k2020-ohse-backend.onrender.com/api

# App Config
VITE_APP_NAME=K2020 OHSE SaaS
VITE_APP_VERSION=1.0.0

# Node Environment
VITE_NODE_ENV=production
```

---

## How Vite Loads Environment Files

Vite automatically loads environment files based on **mode**:

### Development Mode
```bash
npm run dev
```
- Loads `.env.development`
- `VITE_API_URL` = `http://localhost:5000/api`
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production Mode (Build)
```bash
npm run build
```
- Loads `.env.production`
- `VITE_API_URL` = `https://k2020-ohse-backend.onrender.com/api`
- Frontend: `https://k2020-ohse-s.vercel.app`
- Backend: `https://k2020-ohse-backend.onrender.com`

---

## How Frontend Uses API_URL

**File: `frontend/src/lib/api.ts` (Line 3)**

```typescript
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
```

- Reads `VITE_API_URL` from .env file
- Falls back to `http://localhost:5000` if not set
- Used in all API calls:

```typescript
// Example: Upload and analyze
fetch(`${API_URL}/api/upload-and-analyze`, { ... })

// Example: Health check  
fetch(`${API_URL}/api/health`, { ... })
```

---

## Frontend to Backend Communication Flow

### Development Flow
```
1. Frontend loads on http://localhost:5173
2. Reads .env.development
3. Sets API_URL = http://localhost:5000/api
4. Makes request: http://localhost:5000/api/health
5. Backend receives on port 5000
6. Backend checks CORS origin: http://localhost:5173 ✅ ALLOWED
7. Response sent back to frontend
```

### Production Flow
```
1. Frontend deployed to https://k2020-ohse-s.vercel.app
2. Reads .env.production (built into bundle)
3. Sets API_URL = https://k2020-ohse-backend.onrender.com/api
4. Makes request: https://k2020-ohse-backend.onrender.com/api/health
5. Backend receives on Render
6. Backend checks CORS origin: https://k2020-ohse-s.vercel.app ✅ ALLOWED
7. Response sent back to frontend
```

---

## NODE_ENV Configuration

Your frontend also tracks `VITE_NODE_ENV`:

### In Development
```
VITE_NODE_ENV=development
```

Use this to conditionally enable features:
```typescript
if (import.meta.env.VITE_NODE_ENV === 'development') {
  // Enable debug logging, test features, etc
  console.log("Debug info", data);
}
```

### In Production
```
VITE_NODE_ENV=production
```

Use to optimize:
```typescript
if (import.meta.env.VITE_NODE_ENV === 'production') {
  // Disable console logging, analytics, etc
  if (analyticsEnabled) trackEvent('page_view');
}
```

---

## What "VITE_" Prefix Means

Variables starting with `VITE_` are:
- ✅ **Exposed to frontend** (browser can access via `import.meta.env`)
- ✅ **Safe to commit** (no secrets)
- ✅ **Built into** the JavaScript bundle

Variables **without** `VITE_` are:
- ❌ **NOT exposed** to frontend
- ✅ **Safe for secrets** (backend only)

---

## Current Configuration Status ✅

### Development Setup
| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `http://localhost:5000/api` | Local backend |
| `VITE_NODE_ENV` | `development` | Enable debug features |
| `VITE_SUPABASE_URL` | `https://qvvmuxwwdishyskheqnh.supabase.co` | Auth & DB |

### Production Setup
| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `https://k2020-ohse-backend.onrender.com/api` | Remote backend |
| `VITE_NODE_ENV` | `production` | Optimize for speed |
| `VITE_SUPABASE_URL` | `https://qvvmuxwwdishyskheqnh.supabase.co` | Auth & DB |

---

## Testing the Configuration

### Test in Development
```bash
cd frontend
npm run dev
```
Then in browser console:
```javascript
// Should log: http://localhost:5000/api
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_NODE_ENV);
```

### Test in Production Build
```bash
npm run build
npm run preview
```
Then in browser console:
```javascript
// Should log: https://k2020-ohse-backend.onrender.com/api
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_NODE_ENV);
```

---

## Deployment Checklist

### Before Deploying to Vercel
1. ✅ `.env.production` has correct `VITE_API_URL`
2. ✅ Backend is running on Render (get the URL)
3. ✅ Backend's `.env` has `CORS_ORIGIN_PROD` set to Vercel URL
4. ✅ Backend has been deployed to Render first
5. ✅ Test locally with `npm run preview`

### After Deploying to Vercel
1. ✅ Visit https://k2020-ohse-s.vercel.app
2. ✅ Open browser console
3. ✅ Check: `console.log(import.meta.env.VITE_API_URL)` → should be Render URL
4. ✅ Test login (should call Render backend)
5. ✅ Create a test project

---

## Quick Reference: Environment Variables

### Frontend (.env files)
```
VITE_API_URL          → Where backend is (http://localhost:5000/api OR https://...onrender.com/api)
VITE_NODE_ENV         → development OR production
VITE_SUPABASE_URL     → Supabase project URL
VITE_SUPABASE_ANON_KEY → Supabase public key
VITE_APP_NAME         → App display name
VITE_APP_VERSION      → Version number
```

### Backend (.env file)
```
SUPABASE_URL          → Supabase project URL (same as frontend)
SUPABASE_SERVICE_KEY  → Supabase service role key
PORT                  → 5000 (development) or 443 (production)
NODE_ENV              → development OR production
CORS_ORIGIN           → http://localhost:5173 (dev frontend)
CORS_ORIGIN_PROD      → https://k2020-ohse-s.vercel.app (prod frontend)
```

---

## Summary

✅ **Your setup is correct:**
- Frontend has `.env.development` for local testing
- Frontend has `.env.production` for Vercel deployment
- Both connect to the same Supabase project
- API URLs match backend deployment
- CORS is properly configured on backend side
- NODE_ENV correctly set for each environment

**No changes needed!** Ready to run `npm run dev` locally and deploy to production. 🚀
