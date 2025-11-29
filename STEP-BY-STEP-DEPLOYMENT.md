# Step-by-Step Deployment Guide

This is a comprehensive, beginner-friendly guide to deploy your Furniture Ordering System to production.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Code pushed to GitHub (already done: `https://github.com/ubaidtra/Furniture-shop`)
- ✅ MongoDB Atlas account (or MongoDB database)
- ✅ Node.js installed locally (for testing)
- ✅ Git installed

---

## 🚀 Method 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications. It's free for personal projects and handles everything automatically.

### Step 1: Prepare Your Environment Variables

First, generate a secure secret for NextAuth:

**Option A: Using the provided script**
```bash
npm run generate-secret
```

**Option B: Using OpenSSL (if available)**
```bash
openssl rand -base64 32
```

**Option C: Online generator**
Visit: https://generate-secret.vercel.app/32

**Save this secret** - you'll need it in Step 4.

### Step 2: Install Vercel CLI

Open your terminal in the project directory and run:

```bash
npm i -g vercel
```

Wait for the installation to complete.

### Step 3: Login to Vercel

```bash
vercel login
```

This will open your browser. Log in with:
- GitHub account (recommended)
- Email account
- Or create a new account

### Step 4: Deploy to Vercel

Run the deployment command:

```bash
vercel
```

**Answer the prompts as follows:**

1. **Set up and deploy?** → Type `Y` and press Enter
2. **Which scope?** → Select your account (usually the first option)
3. **Link to existing project?** → Type `N` (for first deployment)
4. **What's your project's name?** → Type `furniture-ordering-system` (or press Enter for default)
5. **In which directory is your code located?** → Type `./` and press Enter
6. **Want to override the settings?** → Type `N` and press Enter

Vercel will now:
- Upload your code
- Install dependencies
- Build your application
- Deploy it

**Wait for the deployment to complete.** You'll see a URL like: `https://furniture-ordering-system-xxxxx.vercel.app`

### Step 5: Set Environment Variables

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `furniture-ordering-system`

2. **Navigate to Settings:**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add the following variables:**

   Click **Add New** for each variable:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority`
     - Replace with your actual MongoDB connection string from MongoDB Atlas
   - Environment: Select **Production**, **Preview**, and **Development** (all three)
   - Click **Save**

   **Variable 2:**
   - Key: `NEXTAUTH_URL`
   - Value: `https://furniture-ordering-system-xxxxx.vercel.app` (use your actual Vercel URL from Step 4)
   - Environment: Select **Production**, **Preview**, and **Development** (all three)
   - Click **Save**

   **Variable 3:**
   - Key: `NEXTAUTH_SECRET`
   - Value: (paste the secret you generated in Step 1)
   - Environment: Select **Production**, **Preview**, and **Development** (all three)
   - Click **Save**

### Step 6: Redeploy with Environment Variables

After adding environment variables, you need to redeploy:

**Option A: Using CLI**
```bash
vercel --prod
```

**Option B: Using Dashboard**
1. Go to your project in Vercel Dashboard
2. Click on **Deployments** tab
3. Click the **⋯** (three dots) on the latest deployment
4. Click **Redeploy**

### Step 7: Set Up Database

