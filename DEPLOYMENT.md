# K2020 OHSE SaaS - Deployment Guide

## Prerequisites

- GitHub repository connected
- Supabase account with project created
- OpenAI API key
- Vercel account (for frontend)
- Render account (for backend)

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the project root

### Step 3: Configure Environment Variables

In Vercel dashboard, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy

Click "Deploy" - Vercel will automatically:
- Build with Vite
- Optimize assets
- Deploy to CDN

Your frontend will be available at: `https://your-project.vercel.app`

## Backend Deployment (Render)

### Step 1: Prepare Repository

Ensure `backend/` directory has:
- `package.json` with `"type": "module"`
- `index.js` as entry point
- All dependencies listed

### Step 2: Create Render Service

1. Go to [render.com](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository

### Step 3: Configure Service

Settings:
- **Name**: k2020-ohse-backend
- **Root Directory**: backend
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

In Render dashboard, add:

```
OPENAI_API_KEY=your-openai-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
CORS_ORIGIN=https://your-project.vercel.app
NODE_ENV=production
PORT=10000
```

### Step 5: Deploy

Click "Create Web Service" - Render will:
- Clone your repository
- Install dependencies
- Start your server

Your backend will be available at: `https://your-backend.onrender.com`

## Database Setup (Supabase)

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Fill in project details
4. Wait for project to initialize

### Step 2: Run Schema

1. Go to SQL Editor
2. Click "New query"
3. Copy contents of `supabase/schema.sql`
4. Paste into editor
5. Click "Run"

This creates all tables, RLS policies, and indexes.

### Step 3: Enable Authentication

1. Go to Authentication > Providers
2. Enable Email/Password
3. Configure email templates if needed

### Step 4: Setup Storage (Optional)

1. Go to Storage
2. Click "New bucket"
3. Name it `documents`
4. Set to private
5. Create RLS policies

## Post-Deployment Checks

### 1. Test Frontend

```bash
# Check frontend loads
curl https://your-project.vercel.app

# Check environment variables are set
Open DevTools > Console
console.log(import.meta.env.VITE_API_URL)
```

### 2. Test Backend

```bash
# Check health endpoint
curl https://your-backend.onrender.com/api/health

# Should respond with:
# {"status":"ok","timestamp":"2026-05-26T..."}
```

### 3. Test API Connection

1. Open frontend
2. Try to login (Supabase auth should work)
3. Upload a document
4. Check backend logs for processing

### 4. Test Database

1. Go to Supabase dashboard
2. Open SQL Editor
3. Query users: `SELECT COUNT(*) FROM auth.users;`
4. Query projects: `SELECT COUNT(*) FROM projects;`

## Monitoring & Logs

### Vercel Logs

```bash
# Watch live logs
vercel logs --tail
```

### Render Logs

Available in Render dashboard > Logs tab

### Supabase Logs

Available in Supabase dashboard > Logs

## Troubleshooting

### Frontend won't load

- Check Vercel build logs
- Verify environment variables are set
- Clear browser cache
- Check CORS headers from backend

### Backend errors

- Check Render logs
- Verify environment variables
- Test health endpoint
- Check OpenAI API quota

### Database connection issues

- Verify Supabase credentials
- Check RLS policies
- Test SQL queries directly
- Check connection pool limits

### File upload fails

- Check file size limit (50MB)
- Verify CORS origin in backend
- Check storage bucket exists
- Verify RLS policies allow uploads

## Environment Variables Reference

### Frontend
```
VITE_SUPABASE_URL       - Supabase project URL
VITE_SUPABASE_ANON_KEY  - Supabase public key
VITE_API_URL            - Backend API URL
VITE_API_URL_PROD       - Production backend URL
VITE_APP_NAME           - Application name
VITE_APP_VERSION        - App version
```

### Backend
```
OPENAI_API_KEY          - OpenAI API key
SUPABASE_URL            - Supabase project URL
SUPABASE_ANON_KEY       - Supabase public key
SUPABASE_SERVICE_KEY    - Supabase service role key
PORT                    - Server port (default: 5000)
NODE_ENV                - development/production
CORS_ORIGIN             - Frontend URL
CORS_ORIGIN_PROD        - Production frontend URL
MAX_FILE_SIZE           - Max upload (default: 50MB)
UPLOAD_DIR              - Upload directory
AI_MODEL                - OpenAI model (default: gpt-4-mini)
AI_TEMPERATURE          - AI temperature (default: 0.7)
```

## Performance Optimization

### Frontend

- [ ] Enable caching in Vercel
- [ ] Setup CDN
- [ ] Optimize images
- [ ] Enable compression
- [ ] Setup analytics

### Backend

- [ ] Add database connection pooling
- [ ] Enable Redis caching
- [ ] Setup load balancing
- [ ] Monitor API response times
- [ ] Setup error tracking

## Security Checklist

- [ ] All secrets in environment variables
- [ ] CORS configured correctly
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] API keys rotated
- [ ] Dependencies updated
- [ ] Security headers set

## Rollback Procedure

### If deployment fails

Vercel:
```bash
# Revert to previous deployment
vercel rollback
```

Render:
```bash
# Manual rollback in dashboard
# Go to Deploys tab and select previous version
```

## Support

For deployment issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Check [Render Docs](https://render.com/docs)
- Check [Supabase Docs](https://supabase.com/docs)
- Email support@k2020-ohse.com

---

**Last Updated**: May 26, 2026
