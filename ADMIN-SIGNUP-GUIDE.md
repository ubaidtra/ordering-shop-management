# Admin Signup Guide

## One-Time Admin Signup Feature

This feature allows you to create an admin account through the signup page, but **only once**. After the first admin is created, this feature is automatically disabled.

## How to Use

### Step 1: Go to Signup Page

Navigate to: `/signup` on your application

### Step 2: Enable Admin Signup

1. On the signup page, click the link: **"Sign up as Admin (One-time only)"**
2. This will show the admin signup form

### Step 3: Enter Admin Signup Code

You'll need to enter the admin signup code. The default code is:
```
ADMIN_SETUP_2024
```

**To change this code:**
1. Add an environment variable `ADMIN_SIGNUP_CODE` in Vercel
2. Or update it in `app/api/auth/signup/route.ts` (line with `process.env.ADMIN_SIGNUP_CODE`)

### Step 4: Fill in Admin Details

- **Name**: Your full name
- **Email**: Your admin email (e.g., `traubaid@gmail.com`)
- **Password**: Your admin password (minimum 6 characters)
- **Confirm Password**: Confirm your password
- **Admin Signup Code**: Enter the code (default: `ADMIN_SETUP_2024`)

### Step 5: Submit

Click "Sign Up" to create your admin account.

## Security Features

1. **One-Time Only**: Once an admin account exists, admin signup is permanently disabled
2. **Secret Code**: Requires a secret code to prevent unauthorized admin creation
3. **Automatic Redirect**: After successful admin signup, you'll be redirected to the admin dashboard

## Important Notes

⚠️ **After the first admin is created:**
- Admin signup will be disabled
- The "Sign up as Admin" option will still appear, but will show an error if attempted
- You'll need to use the admin dashboard or scripts to create additional admins

## Setting the Admin Signup Code

### Option 1: Environment Variable (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `ADMIN_SIGNUP_CODE` = `your-secret-code-here`
3. Redeploy

### Option 2: Update Code Directly

Edit `app/api/auth/signup/route.ts` and change:
```typescript
const validAdminCode = process.env.ADMIN_SIGNUP_CODE || "ADMIN_SETUP_2024";
```

## Troubleshooting

### "Admin account already exists" Error

This means an admin has already been created. You cannot use this feature anymore. Instead:
- Use the existing admin account to create more admins via the admin dashboard
- Or use the `scripts/create-admin.js` script

### "Invalid admin signup code" Error

- Check that you entered the correct code
- Verify the `ADMIN_SIGNUP_CODE` environment variable is set correctly (if using custom code)
- Default code is: `ADMIN_SETUP_2024`

### Admin Signup Not Working

1. Check Vercel logs for errors
2. Verify database connection
3. Make sure no admin exists yet (check MongoDB Atlas)

## Default Admin Signup Code

**Default Code:** `ADMIN_SETUP_2024`

**⚠️ Security Recommendation:** Change this to a strong, unique code in production!

## After Admin Signup

Once you've created your admin account:
1. You'll be automatically logged in
2. Redirected to `/admin` dashboard
3. Admin signup feature is now disabled
4. You can create more admins from the admin dashboard

