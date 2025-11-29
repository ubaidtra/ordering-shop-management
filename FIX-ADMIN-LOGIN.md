# Fix Admin Login Issue

## Problem
Getting "Invalid email or password" error when trying to log in with admin credentials on the deployed version.

## Solution

The admin user exists locally but needs to be created in the **production database** (Vercel).

### Step 1: Create Admin User in Production Database

You have two options:

#### Option A: Run Script Locally (Recommended)

1. Make sure your `.env` file points to the **production database**:
   ```env
   DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```

2. Run the ensure-admin script:
   ```bash
   node scripts/ensure-admin.js
   ```

   This will create/update the admin user in your production database.

#### Option B: Use MongoDB Atlas Directly

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your database: `sample_mflix`
3. Go to Collections → `User`
4. Check if user with email `traubaid@gmail.com` exists
5. If not, create it manually or run the script

### Step 2: Verify Admin User

Run the verification script:
```bash
node scripts/verify-admin.js
```

This will check if the admin user exists and if the password is correct.

### Step 3: Test Login

1. Go to your deployed app: `https://your-app.vercel.app/login`
2. Enter:
   - Email: `traubaid@gmail.com`
   - Password: `YOUR_ADMIN_PASSWORD`
3. Click "Sign in"

## Admin Credentials

- **Email:** `traubaid@gmail.com`
- **Password:** `YOUR_ADMIN_PASSWORD`
- **Role:** `ADMIN`

## Troubleshooting

### Still getting "Invalid email or password"?

1. **Check database connection:**
   - Verify `DATABASE_URL` in Vercel environment variables
   - Make sure MongoDB Atlas allows connections from Vercel IPs (or allow all: `0.0.0.0/0`)

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → View Function Logs
   - Look for authentication errors

3. **Verify admin user exists:**
   - Run `node scripts/verify-admin.js` with production DATABASE_URL
   - Check MongoDB Atlas directly

4. **Check email format:**
   - Make sure there are no extra spaces
   - Email should be: `traubaid@gmail.com` (lowercase)

## Quick Fix Script

Run this to ensure admin user exists in production:

```bash
# Set production database URL (if different from .env)
export DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Run ensure-admin script
node scripts/ensure-admin.js
```

