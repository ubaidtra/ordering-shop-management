# Fix MongoDB Connection Error

## Error Message
```
Server selection timeout: No available servers
I/O error: received fatal alert: InternalError
```

This error indicates that Prisma cannot connect to your MongoDB Atlas cluster.

---

## 🔍 Common Causes

1. **IP Address not whitelisted** - MongoDB Atlas blocks connections from unknown IPs
2. **Network/Firewall blocking** - Your network or firewall is blocking the connection
3. **MongoDB Atlas cluster paused** - Free tier clusters pause after inactivity
4. **Connection string issues** - Incorrect credentials or connection string
5. **SSL/TLS issues** - Certificate or encryption problems

---

## ✅ Step 1: Check MongoDB Atlas Network Access

### 1.1 Go to MongoDB Atlas

1. Visit: https://cloud.mongodb.com
2. Log in to your account
3. Select your cluster

### 1.2 Check Network Access

1. Click **Network Access** in the left sidebar
2. Check your IP whitelist:
   - **Option A (Recommended for testing)**: Add `0.0.0.0/0` to allow all IPs
     - Click **Add IP Address**
     - Click **Allow Access from Anywhere**
     - Click **Confirm**
   - **Option B (More secure)**: Add your current IP address
     - Click **Add IP Address**
     - Click **Add Current IP Address**
     - Click **Confirm**

### 1.3 Wait for Changes

- Network access changes can take 1-2 minutes to propagate
- Wait a few minutes after adding IP addresses

---

## ✅ Step 2: Verify MongoDB Atlas Cluster is Running

### 2.1 Check Cluster Status

1. Go to **Database** → **Clusters**
2. Check if your cluster shows:
   - ✅ **Status: Running** (green)
   - ❌ **Status: Paused** (if paused, click "Resume")

### 2.2 Resume Paused Cluster (if needed)

1. If cluster is paused, click **Resume**
2. Wait 1-2 minutes for cluster to start
3. Try connecting again

---

## ✅ Step 3: Verify Connection String

### 3.1 Get Correct Connection String

1. Go to **Database** → **Clusters**
2. Click **Connect** on your cluster
3. Select **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `sample_mflix` (or your database name)

### 3.2 Test Connection String Format

Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Important:**
- Username: Your MongoDB username
- Password: Your MongoDB password (URL encode special characters if needed)
- Cluster: `cluster0.6qxphwl.mongodb.net`
- Database: `sample_mflix`

---

## ✅ Step 4: Test Connection with Different Methods

### 4.1 Test with MongoDB Compass (GUI Tool)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Use your connection string
3. If Compass connects, the issue is with Prisma/Node.js
4. If Compass doesn't connect, the issue is with MongoDB Atlas configuration

### 4.2 Test with Node.js Directly

Create a test file `test-connection.js`:
```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority';

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected successfully!');
    await client.db().admin().ping();
    console.log('✅ Database ping successful!');
    await client.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run it:
```powershell
npm install mongodb
node test-connection.js
```

---

## ✅ Step 5: Fix Prisma Connection

### 5.1 Update .env File

Make sure your `.env` file has the correct connection string:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
```

**Important:**
- Use double quotes around the connection string
- No spaces around the `=` sign
- Make sure password doesn't have special characters that need URL encoding

### 5.2 URL Encode Password (if needed)

If your password has special characters, you need to URL encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `&` becomes `%26`
- etc.

Example:
```
Password: `pass@word#123`
Encoded: `pass%40word%23123`
```

### 5.3 Try Prisma Push Again

After fixing network access and connection string:

```powershell
# Set environment variable
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"

# Try again
npx prisma db push
```

---

## ✅ Step 6: Alternative - Use Direct Connection

If `mongodb+srv://` doesn't work, try the direct connection string:

1. Go to MongoDB Atlas → **Connect** → **Connect your application**
2. Select **Driver**: Node.js
3. Select **Version**: 4.1 or later
4. Copy the connection string
5. It should look like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add database name: `/sample_mflix` before the `?`

---

## ✅ Step 7: Check Firewall/Antivirus

### 7.1 Windows Firewall

1. Go to **Windows Security** → **Firewall & network protection**
2. Check if MongoDB/Node.js is blocked
3. Temporarily disable firewall to test (re-enable after)

### 7.2 Antivirus Software

1. Check if antivirus is blocking Node.js/MongoDB connections
2. Add exceptions for:
   - Node.js
   - Prisma
   - MongoDB connections

---

## ✅ Step 8: Verify Database User Credentials

### 8.1 Check Database User

1. Go to MongoDB Atlas → **Database Access**
2. Verify user `ubaidtraw` exists
3. Check user has correct password
4. Verify user has proper permissions (at least `readWrite` on `sample_mflix`)

### 8.2 Reset Password (if needed)

1. Click on the user
2. Click **Edit**
3. Click **Edit Password**
4. Set new password
5. Update connection string with new password

---

## 🔧 Quick Fix Checklist

- [ ] MongoDB Atlas Network Access allows your IP (or `0.0.0.0/0`)
- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] Connection string is correct
- [ ] Password is correct (URL encoded if needed)
- [ ] Database name is correct (`sample_mflix`)
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Firewall/antivirus not blocking connection
- [ ] Database user exists and has permissions

---

## 🎯 Most Likely Solution

**90% of the time, this error is caused by IP whitelist:**

1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**
5. Wait 2-3 minutes
6. Try `npx prisma db push` again

---

## 🆘 Still Not Working?

If connection still fails:

1. **Check MongoDB Atlas Status**: https://status.mongodb.com/
2. **Try MongoDB Compass**: If Compass works, issue is with Prisma
3. **Check Prisma version**: `npx prisma --version`
4. **Update Prisma**: `npm install prisma @prisma/client --save-dev`
5. **Check Node.js version**: Should be 16+ for Prisma with MongoDB
6. **Try different network**: Test from different network/internet connection

---

## 📝 Test Connection Script

Save this as `test-mongodb.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');
    
    // Try a simple query
    const count = await prisma.user.count();
    console.log(`✅ Database accessible! User count: ${count}`);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

test();
```

Run it:
```powershell
$env:DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
node test-mongodb.js
```

---

## ✅ Success!

Once connection works, you should see:
```
✅ Prisma connected successfully!
✅ Database accessible!
✅ Disconnected successfully!
```

Then you can run:
```powershell
npx prisma db push
```

