# Backend NPM Installation Guide

## Quick Command

Run this in your terminal:

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
npm install
```

---

## Step-by-Step Installation

### Step 1: Navigate to Backend Folder

```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS\backend
```

### Step 2: Run npm Install

```bash
npm install
```

### Step 3: Wait for Installation

This will install:
- 13 production dependencies (express, supabase, dotenv, etc.)
- 4 development dependencies (typescript, tsx, nodemon, etc.)
- All transitive dependencies

**Expected time:** 5-10 minutes on first install

### Step 4: Verify Installation

```bash
npm list
```

Should show all packages without errors.

---

## What Gets Installed

### Production Dependencies (13)
```
express@^4.21.2                  - Web framework
@supabase/supabase-js@^2.49.8   - Database client
dotenv@^16.5.0                   - Environment variables
cors@^2.8.5                      - Cross-origin requests
multer@^1.4.5-lts.2             - File upload handling
openai@^4.89.0                   - GPT-4 API client
pdf-parse@^1.1.1                - PDF parsing
pdfkit@^0.13.0                  - PDF generation
docx@^8.5.0                     - DOCX document generation
mammoth@^1.6.1                  - DOCX parsing
@types/express@^4.17.21         - TypeScript types for Express
@types/multer@^1.4.11           - TypeScript types for Multer
@types/node@^20.10.6            - TypeScript types for Node.js
```

### Development Dependencies (4)
```
typescript@^5.8.2               - TypeScript compiler
tsx@^4.7.0                      - Run TypeScript directly
nodemon@^3.1.0                  - Auto-restart on file changes
@types/pdfkit@^0.12.11          - TypeScript types for PDFKit
```

---

## After Installation

### Test Backend Startup

```bash
npm start
```

**Expected output:**
```
Environment: production
Production Mode: true
[RBAC] Initializing Supabase client with URL: https://qvvmuxwwdishi...
Allowed CORS origins: Set(3) {...}
Backend server running on port 5000
```

### Check What Was Installed

```bash
# List all installed packages
npm list

# Show only top-level packages
npm list --depth=0

# Check specific package version
npm list express
```

### If Installation Fails

**Error: "npm not found"**
- Install Node.js from https://nodejs.org
- Add to PATH
- Restart terminal

**Error: "Permission denied"**
- Run terminal as Administrator
- Or try: `npm install --no-optional`

**Error: "Network timeout"**
- Try: `npm install --verbose`
- Or: `npm cache clean --force && npm install`

**Error: "Module not found after install"**
- Delete node_modules: `rm -rf node_modules`
- Delete lock file: `rm package-lock.json`
- Reinstall: `npm install`

---

## Important: node_modules Folder

After `npm install`, you should have:

```
backend/
├── node_modules/              ← All packages installed here (will be large ~500MB)
│   ├── express/
│   ├── @supabase/
│   ├── typescript/
│   ├── ... (many more folders)
├── package.json               ← Package definitions
├── package-lock.json          ← Lock file (auto-generated)
├── index.ts
├── rbac.ts
├── routes.ts
└── ... (other files)
```

---

## Verify All Packages Installed

Run this to see if critical packages are present:

```bash
npm list express @supabase/supabase-js dotenv typescript tsx
```

Should show:
```
express@4.21.2
@supabase/supabase-js@2.49.8
dotenv@16.5.0
typescript@5.8.2
tsx@4.7.0
```

---

## After npm install, Run:

```bash
# 1. Test backend start
npm start

# 2. In new terminal, test frontend
cd ../frontend
npm run dev

# 3. Test login at http://localhost:5173
```

---

## Summary

**Command:** 
```bash
cd backend && npm install
```

**Time:** 5-10 minutes  
**Disk space needed:** ~500MB  
**After install:** Run `npm start` to verify backend works

---

## Notes

- ✅ package.json already has all dependencies listed
- ✅ node_modules will be in `.gitignore` (don't commit to git)
- ✅ npm install is idempotent (safe to run multiple times)
- ✅ All packages are compatible with Node.js v24+ and Windows

---

If you see "npm: not found" error, Node.js may not be installed.  
Download from: https://nodejs.org

If installation completes successfully, proceed to: `npm start`
