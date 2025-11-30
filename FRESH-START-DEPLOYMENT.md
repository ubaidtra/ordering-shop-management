# Fresh Start Deployment Guide

This guide will help you deploy the application from scratch with a clean slate.

---

## 📋 Phase 1: Clean Up (You'll do this)

### Step 1: Delete from GitHub (Optional - if you want fresh repo)
1. Go to: https://github.com/ubaidtra/furniture-shop
2. Click **Settings** (bottom of sidebar)
3. Scroll down to **Danger Zone**
4. Click **Delete this repository**
5. Type the repository name to confirm
6. Click **I understand the consequences, delete this repository**

**OR** keep the repo and just push the cleaned code.

### Step 2: Delete from Vercel
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll down to **Delete Project**
5. Type the project name to confirm
6. Click **Delete**

### Step 3: Clean MongoDB Database (Optional - if you want fresh data)

**Option A: Delete all collections**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your cluster → **Browse Collections**
3. Delete each collection: User, Product, Order, OrderItem, Cart, CartItem

**Option B: Keep the database** (recommended)
- Keep existing database structure
- We'll create fresh admin account during deployment

---

## 🔧 Phase 2: Prepare Local Project (I'm doing this now)

### Cleanup tasks:
- ✅ Remove local database files
- ✅ Clear build cache
- ✅ Verify all code is clean
- ✅ Create deployment checklist
- ✅ Prepare environment variables template

---

## 🚀 Phase 3: Fresh Deployment (You'll do this after Phase 2)

### Step 1: Push to GitHub

```bash
# If you deleted the repo, create a new one
# Go to https://github.com/new
# Repository name: furniture-shop
# Make it private or public (your choice)
# Don't initialize with README (we have one)
# Click "Create repository"

# Then in your project:
git remote remove origin  # Remove old remote if exists
git remote add origin https://github.com/ubaidtra/furniture-shop.git
git branch -M main
git push -u origin main
```

**OR if keeping the existing repo:**
```bash
git push
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repository: `ubaidtra/furniture-shop`
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (leave default)
   - **Output Directory**: `.next` (leave default)
   - **Install Command**: `npm install && npx prisma generate`
5. Click **Deploy** (it will fail first time - that's okay, we need to add env variables)

**Option B: Via CLI**
```bash
npm i -g vercel  # Install Vercel CLI if not installed
vercel login    # Login to your account
vercel          # Deploy
```

### Step 3: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these 3 required variables:

**Variable 1: DATABASE_URL**
- **Key**: `DATABASE_URL`
- **Value**: `mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

**Variable 2: NEXTAUTH_URL**
- **Key**: `NEXTAUTH_URL`
- **Value**: Your Vercel URL (e.g., `https://furniture-shop-xxxxx.vercel.app`)
  - Get this from your deployment URL
  - Update after first deployment
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

**Variable 3: NEXTAUTH_SECRET**
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `yHPAn566eupHyWWvVJtXEj0yNkORn3pgPzayyWRK1xA=`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

**Variable 4: ADMIN_SIGNUP_CODE (Optional)**
- **Key**: `ADMIN_SIGNUP_CODE`
- **Value**: `ADMIN_SETUP_2024` (or your custom code)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 5: Setup Production Database

**Option A: Push schema from local machine**
```bash
# Set production database URL
$env:DATABASE_URL="mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0"

# Push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

**Option B: Schema will auto-create on first use**
- Vercel will create collections automatically when accessed
- But it's better to push schema manually (Option A)

### Step 6: Create Admin Account

**Option A: Use one-time admin signup (Easiest)**
1. Go to: `https://your-app.vercel.app/signup`
2. Click **"Sign up as Admin (One-time only)"**
3. Fill in:
   - Name: Your name
   - Email: `ubaidtra@gmail.com`
   - Password: `ubaid@281986` (or your choice)
   - Admin Signup Code: `ADMIN_SETUP_2024`
4. Click **Sign Up**
5. You'll be redirected to admin dashboard

**Option B: Use script**
```bash
# Set production database URL
$env:DATABASE_URL="mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0"

# Create admin account
node scripts/create-admin-production.js
```

### Step 7: Test Everything

1. **Test Login**: Go to `https://your-app.vercel.app/login`
2. **Test Admin Dashboard**: Login and access `/admin`
3. **Test Product Creation**: Create a test product
4. **Test Customer Signup**: Create a test customer account
5. **Test Order Flow**: Place a test order

---

## 📝 Quick Reference

### Local Environment Variables (.env)
```env
DATABASE_URL="mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="yHPAn566eupHyWWvVJtXEj0yNkORn3pgPzayyWRK1xA="
ADMIN_SIGNUP_CODE="ADMIN_SETUP_2024"
```

### Vercel Environment Variables
```env
DATABASE_URL="mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="yHPAn566eupHyWWvVJtXEj0yNkORn3pgPzayyWRK1xA="
ADMIN_SIGNUP_CODE="ADMIN_SETUP_2024"
```

### Admin Credentials (after creation)
```
Email: ubaidtra@gmail.com
Password: ubaid@281986
Admin Code: ADMIN_SETUP_2024
```

---

## ✅ Final Checklist

### Before Deployment
- [ ] GitHub repo created/updated
- [ ] Local code is clean and tested
- [ ] Environment variables prepared

### During Deployment
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Added all environment variables
- [ ] Redeployed after adding env variables

### After Deployment
- [ ] Database schema pushed
- [ ] Admin account created
- [ ] Login tested
- [ ] Admin dashboard accessible
- [ ] All features working

---

## 🆘 Troubleshooting

### Build fails on Vercel
- Check Vercel deployment logs
- Verify all environment variables are set
- Make sure `NEXTAUTH_SECRET` and `DATABASE_URL` are set

### Can't login
- Verify `NEXTAUTH_URL` matches your Vercel URL exactly
- Check `NEXTAUTH_SECRET` is set
- Verify admin account exists in database

### Admin signup doesn't work
- Make sure no admin exists yet
- Verify `ADMIN_SIGNUP_CODE` matches
- Check database connection

### Database connection fails
- Verify `DATABASE_URL` is correct
- Check MongoDB Atlas IP whitelist (should allow `0.0.0.0/0`)
- Verify database name in connection string

---

## 🎉 Success!

Once everything is working:
1. ✅ App is deployed on Vercel
2. ✅ Database is connected
3. ✅ Admin account created
4. ✅ You can log in and manage the system

Your furniture ordering system is live and ready to use!

