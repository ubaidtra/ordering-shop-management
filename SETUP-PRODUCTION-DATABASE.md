# Setup Production Database - Step by Step

Since you've corrected the DATABASE_URL in Vercel, follow these steps:

## Step 1: Get Your Correct Database URL from Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` and **copy the entire value**
5. It should look like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```

## Step 2: Push Database Schema to Production Database

Make sure your production database has the correct schema:

```powershell
# Set the production database URL (from Vercel)
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Step 3: Create Admin Account in Production Database

```powershell
# Use the same DATABASE_URL from Step 2
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Create admin account
node scripts/create-admin-production.js
```

## Step 4: Verify Vercel Environment Variables

Go to **Vercel Dashboard** → **Settings** → **Environment Variables** and verify:

1. **DATABASE_URL** - Should match the one you used in Step 2-3
2. **NEXTAUTH_URL** - Should be your Vercel app URL (e.g., `https://your-app.vercel.app`)
3. **NEXTAUTH_SECRET** - Should be a secure random string (32+ characters)

## Step 5: Redeploy Vercel (Important!)

After updating DATABASE_URL in Vercel, you **must redeploy**:

**Option A: Via Dashboard**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

**Option B: Via CLI**
```powershell
vercel --prod
```

**Option C: Push to GitHub** (if connected)
```powershell
git add .
git commit -m "Update database configuration"
git push
```

## Step 6: Test Login

1. Wait for Vercel deployment to complete
2. Go to: `https://your-app.vercel.app/login`
3. Login with:
   - **Email:** `ubaidtra@gmail.com`
   - **Password:** `ubaid@281986`

## Troubleshooting

### "Cannot connect to database"
- Verify DATABASE_URL in Vercel matches the one you used locally
- Check MongoDB Atlas IP whitelist allows `0.0.0.0/0` (for Vercel)
- Verify database name in connection string

### "Admin account not found"
- Make sure you ran the script with the **correct** DATABASE_URL (from Vercel)
- Check MongoDB Atlas to see if user was created
- Verify you're using the production database, not local

### "Login still doesn't work"
- Verify Vercel was **redeployed** after updating DATABASE_URL
- Check Vercel deployment logs for errors
- Verify NEXTAUTH_URL matches your Vercel domain exactly
- Verify NEXTAUTH_SECRET is set in Vercel

### "Schema push fails"
- Make sure you're using standard MongoDB connection string (not SQL endpoint)
- Verify database name in connection string
- Check MongoDB Atlas cluster is running

## Quick Checklist

- [ ] Got DATABASE_URL from Vercel
- [ ] Pushed schema to production database
- [ ] Created admin account in production database
- [ ] Verified all Vercel environment variables
- [ ] Redeployed Vercel
- [ ] Tested login

