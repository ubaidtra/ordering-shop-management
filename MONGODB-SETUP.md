# MongoDB Connection Setup

## Important: MongoDB Atlas SQL Endpoint Limitation

The connection string you provided is for a **MongoDB Atlas SQL endpoint**, which is **read-only** and cannot be used for:
- Creating collections
- Inserting/updating/deleting documents
- Running Prisma migrations

## Solution: Get the Standard MongoDB Connection String

You need to get the **standard MongoDB connection string** from MongoDB Atlas:

### Steps:

1. Go to **MongoDB Atlas Dashboard**
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"** (NOT "SQL" or "Query")
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string - it should look like:
   ```
   mongodb+srv://ubaidtraw:ubaid281986@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add your database name:
   ```
   mongodb+srv://ubaidtraw:ubaid281986@cluster0.xxxxx.mongodb.net/sample_mflix?retryWrites=true&w=majority
   ```

### Update .env File

Replace the `DATABASE_URL` in your `.env` file with the standard connection string:

```env
DATABASE_URL="mongodb+srv://ubaidtraw:ubaid281986@cluster0.xxxxx.mongodb.net/sample_mflix?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="furniture-ordering-secret-key-change-in-production"
```

### Then Run:

```bash
# Push schema to MongoDB
npx prisma db push

# Create admin user
node scripts/create-admin.js

# Or seed all data
npx prisma db seed
```

## Current Status

- ✅ Connection string format is correct
- ✅ Credentials are working
- ❌ SQL endpoint is read-only (cannot write data)
- ⚠️ Need standard MongoDB connection string for full functionality
