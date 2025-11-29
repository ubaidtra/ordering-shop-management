# How to Run ensure-admin.js in Production

Since Vercel doesn't allow direct server access, here are the ways to create the admin user in production:

## Method 1: Run Locally with Production Database (Recommended - Easiest)

This is the simplest method. Run the script on your local machine but connect it to your production database.

### Step 1: Get Your Production DATABASE_URL

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` and copy its value

Or use the same connection string you used during deployment:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Step 2: Run the Script with Production Database

**Option A: Set environment variable temporarily**

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
node scripts/ensure-admin.js
```

**Windows Command Prompt:**
```cmd
set DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
node scripts/ensure-admin.js
```

**Linux/Mac:**
```bash
export DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
node scripts/ensure-admin.js
```

**Option B: Create a temporary .env.production file**

1. Create a file named `.env.production` in your project root:
   ```env
   DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```

2. Modify the script to use `.env.production` or run:
   ```bash
   node -r dotenv/config scripts/ensure-admin.js dotenv_config_path=.env.production
   ```

   (You may need to install dotenv: `npm install dotenv`)

**Option C: Update your .env file temporarily**

1. Backup your current `.env` file
2. Update `DATABASE_URL` in `.env` to point to production
3. Run: `node scripts/ensure-admin.js`
4. Restore your original `.env` file

---

## Method 2: Create an API Endpoint (For One-Time Use)

Create a temporary API endpoint that runs the script when called.

### Step 1: Create the API Route

Create `app/api/admin/create-admin/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // SECURITY: Add a secret token check in production!
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_CREATE_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const email = "traubaid@gmail.com";
    const password = "YOUR_ADMIN_PASSWORD";
    
    const normalizedEmail = email.toLowerCase().trim();
    const adminPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        password: adminPassword,
        name: "Admin User",
        role: "ADMIN",
        isActive: true,
      },
      create: {
        email: normalizedEmail,
        password: adminPassword,
        name: "Admin User",
        role: "ADMIN",
        isActive: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin user created/updated",
      email: admin.email 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to create admin", 
      details: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
```

### Step 2: Add Secret to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `ADMIN_CREATE_SECRET` = `your-random-secret-here`
3. Redeploy

### Step 3: Call the Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/admin/create-admin \
  -H "Authorization: Bearer your-random-secret-here"
```

**⚠️ Important:** Delete this endpoint after use for security!

---

## Method 3: Use MongoDB Atlas Directly

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your database: `sample_mflix`
3. Go to Collections → `User`
4. Click "Insert Document"
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

**Note:** You'll need to generate the bcrypt hash first. Run this locally:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_ADMIN_PASSWORD', 10).then(h => console.log(h));"
```

---

## Method 4: Use Vercel CLI (If Available)

If Vercel CLI supports running scripts (limited), you might be able to:

```bash
vercel env pull .env.production
node scripts/ensure-admin.js
```

---

## Recommended Approach

**Use Method 1 (Run Locally with Production Database)** - It's the simplest and safest:

```powershell
# Windows PowerShell
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
node scripts/ensure-admin.js
```

This will:
- ✅ Connect to your production database
- ✅ Create/update the admin user
- ✅ Verify the password works
- ✅ Not affect your local development

---

## Verification

After running the script, verify it worked:

1. Try logging in to your production app:
   - Email: `traubaid@gmail.com`
   - Password: `YOUR_ADMIN_PASSWORD`

2. Or check MongoDB Atlas directly to see if the user exists

---

## Security Note

⚠️ **Important:** Make sure to:
- Never commit your production DATABASE_URL to GitHub
- Use environment variables
- Delete any temporary API endpoints after use
- Keep your MongoDB Atlas credentials secure

