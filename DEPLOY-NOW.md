# Deploy Now - Step by Step

Since we're starting fresh, follow these steps to deploy via Vercel Dashboard:

## Step 1: Push Code to GitHub (if you want GitHub integration)

If you want to connect to GitHub for automatic deployments:

1. Create a new repository on GitHub
2. Add the remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Project:**
   - **Option A:** If you pushed to GitHub, click **"Import Git Repository"** and select your repo
   - **Option B:** If not using GitHub, click **"Deploy"** and drag your project folder (or use CLI method below)

3. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install && npx prisma generate`
   - **Output Directory:** `.next` (default)

4. **Add Environment Variables (BEFORE clicking Deploy):**
   
   Click **"Environment Variables"** and add these three:
   
   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**
   
   **Variable 2:**
   - Key: `NEXTAUTH_SECRET`
   - Value: `QtMTx33rICj97z/czI2JYtlWPpbop2Et9D62DUEFyzQ=`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**
   
   **Variable 3:**
   - Key: `NEXTAUTH_URL`
   - Value: (leave empty for now - we'll update after deployment)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

5. **Deploy:**
   - Click **"Deploy"** button
   - Wait for deployment to complete (2-5 minutes)

6. **After Deployment:**
   - Copy your deployment URL (e.g., `https://your-project.vercel.app`)
   - Go to **Settings** → **Environment Variables**
   - Edit `NEXTAUTH_URL` and set it to your deployment URL
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment → **Redeploy**

## Step 3: Verify Deployment

1. Visit your deployment URL
2. Test the homepage loads
3. Test admin login:
   - Email: `abdoulkarim@furniture.com`
   - Password: `trawally281986`

## Alternative: CLI Method (if dashboard doesn't work)

If you want to try CLI again, we can create a project with a specific name:

```bash
# This will prompt you interactively
vercel
```

When prompted:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N**
- Project name? → **furniture-ordering-system** (type this exactly)
- Directory? → **./**
- Override settings? → **N**

Then add environment variables via dashboard or CLI.

