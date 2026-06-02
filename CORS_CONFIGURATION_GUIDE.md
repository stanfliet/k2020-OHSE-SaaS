# CORS Configuration Guide: Development & Production

## Current .env Setup

Your `.env` file currently has:
```env
# CORS
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

✅ **This setup is good!** But let me show you the best practices and all your options.

---

## How CORS Works in Your Backend

**File:** `backend/index.ts` (lines 43-48)

```typescript
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,         // Dev origin from .env
  process.env.CORS_ORIGIN_PROD,    // Prod origin from .env
  "http://localhost:5173",         // Frontend dev server (Vite)
  "http://localhost:3000",         // Hardcoded fallback
].filter(Boolean));
```

✅ Your code **already supports multiple CORS origins!**

The `.filter(Boolean)` removes any undefined values.

---

## Best Practices for .env CORS Configuration

### Option 1: Simple (What You Have Now) ✅

**Best for:** Most projects

```env
# CORS Configuration
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**Pros:**
- ✅ Simple and clean
- ✅ Covers most use cases
- ✅ Already in your code

**How it works:**
- Dev: `http://localhost:5173` (local Vite frontend)
- Prod: `https://k2020-ohse-s.vercel.app` (Vercel production)

---

### Option 2: Multiple Environments (Recommended) ✅

**Best for:** Multiple deployment environments (dev, staging, prod)

```env
# CORS Configuration - Development
CORS_ORIGIN_DEV=http://localhost:5173

# CORS Configuration - Staging
CORS_ORIGIN_STAGING=https://staging.k2020-ohse-s.vercel.app

# CORS Configuration - Production
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**Then update `index.ts` to:**

```typescript
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN_DEV,
  process.env.CORS_ORIGIN_STAGING,
  process.env.CORS_ORIGIN_PROD,
  "http://localhost:5173",  // Fallback for local dev
  "http://localhost:3000",  // Fallback for local API testing
].filter(Boolean));
```

---

### Option 3: Comma-Separated Origins (Most Flexible) ⭐

**Best for:** Multiple origins without separate env vars

```env
# CORS Configuration - Comma-separated list
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://k2020-ohse-s.vercel.app,https://staging.k2020-ohse-s.vercel.app
```

**Then update `index.ts` to:**

```typescript
const allowedOriginsList = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...allowedOriginsList,
  "http://localhost:5173",  // Always allow local dev
]);
```

---

### Option 4: Environment-Based Auto-Config (Advanced) 🚀

**Best for:** Automatic config based on NODE_ENV

```env
# Environment
NODE_ENV=development
# or NODE_ENV=production

# CORS - Will be selected based on NODE_ENV
CORS_ORIGIN_DEVELOPMENT=http://localhost:5173
CORS_ORIGIN_STAGING=https://staging.k2020-ohse-s.vercel.app
CORS_ORIGIN_PRODUCTION=https://k2020-ohse-s.vercel.app
```

**Then update `index.ts` to:**

```typescript
const nodeEnv = process.env.NODE_ENV || 'development';
const corsByEnv = {
  development: process.env.CORS_ORIGIN_DEVELOPMENT || 'http://localhost:5173',
  staging: process.env.CORS_ORIGIN_STAGING || 'http://localhost:3000',
  production: process.env.CORS_ORIGIN_PRODUCTION || 'https://k2020-ohse-s.vercel.app',
};

const allowedOrigins = new Set([
  corsByEnv[nodeEnv as keyof typeof corsByEnv],
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean));
```

---

## 📊 Comparison Table

| Option | Simplicity | Flexibility | Best For |
|--------|-----------|------------|----------|
| Option 1 (Current) | ⭐⭐⭐⭐⭐ | ⭐⭐ | Small projects |
| Option 2 | ⭐⭐⭐⭐ | ⭐⭐⭐ | Multiple envs |
| Option 3 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Many origins |
| Option 4 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Dynamic config |

---

## Your Current Setup Analysis

**Current .env:**
```env
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**Current index.ts:**
```typescript
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,         // = "http://localhost:3000"
  process.env.CORS_ORIGIN_PROD,    // = "https://k2020-ohse-s.vercel.app"
  "http://localhost:5173",         // Vite dev (always added)
  "http://localhost:3000",         // Fallback (always added)
].filter(Boolean));
```

