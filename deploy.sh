#!/bin/bash
# K2020 OHSE SaaS - Deployment Helper Script
# This script helps with the deployment process

echo "🚀 K2020 OHSE SaaS - Deployment Helper"
echo "======================================"
echo ""

# Check if all environment files exist
echo "✓ Checking environment configuration..."

if [ -f "frontend/.env" ]; then
  echo "  ✓ Frontend .env found"
else
  echo "  ✗ Frontend .env not found - creating from template"
  cp .env.example frontend/.env
fi

if [ -f "backend/.env" ]; then
  echo "  ✓ Backend .env found"
else
  echo "  ✗ Backend .env not found - creating from template"
  cp .env.example backend/.env
fi

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "======================="
echo ""
echo "Before deploying, ensure:"
echo ""
echo "1. SUPABASE SETUP:"
echo "   ☐ Create account at https://supabase.com"
echo "   ☐ Create a new project"
echo "   ☐ Go to Project Settings > API"
echo "   ☐ Copy Project URL (VITE_SUPABASE_URL)"
echo "   ☐ Copy anon/public key (VITE_SUPABASE_ANON_KEY)"
echo "   ☐ Copy service_role key (SUPABASE_SERVICE_KEY)"
echo "   ☐ Run schema.sql in SQL Editor"
echo ""
echo "2. OPENAI SETUP:"
echo "   ☐ Create account at https://openai.com"
echo "   ☐ Go to API Keys section"
echo "   ☐ Create new API key"
echo "   ☐ Copy key to OPENAI_API_KEY"
echo ""
echo "3. GITHUB SETUP:"
echo "   ☐ Push code to GitHub"
echo "   ☐ Create Personal Access Token (PAT)"
echo ""
echo "4. RENDER SETUP (Backend):"
echo "   ☐ Create account at https://render.com"
echo "   ☐ Connect GitHub account"
echo "   ☐ Create New > Web Service"
echo "   ☐ Select your repository"
echo "   ☐ Configure: Name, Build, Start commands"
echo "   ☐ Add environment variables from backend/.env"
echo "   ☐ Deploy"
echo ""
echo "5. VERCEL SETUP (Frontend):"
echo "   ☐ Create account at https://vercel.com"
echo "   ☐ Import project from GitHub"
echo "   ☐ Select 'frontend' as root directory"
echo "   ☐ Add environment variables"
echo "   ☐ Deploy"
echo ""
echo "📝 NEXT STEPS:"
echo "=============="
echo "1. Update frontend/.env with Supabase credentials"
echo "2. Update backend/.env with all required keys"
echo "3. Test locally: npm start (backend) and npm run dev (frontend)"
echo "4. Deploy to Render and Vercel using their dashboards"
echo "5. After deployment, commit with: git add . && git commit -m 'deploy: production deployment'"
echo ""
echo "🔗 Documentation:"
echo "=================="
echo "Frontend: See DEPLOYMENT.md"
echo "Backend: See DEPLOYMENT.md"
echo "Troubleshooting: See TROUBLESHOOTING.md"
echo ""
