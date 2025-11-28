# Step-by-Step Guide: Make Login Work in Vercel

This guide will help you set up authentication so login works correctly on your Vercel deployment.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- ✅ Your MongoDB connection string
- ✅ Access to Vercel Dashboard
- ✅ Your admin credentials ready

---

## Step 1: Set Environment Variables in Vercel

### 1.1 Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project (e.g., `furniture-shop` or `furniture-ordering-system`)

### 1.2 Navigate to Environment Variables

1. Click on **Settings** tab (top navigation)
2. Click on **Environment Variables** in the left sidebar

### 1.3 Add Required Environment Variables

Add these **three** environment variables (click "Add New" for each):

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development (select all three)
- Click **Save**

#### Variable 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `QtMTx33rICj97z/czI2JYtlWPpbop2Et9D62DUEFyzQ=`
  - (Or generate a new one using: `npm run generate-secret`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development (select all three)
- Click **Save**

#### Variable 3: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Your actual Vercel deployment URL
  - Example: `https://furniture-shop-xxxxx.vercel.app`
  - **Important**: Use your actual URL, not the example!
- **Environments**: ✅ Production, ✅ Preview, ✅ Development (select all three)
- Click **Save**

### 1.4 Verify Environment Variables

After adding all three, you should see:
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL`

---

## Step 2: Create Admin User in Production Database

The admin user needs to exist in your **production database** (the one connected to Vercel).

### 2.1 Method A: Run Script Locally (Recommended)

1. **Open PowerShell** in your project directory

2. **Set production database URL**:
   ```powershell
   $env:DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority"
   ```

3. **Run the ensure-admin script**:
   ```powershell
   node scripts/ensure-admin.js
   ```

4. **Expected output**:
   ```
   🔍 Checking admin user...
   ✅ Admin user ensured: traubaid@gmail.com
      Role: ADMIN
      Active: true
      Password verified: ✅
   ```

### 2.2 Method B: Use One-Time Admin Signup

1. Go to your Vercel deployment: `https://your-app.vercel.app/signup`
2. Click **"Sign up as Admin (One-time only)"**
3. Fill in:
   - Name: Your name
   - Email: `traubaid@gmail.com` (or your preferred admin email)
   - Password: `trawally@281986` (or your preferred password)
   - Admin Signup Code: `ADMIN_SETUP_2024`
4. Click **"Sign Up"**
5. You'll be redirected to the admin dashboard

### 2.3 Method C: Use MongoDB Atlas Directly

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your database: `sample_mflix`
3. Go to **Collections** → `User`
4. Click **Insert Document**
5. Create a document with:
   ```json
   {
     "_id": ObjectId(),
     "email": "traubaid@gmail.com",
     "password": "$2a$10$...", // You need to generate this hash
     "name": "Admin User",
     "role": "ADMIN",
     "isActive": true,
     "createdAt": new Date()
   }
   ```

   **To generate password hash**, run locally:
   ```powershell
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('trawally@281986', 10).then(h => console.log(h));"
   ```

---

## Step 3: Redeploy on Vercel

After setting environment variables, you need to redeploy:

### 3.1 Option A: Automatic Redeploy

If you have GitHub connected, just push a commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### 3.2 Option B: Manual Redeploy

1. Go to Vercel Dashboard → Your Project
2. Click on **Deployments** tab
3. Click **⋯** (three dots) on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete (2-5 minutes)

---

## Step 4: Verify Environment Variables Are Set

### 4.1 Check in Vercel Dashboard

1. Go to **Settings** → **Environment Variables**
2. Verify all three variables are present:
   - `DATABASE_URL` ✅
   - `NEXTAUTH_SECRET` ✅
   - `NEXTAUTH_URL` ✅

### 4.2 Check Deployment Logs

1. Go to **Deployments** → Click on latest deployment
2. Click **View Function Logs** or **View Build Logs**
3. Look for any errors related to:
   - Database connection
   - Missing environment variables
   - Authentication errors

---

## Step 5: Test Login

### 5.1 Test Admin Login

1. Go to your Vercel URL: `https://your-app.vercel.app/login`
2. Enter credentials:
   - **Email**: `traubaid@gmail.com`
   - **Password**: `trawally@281986`
3. Click **"Sign in"**
4. You should be redirected to `/admin` dashboard

### 5.2 Test Customer Signup/Login

1. Go to: `https://your-app.vercel.app/signup`
2. Fill in customer details
3. Click **"Sign Up"**
4. You should be redirected to login
5. Login with the customer credentials
6. You should be redirected to homepage

---

## Step 6: Troubleshooting

### Issue: "Invalid email or password"

**Possible causes:**
1. Admin user doesn't exist in production database
2. Wrong password
3. Database connection issue

**Solutions:**
1. **Verify admin user exists**:
   ```powershell
   $env:DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority"
   node scripts/verify-admin.js
   ```

2. **Recreate admin user**:
   ```powershell
   $env:DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority"
   node scripts/ensure-admin.js
   ```

3. **Check MongoDB Atlas**:
   - Verify database is accessible
   - Check IP whitelist (should allow `0.0.0.0/0` for testing)
   - Verify connection string is correct

### Issue: "Database connection error"

**Solutions:**
1. **Verify DATABASE_URL** in Vercel:
   - Go to Settings → Environment Variables
   - Check `DATABASE_URL` is correct
   - Make sure it's set for Production environment

2. **Check MongoDB Atlas**:
   - Go to MongoDB Atlas Dashboard
   - Check Network Access → IP Access List
   - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Or add Vercel's IP ranges

3. **Check database credentials**:
   - Verify username and password are correct
   - Check database name matches

### Issue: "NextAuth error" or "Session not working"

**Solutions:**
1. **Verify NEXTAUTH_URL**:
   - Must match your Vercel URL exactly
   - Include `https://`
   - No trailing slash
   - Example: `https://furniture-shop-xxxxx.vercel.app`

2. **Verify NEXTAUTH_SECRET**:
   - Must be at least 32 characters
   - Should be a random string
   - Generate new one if needed: `npm run generate-secret`

3. **Redeploy after setting variables**:
   - Environment variables only take effect after redeploy

### Issue: "Redirects to wrong page after login"

**Solutions:**
1. **Check session is loading**:
   - Open browser console (F12)
   - Check for errors
   - Verify session is being set

2. **Clear browser cache**:
   - Clear cookies for your Vercel domain
   - Try incognito/private window

3. **Check middleware**:
   - Verify middleware.ts is working
   - Check role-based redirects

---

## Step 7: Verify Everything Works

### Checklist:

- [ ] All 3 environment variables set in Vercel
- [ ] Environment variables set for Production, Preview, and Development
- [ ] Admin user exists in production database
- [ ] Deployment completed successfully
- [ ] Can access login page
- [ ] Admin login works
- [ ] Redirects to `/admin` after admin login
- [ ] Customer signup works
- [ ] Customer login works
- [ ] Redirects to homepage after customer login

---

## Quick Reference

### Admin Credentials
- **Email**: `traubaid@gmail.com`
- **Password**: `trawally@281986`

### Environment Variables Needed
```
DATABASE_URL=mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority
NEXTAUTH_SECRET=QtMTx33rICj97z/czI2JYtlWPpbop2Et9D62DUEFyzQ=
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
```

### Quick Commands

**Create admin in production:**
```powershell
$env:DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority"
node scripts/ensure-admin.js
```

**Verify admin exists:**
```powershell
$env:DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.6qxphwl.mongodb.net/sample_mflix?retryWrites=true&w=majority"
node scripts/verify-admin.js
```

---

## 🎉 Success!

Once all steps are completed, your login should work perfectly on Vercel!

**Test it:**
1. Go to: `https://your-app.vercel.app/login`
2. Login with admin credentials
3. You should see the admin dashboard

---

## Need Help?

If login still doesn't work:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure admin user exists in production database
5. Try clearing browser cache and cookies

