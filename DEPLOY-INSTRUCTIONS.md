# Deploy Now - Quick Instructions

## Current Status
- ✅ Code is ready
- ✅ Environment variables prepared
- ✅ Database configured
- ✅ Admin user created
- ❌ GitHub repository deleted (need to recreate or deploy directly)

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Create New GitHub Repository
1. Go to https://github.com/new
2. Repository name: `furniture-shop` (or any name)
3. Make it **Public** or **Private** (your choice)
4. **Don't** initialize with README
5. Click **Create repository**

### Step 2: Push Your Code
Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/furniture-shop.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. In the Vercel page that's open, click **"Continue with GitHub"**
2. Select your new repository: `furniture-shop`
3. Click **Import**
4. Configure:
   - **Framework Preset:** Next.js
   - **Install Command:** `npm install && npx prisma generate`
   - **Build Command:** `npm run build`
5. **Add Environment Variables** (click "Environment Variables" section):
   - `DATABASE_URL` = `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority`
   - `NEXTAUTH_SECRET` = Generate a secure secret (run `npm run generate-secret`)
   - `NEXTAUTH_URL` = (leave empty for now)
6. Click **Deploy**

## Option 2: Deploy Directly (Without GitHub)

Since Vercel Dashboard requires GitHub for import, use CLI with this workaround:

1. **Create a temporary GitHub repo** (quickest way)
2. Or use Vercel CLI with manual project creation

## After Deployment

1. Copy your deployment URL (e.g., `https://your-project.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` with your actual URL
4. Go to **Deployments** → **Redeploy** the latest deployment

## Admin Login Credentials
- Email: Set via `ADMIN_EMAIL` environment variable or in scripts
- Password: Set via `ADMIN_PASSWORD` environment variable or in scripts

