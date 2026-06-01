# Git Commit & Push Commands

Run these commands in your terminal to commit the fixes to GitHub:

## Step 1: Stage All Changes
```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS
git add .
```

## Step 2: Commit with Message
```bash
git commit -m "fix: move dotenv.config() to top of index.ts for proper env loading; add deployment guides"
```

## Step 3: Push to GitHub
```bash
git push origin main
```

## Complete Command (Run All At Once)
```bash
cd C:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS && git add . && git commit -m "fix: move dotenv.config() to top of index.ts for proper env loading; add deployment guides" && git push origin main
```

## What's Being Committed

### Modified Files
- `backend/index.ts` - Fixed dotenv loading order (CRITICAL FIX)

### New Files
- `CHECKPOINT_006_COMPLETE_AND_READY.md` - Final status report
- `BACKEND_LAUNCH_COMMANDS.md` - Quick launch guide
- `GIT_COMMIT_COMMANDS.md` - This file

## Verification After Push

1. Go to https://github.com/stanfliet/k2020-OHSE-SaaS
2. Verify commits appear in main branch
3. Check that all files are there

## Next: Deployment

After commit is pushed, follow these steps:

1. **Local Testing (10 minutes)**
   ```bash
   cd backend
   npm start
   ```

2. **Deploy to Render (30 minutes)**
   - Connect GitHub repo to Render.com
   - Set environment variables
   - Deploy backend

3. **Deploy to Vercel (20 minutes)**
   - Connect GitHub repo to Vercel
   - Set environment variables
   - Deploy frontend

See `FINAL_DEPLOYMENT_CHECKLIST.md` for detailed instructions.
