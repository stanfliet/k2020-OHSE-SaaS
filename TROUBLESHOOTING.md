# Troubleshooting Guide

## Common Issues & Solutions

### Frontend Issues

#### Issue: "Cannot find module" errors
**Symptoms**: `Cannot find module or type declarations for side-effect import`

**Solutions**:
1. Clear node_modules and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

2. Clear Vite cache:
```bash
rm -rf .vite node_modules/.vite
npm run dev
```

3. Check tsconfig.json settings
4. Ensure CSS files exist in src/styles/

---

#### Issue: Styling not applied
**Symptoms**: Components render but styles are missing

**Solutions**:
1. Verify CSS files are imported in components
2. Check CSS file paths are correct
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for CSS loading errors
5. Verify class names match between TSX and CSS

---

#### Issue: "VITE_SUPABASE_URL is undefined"
**Symptoms**: Supabase connection fails

**Solutions**:
1. Verify .env file exists in frontend directory
2. Check environment variables are properly named with VITE_ prefix
3. Restart dev server after .env changes
4. Verify Supabase URL is correct and accessible

---

#### Issue: Login page not working
**Symptoms**: Login button doesn't work or shows errors

**Solutions**:
1. Check Supabase credentials in .env
2. Verify Supabase project is active
3. Check browser console for detailed errors
4. Test API endpoint: `curl https://your-supabase-url/auth/v1/health`
5. Clear localStorage and try again

---

### Backend Issues

#### Issue: "Port 5000 already in use"
**Symptoms**: Backend fails to start, port already in use error

**Solutions**:
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Alternative: Change PORT in .env file

---

#### Issue: "Cannot find package 'multer'"
**Symptoms**: Backend crashes with module not found

**Solutions**:
1. Install dependencies:
```bash
cd backend
npm install
```

2. Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. Check package.json has all required dependencies

---

#### Issue: "OPENAI_API_KEY is missing"
**Symptoms**: Document analysis fails

**Solutions**:
1. Verify .env has OPENAI_API_KEY
2. Check API key is valid (should start with sk-)
3. Verify OpenAI account has credits/quota
4. Check API key hasn't been revoked

---

#### Issue: File upload fails
**Symptoms**: "File upload failed" error

**Solutions**:
1. Verify file size is under 50MB
2. Check file type is supported (PDF, DOCX, TXT, PNG, JPG)
3. Ensure uploads/ directory exists and is writable
4. Check disk space is available
5. Verify NODE_ENV is set correctly
6. Check MAX_FILE_SIZE in .env

---

#### Issue: Backend crashes on startup
**Symptoms**: Server starts then immediately crashes

**Solutions**:
1. Check all required environment variables are set
2. Verify database connections
3. Check for port conflicts
4. Review error logs in console
5. Verify Node.js version >= 18

---

### API Issues

#### Issue: CORS errors when calling API
**Symptoms**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Verify CORS_ORIGIN in backend .env matches frontend URL
2. Check backend CORS middleware is configured
3. Verify OPTIONS requests are handled
4. Clear browser cache
5. Test with curl:
```bash
curl -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -X OPTIONS http://localhost:5000/api/health
```

---

#### Issue: API returns 500 errors
**Symptoms**: All API requests return 500 Internal Server Error

**Solutions**:
1. Check backend console logs for errors
2. Verify all environment variables are set
3. Test API health: `curl http://localhost:5000/api/health`
4. Restart backend server
5. Check database connectivity
6. Review backend code for bugs

---

### Database Issues

#### Issue: "Cannot connect to Supabase"
**Symptoms**: Database operations fail, connection errors

**Solutions**:
1. Verify Supabase URL and keys in .env
2. Check Supabase project is active in console
3. Verify database hasn't been suspended
4. Check network connectivity
5. Test connection:
```bash
curl https://your-supabase-url/rest/v1/
```

---

#### Issue: RLS policies blocking queries
**Symptoms**: "row level security" errors

**Solutions**:
1. Check RLS policies are configured correctly
2. Verify user is authenticated
3. Check user ID in JWT token
4. Test with service key (bypass RLS)
5. Review RLS policy rules

---

### Deployment Issues

#### Issue: Backend won't start on Render
**Symptoms**: Deployment fails or crashes after deploy

**Solutions**:
1. Check build command in render.json
2. Verify all environment variables are set in Render dashboard
3. Check Node.js version setting
4. Review deployment logs on Render dashboard
5. Verify start command is correct
6. Check for hardcoded localhost values

---

#### Issue: Frontend build fails on Vercel
**Symptoms**: Deploy fails during build phase

**Solutions**:
1. Check build command: `npm run build`
2. Verify all environment variables are set
3. Test build locally: `cd frontend && npm run build`
4. Check for TypeScript errors
5. Verify dependencies are installed
6. Check node_modules are not committed

---

#### Issue: Deployed app shows blank page
**Symptoms**: Frontend loads but nothing displays

**Solutions**:
1. Open browser DevTools console
2. Check for JavaScript errors
3. Verify API_URL is correct and accessible
4. Check network requests in DevTools
5. Verify Supabase connection works
6. Check service worker issues
7. Clear browser cache

---

### Performance Issues

#### Issue: Slow document upload/analysis
**Symptoms**: Taking too long to process files

**Solutions**:
1. Check file size (large files take longer)
2. Verify OpenAI API isn't rate limited
3. Check backend CPU/memory usage
4. Optimize PDF extraction
5. Consider chunking large documents
6. Upgrade backend plan on Render

---

#### Issue: High API response times
**Symptoms**: API calls are slow

**Solutions**:
1. Check backend resource usage
2. Verify database query performance
3. Add indexes to database tables
4. Implement caching layer
5. Monitor network latency
6. Consider CDN for assets

---

## Getting Help

### Check These First
1. Error message in browser console (F12)
2. Backend server console logs
3. Network tab in DevTools
4. .env file configuration
5. Latest error logs

### Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Create an Issue
If you can't find a solution:
1. Go to GitHub Issues
2. Provide detailed error message
3. Include steps to reproduce
4. Share relevant console logs
5. Mention your environment (OS, Node version)

---

## Debug Mode

Enable detailed logging:

**Frontend** - Add to main.tsx:
```typescript
if (import.meta.env.DEV) {
  console.log("Debug mode enabled");
  window.DEBUG = true;
}
```

**Backend** - Set NODE_ENV=development:
```bash
NODE_ENV=development npm start
```

---

**Last Updated**: May 25, 2026
