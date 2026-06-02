# Frontend vs Backend CORS & Environment Configuration

## Complete Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT ENVIRONMENT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Browser (localhost:5173)                                                   │
│  ├─ Loads frontend/.env.development                                        │
│  ├─ VITE_API_URL = http://localhost:5000/api                               │
│  ├─ VITE_NODE_ENV = development                                            │
│  │                                                                          │
│  └─ Makes API calls to: http://localhost:5000/api/*                        │
│      │                                                                      │
│      └─> Backend Express Server (port 5000)                                │
│          ├─ Loads backend/.env                                             │
│          ├─ CORS_ORIGIN = http://localhost:5173 ✅ ALLOWED                │
│          ├─ NODE_ENV = development                                         │
│          └─ Returns JSON responses with CORS headers                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION ENVIRONMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Browser (k2020-ohse-s.vercel.app)                                         │
│  ├─ Loads frontend/.env.production (baked into build)                      │
│  ├─ VITE_API_URL = https://k2020-ohse-backend.onrender.com/api             │
│  ├─ VITE_NODE_ENV = production                                             │
│  │                                                                          │
│  └─ Makes API calls to: https://k2020-ohse-backend.onrender.com/api/*      │
│      │                                                                      │
│      └─> Backend on Render (https://...)                                   │
│          ├─ Loads backend/.env                                             │
│          ├─ CORS_ORIGIN_PROD = https://k2020-ohse-s.vercel.app ✅          │
│          ├─ NODE_ENV = production                                          │
│          └─ Returns JSON responses with CORS headers                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Configuration Comparison Table

### Frontend Configuration

| Setting | Development | Production | Purpose |
|---------|-------------|-----------|---------|
| **File** | `.env.development` | `.env.production` | Separates environments |
| **VITE_API_URL** | `http://localhost:5000/api` | `https://k2020-ohse-backend.onrender.com/api` | Tells frontend where backend is |
| **VITE_NODE_ENV** | `development` | `production` | Enables/disables debug features |
| **Frontend URL** | `http://localhost:5173` | `https://k2020-ohse-s.vercel.app` | Where frontend runs |
| **Auto-loaded by** | `npm run dev` | `npm run build` | Vite automatically selects |
| **Built into** | Runtime only | JavaScript bundle | Frontend needs to know API URL |

### Backend Configuration

| Setting | Development | Production | Purpose |
|---------|-------------|-----------|---------|
| **File** | `.env` | `.env` (same file) | Both environments use one .env |
| **PORT** | `5000` | `443` (Render handles) | Where backend listens |
| **NODE_ENV** | `development` | `production` | Logging level, optimization |
| **CORS_ORIGIN** | `http://localhost:5173` | `http://localhost:3000` (fallback) | Dev frontend origin |
| **CORS_ORIGIN_PROD** | `https://k2020-ohse-s.vercel.app` | `https://k2020-ohse-s.vercel.app` | Production frontend origin |
| **Backend URL** | `http://localhost:5000` | `https://k2020-ohse-backend.onrender.com` | How frontend reaches backend |
| **Supabase** | Same database | Same database | Shared auth & data |

---

## How Environment Selection Works

### Frontend: Vite's Auto-Detection

**When you run:**
```bash
npm run dev
```
Vite sees `--mode development` (default) → Loads `.env.development`

**When you run:**
```bash
npm run build
```
Vite sees `--mode production` (default) → Loads `.env.production` → Bakes it into build

**Check in browser console during dev:**
```javascript
console.log(import.meta.env.VITE_API_URL)
// Output: http://localhost:5000/api
```

**Check in browser console during production:**
```javascript
console.log(import.meta.env.VITE_API_URL)
// Output: https://k2020-ohse-backend.onrender.com/api
```

### Backend: Manual Configuration

Backend uses one `.env` file for ALL environments.

**Detect environment at runtime:**
```typescript
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Use CORS_ORIGIN_PROD
  // Disable console logs
  // Enable security headers
} else {
  // Use CORS_ORIGIN
  // Enable debug logging
}
```

---

## CORS Request Flow

### Development: Browser → Localhost Backend

```
1. Frontend makes request:
   fetch('http://localhost:5000/api/health', {
     headers: { 'Origin': 'http://localhost:5173' }
   })

2. Backend CORS middleware checks:
   if (allowedOrigins.has('http://localhost:5173')) {
     // YES - in CORS_ORIGIN from .env
     return response with: Access-Control-Allow-Origin: http://localhost:5173
   }

3. Browser receives response with CORS header → Request succeeds ✅
```

### Production: Browser → Render Backend

```
1. Frontend makes request:
   fetch('https://k2020-ohse-backend.onrender.com/api/health', {
     headers: { 'Origin': 'https://k2020-ohse-s.vercel.app' }
   })

2. Backend CORS middleware checks:
   if (allowedOrigins.has('https://k2020-ohse-s.vercel.app')) {
     // YES - in CORS_ORIGIN_PROD from .env
     return response with: Access-Control-Allow-Origin: https://k2020-ohse-s.vercel.app
   }

3. Browser receives response with CORS header → Request succeeds ✅
```

---

## Why Two .env Files on Frontend?

### The Problem
- Frontend needs to know backend URL at **build time** (for production)
- But different URLs for dev vs prod
- Can't detect "are we prod or dev" at runtime in frontend (it's already built)

