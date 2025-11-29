# Fix "Failed to create account" Error on Vercel

This guide will help you troubleshoot and fix the "Failed to create account" error when signing up on Vercel.

---

## 🔍 Common Causes

1. **Database connection issue** - DATABASE_URL not set or incorrect
2. **Email already exists** - User with that email already exists
3. **Database schema not synced** - Prisma schema not pushed to production database
4. **Missing environment variables** - Required env vars not set in Vercel
5. **Case sensitivity** - Email comparison issues (now fixed)

---

## ✅ Step 1: Check Environment Variables in Vercel

### 1.1 Verify DATABASE_URL is Set

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check that `DATABASE_URL` exists and is correct:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```
3. Make sure it's set for **Production**, **Preview**, and **Development**

### 1.2 Verify Other Required Variables

Check these are also set:
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL`

---

## ✅ Step 2: Sync Database Schema

The database schema must be pushed to your production database.

### 2.1 Method A: Run Prisma Push Locally

1. **Set production DATABASE_URL**:
   ```powershell
   $env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
   ```

2. **Push schema to production**:
   ```powershell
   npx prisma db push
   ```

3. **Generate Prisma Client**:
   ```powershell
   npx prisma generate
   ```

### 2.2 Method B: Use MongoDB Atlas Directly

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your database
3. Verify the `User` collection exists with these fields:
   - `id` (String)
   - `email` (String, unique)
   - `password` (String)
   - `name` (String)
   - `role` (String: ADMIN, OPERATOR, CUSTOMER)
   - `isActive` (Boolean)
   - `contact` (String, optional)
   - `address` (String, optional)
   - `createdAt` (DateTime)
   - `updatedAt` (DateTime)

---

## ✅ Step 3: Check Vercel Function Logs

The improved error handling will now show more specific errors.

### 3.1 View Logs

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **View Function Logs** or **View Build Logs**
4. Look for errors related to:
   - Database connection
   - Prisma errors
   - Missing environment variables

### 3.2 Common Error Messages

**"Database connection error"**
- ✅ Check `DATABASE_URL` is correct
- ✅ Verify MongoDB Atlas network access allows Vercel IPs
- ✅ Check database credentials

**"User with this email already exists"**
- ✅ Try a different email
- ✅ Check if user exists in database

**"P2002" (Prisma unique constraint)**
- ✅ Email already exists in database
- ✅ Try different email

---

## ✅ Step 4: Test Database Connection

### 4.1 Test Locally with Production Database

1. **Set production DATABASE_URL**:
   ```powershell
   $env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
   ```

2. **Test connection**:
   ```powershell
   node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Connected'); prisma.$disconnect(); }).catch(e => { console.error('❌ Error:', e); });"
   ```

3. **Try creating a test user**:
   ```powershell
   node scripts/create-admin.js
   ```

---

## ✅ Step 5: Redeploy After Fixes

After fixing environment variables or database schema:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## ✅ Step 6: Verify Signup Works

### 6.1 Test Customer Signup

1. Go to: `https://your-app.vercel.app/signup`
2. Fill in:
   - Name: Test User
   - Email: test@example.com (use a unique email)
   - Password: test123456
   - Contact: +1234567890
   - Address: Test Address
3. Click **"Sign Up"**
4. Should redirect to login page

### 6.2 Test Admin Signup (if no admin exists)

1. Go to: `https://your-app.vercel.app/signup`
2. Click **"Sign up as Admin (One-time only)"**
3. Fill in:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123456
   - Admin Signup Code: `ADMIN_SETUP_2024`
4. Click **"Sign Up"**
5. Should redirect to admin dashboard

---

## 🔧 Troubleshooting Specific Errors

### Error: "Database connection error"

**Solution:**
1. Verify `DATABASE_URL` in Vercel matches your MongoDB Atlas connection string
2. Check MongoDB Atlas → Network Access → IP Access List
   - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Or add Vercel's IP ranges
3. Verify database user credentials are correct
4. Check database name matches (`sample_mflix`)

### Error: "User with this email already exists"

**Solution:**
1. Try a different email address
2. Or delete the existing user from MongoDB Atlas
3. Check if email is case-sensitive (now fixed to be case-insensitive)

### Error: "Failed to create account" (generic)

**Solution:**
1. Check Vercel function logs for specific error
2. Verify all environment variables are set
3. Ensure database schema is synced
4. Check MongoDB Atlas is accessible
5. Verify Prisma Client is generated

### Error: "Contact and address are required"

**Solution:**
- This is for customer signup only
- Make sure you're filling in all required fields
- Or use admin signup if you want to skip contact/address

---

## 📋 Checklist

Before testing signup, verify:

- [ ] `DATABASE_URL` is set in Vercel
- [ ] `DATABASE_URL` is correct and accessible
- [ ] Database schema is synced (Prisma schema matches database)
- [ ] MongoDB Atlas network access allows connections
- [ ] Prisma Client is generated
- [ ] All environment variables are set for Production
- [ ] Latest deployment completed successfully
- [ ] Vercel function logs show no errors

---

## 🎯 Quick Fix Commands

**Set production database and test:**
```powershell
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
npx prisma db push
npx prisma generate
node scripts/create-admin.js
```

**Check if user exists:**
```powershell
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(users => { console.log('Users:', users.map(u => u.email)); prisma.$disconnect(); });"
```

---

## 🆘 Still Not Working?

If signup still fails:

1. **Check Vercel Function Logs** - Look for the specific error message
2. **Test database connection** - Use the test command above
3. **Verify schema** - Make sure User collection has all required fields
4. **Check email format** - Ensure email is valid
5. **Try different email** - In case email already exists

The improved error handling will now show more specific errors in the Vercel logs, making it easier to identify the exact issue.

---

## ✅ What Was Fixed

1. **Email normalization** - Emails are now lowercased and trimmed for case-insensitive comparison
2. **Better error messages** - More specific error messages for different failure scenarios
3. **Database connection errors** - Specific error message for connection issues
4. **Prisma errors** - Better handling of Prisma-specific errors (P2002 for unique constraints)

---

## 🎉 Success!

Once all steps are completed, signup should work correctly on Vercel!

**Test it:**
1. Go to: `https://your-app.vercel.app/signup`
2. Fill in the form
3. Click "Sign Up"
4. You should be redirected to login or dashboard

