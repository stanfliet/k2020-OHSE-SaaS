# Quick Reference Guide

## Project Directories

```
K2020-OHSE-SaaS/
├── frontend/               React app (port 5173)
│   ├── src/components/     Reusable UI components
│   ├── src/pages/          Page components
│   ├── src/lib/            API & utilities
│   ├── src/styles/         CSS files
│   └── src/main.tsx        Entry point
├── backend/                Express app (port 5000)
│   ├── index.js            Server entry
│   ├── server.ts           TypeScript server
│   ├── utils.ts            Utilities & validation
│   └── uploads/            File storage
├── supabase/               Database
│   └── schema.sql          Database schema
└── docs/                   Documentation files
```

## Common Commands

### Frontend
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
npm run preview    # Preview production build
npm install        # Install dependencies
```

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with watch mode
npm test           # Run tests
npm install        # Install dependencies
```

### Git
```bash
git status                    # Check status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push origin main          # Push to remote
git pull upstream main        # Pull from upstream
git checkout -b feature/name  # Create branch
```

## Environment Variables

### Frontend (.env or .env.local)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
OPENAI_API_KEY=sk-your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_KEY=your_service_key
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Health
- `GET /api/health` - Check API status

### Documents
- `POST /api/upload-and-analyze` - Upload and analyze files
- `POST /api/generate-documents` - Generate OHSE documents

## File Structure Reference

### Component Creation
```
frontend/src/components/
MyComponent.tsx         # Component logic
src/styles/
MyComponent.css         # Component styling
```

### Page Creation
```
frontend/src/pages/
MyPage.tsx             # Page component
src/styles/
MyPage.css             # Page styling
```

### API Endpoints
```
backend/
index.js               # Add new routes here
utils.ts               # Add validation/helpers
```

## Code Examples

### Creating a Component
```typescript
import React from "react";
import "../styles/MyComponent.css";

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={onClick}>Click Me</button>
    </div>
  );
}
```

### Creating an API Endpoint
```typescript
app.post("/api/my-endpoint", async (req, res) => {
  try {
    const { data } = req.body;
    
    // Validate
    if (!data) {
      return res.status(400).json({ error: "Missing data" });
    }
    
    // Process
    const result = await processData(data);
    
    // Response
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Using Supabase
```typescript
import { supabase } from "./supabase";

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Query data
const { data, error } = await supabase
  .from("projects")
  .select("*")
  .eq("user_id", user.id);

// Insert data
const { data: newProject, error } = await supabase
  .from("projects")
  .insert([{ name: "My Project", user_id: user.id }]);
```

## Debugging Tips

### Frontend
```
1. Open DevTools: F12
2. Check Console for errors
3. Network tab for API calls
4. Elements tab for DOM structure
5. Use debugger in VS Code
```

### Backend
```
1. Check console logs
2. Use console.log() for debugging
3. Test endpoints with curl
4. Check .env file configuration
5. Verify database connection
```

### Database
```
1. Use Supabase dashboard
2. Check RLS policies
3. View table contents
4. Check query execution
5. Monitor real-time updates
```

## Useful Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev)
- [Express Docs](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

## Keyboard Shortcuts

### VS Code
- `Ctrl+S` - Save file
- `Ctrl+/` - Toggle comment
- `Alt+↑/↓` - Move line
- `Shift+Alt+↓` - Duplicate line
- `Ctrl+Shift+F` - Find in files
- `Ctrl+Shift+P` - Command palette
- `F5` - Start debugging

### Browser DevTools
- `F12` - Open DevTools
- `Ctrl+Shift+I` - Open DevTools
- `Ctrl+Shift+C` - Inspect element
- `Ctrl+Shift+J` - Open Console

## Git Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# 3. Commit regularly
git commit -m "feat: add new feature"

# 4. Push changes
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
# 6. Address review comments
# 7. Merge when approved
```

### Bug Fixes
```bash
# 1. Create fix branch
git checkout -b fix/bug-name

# 2. Fix the bug
# 3. Commit fix
git commit -m "fix: resolve bug"

# 4. Push and create PR
git push origin fix/bug-name
```

## Testing Checklist

Before pushing code:
- [ ] Feature works as intended
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive design tested
- [ ] API endpoints tested
- [ ] Database queries tested
- [ ] Error cases handled
- [ ] Comments added
- [ ] Code formatted

## Deployment Checklist

Before production deployment:
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Security audit passed
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Backup created
- [ ] Rollback plan ready

## Performance Optimization

### Frontend
- Split code by routes
- Lazy load images
- Minimize bundle size
- Use React.memo() for components
- Optimize re-renders

### Backend
- Use connection pooling
- Implement caching
- Add database indexes
- Optimize queries
- Use pagination

## Security Checklist

- [ ] No hardcoded credentials
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Secure headers

## Useful npm Packages

### Already Installed
- `cors` - CORS middleware
- `express` - Web framework
- `multer` - File uploads
- `dotenv` - Environment variables
- `pdf-parse` - PDF extraction
- `openai` - OpenAI API client

### Consider Adding
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `joi` - Input validation
- `pino` - Logging
- `jest` - Testing

---

**Last Updated**: May 25, 2026