1. **Connect to your MongoDB database** (make sure it's accessible from the internet)

2. **Push the database schema:**
   ```bash
   npx prisma db push
   ```
   This creates all the necessary tables in your database.

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Step 8: Create Admin User

You need to create an admin user to access the admin panel. You can do this in two ways:

**Option A: Using the script (if available)**
```bash
node scripts/create-admin.js
```

**Option B: Manually through MongoDB**
1. Go to MongoDB Atlas
2. Open your database
3. Find the `User` collection
4. Insert a new document:
   ```json
   {
     "email": "admin@example.com",
     "password": "hashed_password_here",
     "role": "ADMIN",
     "name": "Admin User"
   }
   ```
   Note: You'll need to hash the password using bcrypt.

### Step 9: Test Your Deployment

1. **Visit your deployed URL:**
   - Go to: `https://furniture-ordering-system-xxxxx.vercel.app`

2. **Test the following:**
   - ✅ Homepage loads
   - ✅ Products page loads
   - ✅ Sign up page works
   - ✅ Login page works
   - ✅ Admin login works (use credentials from Step 8)
   - ✅ Cart functionality works
   - ✅ Order creation works

### Step 10: Update NEXTAUTH_URL (If Needed)

If your Vercel URL changed or you want to use a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to match your current domain
3. Redeploy (Step 6)

---

## 🌐 Method 2: Deploy via GitHub Integration (Alternative)

If you prefer using the web interface instead of CLI:

### Step 1: Go to Vercel

Visit: https://vercel.com

### Step 2: Sign In

Click **Sign In** and log in with your GitHub account.

### Step 3: Import Project

1. Click **Add New...** → **Project**
2. You'll see your GitHub repositories
3. Find and click **Import** next to `ubaidtra/Furniture-shop`

### Step 4: Configure Project

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (leave as default)
- **Install Command:** `npm install && npx prisma generate`

Click **Deploy** (don't add environment variables yet).

### Step 5: Add Environment Variables

After the first deployment:

1. Go to **Settings** → **Environment Variables**
2. Add the three variables as described in Method 1, Step 5
3. Redeploy

### Step 6-10: Follow Steps 7-10 from Method 1

Complete the database setup, create admin user, and test.

---

## 🐳 Method 3: Deploy with Docker

If you want to deploy to your own server or a Docker-compatible platform:

### Step 1: Check Dockerfile

Your project already has a `Dockerfile`. Verify it exists and is correct.

### Step 2: Build Docker Image

```bash
docker build -t furniture-ordering-system .
```

### Step 3: Create .env.production File

Create a file named `.env.production`:

```env
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here
PORT=5000
```

### Step 4: Run Docker Container

```bash
docker run -p 5000:5000 --env-file .env.production furniture-ordering-system
```

### Step 5: Set Up Database

Follow Step 7 from Method 1 to set up the database.

---

## 🔧 Post-Deployment Checklist

After deployment, verify everything works:

- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] User signup works
- [ ] User login works
- [ ] Admin login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Order creation works
- [ ] Admin dashboard accessible
- [ ] Operator dashboard accessible
- [ ] Image uploads work (if applicable)
- [ ] Database connection is stable

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
1. Test build locally: `npm run build`
2. Fix any TypeScript or build errors
3. Ensure all dependencies are in `package.json`
4. Check that Prisma schema is valid

### Issue: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` is correct in environment variables
2. Check MongoDB Atlas IP whitelist (should allow all IPs: `0.0.0.0/0` for testing)
3. Verify MongoDB credentials are correct
4. Ensure database exists

### Issue: NextAuth Not Working

**Solution:**
1. Verify `NEXTAUTH_URL` matches your actual domain exactly
2. Check `NEXTAUTH_SECRET` is set and is at least 32 characters
3. Ensure cookies can be set (HTTPS required in production)
4. Check browser console for errors

### Issue: Images Not Uploading

**Solution:**
1. Check file permissions on server
2. Verify upload directory exists
3. For Vercel: Consider using cloud storage (Vercel has file system limitations)
4. Check API route logs for errors

### Issue: Prisma Client Not Generated

**Solution:**
1. Run `npx prisma generate` locally
2. Ensure `postinstall` script in `package.json` includes `prisma generate`
3. Check Vercel build logs for Prisma generation

---

## 📞 Getting Help

If you encounter issues:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → View Function Logs

2. **Check Build Logs:**
   - In the same deployment page, scroll to see build logs

3. **Test Locally:**
   - Run `npm run build` and `npm start` locally
   - This helps identify if issues are deployment-specific

4. **Documentation:**
   - Next.js: https://nextjs.org/docs
   - Vercel: https://vercel.com/docs
   - Prisma: https://www.prisma.io/docs

---

## 🎉 Success!

Once everything is working, your application is live! Share your URL with users and start managing furniture orders.

**Your deployed URL:** `https://your-project.vercel.app`

Remember to:
- Keep your `NEXTAUTH_SECRET` secure
- Regularly update dependencies
- Monitor your application for errors
- Backup your database regularly

