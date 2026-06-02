# CORS Quick Reference

## Your Current Configuration ✅

**.env file:**
```env
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

**.backend/index.ts automatically handles:**
```typescript
const allowedOrigins = new Set([
  "http://localhost:5173",         // Dev (from CORS_ORIGIN)
  "https://k2020-ohse-s.vercel.app", // Prod (from CORS_ORIGIN_PROD)
  "http://localhost:5173",         // Vite dev (hardcoded)
  "http://localhost:3000",         // API testing (hardcoded)
]);
```

---

## What Gets Allowed ✅

| Origin | Environment | Status |
|--------|-------------|--------|
| `http://localhost:5173` | Local Development | ✅ ALLOWED |
| `http://localhost:3000` | API Testing | ✅ ALLOWED |
| `https://k2020-ohse-s.vercel.app` | Production | ✅ ALLOWED |
| `https://example.com` | Other | ❌ BLOCKED |

---

## How It Works

### Development
- Frontend runs on: `http://localhost:5173` (Vite)
- Backend runs on: `http://localhost:5000` (Express)
- Frontend can request from backend: ✅ **CORS allows it**

### Production
- Frontend runs on: `https://k2020-ohse-s.vercel.app` (Vercel)
- Backend runs on: `https://your-backend.onrender.com` (Render)
- Frontend can request from backend: ✅ **CORS allows it**

---

## Adding More Origins

If you need to add another origin:

### Option A: Add to .env
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3001
```

Then update index.ts to handle comma-separated values.

### Option B: Add to Hardcoded List in index.ts
```typescript
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN_PROD,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://staging.example.com",  // ← Add here
].filter(Boolean));
```

### Option C: Create .env for Each Environment
**Development:**
```env
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=http://localhost:3000
```

**Production:**
```env
CORS_ORIGIN=https://k2020-ohse-s.vercel.app
CORS_ORIGIN_PROD=https://k2020-ohse-s.vercel.app
```

---

## Testing CORS

```bash
# Test development origin
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     http://localhost:5000/api/health

# Should respond: {"status": "ok"}

# Test production origin
curl -H "Origin: https://k2020-ohse-s.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     https://your-backend.onrender.com/api/health

# Should respond: {"status": "ok"}
```

---

## Security Notes ✅

- ✅ **Whitelist:** Only specified origins allowed
- ✅ **No wildcard:** Not using `*` (which allows all)
- ✅ **Credentials:** Enabled for authenticated requests
- ✅ **Methods:** GET, POST, PUT, DELETE, OPTIONS
- ✅ **Headers:** Content-Type, Authorization

---

## Your Setup is Production-Ready ✅

- ✅ Development CORS configured
- ✅ Production CORS configured
- ✅ Security best practices followed
- ✅ Ready to deploy

**No further CORS configuration needed!**
