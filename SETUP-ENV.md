# Setting Up Environment Variables

## Create .env File

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="furniture-ordering-secret-key-change-in-production"
```

## Important Notes:

1. **Password Encoding**: If your MongoDB password contains special characters like `@`, you may need to URL encode them:
   - `@` becomes `%40`
   - Example: If password is `ubaid@281986`, use `ubaid%40281986` in the connection string

2. **Verify Your MongoDB Credentials**:
   - Username: Your MongoDB Atlas username
   - Password: Your MongoDB Atlas password (URL encode special characters if needed)
   - Make sure these are correct in your MongoDB Atlas account

3. **Connection String Format**:
   ```
   mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE?options
   ```

4. **If Authentication Fails**:
   - Double-check your MongoDB Atlas username and password
   - Ensure your IP is whitelisted in MongoDB Atlas Network Access
   - Verify the database name exists or will be created
   - Try the connection string from MongoDB Atlas directly (copy from Atlas dashboard)

## After Creating .env:

1. Push schema to MongoDB:
   ```bash
   npx prisma db push
   ```

2. Create admin user:
   ```bash
   node scripts/create-admin.js
   ```

3. Start the application:
   ```bash
   npm run dev
   ```
