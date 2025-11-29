# Quick Deployment Guide

## Deploy to Vercel (Recommended - Easiest)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (for first deployment)
- Project name? **furniture-ordering-system** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 4: Set Environment Variables

After deployment, go to Vercel Dashboard → Your Project → Settings → Environment Variables and add:

```
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key-minimum-32-characters
```

### Step 5: Redeploy

After setting environment variables, redeploy:
```bash
vercel --prod
```

Or trigger a new deployment from Vercel dashboard.

## Alternative: Deploy from GitHub

1. Push your code to GitHub (already done)
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository: `ubaidtra/Furniture-shop`
5. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install && npx prisma generate`
6. Add environment variables
7. Click "Deploy"

## Post-Deployment

1. Update `NEXTAUTH_URL` in environment variables to match your Vercel domain
2. Run database migrations: `npx prisma db push`
3. Create admin user: Use the scripts or do it manually
4. Test the application

## Production URLs

After deployment, your app will be available at:
- `https://your-project.vercel.app`

Update `NEXTAUTH_URL` environment variable to this URL.
