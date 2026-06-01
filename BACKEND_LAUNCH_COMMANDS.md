# Backend Launch Commands

## Quick Start (Local Development)

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```

**Expected Output:**
```
Environment: production
Production Mode: true
Allowed CORS origins: ...
Supabase client connected
Backend server running on port 5000
```

### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.0
Local: http://localhost:5173/
```

## Verify Servers are Running

### Backend Health Check
```bash
curl http://localhost:3000/health
# Expected: { "status": "ok" }
```

### Frontend Access
```
Open browser: http://localhost:5173
```

## Environment Validation

The `.env` file contains:
- ✅ SUPABASE_URL (real project URL)
- ✅ SUPABASE_ANON_KEY (JWT token for public access)
- ✅ SUPABASE_SERVICE_ROLE_KEY (JWT token for admin)
- ✅ OPENAI_API_KEY (GPT-4-mini access)
- ✅ PORT (5000 for backend)
- ✅ NODE_ENV (production)

## Common Issues & Fixes

### Issue: "Port 3000 already in use"
**Fix:** Kill existing process or change PORT in .env
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Cannot find module 'dotenv'"
**Fix:** Reinstall dependencies
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: "supabaseUrl is required"
**Fix:** Verify .env file
```bash
# Check that SUPABASE_URL is not empty
cat .env | grep SUPABASE_URL

# Should show:
# SUPABASE_URL=https://qvvmuxwwdishyskheqnh.supabase.co
```

### Issue: "Unexpected token import"
**Fix:** Already fixed - using tsx to run TypeScript directly
```bash
npm start  # Uses tsx, not node
```

## Production Deployment

### Build Backend
```bash
cd backend
npm run build  # Compiles TypeScript to dist/
```

### Run Compiled Backend
```bash
cd backend
node dist/index.js
```

**Note:** For development, use `npm start` (tsx). For production on Render, use `npm run build` then `node dist/index.js`.

## Next Steps

1. Run `npm start` in backend folder
2. Run `npm run dev` in frontend folder
3. Test login at http://localhost:5173
4. Create test project
5. Test document generation
6. Deploy to Render & Vercel (see FINAL_DEPLOYMENT_CHECKLIST.md)