### The Solution
- `.env.development` → Used during `npm run dev`
- `.env.production` → Used during `npm run build` (baked into the bundle)
- Each contains the **correct backend URL for that environment**

### What Gets Built Into Bundle

When you run `npm run build`:

```javascript
// Original code in api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Becomes (after build with .env.production):
const API_URL = "https://k2020-ohse-backend.onrender.com/api" || "http://localhost:5000";

// Vite optimizes to:
const API_URL = "https://k2020-ohse-backend.onrender.com/api";
```

The actual URL is **hardcoded in the JavaScript**, not read at runtime.

---

## Why One .env on Backend?

### The Difference
Backend is a **running process** on a specific server.

It can detect its environment at startup:
```typescript
if (process.env.NODE_ENV === 'production') {
  // Use production settings
} else {
  // Use development settings
}
```

So it needs only **one .env file** with both dev and prod settings.

---

## Your Complete Configuration ✅

### Frontend Development
```
.env.development:
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```
✅ **Correct**

### Frontend Production
```
.env.production:
VITE_API_URL=https://k2020-ohse-backend.onrender.com/api
VITE_NODE_ENV=production
```
✅ **Correct**

### Backend All Environments
```
.env:
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
PORT=5000
NODE_ENV=production (runtime detects via Render)
```
✅ **Correct**

---

## Testing Locally

### Step 1: Start Backend
```bash
cd backend
npm install  # If not done yet
npm start
# Output: Backend server running on port 5000
```

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm install  # If not done yet
npm run dev
# Output: Local: http://localhost:5173
```

### Step 3: Verify Configuration
Open browser console at `http://localhost:5173`:
```javascript
console.log(import.meta.env.VITE_API_URL)
// Should output: http://localhost:5000/api

console.log(import.meta.env.VITE_NODE_ENV)
// Should output: development
```

### Step 4: Test API Connection
```javascript
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(d => console.log('Backend responding:', d))
  .catch(e => console.error('Backend not responding:', e))
```

---

## Deployment Checklist

### Before Frontend Deployment to Vercel

- [ ] Backend is deployed to Render (get the URL)
- [ ] Update `.env.production` with actual Render backend URL
- [ ] Run `npm run build` locally and test with `npm run preview`
- [ ] Check browser console shows correct API_URL
- [ ] Test API call works in preview
- [ ] Git commit and push to GitHub
- [ ] Vercel auto-deploys from git

### Backend Configuration for Production

- [ ] `.env` has correct `CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app`
- [ ] `.env` has correct Supabase credentials
- [ ] Deployed to Render with environment variables set
- [ ] Test with: `curl -H "Origin: https://k2020-ohse-s.vercel.app" https://your-render-url/api/health`

---

## Summary Table

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Config Files** | 2 (.env.dev, .env.prod) | 1 (.env) |
| **How it switches** | Automatic (by npm script) | Manual (by NODE_ENV value) |
| **Dev API URL** | Configured in `.env.development` | Listens on port 5000 |
| **Prod API URL** | Hardcoded in bundle | On Render (dynamic URL) |
| **CORS** | Sent in requests | Configured in backend |
| **Variables** | Start with `VITE_` | No prefix |
| **Exposed to Browser** | YES (all variables) | NO (backend only) |

---

## The Bottom Line ✅

Your setup is **production-ready** and **correctly configured**:

- ✅ Frontend knows where backend is (for each environment)
- ✅ Backend allows frontend to talk to it (CORS configured)
- ✅ Both environments properly separated
- ✅ No secrets exposed in frontend
- ✅ Ready to deploy

You can now safely:
```bash
# Local development
npm run dev  # Backend + Frontend

# Production build
npm run build  # Creates optimized bundle with Render URL
npm run preview  # Test production build locally
```

🚀 Everything is ready to go!