**Actual allowed origins:**
- ✅ `http://localhost:3000`
- ✅ `https://k2020-ohse-s.vercel.app`
- ✅ `http://localhost:5173`

✅ **Your setup is correct!** But I recommend a small fix...

---

## Recommended Fix for Your .env

**Change this:**
```env
CORS_ORIGIN=http://localhost:3000
```

**To this:**
```env
CORS_ORIGIN=http://localhost:5173
```

**Why?**
- `http://localhost:5173` is your Vite frontend dev server
- `http://localhost:3000` is already hardcoded as fallback in index.ts
- This makes .env clearer about what dev environment you're using

**Updated .env:**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-efghijklmnop5678efghijklmnop5678efghijkl

# Supabase Configuration
SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=http://localhost:5173        # ← Frontend dev server (Vite)
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app  # ← Production frontend

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# AI Configuration
AI_MODEL=gpt-4-mini
AI_TEMPERATURE=0.7
```

---

## Complete Setup for Development & Production

### Development (.env)
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=http://localhost:3000
```

### Production (.env.production or Render env vars)
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://k2020-ohse-s.vercel.app
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

---

## How to Add More Origins

If you need to add more allowed origins:

### Method 1: Update .env and Restart
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3001
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app,https://staging.example.com
```

Then update `index.ts`:
```typescript
const allowedOrigins = new Set([
  ...(process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean),
  ...(process.env.CORS_ORIGIN_PROD || '').split(',').map(o => o.trim()).filter(Boolean),
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean));
```

### Method 2: Add to Hardcoded List
```typescript
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN_PROD,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",              // ← Add here
  "https://staging.example.com",        // ← Add here
].filter(Boolean));
```

---

## Testing CORS Configuration

### Test from Localhost
```bash
curl -H "Origin: http://localhost:5173" http://localhost:3000/api/health
```

**Should work:** ✅ No CORS error

### Test from Vercel Production
```bash
curl -H "Origin: https://k2020-ohse-s.vercel.app" https://your-backend.onrender.com/api/health
```

**Should work:** ✅ No CORS error

### Test from Blocked Origin
```bash
curl -H "Origin: https://example.com" http://localhost:3000/api/health
```

**Should be blocked:** ✅ CORS error (expected)

---

## CORS Security Best Practices

### ✅ DO:
- ✅ Whitelist specific origins (don't use `*`)
- ✅ Use HTTPS in production
- ✅ Never hardcode secrets in CORS origins
- ✅ Keep credentials: true for authenticated requests
- ✅ Test CORS in different environments

### ❌ DON'T:
- ❌ Use `*` as origin (allows anyone)
- ❌ Trust all origins
- ❌ Put sensitive data in CORS config
- ❌ Disable CORS entirely as a shortcut

---

## Your CORS Configuration Summary

**Current (Working):**
```env
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**Recommended (Better clarity):**
```env
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**Why the change?**
- Makes it clear CORS_ORIGIN is for Vite frontend (port 5173)
- `localhost:3000` fallback still works (hardcoded)
- More intuitive naming

**Keep:**
```env
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

This is correct and ready for production!

---

## Deployment Configuration

### Render (Backend)
Add environment variable in Render dashboard:
```
CORS_ORIGIN=https://k2020-ohse-s.vercel.app
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

### Vercel (Frontend)
Add in .env.production:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Recommended Action

Update your `.env` file:

```diff
- CORS_ORIGIN=http://localhost:3000
+ CORS_ORIGIN=http://localhost:5173
```

Then commit:
```bash
git add backend/.env
git commit -m "config: clarify CORS_ORIGIN for Vite frontend"
```

---

## Summary

✅ **Your current CORS setup works perfectly**  
✅ **Both development and production are configured**  
✅ **Secure (whitelist, not wildcard)**  
✅ **Ready for deployment**

The only recommendation is to clarify which port is development (5173 for Vite).

**Do you want me to update the .env file for you?**
