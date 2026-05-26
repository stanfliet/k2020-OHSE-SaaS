# Complete Deployment Guide - K2020 OHSE SaaS

## Overview

This guide will walk you through deploying the K2020 OHSE SaaS application to production using:
- **Supabase** for database and authentication
- **Render** for backend hosting
- **Vercel** for frontend hosting

---

## Phase 1: Supabase Setup (Database & Auth)

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign up" and create a free account
3. Verify your email address

### Step 2: Create a New Project

1. In Supabase Dashboard, click "New Project"
2. Fill in:
   - **Project Name**: `k2020-ohse`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., US East)
3. Click "Create new project" and wait 2-3 minutes

### Step 3: Get Your Credentials

1. Go to **Project Settings > API** (bottom left)
2. Copy and save these values:
   - **Project URL** → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_KEY`

### Step 4: Setup Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents from `supabase/schema.sql`
4. Paste into SQL Editor
5. Click **"Run"** (execute the query)
6. You should see success message with tables created

### Step 5: Enable Email Authentication

1. Go to **Authentication > Providers**
2. Ensure **Email** is enabled
3. Go to **Authentication > Email Templates**
4. Verify the confirmation email template (default is fine)

### Step 6: Configure CORS for Supabase

1. Go to **Project Settings > API**
2. Under **CORS Allow List**, add:
   - `http://localhost:5173` (local development)
   - `http://localhost:5000` (local backend)
   - Later add your production domains

✅ **Supabase is ready!**

---

## Phase 2: Backend Deployment (Render)

### Step 1: Prepare Your GitHub Repository

```bash
# Make sure all files are committed
cd c:\Users\k2020\OneDrive\Desktop\K2020-OHSE-SaaS
git status
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign up"** or **"Sign in with GitHub"**
3. Authorize Render to access your GitHub repositories

### Step 3: Deploy Backend Service

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Choose **"Deploy an existing repository"**
4. Select your `k2020-OHSE-SAAS` repository
5. Fill in:
   - **Name**: `k2020-ohse-backend`
   - **Environment**: `Node`
   - **Region**: Your closest region
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free)

### Step 4: Add Environment Variables to Render

1. In Render deployment screen, scroll to **"Environment"**
2. Add each variable (click **"Add Environment Variable"**):

```
OPENAI_API_KEY=sk-your_key_here
SUPABASE_URL=https://your-url.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_PROD=https://your-frontend-domain.vercel.app
```

3. Click **"Create Web Service"**
4. Wait for deployment (5-10 minutes)
5. You'll see a URL like: `https://k2020-ohse-backend.onrender.com`

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://k2020-ohse-backend.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

✅ **Backend is deployed!**

---

## Phase 3: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign up"** or **"Sign in with GitHub"**
3. Authorize Vercel to access your repositories

### Step 2: Deploy Frontend

1. In Vercel Dashboard, click **"Add New..."** > **"Project"**
2. Click **"Import Git Repository"**
3. Select your `k2020-OHSE-SAAS` repository
4. Click **"Import"**

### Step 3: Configure Build Settings

1. Under **"Configure Project"**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

2. Click **"Continue"**

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_SUPABASE_URL=https://your-url.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://k2020-ohse-backend.onrender.com
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build and deployment (3-5 minutes)
3. You'll get a URL like: `https://k2020-ohse-frontend.vercel.app`

✅ **Frontend is deployed!**

---

## Phase 4: Post-Deployment Configuration

### Update Supabase CORS

1. Go back to Supabase > **Project Settings > API**
2. Add to **CORS Allow List**:
   - Your Vercel frontend URL
   - Your Render backend URL

### Update Environment Variables

**In Vercel:**
1. Go to Project Settings > Environment Variables
2. Update `VITE_API_URL` to your Render backend URL

**In Render:**
1. Go to your service
2. Settings > Environment > Edit environment variables
3. Update `CORS_ORIGIN_PROD` to your Vercel URL

### Test the Deployment

1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Try to sign up with test credentials
3. Check backend logs in Render for errors

---

## Phase 5: Continuous Deployment Setup

### GitHub Webhooks (Auto-Deploy)

Both Render and Vercel automatically deploy when you push to main:

```bash
# Make code changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Render and Vercel will automatically rebuild and deploy
# Check their dashboards for deployment status
```

---

## Troubleshooting Deployment

### Issue: "Failed to fetch" in frontend

**Solution:**
1. Check Supabase credentials are correct
2. Verify CORS is configured in Supabase
3. Check browser console for exact error
4. Verify network connectivity

### Issue: Backend won't start on Render

**Solution:**
1. Check all environment variables are set
2. Review build logs in Render dashboard
3. Ensure Node.js version is compatible
4. Check for hardcoded localhost values in code

### Issue: Frontend build fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `cd frontend && npm run build`
4. Check for TypeScript errors

### Issue: Supabase auth not working

**Solution:**
1. Verify CORS settings in Supabase
2. Check API keys are correct
3. Ensure email confirmation is enabled
4. Check browser console for auth errors

---

## Monitoring & Maintenance

### Monitor Backend (Render)

1. Go to Render Dashboard > Your Service
2. Check **Metrics** tab for:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

### Monitor Frontend (Vercel)

1. Go to Vercel Dashboard > Your Project
2. Check **Analytics** for:
   - Page load times
   - Core Web Vitals
   - Error tracking

### Database Monitoring (Supabase)

1. Go to Supabase Dashboard
2. Check **Database** > **Usage** for:
   - Storage used
   - Real-time message count
   - Active connections

---

## Production Checklist

Before marking as ready for production:

- [ ] Supabase project created and configured
- [ ] Database schema loaded
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured on Supabase
- [ ] Sign up works in production
- [ ] Login works in production
- [ ] Document upload works
- [ ] AI analysis works
- [ ] No console errors in production
- [ ] SSL/TLS certificates working (automatic on both services)
- [ ] Monitoring setup complete

---

## Custom Domains (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings > Domains
2. Enter your domain (e.g., `app.example.com`)
3. Update DNS records as instructed
4. Wait for propagation (typically 24 hours)

### Add Custom Domain to Render

1. Go to Service Settings > Custom Domains
2. Add your domain
3. Update DNS records as instructed

---

## Next Steps

1. **Test thoroughly** in production
2. **Gather user feedback** from beta testers
3. **Monitor performance** and logs
4. **Make improvements** based on feedback
5. **Scale as needed** (upgrade plan on Render/Vercel)

---

## Support

For detailed help:
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Issues](https://github.com/stanfliet/k2020-OHSE-SAAS/issues)

---

**Deployment Date**: May 26, 2026
**Status**: Ready for Production
