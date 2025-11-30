# Fix Production Admin Account - Two Options

## Problem
Admin account was created locally but not in production MongoDB database.

---

## ✅ Option 1: Create Admin in Production Database (RECOMMENDED - Faster)

This is the **easiest and fastest** solution. No need to delete anything.

### Step 1: Get Your Production MongoDB Connection String

1. Go to **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. Click on your cluster
3. Click **"Connect"**
4. Choose **"Connect your application"**
5. Copy the connection string (should look like):
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```

### Step 2: Create Admin Account in Production Database

**In PowerShell, run these commands:**

```powershell
# Set the production database URL
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Run the admin creation script
node scripts/create-admin-account.js
```

**Replace the connection string with your actual MongoDB Atlas connection string.**

### Step 3: Verify

1. Go to your Vercel app: `https://your-app.vercel.app/login`
2. Login with:
   - **Email:** ubaidtra@gmail.com
   - **Password:** ubaid@281986

---

## 🔄 Option 2: Fresh Deployment (Complete Reset)

Use this if Option 1 doesn't work or you want a completely fresh start.

### Step 1: Delete MongoDB Database

1. Go to **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. Navigate to your cluster
3. Click on **"Browse Collections"**
4. For each collection (User, Product, Order, etc.):
   - Click on the collection
   - Click **"Delete Collection"**
   - Confirm deletion

**OR** delete the entire database:
1. Go to **"Database"** tab
2. Find your database name
3. Click the **trash icon** next to it
4. Confirm deletion

### Step 2: Delete Vercel Project (Optional)

**Option A: Delete via Dashboard**
1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll down to **"Delete Project"**
5. Type the project name to confirm
6. Click **"Delete"**

**Option B: Keep Project, Just Redeploy**
- Skip this step and just redeploy (recommended)

### Step 3: Push Database Schema to MongoDB

```powershell
# Make sure DATABASE_URL is set to production MongoDB
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 4: Create Admin Account

```powershell
# Create admin account
node scripts/create-admin-account.js
```

### Step 5: Redeploy on Vercel

**Option A: Via Dashboard**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment

**Option B: Via CLI**
```powershell
vercel --prod
```

**Option C: Push to GitHub (if connected)**
```powershell
git push
```
(Vercel will auto-deploy)

### Step 6: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these are set:
   - `DATABASE_URL` - Your MongoDB connection string
   - `NEXTAUTH_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - A secure random string

3. If any are missing, add them and **Redeploy**

### Step 7: Test Login

1. Go to: `https://your-app.vercel.app/login`
2. Login with:
   - **Email:** ubaidtra@gmail.com
   - **Password:** ubaid@281986

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Check MongoDB Atlas IP whitelist (should allow `0.0.0.0/0` for Vercel)
- Verify connection string is correct
- Check database name in connection string

### "Admin account not found"
- Make sure you ran the script with production `DATABASE_URL`
- Check MongoDB Atlas to see if user was created
- Verify email is exactly: `ubaidtra@gmail.com` (lowercase)

### "Login fails"
- Check `NEXTAUTH_URL` matches your Vercel URL exactly
- Verify `NEXTAUTH_SECRET` is set in Vercel
- Check Vercel deployment logs for errors

### "Schema push fails"
- Make sure you're using the standard MongoDB connection string (not SQL endpoint)
- Verify database name in connection string
- Check MongoDB Atlas cluster is running

---

## 📝 Quick Reference

**Admin Credentials:**
- Email: `ubaidtra@gmail.com`
- Password: `ubaid@281986`

**Script Location:**
- `scripts/create-admin-account.js`

**Environment Variables Needed:**
- `DATABASE_URL` - MongoDB connection string
- `NEXTAUTH_URL` - Your Vercel app URL
- `NEXTAUTH_SECRET` - Secure random string

---

## ✅ Recommended Approach

**Start with Option 1** - it's faster and less disruptive. Only use Option 2 if Option 1 doesn't work.

