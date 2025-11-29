# Post-Deployment Checklist

## ✅ Deployment Complete!

Your Furniture Ordering System is now live on Vercel!

## 🔗 Your Deployment URL

Your application is available at:
**`https://your-project.vercel.app`** (replace with your actual URL)

---

## 📋 Post-Deployment Steps

### 1. Update NEXTAUTH_URL Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Edit it and set the value to your actual deployment URL (e.g., `https://furniture-shop-xxxxx.vercel.app`)
4. Make sure it's set for **Production**, **Preview**, and **Development** environments
5. Click **Save**

### 2. Redeploy After Updating NEXTAUTH_URL

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for the redeployment to complete

---

## 🧪 Testing Your Deployment

### Test These Features:

1. **Homepage**
   - ✅ Visit your deployment URL
   - ✅ Verify the homepage loads correctly

2. **User Signup**
   - ✅ Go to `/signup`
   - ✅ Create a new customer account
   - ✅ Verify signup works

3. **User Login**
   - ✅ Go to `/login`
   - ✅ Login with a customer account
   - ✅ Verify login works

4. **Admin Login**
   - ✅ Go to `/login`
   - ✅ Login with admin credentials:
     - Email: `traubaid@gmail.com`
     - Password: `YOUR_ADMIN_PASSWORD`
   - ✅ Verify admin dashboard loads

5. **Products**
   - ✅ Browse products at `/products`
   - ✅ View product details
   - ✅ Verify images load correctly

6. **Cart & Checkout**
   - ✅ Add products to cart
   - ✅ Go to cart page
   - ✅ Proceed to checkout
   - ✅ Verify order creation

7. **Admin Features**
   - ✅ Access admin dashboard
   - ✅ View orders
   - ✅ Manage products
   - ✅ Manage operators

---

## 🔐 Admin Credentials

**Admin Login:**
- Email: `traubaid@gmail.com`
- Password: `YOUR_ADMIN_PASSWORD`

**⚠️ Security Note:** Change the admin password after first login!

---

## 🐛 Troubleshooting

### Issue: Authentication not working
- **Solution:** Make sure `NEXTAUTH_URL` is set correctly and matches your deployment URL exactly (including `https://`)

### Issue: Database connection errors
- **Solution:** Verify `DATABASE_URL` is correct in environment variables
- Check MongoDB Atlas IP whitelist (should allow all IPs: `0.0.0.0/0` for testing)

### Issue: Images not loading
- **Solution:** Vercel has file system limitations. Consider using:
  - Cloudinary
  - AWS S3
  - Or another cloud storage service

### Issue: Build errors
- **Solution:** Check Vercel deployment logs:
  - Go to Deployments → Click on deployment → View logs
  - Look for error messages

---

## 📊 Monitoring

### Check Deployment Status:
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. View deployment history and status

### View Logs:
1. Go to Deployments → Click on a deployment
2. Click **View Function Logs** or **View Build Logs**

---

## 🎉 Success!

If all tests pass, your application is successfully deployed and ready to use!

**Next Steps:**
- Share your deployment URL with users
- Monitor the application for any issues
- Consider setting up a custom domain (optional)
- Set up error tracking (Sentry, etc.) for production monitoring

---

## 📝 Environment Variables Summary

Make sure these are set in Vercel:

1. `DATABASE_URL` = `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority`
2. `NEXTAUTH_SECRET` = Generate a secure secret (run `npm run generate-secret`)
3. `NEXTAUTH_URL` = `https://your-actual-deployment-url.vercel.app`

---

## 🆘 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Check deployment logs in Vercel Dashboard

